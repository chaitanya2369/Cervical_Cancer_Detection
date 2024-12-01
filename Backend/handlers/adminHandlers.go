package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetUnApprovedUsers(c *gin.Context) {
   var UnApprovedUsers []models.USER
   userCollection:=db.Client.Database("db1").Collection("users")
   cur,err:= userCollection.Find(context.TODO(), gin.H{"isApproved": false})

   if err!=nil{
	 log.Fatal(err)
   }
   for cur.Next(context.TODO()){
	var elem models.USER
	err:=cur.Decode(&elem)

	if err!=nil{
		log.Fatal(err)
	}
	UnApprovedUsers = append(UnApprovedUsers, elem)
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "successful", "users": UnApprovedUsers})
}

func ApproveUser(c *gin.Context){ //send complete user
   var user models.USER
   if err:=c.ShouldBindJSON(&user); err!=nil{
	 log.Fatal(err)
	 return
   }
   
   userCollection := db.Client.Database("db1").Collection("users")
   filter := bson.M{"_id": user.ID}
   _,err := userCollection.ReplaceOne(context.TODO(), filter, user)

  if err!=nil{
	log.Fatal(err)
	return
  }

  c.JSON(http.StatusAccepted, gin.H{"message": "Approved user and gave permissions"})
}