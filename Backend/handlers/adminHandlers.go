package handlers

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)



func GetUnApprovedUsers(c *gin.Context) {
	log.Print("GetUnapprovedusers called!!");
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
func GetApprovedUsers(c *gin.Context) {
	log.Print("GetUnapprovedusers called!!");
   var UnApprovedUsers []models.USER
   userCollection:=db.Client.Database("db1").Collection("users")
   cur,err:= userCollection.Find(context.TODO(), gin.H{"isApproved": true})

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

func CreateUser(c *gin.Context) {
	var user models.USER

	// Bind the JSON request body to the user struct
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}

	// Check if user with this email already exists
	userCollection := db.Client.Database("db1").Collection("users")
	var existingUser models.USER
	err := userCollection.FindOne(context.TODO(), bson.M{"email": user.Email}).Decode(&existingUser)
	if err != mongo.ErrNoDocuments { // ErrNoDocuments means no user was found
		log.Fatal("User already exists with the same email")
		c.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
		return
	}
	_, err = userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Fatal("Error inserting user: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating user", "error": err.Error()})
		return
	}

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "user": user})
}