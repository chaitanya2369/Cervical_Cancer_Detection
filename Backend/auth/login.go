package auth

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func checkPassword(hashedPassword string, password string) bool{
   err:= bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
   return err==nil
}

func HandleLogin(c *gin.Context){ 
   var user models.GENERIC_USER
   if err:= c.ShouldBindJSON(&user); err!=nil{
	 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	 return
   }

   userCollection := db.Client.Database("db1").Collection("users")
   adminCollection := db.Client.Database("db1").Collection("admins")
   
   var tempUser models.USER
   errAtUserCollection:= userCollection.FindOne(context.TODO(), gin.H{"email": user.Email}).Decode(&tempUser) //check if already registered

   var tempAdmin models.ADMIN
   errAtAdminCollection:= adminCollection.FindOne(context.TODO(),gin.H{"email": user.Email}).Decode(&tempAdmin)

   if errAtUserCollection==nil{
      if !checkPassword(tempUser.Password, user.Password){
	      c.JSON(http.StatusNotAcceptable, gin.H{"message": "password not matched"})
	      return
      }
	   token, err := CreateJWTtoken(user.Email)
      if err!=nil{
	      c.JSON(http.StatusInternalServerError, gin.H{"message": "JWT not created", "error": err.Error()})
	      return
      }

      c.JSON(http.StatusAccepted, gin.H{"success": true,"message": "Password Matched", "jwt-token": token, "user": tempUser, "role": "user"})
      return
   }

   if errAtAdminCollection==nil{
      if !checkPassword(tempAdmin.Password, user.Password){
	      c.JSON(http.StatusNotAcceptable, gin.H{"message": "password not matched"})
	      return
      }
      token, err := CreateJWTtoken(user.Email)
      if err!=nil{
	      c.JSON(http.StatusInternalServerError, gin.H{"message": "JWT not created", "error": err.Error()})
	      return
      }

      c.JSON(http.StatusAccepted, gin.H{"success": true,"message": "Password Matched", "jwt-token": token, "admin": tempAdmin, "role": tempAdmin.Role})
      return
   }

   c.JSON(http.StatusNotAcceptable, gin.H{"message": "User not Registered"})
}