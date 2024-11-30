package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
    ID            primitive.ObjectID `bson:"_id,omitempty"`
    Name          string             `bson:"name"`
    Email         string             `bson:"email"`
    ContactNumber string             `bson:"contact_number"`
    Password      string             `bson:"password"`
    Role          string             `bson:"role"`
}
