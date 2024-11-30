package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"go.mongodb.org/mongo-driver/mongo/writeconcern"
)

var client *mongo.Client

func init() {
	// Initialize MongoDB connection with updated write concern
	wc := writeconcern.Majority()
	clientOptions := options.Client().
		ApplyURI("mongodb://localhost:27017").
		SetWriteConcern(wc)

	// Use mongo.Connect instead of deprecated functions
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to create MongoDB client: %v", err)
	}

	// Ping the database to ensure connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	fmt.Println("Connected to MongoDB!")
}

func main() {
	router := gin.Default()

	// Enable CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Route definitions
	router.POST("/signup", handleSignUp)
	router.POST("/verify-otp", handleVerifyOtp)
	router.POST("/signin", handleSignIn)

	// Start the server
	router.Run(":8080")
}

func handleSignUp(c *gin.Context) {
	var user struct {
		Name            string `json:"name" binding:"required"`
		Email           string `json:"email" binding:"required,email"`
		ContactNumber   string `json:"contactNumber" binding:"required"`
		Password        string `json:"password" binding:"required"`
		//ConfirmPassword string `json:"confirmPassword" binding:"required"`
		Role            string `json:"role" binding:"required"`
	}
    //ConfirmPassword = user.Password
	// Bind the incoming JSON request to the user struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Received data: %+v\n", user)

	// Check if password and confirm password match
	if user.Password != "12345" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	// Check for duplicate email
	collection := client.Database("yourdbname").Collection("users")
	var existingUser bson.M
	err := collection.FindOne(c.Request.Context(), bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	// Generate OTP and store it in the database
	otp := generateOtp()
	otpCollection := client.Database("yourdbname").Collection("otps")
	_, err = otpCollection.InsertOne(c.Request.Context(), bson.M{
		"email":   user.Email,
		"otp":     otp,
		"expires": time.Now().Add(5 * time.Minute),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate OTP"})
		return
	}

	// Simulate sending OTP (In production, integrate an email service)
	fmt.Printf("Generated OTP for %s: %s\n", user.Email, otp)

	c.JSON(http.StatusOK, gin.H{"message": "Sign up successful, verify your OTP"})
}


func handleVerifyOtp(c *gin.Context) {
	var otpRequest struct {
		Email string `json:"email" binding:"required,email"`
		Otp   string `json:"otp" binding:"required"`
	}

	if err := c.ShouldBindJSON(&otpRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	otpCollection := client.Database("cervical_cancer_detection").Collection("otps")
	var storedOtp struct {
		Otp     string    `bson:"otp"`
		Expires time.Time `bson:"expires"`
	}

	err := otpCollection.FindOne(c.Request.Context(), bson.M{"email": otpRequest.Email}).Decode(&storedOtp)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP not found"})
		return
	}

	if storedOtp.Expires.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP expired"})
		return
	}

	if storedOtp.Otp != otpRequest.Otp {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	// Save user in the database after successful OTP verification
	usersCollection := client.Database("cervical_cancer_detection").Collection("users")
	_, err = usersCollection.InsertOne(c.Request.Context(), bson.M{
		"name":          otpRequest.Email, // Replace with user details
		"email":         otpRequest.Email,
		"contactNumber": "placeholder", // Replace with actual data
		"role":          "student",     // Replace with actual data
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store user"})
		return
	}

	// Redirect user to the login page after successful verification
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified, user registered"})
}

func handleSignIn(c *gin.Context) {
	var loginRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user in the database
	collection := client.Database("cervical_cancer_detection").Collection("users")
	var user struct {
		Password string `bson:"password"`
		Role     string `bson:"role"`
	}

	err := collection.FindOne(c.Request.Context(), bson.M{"email": loginRequest.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if user.Password != loginRequest.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Redirect to the respective homepage based on the role
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "role": user.Role})
}

func generateOtp() string {
	return fmt.Sprintf("%06d", time.Now().UnixNano()%1000000)
}
