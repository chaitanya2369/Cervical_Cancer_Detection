package models

import (
	"time"
)

type ImageData struct{
	URL           string          `bson:"url"`          //Base64-encoded string later will replace with s3 url
	InsertedAt    time.Time       `bson:"inserted_at"` 
	Type          string          `bson:"type"`
}

type Vitals struct{
	BP           string      `bson:"bp"`
	Weight       string      `bson:"weight"`
	SPO2         string      `bson:"spo2"`
}

type Doctor struct{
	Name           string    `bson:"name"`
	ID             string    `bson:"id"`
	Specialization string    `bson:"specialization"`
	Department     string    `bson:"department"` 
}

type PATIENT struct {
	ID            string             `bson:"_id,omitempty"`
	Name          string             `bson:"name"`
	Age           string             `bson:"age"`
	PhoneNumber   string             `bson:"phoneNumber"`
	Address       string             `bson:"address"`
	ConsultDate   string             `bson:"consultDate"`
	IsActive      bool               `bson:"is_active"` 
 	Vitals        Vitals             `bson:"vitals"`
	Doctor        Doctor             `bson:"doctor"`
	Images        []ImageData        `bson:"images"` 
}