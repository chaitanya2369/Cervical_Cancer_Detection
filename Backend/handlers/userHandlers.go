package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"log"

	// "math/rand/v2"

	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
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
	filter["is_active"]=true
	filter["hospital"]=hospital
	if status=="inactive"{
		filter["is_active"] =false
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
	var patient models.PATIENT

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patientsCollection := db.Client.Database("db1").Collection("patients")
	err := patientsCollection.FindOne(context.TODO(), gin.H{"_id": patient.ID}).Decode(&patient)

	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Patient Found", "patient": patient})
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

	if err := c.ShouldBindJSON(&newPatient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patientsCollection := db.Client.Database("db1").Collection("patients")

	newPatient.ID = getID(patientsCollection)
	newPatient.IsActive = true

	_, err := patientsCollection.InsertOne(context.TODO(), newPatient)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "Patient Added Successfully", "success": true})
} 

func EditPatient(c *gin.Context) {
	var patient models.PATIENT

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patientCollection := db.Client.Database("db1").Collection("patients")
	filter := bson.M{"_id": patient.ID}
	_, err := patientCollection.ReplaceOne(context.TODO(), filter, patient)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Patient Updated Successfully"})
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