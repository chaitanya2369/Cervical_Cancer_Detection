package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(router *gin.Engine) {
   adminGroup := router.Group("/admin")
   {
	 adminGroup.POST("/get-un-users", handlers.GetUnApprovedUsers)
	 adminGroup.POST("/approve-user", handlers.ApproveUser)
	 adminGroup.POST("/change-user",  handlers.ChangeUserPermission)
	 adminGroup.POST("/get-users", handlers.GetApprovedUsers)
   }
}