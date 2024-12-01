package auth

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleLogin(c *gin.Context){ 
   var user models.USER
   if err:= c.ShouldBindJSON(&user); err!=nil{
	 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	 return
   }
   userCollection := db.Client.Database("db1").Collection("users")
   var tempUser models.USER
   err:= userCollection.FindOne(context.TODO(), gin.H{"email": user.Email}).Decode(&tempUser) //check if already registered

   if err!=nil{
	  c.JSON(http.StatusNotAcceptable, gin.H{"message": "User not Registered"})
	  return
   }

   if tempUser.Password!=user.Password{
	 c.JSON(http.StatusNotAcceptable, gin.H{"message": "password not matched"})
	 return
   }
   token, err := CreateJWTtoken(user.Email)
   if err!=nil{
	 c.JSON(http.StatusInternalServerError, gin.H{"message": "JWT not created", "error": err.Error()})
	 return
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "Password Matched", "jwt-token": token, "role": user})
}