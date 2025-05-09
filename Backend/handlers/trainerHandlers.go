package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)


type Train_Data_Format struct {
	ID          string `bson:"_id,omitempty"`
	Sender      string `bson:"sender"`
	Status      string `bson:"status"`
	DatasetName string `bson:"datasetName"`
	Model       string `bson:"model"`
	Type        string `bson:"type"`
	Note        string `bson:"note"`
	CreatedAt   string `bson:"createdAt"`
}

var pythonService string

func init(){
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	pythonService = os.Getenv("JWT_SECRET_KEY")
}


func GetAllTrainingData(c *gin.Context) { //send everythign except cells data
	trainDataCollection:=db.Client.Database("db1").Collection("train_data");

	projection := bson.M{
		"CellsData": 0,
	}
	//println(projection)
	findOptions := options.Find().SetProjection(projection)
	cursor,err:=trainDataCollection.Find(context.TODO(), bson.M{},findOptions)
	if err!=nil{
		//print(err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var data []Train_Data_Format
	if err:= cursor.All(context.TODO(),&data); err!=nil{
		println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	//print(data)
	c.JSON(http.StatusOK, data)
}

func GetAcceptedTrainingData(c *gin.Context){
	trainDataCollection:=db.Client.Database("db1").Collection("train_data");

	projection := bson.M{
		"cellsData": 0,
	}

	findOptions := options.Find().SetProjection(projection)
	cursor,err:=trainDataCollection.Find(context.TODO(), bson.M{"status": "accepted"},findOptions)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var data []Train_Data_Format
	if err:= cursor.All(context.TODO(),&data); err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}

type UpdateStatusRequest struct{
	ID       string   `bson:"id" binding:"required"`
	Status   string   `bson:"status" binding:"required"`
}

func UpdateStatus(c *gin.Context){ //send id, new status
	var updateStatus UpdateStatusRequest
	if err:=c.ShouldBindJSON(&updateStatus); err!=nil{
		log.Print(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	trainDataCollection:=db.Client.Database("db1").Collection("train_data");
    
	objId, err:=primitive.ObjectIDFromHex(updateStatus.ID)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	filter:=bson.M{"_id": objId}
    
	update:=bson.M{
		"$set": bson.M{
			"status": updateStatus.Status,
		},
	}

	_,err=trainDataCollection.UpdateOne(context.TODO(), filter, update)

	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"success": true});
}

type CellsDataResponse struct {
	CellsData interface{} `json:"cellsData"`
}

func DownloadTrainingCellsData(c *gin.Context){ //send id
	id:=c.Query("id")
	log.Print(id)
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "ID is required",
		})
		return
	}

	trainDataCollection:=db.Client.Database("db1").Collection("train_data");

	projection := bson.M{
		"cellsData": 1,
		"_id": 0,
	}

	objId, err:=primitive.ObjectIDFromHex(id)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	findOptions := options.FindOne().SetProjection(projection)
	var res CellsDataResponse
	err=trainDataCollection.FindOne(context.TODO(), bson.M{"_id": objId},findOptions).Decode(&res)
	if err!=nil{
		log.Print(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func UploadPickleFile(c *gin.Context){
	var modelHistoryEntry models.MODEL_HISTORY
	if err:=c.ShouldBindJSON(&modelHistoryEntry); err!=nil{
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}
	file, header, err := c.Request.FormFile("pickleFile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Failed to get file: " + err.Error(),
		})
		return
	}
	defer file.Close()

	if filepath.Ext(header.Filename) != ".pkl" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid file type. Only .pkl files are allowed.",
		})
		return
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("pickleFile", header.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create form file: " + err.Error(),
		})
		return
	}

	_, err = io.Copy(part, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to copy file: " + err.Error(),
		})
		return
	}

	err = writer.Close()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to close writer: " + err.Error(),
		})
		return
	}

	pythonServiceURL:=pythonService+"/replace-pickle"
	u,err:=url.Parse(pythonServiceURL)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err, "success": false})
		return
	}

	q:=u.Query()
	q.Set("model", modelHistoryEntry.ModelType)
	q.Set("type", modelHistoryEntry.ImageType)
    
	u.RawQuery=q.Encode()
	pythonServiceURL=u.String()


	req, err := http.NewRequest("POST", pythonServiceURL, body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create request: " + err.Error(),
		})
		return
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to send file to Python service: " + err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Python service returned status: %d", resp.StatusCode),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Pickle file uploaded and replaced successfully.",
	})
}