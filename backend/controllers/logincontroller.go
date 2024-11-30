package controllers

import (
    "context"
    "net/http"

    "cervical_cancer_detection/database"
    "cervical_cancer_detection/models"
    "cervical_cancer_detection/utils"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
)

func Login(c *gin.Context) {
    var loginInput models.User
    if err := c.ShouldBindJSON(&loginInput); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userCollection := database.Client.Database("yourdb").Collection("users")
    var user models.User
    err := userCollection.FindOne(context.Background(), bson.M{"email": loginInput.Email, "password": loginInput.Password}).Decode(&user)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Generate JWT token
    token, err := utils.GenerateJWT(user.Email, user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token, "role": user.Role})
}
