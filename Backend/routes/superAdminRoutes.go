package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterSuperAdminRoutes(router *gin.Engine) {
   SuperAdminGroup := router.Group("/super-admin")
   {
	 SuperAdminGroup.GET("/pending-admins", handlers.GetUnApprovedAdmins)
	 SuperAdminGroup.GET("/approved-admins", handlers.GetApprovedAdmins)
	 SuperAdminGroup.PUT("/edit-admin",  handlers.ChangeAdminData)
	 SuperAdminGroup.POST("/add-admin",handlers.CreateAdmin)
   }
}