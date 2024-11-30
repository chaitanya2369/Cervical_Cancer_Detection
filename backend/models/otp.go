package models

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type OTP struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    Email     string             `bson:"email"`
    Code      string             `bson:"code"`
    ExpiresAt time.Time          `bson:"expires_at"`
}
