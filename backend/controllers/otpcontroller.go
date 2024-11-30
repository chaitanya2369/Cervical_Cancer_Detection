package controllers

import (
    "context"
    "net/http"
    "time"

    "cervical_cancer_detection/database"
    "cervical_cancer_detection/models"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
)

func VerifyOTP(c *gin.Context) {
    var otpInput models.OTP
    if err := c.ShouldBindJSON(&otpInput); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    otpCollection := database.Client.Database("yourdb").Collection("otps")
    var storedOTP models.OTP
    err := otpCollection.FindOne(context.Background(), bson.M{"email": otpInput.Email, "code": otpInput.Code}).Decode(&storedOTP)
    if err != nil || time.Now().After(storedOTP.ExpiresAt) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired OTP"})
        return
    }

    // Remove OTP from database
    otpCollection.DeleteOne(context.Background(), bson.M{"_id": storedOTP.ID})

    // Add user to the database after OTP verification
    userCollection := database.Client.Database("yourdb").Collection("users")
    _, err = userCollection.InsertOne(context.Background(), models.User{
        Name:          c.PostForm("name"),
        Email:         otpInput.Email,
        ContactNumber: c.PostForm("contact_number"),
        Password:      c.PostForm("password"),
        Role:          c.PostForm("role"),
    })

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}
