package main

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func main() {
	r := gin.Default()
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
	
	db.ConnectDb() //connect db
	// s3service.ConnectS3()

    routes.RegisterAuthRoutes(r) //auth routes
	routes.RegisterSuperAdminRoutes(r) //super admin routes
	routes.RegisterAdminRoutes(r) //admin routes
	routes.RegisterUserRoutes(r) //user routes
	routes.RegisterTrainerRoutes(r)



	r.Run("192.168.82.154:8080")
	// r.Run("10.2.96.197:8080")
}
