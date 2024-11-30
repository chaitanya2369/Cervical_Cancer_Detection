package utils

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
)

// AuthMiddleware is a middleware function to protect routes
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Get the token from the `Authorization` header
        tokenString := c.GetHeader("Authorization")
        if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
            c.Abort()
            return
        }

        // Trim the "Bearer " prefix
        tokenString = strings.TrimPrefix(tokenString, "Bearer ")

        // Validate the JWT
        claims, err := ValidateJWT(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        // Store claims in the context for access in the handler
        c.Set("email", claims.Email)
        c.Set("role", claims.Role)

        c.Next()
    }
}
