package auth

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func checkPassword(hashedPassword string, password string) bool{
   err:= bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
   return err==nil
}

func HandleLogin(c *gin.Context){ 
   log.Print("Handle login initiated")
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

   if !checkPassword(tempUser.Password, user.Password){
	 c.JSON(http.StatusNotAcceptable, gin.H{"message": "password not matched"})
	 return
   }
   token, err := CreateJWTtoken(user.Email)
   if err!=nil{
	 c.JSON(http.StatusInternalServerError, gin.H{"message": "JWT not created", "error": err.Error()})
	 return
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "Password Matched", "jwt-token": token, "role": tempUser.Role})
}