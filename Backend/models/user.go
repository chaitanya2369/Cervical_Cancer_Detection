package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type USER struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       string             `bson:"name"`
    Email      string             `bson:"email"`
	Password   string             `bson:"password"`
}

type OTPuser struct{
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Email      string             `bson:"email"`
	Otp        string             `bson:"otp"`
    ExpiresAt  time.Time          `bson:"expiresAt"`
}