package auth

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func generateOtp(){

}

func saveUser(){

}

func SignUp(c *gin.Context){
	var user models.USER

	if err:= c.ShouldBindJSON(&user); err!=nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
    
	var tempUser models.USER
	userCollection := db.Client.Database("db1").Collection("users");
    err:= userCollection.FindOne(context.TODO(), gin.H{"email": user.Email}).Decode(&tempUser)

	if err==nil{
		c.JSON(http.StatusConflict, gin.H{"error": "User Already present"})
		return
	}

	_,err =userCollection.InsertOne(context.TODO(), user)

	if err!=nil{

	}
}