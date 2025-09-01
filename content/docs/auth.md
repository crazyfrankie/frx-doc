---
title: "auth（JWT authentication）"
linkTitle: "auth"
weight: 0
description: >
  A comprehensive JWT authentication system supporting both Gin and gRPC contexts with flexible token extraction and validation.
---

The auth module provides a comprehensive JWT authentication system with support for both Gin and gRPC contexts, flexible token extraction methods, and robust validation mechanisms.

## Features

- **Multiple signing algorithms**: HS256, HS384, HS512, RS256, RS384, RS512
- **Flexible token extraction** from headers, cookies, query parameters, form data, and URL parameters
- **Context-aware parsing** for both Gin and gRPC frameworks
- **Token refresh mechanism** with configurable expiration
- **RSA key support** for asymmetric algorithms
- **Custom payload handling** with user-defined claims
- **Comprehensive error handling** with specific error types

## Basic JWT Setup

```go
package main

import (
    "time"
    
    "github.com/crazyfrankie/frx/auth/authn"
)

func main() {
    cfg := &authn.Config{
        Realm:            "MyApp",
        SecretKey:        []byte("your-secret-key-here"),
        SigningAlgorithm: "HS256",
        Timeout:          time.Hour * 24,
        MaxRefresh:       time.Hour * 24 * 7,
        TokenLookup:      "header:Authorization",
        TokenHeadName:    "Bearer",
        PayloadFunc: func(data interface{}) authn.MapClaims {
            if user, ok := data.(*User); ok {
                return authn.MapClaims{
                    "user_id": user.ID,
                    "username": user.Username,
                    "role": user.Role,
                }
            }
            return authn.MapClaims{}
        },
    }
    
    jwtHandler, err := authn.New(cfg)
    if err != nil {
        panic(err)
    }
}
```

## Token Generation

```go
type User struct {
    ID       int64  `json:"id"`
    Username string `json:"username"`
    Role     string `json:"role"`
}

func GenerateUserToken(jwtHandler *authn.JWTHandler, user *User) (string, error) {
    token, err := jwtHandler.GenerateToken(user)
    if err != nil {
        return "", err
    }
    
    return token, nil
}
```

## Gin Integration

```go
func AuthMiddleware(jwtHandler *authn.JWTHandler) gin.HandlerFunc {
    return func(c *gin.Context) {
        token, err := jwtHandler.ParseToken(c)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        if !token.Valid {
            c.JSON(401, gin.H{"error": "Token is not valid"})
            c.Abort()
            return
        }
        
        claims := token.Claims.(jwt.MapClaims)
        c.Set("user_id", claims["user_id"])
        c.Set("username", claims["username"])
        c.Set("role", claims["role"])
        
        c.Next()
    }
}

func SetupRoutes(jwtHandler *authn.JWTHandler) *gin.Engine {
    r := gin.Default()
    
    // Public routes
    r.POST("/login", func(c *gin.Context) {
        // Login logic here
        user := &User{ID: 1, Username: "john", Role: "admin"}
        token, err := jwtHandler.GenerateToken(user)
        if err != nil {
            c.JSON(500, gin.H{"error": "Failed to generate token"})
            return
        }
        
        c.JSON(200, gin.H{"token": token})
    })
    
    // Protected routes
    protected := r.Group("/api")
    protected.Use(AuthMiddleware(jwtHandler))
    {
        protected.GET("/profile", func(c *gin.Context) {
            userID := c.GetString("user_id")
            c.JSON(200, gin.H{"user_id": userID})
        })
    }
    
    return r
}
```

## gRPC Integration

```go
func GRPCAuthInterceptor(jwtHandler *authn.JWTHandler) grpc.UnaryServerInterceptor {
    return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
        token, err := jwtHandler.ParseToken(ctx)
        if err != nil {
            return nil, status.Error(codes.Unauthenticated, "Invalid token")
        }
        
        if !token.Valid {
            return nil, status.Error(codes.Unauthenticated, "Token is not valid")
        }
        
        claims := token.Claims.(jwt.MapClaims)
        newCtx := context.WithValue(ctx, "user_id", claims["user_id"])
        newCtx = context.WithValue(newCtx, "username", claims["username"])
        
        return handler(newCtx, req)
    }
}
```

## Token Refresh

```go
func RefreshTokenHandler(jwtHandler *authn.JWTHandler) gin.HandlerFunc {
    return func(c *gin.Context) {
        newToken, err := jwtHandler.RefreshToken(c)
        if err != nil {
            if err == authn.ErrExpiredToken {
                c.JSON(401, gin.H{"error": "Token has expired and cannot be refreshed"})
                return
            }
            c.JSON(500, gin.H{"error": "Failed to refresh token"})
            return
        }
        
        c.JSON(200, gin.H{"token": newToken})
    }
}
```

## RSA Key Configuration

```go
func SetupRSAJWT() (*authn.JWTHandler, error) {
    cfg := &authn.Config{
        Realm:            "MyApp",
        SigningAlgorithm: "RS256",
        PriKeyFile:       "/path/to/private.pem",
        PubKeyFile:       "/path/to/public.pem",
        Timeout:          time.Hour * 24,
        TokenLookup:      "header:Authorization",
        TokenHeadName:    "Bearer",
    }
    
    return authn.New(cfg)
}

// Or using key bytes directly
func SetupRSAJWTWithBytes(privateKeyBytes, publicKeyBytes []byte) (*authn.JWTHandler, error) {
    cfg := &authn.Config{
        Realm:            "MyApp",
        SigningAlgorithm: "RS256",
        PriKeyBytes:      privateKeyBytes,
        PubKeyBytes:      publicKeyBytes,
        Timeout:          time.Hour * 24,
    }
    
    return authn.New(cfg)
}
```

## Flexible Token Extraction

```go
// Extract from different sources
func DemoTokenExtraction() {
    // From header (default)
    cfg1 := &authn.Config{
        TokenLookup: "header:Authorization",
        // ... other config
    }
    
    // From query parameter
    cfg2 := &authn.Config{
        TokenLookup: "query:token",
        // ... other config
    }
    
    // From cookie
    cfg3 := &authn.Config{
        TokenLookup: "cookie:jwt_token",
        // ... other config
    }
    
    // From form data
    cfg4 := &authn.Config{
        TokenLookup: "form:access_token",
        // ... other config
    }
    
    // From URL parameter
    cfg5 := &authn.Config{
        TokenLookup: "param:token",
        // ... other config
    }
}
```

## Error Handling

```go
func HandleJWTErrors(err error) {
    switch err {
    case authn.ErrExpiredToken:
        // Token has expired
        log.Println("Token expired")
    case authn.ErrMissingSecretKey:
        // Secret key not provided
        log.Println("Secret key missing")
    case authn.ErrEmptyAuthHeader:
        // Authorization header is empty
        log.Println("Auth header empty")
    case authn.ErrInvalidAuthHeader:
        // Authorization header format is invalid
        log.Println("Auth header invalid")
    case authn.ErrInvalidSigningAlgorithm:
        // Unsupported signing algorithm
        log.Println("Invalid signing algorithm")
    default:
        log.Printf("JWT error: %v", err)
    }
}
```

