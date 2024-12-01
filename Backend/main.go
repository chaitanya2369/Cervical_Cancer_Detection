package main

import (
	"Cervical_Cancer_Detection/auth"
	"Cervical_Cancer_Detection/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func main() {
	r := gin.Default()
    r.Use(cors.Default())
	
	db.ConnectDb() //connect db

	r.POST("/signup", auth.SignUp)
	r.POST("/verify-otp", auth.VerifyOtp)

	r.Run(":8080")	
}