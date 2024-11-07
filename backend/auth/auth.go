package auth

import (
    "context"
    "crypto/rand"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"

    "github.com/go-playground/validator/v10"
    "golang.org/x/crypto/bcrypt"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    gomail "gopkg.in/gomail.v2"
)

var client *mongo.Client
var validate *validator.Validate

// Initialize MongoDB client and validator
func init() {
    var err error
    clientOptions := options.Client().ApplyURI("mongodb://localhost/cervical_cancer_detection")
    client, err = mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
    err = client.Ping(context.TODO(), nil)
    if err != nil {
        log.Fatal(err)
    }
    validate = validator.New()
}

// User represents a user in the system
type User struct {
    Name     string `json:"name" validate:"required"`
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
    Role     string `json:"role" validate:"required"`
}

type OTPRecord struct {
    Email     string    `bson:"email"`
    OTP       string    `bson:"otp"`
    CreatedAt time.Time `bson:"createdAt"`
    ExpiresAt time.Time `bson:"expiresAt"`
}

// SaveOTP saves the OTP to MongoDB with an expiration time
func SaveOTP(email string, otp string) error {
    collection := client.Database("cervical_cancer_detection").Collection("otps")

    // Set expiration time for 10 minutes from now
    expiresAt := time.Now().Add(10 * time.Minute)

    // Upsert (update or insert) the OTP record to ensure only one OTP per email
    filter := bson.M{"email": email}
    update := bson.M{
        "$set": OTPRecord{
            Email:     email,
            OTP:       otp,
            CreatedAt: time.Now(),
            ExpiresAt: expiresAt,
        },
    }
    _, err := collection.UpdateOne(context.TODO(), filter, update, options.Update().SetUpsert(true))
    return err
}

// Setup a TTL index on ExpiresAt field in MongoDB initialization code
func SetupTTLIndex() {
    collection := client.Database("cervical_cancer_detection").Collection("otps")
    indexModel := mongo.IndexModel{
        Keys:    bson.M{"expiresAt": 1},
        Options: options.Index().SetExpireAfterSeconds(0),
    }
    _, err := collection.Indexes().CreateOne(context.TODO(), indexModel)
    if err != nil {
        log.Fatal("Could not create TTL index:", err)
    }
}

// SendEmail sends an email to the user
func SendEmail(to string, otp string) error {
    m := gomail.NewMessage()
    m.SetHeader("From", "rockingraja9912@gmail.com")
    m.SetHeader("To", to)
    m.SetHeader("Subject", "Your OTP Code")
    m.SetBody("text/plain", fmt.Sprintf("Your OTP is: %s", otp))

    d := gomail.NewDialer("smtp.gmail.com", 587, "rockingraja9912@gmail.com", "tlta fqan psby kynf") // Update with your SMTP settings

    return d.DialAndSend(m)
}

// GenerateOTP generates a random 6-digit OTP
func GenerateOTP() string {
    b := make([]byte, 3)
    if _, err := rand.Read(b); err != nil {
        return ""
    }
    otp := (int(b[0])%10)*100000 + (int(b[1])%10)*10000 + (int(b[2])%10)*1000
    return fmt.Sprintf("%06d", otp)
}

// SignUpHandler handles user registration
func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Print("Heyy i'm listening")
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
	fmt.Print(user)

    if err := validate.Struct(user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    user.Password = string(hashedPassword)

    collection := client.Database("cervical_cancer_detection").Collection("users")
    _, err := collection.InsertOne(context.TODO(), user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Generate and send OTP
    otp := GenerateOTP()
    err = SendEmail(user.Email, otp)
    if err != nil {
        http.Error(w, "Could not send OTP", http.StatusInternalServerError)
        return
    }

    // http.SetCookie(w, &http.Cookie{
    //     Name:    "otp",
    //     Value:   otp,
    //     Path:    "/",
    //     Expires: time.Now().Add(10 * time.Minute),
    // })
	SaveOTP(user.Email,otp)

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode("User registered successfully, please verify OTP.")
}

// SignInHandler handles user login
func SignInHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    collection := client.Database("cervical_cancer_detection").Collection("users")
    var foundUser User
    err := collection.FindOne(context.TODO(), bson.M{"email": user.Email}).Decode(&foundUser)
    if err != nil {
        http.Error(w, "User not found", http.StatusUnauthorized)
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password)); err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Generate and send OTP
    otp := GenerateOTP()
    err = SendEmail(user.Email, otp)
    if err != nil {
        http.Error(w, "Could not send OTP", http.StatusInternalServerError)
        return
    }

    // http.SetCookie(w, &http.Cookie{
    //     Name:    "otp",
    //     Value:   otp,
    //     Path:    "/",
    //     Expires: time.Now().Add(10 * time.Minute),
    // })

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode("Login successful, please verify OTP.")
}
