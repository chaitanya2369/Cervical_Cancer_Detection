package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterSuperAdminRoutes(router *gin.Engine) {
   SuperAdminGroup := router.Group("/super-admin")
   {
	 SuperAdminGroup.GET("/admins", handlers.GetSelectedFilterAdmins)
	 SuperAdminGroup.POST("/add-admin",handlers.CreateAdmin) 
	 SuperAdminGroup.PUT("/edit-admin/:id",  handlers.ChangeAdminData)
	 SuperAdminGroup.DELETE("/remove-admin/:id", handlers.RemoveAdmin)
   }
}