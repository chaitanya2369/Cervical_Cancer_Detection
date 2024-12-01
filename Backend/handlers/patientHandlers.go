package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPatient (c *gin.Context){
   var newPatient models.PATIENT

   if err:=c.ShouldBindJSON(&newPatient); err!=nil{
	 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	 return
   }
   
   paitentCollection := db.Client.Database("db1").Collection("patients");
   
   var tempPatient models.PATIENT
   err:=paitentCollection.FindOne(context.TODO(), gin.H{"email": newPatient.Email}).Decode(&tempPatient)

   if err!=nil{
	 c.JSON(http.StatusNotAcceptable, gin.H{"message": "Patient Already Exist"})
	 return
   }

   _,err=paitentCollection.InsertOne(context.TODO(), newPatient)

   if err!=nil{
	 c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
	 return
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "Patient added successfully"})
}
