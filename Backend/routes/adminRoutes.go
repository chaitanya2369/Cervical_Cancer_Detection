package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(router *gin.Engine) {
   adminGroup := router.Group("/admin")
   {
	 adminGroup.GET("/pending/:hospital", handlers.GetUnApprovedUsers)
	 adminGroup.GET("/approved/:hospital", handlers.GetApprovedUsers)
	 adminGroup.PUT("/edit-user",  handlers.ChangeUserData)
	 adminGroup.POST("/add-user",handlers.CreateUser)
   }
}