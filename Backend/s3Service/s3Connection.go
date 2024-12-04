package s3service

import (
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/joho/godotenv"
)

var S3Client *s3.S3

func ConnectS3() {
	if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-1"),
		Credentials: credentials.NewStaticCredentials(os.Getenv("ACCESSKEY_ID"), os.Getenv("SECRET_ACCESS_KEY"),""),
	})

	if err != nil {
        log.Fatal("Failed to create session:", err)
    }

	S3Client=s3.New(sess)

	log.Print("S3 Connected Successfully")
}