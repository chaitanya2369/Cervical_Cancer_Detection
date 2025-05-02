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

func GetSelectedFilterAdmins(c *gin.Context){
    status:=c.Query("status")
    pageStr:=c.Query("page")
    sizeStr:=c.Query("size")
    search:=c.Query("search")

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
	filter["role"] = "admin"
	if search!=""{
		filter["$or"] = []bson.M{
                {"name": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
                {"email": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
                {"hospital": bson.M{"$regex": ".*" + search + ".*", "$options": "i"}},
        }
	}
    adminCollection:=db.Client.Database("db1").Collection("admins")
    
	total,err:=adminCollection.CountDocuments(context.TODO(), filter)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return 
	}
    
	skip := int64((page - 1) * size)
    limit := int64(size)
    opts := options.Find().SetSkip(skip).SetLimit(limit)

	cursor, err:=adminCollection.Find(context.TODO(), filter, opts)
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return 
	}
	defer cursor.Close(context.TODO())

	var selectedFilterAdmins []models.ADMIN
	if err=cursor.All(context.TODO(), &selectedFilterAdmins); err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err})
		return
	}

    c.JSON(http.StatusAccepted, gin.H{"success":true, "admins": selectedFilterAdmins, "count": total})
}

func createFieldsForHospital(hospital string) error {
	var field models.PatientFields
	field.Hospital = hospital
	field.Fields = []string{}

	fieldCollection := db.Client.Database("db1").Collection("fields")
	// Check if the hospital already exists	

	var existingField models.PatientFields
	err := fieldCollection.FindOne(context.TODO(), bson.M{"hospital": hospital}).Decode(&existingField)
	if err == nil {
		return nil
	}

	_, err = fieldCollection.InsertOne(context.TODO(), field)
	if err != nil {
		return err
	}

	return nil
}


func CreateAdmin(c *gin.Context) {
	var newAdmin models.ADMIN

	// Bind the JSON request body to the admin struct
	if err := c.ShouldBindJSON(&newAdmin); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}
    newAdmin.Role = "admin"
	// Check if admin with this email already exists
	adminCollection := db.Client.Database("db1").Collection("admins")
	var existingAdmin models.ADMIN
	err := adminCollection.FindOne(context.TODO(), bson.M{"email": newAdmin.Email}).Decode(&existingAdmin)
	if err != mongo.ErrNoDocuments { // ErrNoDocuments means no admin was found
		c.JSON(http.StatusConflict, gin.H{"message": "User already exists", "success": false})
		return
	}
	
	newAdmin.Password, err = auth.HashPassword(auth.GenerateRandomPassword(10)) 
	//need to send this password in Mail
	if err != nil {
		log.Fatal("Error hashing password: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success":false,"message": "Error creating admin", "error": err.Error()})
		return
	}
	_, err = adminCollection.InsertOne(context.TODO(), newAdmin)
	
	if err != nil {
		log.Fatal("Error inserting admin: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	err = createFieldsForHospital(newAdmin.Hospital)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "admin": newAdmin, "success": true})
}

func ChangeAdminData(c *gin.Context){ //send complete user
  var admin models.ADMIN
   if err:=c.ShouldBindJSON(&admin); err!=nil{
	 log.Fatal(err)
	 return
   }

   log.Println(admin)
   id:=c.Param("id")
   AdminId,_:= primitive.ObjectIDFromHex(id)


   log.Println(id)
   
   adminCollection := db.Client.Database("db1").Collection("admins")
   filter := bson.M{"_id": AdminId}
   match,err := adminCollection.ReplaceOne(context.TODO(), filter, admin)
   
   log.Println(match.MatchedCount)

  if err!=nil{
	log.Fatal(err)
	return
  }

  c.JSON(http.StatusAccepted, gin.H{"success": true,"message": "Data changed", "admin": admin})
}

func RemoveAdmin(c *gin.Context) {
	id := c.Param("id")
	patientId, _ := primitive.ObjectIDFromHex(id)
	adminCollection := db.Client.Database("db1").Collection("admins")
	filter := bson.M{"_id": patientId}
	_, err := adminCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting admin", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Admin deleted successfully"})
}

func EditDetails(c *gin.Context) {
	var editedAdmin models.ADMIN
	if err := c.ShouldBindJSON(&editedAdmin); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	detailsCollection := db.Client.Database("db1").Collection("admins")
	filter := bson.M{"_id": editedAdmin.ID}
	update := bson.M{"$set": editedAdmin}
	_, err := detailsCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Details updated successfully", "admin": editedAdmin})
}

// func ChangePassword(c *gin.Context) {
// 	var passwordChange models.PasswordChange
// 	if err := c.ShouldBindJSON(&passwordChange); err != nil {
// 		log.Fatal(err)
// 		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
// 		return
// 	}

// 	adminCollection := db.Client.Database("db1").Collection("admins")
// 	filter := bson.M{"_id": passwordChange.ID}
// 	update := bson.M{"$set": bson.M{"password": passwordChange.NewPassword}}
// 	_, err := adminCollection.UpdateOne(context.TODO(), filter, update)
// 	if err != nil {
// 		log.Fatal(err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Password changed successfully"})
	
// }