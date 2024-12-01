package routes

import (
	"Cervical_Cancer_Detection/auth"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine) {
   authGroup := router.Group("/auth")
   {
	 authGroup.POST("/signup", auth.SignUp)
	 authGroup.POST("/verify-otp", auth.VerifyOtp)
	 authGroup.POST("/login", auth.HandleLogin)
   }
}