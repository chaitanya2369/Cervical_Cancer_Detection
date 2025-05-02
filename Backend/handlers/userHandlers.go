package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"time"

	// "math/rand/v2"

	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var predictionService string

func init(){
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	predictionService = os.Getenv("PREDICTION_SERVICE")
}

func GetSelectedFilterPatients(c *gin.Context){
	hospital:=c.Param("hospital")
    status:=c.Query("status")
    pageStr:=c.Query("page")
    sizeStr:=c.Query("size")
    search:=c.Query("search")

    page, _ := strconv.Atoi(pageStr)
    if page < 1 {
		page = 1
	}
	size, _ := strconv.Atoi(sizeStr)
	if size <= 0 {
		size = 10
	}

	filter:=bson.M{}
	filter["isactive"]=true
	filter["hospital"]=hospital
	if status=="inactive"{
		filter["isactive"] =false
	}
	if search!=""{
		filter["$or"] = []bson.M{
                {"name": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
                {"phoneNumber": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
        }
	}
    patientsCollection:=db.Client.Database("db1").Collection("patients")
    
	total,err:=patientsCollection.CountDocuments(context.TODO(), filter)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return 
	}
    
	skip := int64((page - 1) * size)
    limit := int64(size)
    opts := options.Find().SetSkip(skip).SetLimit(limit)

	cursor, err:=patientsCollection.Find(context.TODO(), filter, opts)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return 
	}
	defer cursor.Close(context.TODO())

    var selectedFilterPatients []models.PATIENT
	if err=cursor.All(context.TODO(), &selectedFilterPatients); err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return
	}

    c.JSON(http.StatusAccepted, gin.H{"success":true, "patients": selectedFilterPatients, "count": total})
}

func GetPatientById(c *gin.Context) { //patient id
	pId:=c.Param("patientId")
	var patient models.PATIENT
	patient.ID = pId
	patientsCollection := db.Client.Database("db1").Collection("patients")
	err := patientsCollection.FindOne(context.TODO(), gin.H{"_id": patient.ID}).Decode(&patient)

	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Patient Found", "patient": patient, "success": true})
}

func getID(collection *mongo.Collection) string {
	count, err := collection.EstimatedDocumentCount(context.TODO())

	count++
	if err != nil {
		log.Fatal("Error while counting the total number")
		return "-1"
	}
	str := strconv.FormatInt(count, 10)
	for len(str) < 4 {
		str = "0" + str
	}
	str = "CC" + str
	return str
}

func AddNewPatient(c *gin.Context) {
	var newPatient models.PATIENT
    log.Print(c.Request.Body)
	if err := c.ShouldBindJSON(&newPatient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}


	log.Print(newPatient)
	patientsCollection := db.Client.Database("db1").Collection("patients")

	newPatient.ID = getID(patientsCollection)
	newPatient.Notes = []models.PatientNote{}
	// newPatient.Fields = make(map[string]interface{})
	// newPatient.IsActive = true

	_, err := patientsCollection.InsertOne(context.TODO(), newPatient)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "Patient Added Successfully", "success": true, "patient": newPatient})
} 

// func EditPatient(c *gin.Context) {
// 	var patient models.PATIENT

// 	if err := c.ShouldBindJSON(&patient); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	patientCollection := db.Client.Database("db1").Collection("patients")
// 	filter := bson.M{"_id": patient.ID}
// 	_, err := patientCollection.ReplaceOne(context.TODO(), filter, patient)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"success": true,"message": "Patient Updated Successfully"})
// }

func EditPatient(c *gin.Context) {
	// Parse the incoming JSON into a map for partial updates
	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Extract patient ID (assuming it's sent in the JSON or as a URL parameter)
	patientID := c.Param("patientId")

	// If no fields are provided to update, return an error
	if len(updateData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "No fields provided to update"})
		return
	}

	// Connect to the patients collection
	patientCollection := db.Client.Database("db1").Collection("patients")

	// Check if the patient exists
	filter := bson.M{"_id": patientID}
	var existingPatient bson.M
	err := patientCollection.FindOne(context.TODO(), filter).Decode(&existingPatient)
	if err == mongo.ErrNoDocuments {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Patient not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Prepare the update with $set to update only provided fields
	update := bson.M{
		"$set": updateData,
	}

	// Perform the partial update
	result, err := patientCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Check if the update was successful
	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Patient not found"})
		return
	}

	// Optionally fetch the updated patient to return
	var updatedPatient bson.M
	err = patientCollection.FindOne(context.TODO(), filter).Decode(&updatedPatient)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Return success response with the updated patient
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Patient updated successfully",
		"patient": updatedPatient,
	})
}

func RemovePatient(c *gin.Context) {
	id := c.Param("id")
	patientCollection := db.Client.Database("db1").Collection("patients")

	filter := bson.M{"_id": id}
	_, err := patientCollection.DeleteOne(context.TODO(), filter)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Patient Removed Successfully"})
}

