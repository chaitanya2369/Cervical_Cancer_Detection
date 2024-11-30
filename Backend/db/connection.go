package db

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var err error

func ConnectDb(){
	if err = godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	MONGO_URL := os.Getenv("MONGO_URL")
	clientOptions := options.Client().ApplyURI(MONGO_URL)
    
	Client, err = mongo.Connect(context.TODO(), clientOptions)
    if err!=nil{
		log.Fatal("MonogoDb Connection Failed")
	}
	log.Println("MonogoDb Connected Successfully")
}