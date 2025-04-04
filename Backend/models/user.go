package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GENERIC_USER struct{
	Name       string             `bson:"name"`
    Email      string             `bson:"email"`
	Password   string             `bson:"password"`
}

type USER struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       string             `bson:"name"`
    Email      string             `bson:"email"`
	Password   string             `bson:"password"`
	IsApproved   bool             `bson:"isApproved"`
	CanPredict   bool             `bson:"canPredict"`
	CanTrain     bool             `bson:"canTrain"`
}

type ADMIN struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       string             `bson:"name"`
    Email      string             `bson:"email"`
	Password   string             `bson:"password"`
	IsApproved   bool             `bson:"isApproved"`
	Role       string             `bson:"role"`
}

type OTPuser struct{
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Email      string             `bson:"email"`
	Otp        string             `bson:"otp"`
	Role       string             `bson:"role"`
    ExpiresAt  time.Time          `bson:"expiresAt"`
}

func NewUser(name, email, hashedPassword string, isApproved, canPredict, canTrain bool) *USER {
	return &USER{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		IsApproved: isApproved,
		CanPredict: canPredict,
		CanTrain: canTrain,
	}
}

func NewAdmin(name, email, hashedPassword string, isApproved bool, role string) *ADMIN {
	return &ADMIN{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		IsApproved: isApproved,
		Role: role,
	}
}