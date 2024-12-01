package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var secretKey string

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	secretKey = os.Getenv("JWT_SECRET_KEY")
}

func CreateJWTtoken(email string) (string, error) {
   token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{ 
        "email": email, 
        "exp": time.Now().Add(time.Hour * 24).Unix(), 
        })
	tokenString,err := token.SignedString(secretKey)

	if err!=nil{
		return "",err
	}
    
	return tokenString, err
}

func VerifyJWTtoken(email string, tokenString string) (error){
   token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
      return secretKey, nil
   })
  
   if err != nil {
      return err
   }
  
   if !token.Valid {
      return fmt.Errorf("invalid token")
   }

   return nil
}