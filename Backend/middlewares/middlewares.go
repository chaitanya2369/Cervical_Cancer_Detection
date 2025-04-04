package middlewares

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var secretKey []byte

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	secretKey = []byte(os.Getenv("JWT_SECRET_KEY"))
}

// func JWTAuthMiddleware() gin.HandlerFunc{
//   return func(c *gin.Context) {
// 	authHeader:=c.GetHeader("Authorization")
// 	if authHeader==""{
// 		c.JSON(http.StatusUnauthorized,gin.H{"error": "Authorization header is required"})
// 		c.Abort()
// 		return
// 	}
    
// 	token:=jwt.Parse(string(secretKey),func(t *jwt.Token) (interface{}, error) {
// 		if _
// 	})
// 	c.Next()
//   }
// }