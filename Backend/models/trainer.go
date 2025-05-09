package models

import "time"

type INCREMENTAL_TRAIN_DATA struct {
	ID          string      `bson:"_id,omitempty"`
	CellsData   interface{} `bson:"cellsData"`
	Sender      string      `bson:"sender"`
	Status      string      `bson:"status"`
	DatasetName string      `bson:"datasetName"`
	Type        string      `bson:"type"`
	Note        string      `bson:"note"`
	CreatedAt   time.Time      `bson:"createdAt"`
}

type MODEL_HISTORY struct {
	ID           string  `bson:"_id,omitempty"`
	ModelType    string  `bson:"modelType"` //svm or lg
	ImageType    string  `bson:"imageType"` //dic or af
    Accuracy     string  `bson:"accuracy"`
	Note         string  `bson:"note"`
	Version      string  `bson:"version"`
}