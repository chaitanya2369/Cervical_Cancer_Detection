package auth

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/models"
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

var smtpPasscode string

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	smtpPasscode = os.Getenv("SMTP_PASSCODE")
}

func generateOtp() string {
	return strconv.Itoa(rand.Intn(1000000))
}

func sendOtp(otp string, email string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", "cervicalcancerdetection@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Your OTP Code")
	m.SetBody("text/plain", fmt.Sprintf("Your OTP is: %s", otp))

	d := gomail.NewDialer("smtp.gmail.com", 587, "cervicalcancerdetection@gmail.com", smtpPasscode) // Update with your SMTP settings

	return d.DialAndSend(m)
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}

type USER_DETAILS struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Name     string             `bson:"name"`
	Email    string             `bson:"email"`
	Password string              `bson:"password"`
	Otp      string             `bson:"otp"`
	Role     string             `bson:"role"`
	Hospital string             `bson:"hospital"`
	ExpiresAt  time.Time          `bson:"expiresAt"`
}

func SignUp(c *gin.Context) {
	var otpUser USER_DETAILS //You only need email and role

	if err := c.ShouldBindJSON(&otpUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	if otpUser.Role=="" || otpUser.Email==""{    //check if email and role sent
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Role Not entered", "success": false})
		return
	}
    
    otpUser.Password, _ = HashPassword(otpUser.Password) //hash the password

	if otpUser.Role=="user"{
		var tempUser models.USER
	    userCollection := db.Client.Database("db1").Collection("users")
	    err := userCollection.FindOne(context.TODO(), gin.H{"email": otpUser.Email}).Decode(&tempUser) //check if already registered

		if err == nil {
		    c.JSON(http.StatusConflict, gin.H{"message": "User Already present", "success": false})
		    return
	    }
	}else{
		var tempUser models.USER
	    userCollection := db.Client.Database("db1").Collection("admins")
	    err := userCollection.FindOne(context.TODO(), gin.H{"email": otpUser.Email}).Decode(&tempUser) //check if already registered

		if err == nil {
		    c.JSON(http.StatusConflict, gin.H{"message": "User Already present", "success": false})
		    return
	    }
	}

	otp := generateOtp()
	err := sendOtp(otp, otpUser.Email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "OTP not sent", "success": false})
		return
	}

	otpUser.Otp = otp
	otpUser.ExpiresAt = time.Now().Add(10 * time.Minute)

	otpUsersCollection := db.Client.Database("db1").Collection("otpUsers")

	_, err = otpUsersCollection.DeleteOne(context.TODO(), bson.M{"email": otpUser.Email}) //delete the previous otp, if exists

	if err != nil {
		log.Fatal("Error while Deleting")
	}
	_, err = otpUsersCollection.InsertOne(context.TODO(), otpUser) //insert new otp

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Error", "success": false})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "Yay! OTP generated check it", "success": true})
}

func createFieldsForHospital(hospital string) error {
	var field models.PatientFields
	field.Hospital = hospital
	field.Fields = []string{}

	fieldCollection := db.Client.Database("db1").Collection("fields")

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

func VerifyOtp(c *gin.Context) {
	var otpUser models.OTPuser
	if err := c.ShouldBindJSON(&otpUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	otpUsersCollection := db.Client.Database("db1").Collection("otpUsers")
	var newUser USER_DETAILS
	err := otpUsersCollection.FindOne(context.TODO(), gin.H{"email": otpUser.Email}).Decode(&newUser)

	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"message": "Generate otp first", "success": false})
		return
	}

	if newUser.Otp != otpUser.Otp {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "OTP not matched", "success": false})
		return
	}

	if time.Now().After(newUser.ExpiresAt) {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Timeup for the otp", "success": false})
		_, err := otpUsersCollection.DeleteOne(context.TODO(), bson.M{"email": newUser.Email})

		if err != nil {
			log.Fatal("Error while deleteone")
		}
		return
	}

	if newUser.Role=="admin"{
		adminCollection := db.Client.Database("db1").Collection("admins")
		adminEntry:=models.NewAdmin(newUser.Name, newUser.Email, newUser.Password, "pending", "admin", newUser.Hospital)
	    _, err = adminCollection.InsertOne(context.TODO(), adminEntry)
		 if err != nil {
		    c.JSON(http.StatusInternalServerError, gin.H{"success": false,"message": "Internal Server Error"})
		    return
	    }

		//create a fields entry for this hospital
		err = createFieldsForHospital(newUser.Hospital)

		if err != nil {
		    c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		    return
	    }

	} else{  
		userCollection := db.Client.Database("db1").Collection("users")
		userEntry:=models.NewUser(newUser.Name, newUser.Email, newUser.Password, "pending", false,false, newUser.Hospital)
	    _, err = userCollection.InsertOne(context.TODO(), userEntry)

		if err != nil {
		    c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		    return
	    }
	}

	_, err = otpUsersCollection.DeleteOne(context.TODO(), bson.M{"email": newUser.Email}) //delete the otp
	if err != nil {
		log.Fatal("Error while deleteone")
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "OTP Matched!, You can Login now"})
}
