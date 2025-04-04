package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	userGroup := router.Group("/user")
	{
		userGroup.GET("/get-active", handlers.GetActivePatients)
		userGroup.GET("/get-Inactive", handlers.GetInActivePatients)
		userGroup.POST("/add-patient", handlers.AddNewPatient)
		userGroup.POST("/get-patient", handlers.GetPatient)
		userGroup.POST("/edit-patient", handlers.EditPatient)

		userGroup.POST("/predict", handlers.UploadImageForPatientAndPredict)
		userGroup.POST("/csv-predit", handlers.CsvFilePredict)
	}
}
