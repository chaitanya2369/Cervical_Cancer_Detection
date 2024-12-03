package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetActivePatients(c* gin.Context){
   var patients []models.PATIENT
   patientsCollection:=db.Client.Database("db1").Collection("patients")
   cur,err:= patientsCollection.Find(context.TODO(), gin.H{"is_active": true})

   if err!=nil{
	 log.Fatal(err)
   }
   for cur.Next(context.TODO()){
	var elem models.PATIENT
	err:=cur.Decode(&elem)

	if err!=nil{
		log.Fatal(err)
	}
	patients = append(patients, elem)
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "successful", "active_patients": patients})
}

func GetInActivePatients(c* gin.Context){
   var patients []models.PATIENT
   patientsCollection:=db.Client.Database("db1").Collection("patients")
   cur,err:= patientsCollection.Find(context.TODO(), gin.H{"is_active": false})

   if err!=nil{
	 log.Fatal(err)
   }
   for cur.Next(context.TODO()){
	var elem models.PATIENT
	err:=cur.Decode(&elem)

	if err!=nil{
		log.Fatal(err)
	}
	patients = append(patients, elem)
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "successful", "active_patients": patients})
}


func GetPatient(c *gin.Context){ //patient id
   var patient models.PATIENT

   if err:=c.ShouldBindJSON(&patient); err!=nil{
	 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	 return 
   }

   patientsCollection:=db.Client.Database("db1").Collection("patients");
   err:= patientsCollection.FindOne(context.TODO(), gin.H{"_id": patient.ID}).Decode(&patient)

   if err!=nil{
	c.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
	return
   }

   c.JSON(http.StatusOK, gin.H{"message": "Patient Found", "patient": patient})
}

func getID(collection *mongo.Collection) string{
   count, err:= collection.EstimatedDocumentCount(context.TODO())
   
   count++
   if err!=nil{
	 log.Fatal("Error while counting the total number")
	 return "-1"
   }
   str:= strconv.FormatInt(count, 10)
   for len(str)<4 {
	  str="0"+str
   }
   str="CC"+str
   return str
}

func AddNewPatient(c *gin.Context) {
   var newPatient models.PATIENT

   if err:=c.ShouldBindJSON(&newPatient); err!=nil{
	 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	 return
   }

   patientsCollection:= db.Client.Database("db1").Collection("patients");

   newPatient.ID = getID(patientsCollection);
   newPatient.IsActive = true
   

   _,err:=patientsCollection.InsertOne(context.TODO(), newPatient)
   
   if err!=nil{
	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	return
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "Patient Added Successfully"})
}

func EditPatient(c *gin.Context){
   var patient models.PATIENT

   if err:=c.ShouldBindJSON(&patient); err!=nil{
	 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	 return
   }

   patientCollection := db.Client.Database("db1").Collection("patients")
   filter := bson.M{"_id": patient.ID}
   _,err := patientCollection.ReplaceOne(context.TODO(), filter, patient)

   if err!=nil{
	 c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	 return 
   }
 
   c.JSON(http.StatusOK, gin.H{"message": "Patient Updated Successfully"})
}

func uploadImageInS3(file multipart.File) (string,error){
   return "",nil;
}


type reqImageData struct{
	ID            primitive.ObjectID  `bson:"_id,omitempty"`
	URL           string              `bson:"url"`          //Base64-encoded string later will replace with s3 url
	Type          string              `bson:"type"`
}

func UploadImageForPatient(c *gin.Context){ //patientID, image
   image,_, err:=c.Request.FormFile("image")

   if err!=nil{
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	return
   }
   imageURL,err :=uploadImageInS3(image) //send image to this later

   if err!=nil{
	 c.JSON(http.StatusAccepted, gin.H{"error": "Error in uploading image in S3 bucket"})
	 return
   }
   
   var img reqImageData
   if err:=c.ShouldBindJSON(&img); err!=nil{
	  c.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
	  return
   }

   newImage := models.ImageData{
	 URL: imageURL,
	 InsertedAt: time.Now(),
	 Type: img.Type,
   }

   patientsCollection:=db.Client.Database("db1").Collection("patients")
   
   
   filter:=gin.H{"_id": img.ID}
   update:=gin.H{"$push": gin.H{"images": newImage}};

   _,err= patientsCollection.UpdateOne(context.TODO(), filter, update)

   if err!=nil{
	 c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	 return
   }
   
   c.JSON(http.StatusOK, gin.H{"message": "Image Uploaded"});
}