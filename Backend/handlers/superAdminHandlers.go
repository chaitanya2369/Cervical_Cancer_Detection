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

func CreateAdmin(c *gin.Context) {
	var newAdmin models.ADMIN

	// Bind the JSON request body to the admin struct
	if err := c.ShouldBindJSON(&newAdmin); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}

	// Check if admin with this email already exists
	adminCollection := db.Client.Database("db1").Collection("admins")
	var existingAdmin models.ADMIN
	err := adminCollection.FindOne(context.TODO(), bson.M{"email": newAdmin.Email}).Decode(&existingAdmin)
	if err != mongo.ErrNoDocuments { // ErrNoDocuments means no admin was found
		log.Fatal("User already exists with the same email")
		c.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
		return
	}
    _, err = adminCollection.InsertOne(context.TODO(), newAdmin)
	if err != nil {
		log.Fatal("Error inserting admin: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating admin", "error": err.Error()})
		return
	}

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "admin": newAdmin})
}

func GetUnApprovedAdmins(c *gin.Context) {
   var UnApprovedAdmins []models.ADMIN
   adminCollection:=db.Client.Database("db1").Collection("admins")
   cur,err:= adminCollection.Find(context.TODO(), gin.H{"isApproved": false})

   if err!=nil{
	 log.Fatal(err)
   }
   for cur.Next(context.TODO()){
	var elem models.ADMIN
	err:=cur.Decode(&elem)

	if err!=nil{
		log.Fatal(err)
	}
	UnApprovedAdmins = append(UnApprovedAdmins, elem)
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "successful", "admins": UnApprovedAdmins})
}

func GetApprovedAdmins(c *gin.Context){
   var ApprovedAdmins []models.ADMIN
   adminCollection:=db.Client.Database("db1").Collection("admins")
   cur,err:= adminCollection.Find(context.TODO(), gin.H{"isApproved": true})

   if err!=nil{
	 log.Fatal(err)
   }
   for cur.Next(context.TODO()){
	var elem models.ADMIN
	err:=cur.Decode(&elem)

	if err!=nil{
		log.Fatal(err)
	}
	ApprovedAdmins = append(ApprovedAdmins, elem)
   }

   c.JSON(http.StatusAccepted, gin.H{"message": "successful", "admins": ApprovedAdmins})
}

func ChangeAdminData(c *gin.Context){ //send complete user
  var admin models.ADMIN
   if err:=c.ShouldBindJSON(&admin); err!=nil{
	 log.Fatal(err)
	 return
   }
   
   userCollection := db.Client.Database("db1").Collection("users")
   filter := bson.M{"_id": admin.ID}
   _,err := userCollection.ReplaceOne(context.TODO(), filter, admin)

  if err!=nil{
	log.Fatal(err)
	return
  }

  c.JSON(http.StatusAccepted, gin.H{"message": "Data changed"})
}