func GetFieldsForUser(c *gin.Context) {
	hospital := c.Param("hospital")
	fieldsCollection := db.Client.Database("db1").Collection("fields")

	var fields models.PatientFields
	err := fieldsCollection.FindOne(context.TODO(), bson.M{"hospital": hospital}).Decode(&fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "fields": fields.Fields})
	
}

func saveHistory(patientId, model, cellType string, cellsData, flaskResp interface{})error {
	log.Print(patientId,flaskResp)
	historyCollection := db.Client.Database("db1").Collection("history")

	// Create a new history item
	historyItem := models.HistoryItem{
		Model:     model,
		CreatedAt: time.Now(),
		Type:      cellType,
		CellsData: cellsData,
		Prediction: flaskResp,
	}

	var existiingHistory models.PatientHistory
	err := historyCollection.FindOne(context.TODO(), bson.M{"patient_id": patientId}).Decode(&existiingHistory)	
	if err != nil {

		existiingHistory = models.PatientHistory{
			PatientID: patientId,
			History:   []models.HistoryItem{historyItem},
		}
		_, err = historyCollection.InsertOne(context.TODO(), existiingHistory)
		if err != nil {
			log.Println("Error inserting new history:", err)
			return err
		}
		return nil
	} else {

		// Append to existing history array
	    _, err = historyCollection.UpdateOne(
   		    context.Background(),
		    primitive.M{"patient_id": patientId},
		    primitive.M{"$push": primitive.M{"history": historyItem}},
	    )
		return err
	}
}


func Predict(c* gin.Context){
	model:=c.Query("model")
	cellType:=c.Query("type")
	patientId:=c.Query("patientId")
	var jsonData interface{}
    
	err:=c.BindJSON(&jsonData);
	if  err!=nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err, "success": false})
		return 
	}
    
	log.Print(jsonData)
	pyurl:=predictionService+"/predict"
	u,err:=url.Parse(pyurl)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
		return
	}

	q:=u.Query()
	q.Set("model", model)
	q.Set("type", cellType)

	u.RawQuery=q.Encode()
	pyurl=u.String()
    jsonBytes,err:=json.Marshal(jsonData)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
		return
	}
	log.Print(jsonBytes)

	resp,err:=http.Post(pyurl,"application/json", bytes.NewBuffer(jsonBytes))
	if err!=nil{
        c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
		return
	}
	defer resp.Body.Close()
	log.Print(resp)

	var flaskResp interface{}
	if err:=json.NewDecoder(resp.Body).Decode(&flaskResp); err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
		return
	}


    err=saveHistory(patientId, model, cellType, jsonData, flaskResp)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
        return
    }

	c.JSON(http.StatusOK, flaskResp)
}

func GetPatientHistory(c *gin.Context){
	patientId := c.Param("patientId")
	historyCollection := db.Client.Database("db1").Collection("history")

	var history models.PatientHistory
	err := historyCollection.FindOne(context.TODO(), bson.M{"patient_id": patientId}).Decode(&history)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Return null when no document is found
			c.JSON(http.StatusOK, gin.H{"success": true, "history": nil})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "history": history})
}

