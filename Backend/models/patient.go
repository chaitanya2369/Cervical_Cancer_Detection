package models

import (
	"time"
)

type PatientNotes struct{
	Note           string          `bson:"note"`          //Base64-encoded string later will replace with s3 url
	InsertedAt    time.Time       `bson:"inserted_at"` 
}

type Vitals struct{
	BP           string      `bson:"bp"`
	Weight       string      `bson:"weight"`
	SPO2         string      `bson:"spo2"`
}

type PatientFields struct {
	ID            string             `bson:"_id,omitempty"`
	Fields       []string            `bson:"fields" json:"fields"`
	Hospital      string             `bson:"hospital"`
}

type PATIENT struct {
	ID            string             `bson:"_id,omitempty"`
	Name          string             `bson:"name"`
	Age           string             `bson:"age"`
	PhoneNumber   string             `bson:"phoneNumber"`
	Address       string             `bson:"address"`
	IsActive      bool               `bson:"is_active"` 
	Hospital      string             `bson:"hospital"`  

	Fields        map[string]interface{} `bson:"fields" json:"fields"`

	Notes         []PatientNotes     `bson:"notes"`
}