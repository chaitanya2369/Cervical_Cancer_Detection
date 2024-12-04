package auth

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

func generateOtp() string{
   return strconv.Itoa(rand.Intn(1000000))
}

func sendOtp(otp string, email string) error{
   m := gomail.NewMessage()
    m.SetHeader("From", "rockingraja9912@gmail.com")
    m.SetHeader("To", email)
    m.SetHeader("Subject", "Your OTP Code")
    m.SetBody("text/plain", fmt.Sprintf("Your OTP is: %s", otp))

	d := gomail.NewDialer("smtp.gmail.com", 587, "rockingraja9912@gmail.com", "tlta fqan psby kynf") // Update with your SMTP settings

    return d.DialAndSend(m)
}

func SignUp(c *gin.Context){
	var user models.OTPuser

	if err:= c.ShouldBindJSON(&user); err!=nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
    
	var tempUser models.USER
	userCollection := db.Client.Database("db1").Collection("users");
    err:= userCollection.FindOne(context.TODO(), gin.H{"email": user.Email}).Decode(&tempUser) //check if already registered

	if err==nil{
		c.JSON(http.StatusConflict, gin.H{"error": "User Already present"})
		return
	}

	otp := generateOtp()
	err = sendOtp(otp,user.Email)

	if err!=nil{
      c.JSON(http.StatusInternalServerError, gin.H{"error": "OTP not sent"})
	  return
	}

	user.Otp = otp 
    user.ExpiresAt =time.Now().Add(30 * time.Minute) 

	otpUsersCollection := db.Client.Database("db1").Collection("otp-users")

    res,err:=otpUsersCollection.DeleteOne(context.TODO(), bson.M{"email": user.Email}) //delete the previous otp

	if err!=nil{
		log.Fatal("Error while Deleting")
	}

	log.Printf("Deleted %d",res.DeletedCount) 

	_,err =otpUsersCollection.InsertOne(context.TODO(), user) //insert new otp

	if err!=nil{
       c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Error"})
	   return
	}
    
	c.JSON(http.StatusAccepted, gin.H{"message":"Yay! OTP generated check it"})
}

func hashPassword(password string)(string, error){
	hashedPassword, err:=bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err!=nil{
		return "",err
	}
    
	return string(hashedPassword),nil
}

type USER_DETAILS struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       string             `bson:"name"`
    Email      string             `bson:"email"`
	Password   string             `bson:"password"`
	Otp        string             `bson:"otp"`
}

func VerifyOtp(c *gin.Context){
    var newUser USER_DETAILS
	if err:= c.ShouldBindJSON(&newUser); err!=nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    otpUsersCollection := db.Client.Database("db1").Collection("otp-users")
	var tempUser models.OTPuser
	err:= otpUsersCollection.FindOne(context.TODO(), gin.H{"email": newUser.Email}).Decode(&tempUser)

	if err!=nil{
		c.JSON(http.StatusConflict, gin.H{"message": "Generate otp first"})
		return
	}

    if tempUser.Otp!=newUser.Otp{
       c.JSON(http.StatusNotAcceptable, gin.H{"message": "OTP not matched"})
	   return
	}

	if time.Now().After(tempUser.ExpiresAt){
      c.JSON(http.StatusNotAcceptable, gin.H{"message": "Timeup for the otp"})
	  res,err:=otpUsersCollection.DeleteOne(context.TODO(), bson.M{"email": newUser.Email})
      
	  if err!=nil{
		log.Fatal("Error while deleteone")
	  }
	  log.Printf("Delete %d due to Timeup", res.DeletedCount)
	  return
	}

	userCollection := db.Client.Database("db1").Collection("users");
    
    hashedPassword,err:= hashPassword(newUser.Password)

	if err!=nil{
		log.Fatal("err:", err)
		return
	}

	var userEntry models.USER
	userEntry.Email = newUser.Email
	userEntry.Name = newUser.Name
	userEntry.Password = hashedPassword
	userEntry.IsApproved = false
	userEntry.CanPredict = false
	userEntry.CanTrain = false
	userEntry.Role = "user"
	_,err =userCollection.InsertOne(context.TODO(), userEntry)
    
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	res,err:=otpUsersCollection.DeleteOne(context.TODO(), bson.M{"email": newUser.Email}) //delete the previous otp
      
	if err!=nil{
	   log.Fatal("Error while deleteone")
	}
	log.Printf("Delete %d due to Timeup", res.DeletedCount)

	c.JSON(http.StatusAccepted, gin.H{"message": "OTP Matched!, You can Login now"})
}