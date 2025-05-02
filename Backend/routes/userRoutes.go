package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	userGroup := router.Group("/user")
	{
		userGroup.GET("/patients/:hospital", handlers.GetSelectedFilterPatients) 
	    userGroup.PATCH("/edit-patient/:patientId",  handlers.EditPatient)
	    userGroup.POST("/add-patient", handlers.AddNewPatient)
	    userGroup.DELETE("/remove-patient/:patientId", handlers.RemovePatient)
		userGroup.GET("/get-patient/:patientId", handlers.GetPatientById)
		userGroup.GET("/fields/:hospital", handlers.GetFieldsForUser)

		userGroup.GET("/history/:patientId", handlers.GetPatientHistory)

	    userGroup.POST("/predict", handlers.Predict)
		userGroup.POST("/format-file", handlers.GetFormatFile) // corrected the spelling of "formated" to "formatted"

		userGroup.PATCH("/add-note/:patientId", handlers.AddNote)
		userGroup.PUT("/edit-details", handlers.EditUserDetails)

		// userGroup.POST("/predict", handlers.UploadImageForPatientAndPredict)
		// userGroup.POST("/csv-predict", handlers.CsvFilePredict) // corrected the spelling of "predit"
	}
}
