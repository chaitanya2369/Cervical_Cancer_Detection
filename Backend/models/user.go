package models

import (
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
	Status     string             `bson:"status"`
	CanPredict   bool             `bson:"canPredict"`
	CanTrain     bool             `bson:"canTrain"`
	Hospital   string             `bson:"hospital"`
}

type ADMIN struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       string             `bson:"name"`
    Email      string             `bson:"email"`
	Password   string             `bson:"password"`
	Status     string             `bson:"status"`
	Role       string             `bson:"role"`
	Hospital   string             `bson:"hospital"`
}

type OTPuser struct{
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Email      string             `bson:"email"`
	Otp        string             `bson:"otp"`
}

func NewUser(name, email, hashedPassword , status string, canPredict, canTrain bool, hospital string) *USER {
	return &USER{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		Status: status,
		CanPredict: canPredict,
		CanTrain: canTrain,
		Hospital: hospital,
	}
}

func NewAdmin(name, email, hashedPassword , status string, role, hospital string) *ADMIN {
	return &ADMIN{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		Status: status,
		Role: role,
		Hospital: hospital,
	}
}