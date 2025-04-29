package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	userGroup := router.Group("/user")
	{
		userGroup.GET("/patients/:hospital", handlers.GetSelectedFilterPatients) 
	    userGroup.PUT("/edit-patient",  handlers.EditPatient)
	    userGroup.POST("/add-patient", handlers.AddNewPatient)
	    userGroup.DELETE("/remove-patient/:id", handlers.RemovePatient)
		userGroup.GET("/get-patient/:id", handlers.GetPatientById)
		userGroup.GET("/fields/:hospital", handlers.GetFieldsForUser)

		// userGroup.POST("/predict", handlers.UploadImageForPatientAndPredict)
		// userGroup.POST("/csv-predict", handlers.CsvFilePredict) // corrected the spelling of "predit"
	}
}
