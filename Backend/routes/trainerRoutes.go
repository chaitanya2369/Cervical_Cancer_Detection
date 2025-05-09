package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterTrainerRoutes(router *gin.Engine) {
   trainerGroup := router.Group("/trainer")
   {
	 trainerGroup.GET("/data", handlers.GetAllTrainingData);
	 trainerGroup.GET("/accepted-data", handlers.GetAcceptedTrainingData)
	 trainerGroup.PATCH("/update-status", handlers.UpdateStatus)
	 trainerGroup.GET("/download-data", handlers.DownloadTrainingCellsData)
	 trainerGroup.POST("/upload-pickle", handlers.UploadPickleFile)
   }
}