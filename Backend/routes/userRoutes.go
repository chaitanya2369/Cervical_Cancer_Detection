package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	userGroup := router.Group("/user")
	{
		userGroup.GET("/patients", handlers.GetSelectedFilterPatients) 
	    userGroup.PUT("/edit-patient",  handlers.EditPatient)
	    userGroup.POST("/add-patient", handlers.AddNewPatient)
	    userGroup.DELETE("/remove-patient/:id", handlers.RemovePatient)
		userGroup.GET("/get-patient/:id", handlers.GetPatientById)

		// userGroup.POST("/predict", handlers.UploadImageForPatientAndPredict)
		// userGroup.POST("/csv-predict", handlers.CsvFilePredict) // corrected the spelling of "predit"
	}
}
