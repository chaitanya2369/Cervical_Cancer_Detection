package main

import (
	"Cervical_Cancer_Detection/db"
	"Cervical_Cancer_Detection/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func main() {
	r := gin.Default()
    r.Use(cors.Default())
	
	db.ConnectDb() //connect db

    routes.RegisterAuthRoutes(r) //auth routes
	routes.RegisterAdminRoutes(r) //admin routes

	r.Run(":8000")	
}