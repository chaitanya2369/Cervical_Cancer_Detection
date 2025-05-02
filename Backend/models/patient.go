package models

import (
	"time"
)

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

type HistoryItem struct {
	Model      string			 `bson:"model"`
	CreatedAt  time.Time		 `bson:"createdat"`
	Type 	   string			 `bson:"type"`
	CellsData  interface{}       `bson:"cells_data"` 
	Prediction interface{}	     `bson:"prediction"`
}

type PatientHistory struct {
	ID            string             `bson:"_id,omitempty"`
	PatientID     string             `bson:"patient_id"`
	History       []HistoryItem      `bson:"history"`
}

type PATIENT struct {
	ID            string             `bson:"_id,omitempty"`
	Name          string             `bson:"name"`
	Age           string             `bson:"age"`
	PhoneNumber   string             `bson:"phoneNumber"`
	Address       string             `bson:"address"`
	ConsultDate   string             `bson:"consultdate"`
	DateOfBirth   string             `bson:"dateofbirth"`
	IsActive      bool               `bson:"isactive"` 
	Hospital      string             `bson:"hospital"`  

	Fields        map[string]interface{} `bson:"fields" json:"fields"`

	Notes         []PatientNote     `bson:"notes"`
	
}

type PatientNote struct {
	Note              string     `json:"note"`	
	InsertedAt        time.Time  `json:"insertedat"`
}