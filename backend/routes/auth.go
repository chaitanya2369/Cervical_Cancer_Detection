package routes

import (
    "cervical_cancer_detection/controllers"
    "cervical_cancer_detection/utils"

    "github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine) {
    authRoutes := router.Group("/auth")
    {
        authRoutes.POST("/signup", controllers.SignUp)
        authRoutes.POST("/verify-otp", controllers.VerifyOTP)
        authRoutes.POST("/login", controllers.Login)
    }

    // Protected routes
    protectedRoutes := router.Group("/dashboard")
    protectedRoutes.Use(utils.AuthMiddleware())
    {
        // protectedRoutes.GET("/", controllers.Dashboard)
    }
}
