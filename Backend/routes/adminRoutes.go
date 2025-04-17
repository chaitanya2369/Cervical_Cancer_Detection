package routes

import (
	"Cervical_Cancer_Detection/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(router *gin.Engine) {
   adminGroup := router.Group("/admin")
   {
	 adminGroup.GET("/users", handlers.GetSelectedFilterUsers)
	 adminGroup.PUT("/edit-user/:id",  handlers.ChangeUserData)
	 adminGroup.POST("/add-user", handlers.CreateUser)
	 adminGroup.DELETE("/remove-user/:id", handlers.RemoveUser)
	 
	 adminGroup.GET("/fields/:hospital", handlers.GetFields)
	 adminGroup.PUT("/edit-field/:hospital", handlers.EditField)	
   }
}