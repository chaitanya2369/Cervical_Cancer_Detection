package main

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/routes"
	s3service "Cervical_Cancer_Detection/s3Service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func main() {
	r := gin.Default()
    r.Use(cors.Default())
	
	db.ConnectDb() //connect db
	s3service.ConnectS3()

    routes.RegisterAuthRoutes(r) //auth routes
	routes.RegisterAdminRoutes(r) //admin routes
	routes.RegisterUserRoutes(r) //user routes

	r.Run(":8080")	
}