package handlers

import (
	"Cervical_Cancer_Detection/auth"
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetSelectedFilterUsers(c *gin.Context){
    status:=c.Query("status")
    pageStr:=c.Query("page")
    sizeStr:=c.Query("size")
    search:=c.Query("search")
	hospital := c.Query("hospital")

    page, _ := strconv.Atoi(pageStr)
    if page < 1 {
		page = 1
	}
	size, _ := strconv.Atoi(sizeStr)
	if size <= 0 {
		size = 10
	}

	filter:=bson.M{}
	filter["status"]=status
	filter["hospital"] = hospital
	if search!=""{
		filter["$or"] = []bson.M{
                {"name": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
                {"email": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
        }
	}
    userCollection:=db.Client.Database("db1").Collection("users")
    
	total,err:=userCollection.CountDocuments(context.TODO(), filter)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return 
	}
    
	skip := int64((page - 1) * size)
    limit := int64(size)
    opts := options.Find().SetSkip(skip).SetLimit(limit)

	cursor, err:=userCollection.Find(context.TODO(), filter, opts)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return 
	}
	defer cursor.Close(context.TODO())

	var selectedFilterUsers []models.USER
	if err=cursor.All(context.TODO(), &selectedFilterUsers); err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return
	}

    c.JSON(http.StatusAccepted, gin.H{"success":true, "users": selectedFilterUsers, "count": total})
}

func ChangeUserData(c *gin.Context){ //send complete user
  
  var user models.USER
   if err:=c.ShouldBindJSON(&user); err!=nil{
	 log.Fatal(err)
	 return
   }
   
   userId,_:=primitive.ObjectIDFromHex(c.Param("id"))
   userCollection := db.Client.Database("db1").Collection("users")
   filter := bson.M{"_id": userId}
   _,err := userCollection.ReplaceOne(context.TODO(), filter, user)

  if err!=nil{
	log.Fatal(err)
	return
  }

  c.JSON(http.StatusAccepted, gin.H{"success":true, "message": "User Data changed"})
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
	err := userCollection.FindOne(context.TODO(), bson.M{"email": user.Email, "hospital": user.Hospital}).Decode(&existingUser)
	if err != mongo.ErrNoDocuments { // ErrNoDocuments means no user was found
		log.Fatal("User already exists with the same email")
		c.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
		return
	}

	user.Password = auth.GenerateRandomPassword(10)
	//Send this password to the user via email
	user.Password, err = auth.HashPassword(user.Password)

	if err != nil {
		log.Fatal("Error hashing password: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating user", "error": err.Error()})
		return
	}

	_, err = userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Fatal("Error inserting user: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating user", "error": err.Error()})
		return
	}

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func RemoveUser(c *gin.Context) {
	id := c.Param("id")
	userCollection := db.Client.Database("db1").Collection("users")
    userId,_:=primitive.ObjectIDFromHex(id)

	// Delete the user with the specified ID
	_, err := userCollection.DeleteOne(context.TODO(), bson.M{"_id": userId})
	if err != nil {
		log.Fatal("Error deleting user: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting user", "error": err.Error()})
		return	
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "User deleted successfully"})
}

func GetFields(c *gin.Context) {
	fieldsCollection := db.Client.Database("db1").Collection("fields")

	var fields models.PatientFields
	err := fieldsCollection.FindOne(context.TODO(), bson.M{"hospital": c.Param("hospital")}).Decode(&fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "fields": fields.Fields})
}

func EditField(c *gin.Context) {
	hospital := c.Param("hospital")	
	fieldsCollection := db.Client.Database("db1").Collection("fields")
	var fields models.PatientFields

	if err := c.ShouldBindJSON(&fields); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}	

	// Update the field with the specified ID
	_, err := fieldsCollection.UpdateOne(context.TODO(), bson.M{"hospital": hospital}, bson.M{"$set": fields})
	if err != nil {	
		log.Fatal("Error updating field: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false,"message": "Error updating field", "error": err.Error()})
		return	
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Field updated successfully", "fields": fields})
}	