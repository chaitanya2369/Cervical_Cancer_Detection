package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
   adminGroup := router.Group("/user")
   {
	 adminGroup.GET("/get-active", handlers.GetActivePatients) 
	 adminGroup.GET("/get-Inactive", handlers.GetInActivePatients) 
	 adminGroup.POST("/add-patient", handlers.AddNewPatient) 
	 adminGroup.GET("/get-patient", handlers.GetPatient) 
	 adminGroup.POST("/edit-patient", handlers.EditPatient) 
   }
}