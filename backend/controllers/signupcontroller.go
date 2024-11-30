package controllers

import (
    "context"
    "crypto/rand"
    "encoding/hex"
    "fmt"
    "log"
    "net/http"
    "time"

    "cervical_cancer_detection/database"
    "cervical_cancer_detection/models"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
)

func generateOTP() string {
    b := make([]byte, 3) // 6 characters
    _, err := rand.Read(b)
    if err != nil {
        log.Fatal(err)
    }
    return hex.EncodeToString(b)
}

func SignUp(c *gin.Context) {
    var userInput models.User
    if err := c.ShouldBindJSON(&userInput); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if passwords match
    if userInput.Password != c.PostForm("confirm_password") {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
        return
    }

    // Check for existing user
    collection := database.Client.Database("yourdb").Collection("users")
    var existingUser models.User
    err := collection.FindOne(context.Background(), bson.M{"email": userInput.Email}).Decode(&existingUser)
    if err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
        return
    }

    // Generate and store OTP
    otp := generateOTP()
    otpCollection := database.Client.Database("yourdb").Collection("otps")
    otpDoc := models.OTP{
        Email:     userInput.Email,
        Code:      otp,
        ExpiresAt: time.Now().Add(5 * time.Minute),
    }
    _, err = otpCollection.InsertOne(context.Background(), otpDoc)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate OTP"})
        return
    }

    // Send OTP (mock email service for simplicity)
    fmt.Printf("Generated OTP for %s: %s\n", userInput.Email, otp)

    c.JSON(http.StatusOK, gin.H{"message": "OTP sent, please verify"})
}
