package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	s3service "Cervical_Cancer_Detection/s3Service"
	"bytes"
	"context"
	"io"
	"log"

	// "math/rand/v2"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetActivePatients(c *gin.Context) {
	var patients []models.PATIENT
	patientsCollection := db.Client.Database("db1").Collection("patients")
	cur, err := patientsCollection.Find(context.TODO(), gin.H{"is_active": true})

	if err != nil {
		log.Fatal(err)
	}
	for cur.Next(context.TODO()) {
		var elem models.PATIENT
		err := cur.Decode(&elem)

		if err != nil {
			log.Fatal(err)
		}
		patients = append(patients, elem)
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "successful", "active_patients": patients})
}

func GetInActivePatients(c *gin.Context) {
	var patients []models.PATIENT
	patientsCollection := db.Client.Database("db1").Collection("patients")
	cur, err := patientsCollection.Find(context.TODO(), gin.H{"is_active": false})

	if err != nil {
		log.Fatal(err)
	}
	for cur.Next(context.TODO()) {
		var elem models.PATIENT
		err := cur.Decode(&elem)

		if err != nil {
			log.Fatal(err)
		}
		patients = append(patients, elem)
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "successful", "active_patients": patients})
}

func GetPatient(c *gin.Context) { //patient id
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
	newPatient.Images = []models.ImageData{}

	_, err := patientsCollection.InsertOne(context.TODO(), newPatient)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "Patient Added Successfully"})
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

func uploadImageInS3(file multipart.File, key string) {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		log.Fatal("Failed to read file:", err)
	}

	svc := s3service.S3Client

	uploadParams := &s3.PutObjectInput{
		Bucket:        aws.String(os.Getenv("BUCKET")),
		Key:           aws.String(key),
		Body:          bytes.NewReader(fileBytes),
		ContentLength: aws.Int64(int64(len(fileBytes))),
		ContentType:   aws.String("image/jpeg"),
	}

	_, err = svc.PutObject(uploadParams)
	if err != nil {
		log.Fatal("Failed to upload image:", err)
	}
}

var currentNumber = 60 // Global variable to store the current number

func getPredictionWithImage() string {
	currentNumber = (currentNumber + 1) % 101 // Increment and wrap around after 100
	return strconv.Itoa(currentNumber)        // Convert to string
}

func UploadImageForPatientAndPredict(c *gin.Context) { //patientID, image
	image, _, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patientId := c.Request.FormValue("id")
	imageType := c.Request.FormValue("type")

	log.Print(patientId)
	log.Print(imageType)

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05") // YYYY-MM-DD HH:MM:SS

	key := patientId + formattedTime + ".jpg"

	uploadImageInS3(image, key) //send image to this later

	imageURL := "https://ccdt.s3.ap-south-1.amazonaws.com/" + key

	if err != nil {
		c.JSON(http.StatusAccepted, gin.H{"error": "Error in uploading image in S3 bucket"})
		return
	}

	newImage := models.ImageData{
		URL:        imageURL,
		InsertedAt: time.Now(),
		Type:       imageType,
	}

	patientsCollection := db.Client.Database("db1").Collection("patients")

	filter := gin.H{"_id": patientId}
	update := gin.H{"$push": gin.H{"images": newImage}}

	_, err = patientsCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image Uploaded", "prediction": getPredictionWithImage()})
}