func GetFormatFile(c *gin.Context){
	fileType:=c.Query("type")
	filePath:="C:/Users/Sanmai/Desktop/MajProject/Cervical_Cancer_Detection/Backend/data/test_"+fileType+".xlsx"

	file,err:=os.Open(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open template file", "success": false})
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get file info", "success": false})
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=input_template.xlsx")
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Expires", "0")

	_, err = io.Copy(c.Writer, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send file", "success": false})
		return
	}

	c.Writer.Flush()

	c.JSON(http.StatusOK, gin.H{"message": "File sent successfully", "success": true})
}

func AddNote(c *gin.Context){
	patientId:=c.Param("patientId")
	var patientNoteEntry models.PatientNote

	if err := c.ShouldBindJSON(&patientNoteEntry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	patientNoteEntry.InsertedAt = time.Now()
	patientCollection := db.Client.Database("db1").Collection("patients")

    _, err := patientCollection.UpdateOne(
   		context.TODO(),
		primitive.M{"_id": patientId},
		primitive.M{"$push": primitive.M{"notes": patientNoteEntry}},
	)

	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add note", "success": false})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"message": "Note added successfully", "success": true})
}

func EditUserDetails(c *gin.Context){
    var editedUser models.USER
	if err := c.ShouldBindJSON(&editedUser); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}
    
	log.Print(editedUser)
	detailsCollection := db.Client.Database("db1").Collection("users")
	filter := bson.M{"_id": editedUser.ID}
	update := bson.M{"$set": editedUser}
	_, err := detailsCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Details updated successfully", "user": editedUser})
}

// func uploadImageInS3(file multipart.File, key string) {
// 	if err := godotenv.Load(); err != nil {
// 		log.Fatal("Error loading .env file")
// 	}

// 	fileBytes, err := io.ReadAll(file)
// 	if err != nil {
// 		log.Fatal("Failed to read file:", err)
// 	}

// 	svc := s3service.S3Client

// 	uploadParams := &s3.PutObjectInput{
// 		Bucket:        aws.String(os.Getenv("BUCKET")),
// 		Key:           aws.String(key),
// 		Body:          bytes.NewReader(fileBytes),
// 		ContentLength: aws.Int64(int64(len(fileBytes))),
// 		ContentType:   aws.String("image/jpeg"),
// 	}

// 	_, err = svc.PutObject(uploadParams)
// 	if err != nil {
// 		log.Fatal("Failed to upload image:", err)
// 	}
// 	log.Print("uploaded image")
// }

// var currentNumber = 60 // Global variable to store the current number

// func deleteFile(){
// 	filePath:="C:/Users/Sanmai/Desktop/MajProject/Cervical_Cancer_Detection/Backend/handlers/image.jpeg"

// 	_,err:=os.Stat(filePath)
// 	if os.IsExist(err){
// 		os.Remove(filePath)
// 	}
// }

// func getPredictionFromPredictionService(image multipart.File) string {
     
// 	// deleteFile()
// 	localFile,err:= os.Create("C:/Users/Sanmai/Desktop/MajProject/Cervical_Cancer_Detection/Backend/handlers/image.jpeg")
// 	// localFile, err := os.OpenFile("C:/Users/Sanmai/Desktop/MajProject/Cervical_Cancer_Detection/Backend/handlers/image.jpeg", os.O_WRONLY|os.O_CREATE, os.ModePerm)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

	

//     _, err = io.Copy(localFile, image)

// 	defer localFile.Close()

// 	if err!=nil{
// 		log.Fatal(err)
// 	}

//     file,err:=os.Open("C:/Users/Sanmai/Desktop/MajProject/Cervical_Cancer_Detection/Backend/handlers/image.jpeg")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer file.Close()

//     body := &bytes.Buffer{}
// 	writer := multipart.NewWriter(body)	

    
// 	part,err:= writer.CreateFormFile("image","image.jpeg")
    
// 	if err != nil {
// 		log.Fatal("Error creating form file:", err)
// 	}

// 	_,err=io.Copy(part,file)
// 	writer.Close()
//     if err != nil {
// 		log.Println("Error copying file:", err)
// 	}

//     url:="http://127.0.0.1:5000/predict"
// 	req,err:=http.NewRequest("POST", url, body)


// 	if err!=nil{
// 		log.Fatal(err)
// 	}
    
// 	req.Header.Set("Content-Type", writer.FormDataContentType())

// 	client:=&http.Client{
// 		Timeout: time.Second*20,
// 	}
//     resp,err:=client.Do(req)

// 	if err != nil {
// 		log.Println("Error sending request:", err)
// 	}
    

// 	bodyBytes,err:=io.ReadAll(resp.Body)

// 	if err != nil {
// 		log.Println(err)
// 	}

// 	bodyString := string(bodyBytes)
	

// 	defer resp.Body.Close()
	
// 	log.Println(bodyString)

// 	return bodyString
// }

// func UploadImageForPatientAndPredict(c *gin.Context) { //patientID, image
// 	image, _, err := c.Request.FormFile("image")
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	patientId := c.Request.FormValue("id")
	

// 	prediction:=getPredictionFromPredictionService(image)


// 	log.Println(prediction)

// 	patientsCollection := db.Client.Database("db1").Collection("patients")

// 	filter := gin.H{"_id": patientId}
	
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
    
// 	var result struct{
// 		Prediction string `json:"prediction"`
// 	}

// 	err=json.Unmarshal([]byte(prediction),&result)

// 	if err!=nil{
// 		panic(err)
// 	}

// 	log.Println(result.Prediction)

// 	var predictions [][]float64

// 	err=json.Unmarshal([]byte(result.Prediction),&predictions)

// 	if err!=nil{
// 		log.Fatalf("Error parsing prediction field: %v", err)
// 	}

// 	notCancer:="0"

// 	if len(predictions)>0 && len(predictions[0])>0{
// 		strValue:=strconv.FormatFloat(predictions[0][0],'f',6,64)
// 		log.Println(strValue)
// 	    prediction = strValue
        
// 		notCancer=strconv.FormatFloat(predictions[0][1],'f',6,64)
// 	}
    

// 	c.JSON(http.StatusOK, gin.H{"prediction": prediction,"notCancer":notCancer})
// }


// func CsvFilePredict(c* gin.Context){
// 	var jsonData interface{}
    
// 	err:=c.BindJSON(&jsonData);
// 	if  err!=nil{
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err, "success": false})
// 		return 
// 	}
    
// 	log.Print(jsonData)
// 	url:=predictionService+"/predict"
//     jsonBytes,err:=json.Marshal(jsonData)
// 	if err!=nil{
// 		c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
// 		return
// 	}

// 	resp,err:=http.Post(url,"application/json", bytes.NewBuffer(jsonBytes))
// 	if err!=nil{
//         c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
// 		return
// 	}
// 	defer resp.Body.Close()

// 	var flaskResp interface{}
// 	if err:=json.NewDecoder(resp.Body).Decode(&flaskResp); err!=nil{
// 		c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
// 		return
// 	}

// 	c.JSON(http.StatusOK, flaskResp)
// }