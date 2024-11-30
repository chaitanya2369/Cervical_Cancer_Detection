package utils

import (
    "time"

    "github.com/dgrijalva/jwt-go"
)

// Secret key for signing the JWTs. Keep this secure!
var jwtSecretKey = []byte("your_secret_key")

// Claims structure for the JWT payload
type JWTClaims struct {
    Email string `json:"email"`
    Role  string `json:"role"`
    jwt.StandardClaims
}

// GenerateJWT generates a JWT for the given email and role
func GenerateJWT(email, role string) (string, error) {
    // Set expiration time for the token (e.g., 1 hour)
    expirationTime := time.Now().Add(1 * time.Hour)

    // Create the JWT claims, which includes the email and role
    claims := &JWTClaims{
        Email: email,
        Role:  role,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    // Create the token with the signing method and claims
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // Sign and get the complete encoded token as a string using the secret
    tokenString, err := token.SignedString(jwtSecretKey)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

// ValidateJWT validates the provided JWT and returns the claims if valid
func ValidateJWT(tokenString string) (*JWTClaims, error) {
    claims := &JWTClaims{}

    // Parse the token
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtSecretKey, nil
    })

    if err != nil {
        return nil, err
    }

    // Check if the token is valid
    if !token.Valid {
        return nil, jwt.ErrSignatureInvalid
    }

    return claims, nil
}
