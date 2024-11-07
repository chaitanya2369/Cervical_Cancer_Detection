package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
)

// OTPData holds the email and OTP
type OTPData struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

// SendOTPHandler sends the OTP to the user's email
func SendOTPHandler(w http.ResponseWriter, r *http.Request) {
	// This function is not needed anymore; OTP is sent in SignUp and SignIn
	http.Error(w, "Use SignIn or SignUp to send OTP.", http.StatusMethodNotAllowed)
}

// VerifyOTP verifies the OTP sent to the user
func VerifyOTPHandler(w http.ResponseWriter, r *http.Request) {
	var otpData OTPData
	if err := json.NewDecoder(r.Body).Decode(&otpData); err != nil {
		fmt.Print("fuck")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Print("bayya")
	collection := client.Database("cervical_cancer_detection").Collection("otps")
	fmt.Print(otpData)
	// Find the OTP record for the given email
	var otpRecord OTPRecord
	err := collection.FindOne(context.TODO(), bson.M{"email": otpData.Email}).Decode(&otpRecord)
	if err != nil {
		http.Error(w, "OTP not found or expired", http.StatusUnauthorized)
		return
	}
	fmt.Print(otpRecord.OTP)
	// Check if the provided OTP matches and is still valid
	if otpData.OTP != otpRecord.OTP || time.Now().After(otpRecord.ExpiresAt) {
		http.Error(w, "Invalid or expired OTP", http.StatusUnauthorized)
		return
	}

	// OTP verified, generate JWT token or any further actions
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": otpData.Email,
		"exp":   time.Now().Add(time.Hour * 1).Unix(),
	})

	tokenString, err := token.SignedString([]byte("your_secret_key")) // Replace with your secret key
	if err != nil {
		http.Error(w, "Could not create token", http.StatusInternalServerError)
		return
	}

	// Optionally, delete the OTP record after successful verification
	_, err = collection.DeleteOne(context.TODO(), bson.M{"email": otpData.Email})
	if err != nil {
		http.Error(w, "Could not delete OTP record", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}
