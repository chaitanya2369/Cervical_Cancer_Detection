package database

import (
    "context"
    "log"
    "time"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func ConnectDB() {
    // Set the MongoDB client options
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

    // Create and connect the client
    var err error
    Client, err = mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatalf("Failed to connect to MongoDB: %v", err)
    }

    // Ping the database to ensure the connection is established
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()

    err = Client.Ping(ctx, nil)
    if err != nil {
        log.Fatalf("Failed to ping MongoDB: %v", err)
    }

    log.Println("Connected to MongoDB!")
}