package main

import (
	"log"
    "net/http"
    "cervical_cancer_detection/auth" // Replace "yourprojectname" with your actual module name
)

func main() {
    // mux := http.NewServeMux()

    // Apply CORS to auth routes
    http.Handle("/signup", auth.EnableCORS(http.HandlerFunc(auth.SignUpHandler)))
    http.Handle("/signin", auth.EnableCORS(http.HandlerFunc(auth.SignInHandler)))
    http.Handle("/verify-otp", auth.EnableCORS(http.HandlerFunc(auth.VerifyOTPHandler)))
    // mux.Handle("/signup", auth.EnableCORS(http.HandlerFunc(auth.SignUpHandler)))
    // mux.Handle("/signin", auth.EnableCORS(http.HandlerFunc(auth.SignInHandler)))
    // mux.Handle("/verify-otp", auth.EnableCORS(http.HandlerFunc(auth.VerifyOTPHandler)))

	log.Println("Server is running on port :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
    // http.ListenAndServe(":8080", mux)
}
