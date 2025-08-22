---
title: "htr（HTTP to RPC converter）"
linkTitle: "htr"
weight: 30
description: >
  A convenient bridge between HTTP requests and gRPC calls, simplifying the process of converting HTTP endpoints to RPC service calls.
---

The htr module provides a convenient bridge between HTTP requests and gRPC calls, simplifying the process of converting HTTP endpoints to RPC service calls with automatic request parsing, validation, and response handling.

## Features

- **Generic type support** for type-safe request/response handling
- **Automatic request parsing** from HTTP/Gin contexts to structured types
- **Built-in validation** using go-playground/validator
- **Error handling integration** with errorx module
- **Flexible middleware hooks** with BindAfter and RespAfter options
- **Support for both Gin and standard HTTP** handlers
- **Structured JSON responses** with consistent error formatting

## Basic Usage with Gin

```go
package main

import (
    "context"
    
    "github.com/gin-gonic/gin"
    "google.golang.org/grpc"
    
    "github.com/crazyfrankie/frx/htr"
    "your-project/pb" // Your protobuf generated code
)

type CreateUserRequest struct {
    Name  string `json:"name" binding:"required"`
    Email string `json:"email" binding:"required,email"`
    Age   int    `json:"age" binding:"min=1,max=120"`
}

type CreateUserResponse struct {
    ID   int64  `json:"id"`
    Name string `json:"name"`
}

func CreateUserHandler(c *gin.Context) {
    // Direct HTTP to RPC conversion
    htr.Call(c, pb.NewUserServiceClient(grpcConn).CreateUser, grpcClient)
}

func main() {
    r := gin.Default()
    
    // Setup gRPC connection
    grpcConn, err := grpc.Dial("localhost:9090", grpc.WithInsecure())
    if err != nil {
        panic(err)
    }
    defer grpcConn.Close()
    
    grpcClient := pb.NewUserServiceClient(grpcConn)
    
    r.POST("/users", func(c *gin.Context) {
        htr.Call[CreateUserRequest, CreateUserResponse](
            c,
            grpcClient.CreateUser,
            grpcClient,
        )
    })
    
    r.Run(":8080")
}
```

## Advanced Usage with Options

```go
func CreateUserWithValidation(c *gin.Context) {
    htr.Call[CreateUserRequest, CreateUserResponse](
        c,
        grpcClient.CreateUser,
        grpcClient,
        &htr.Option[CreateUserRequest, CreateUserResponse]{
            // Custom validation after request binding
            BindAfter: func(req *CreateUserRequest) error {
                if req.Age < 18 {
                    return errors.New("user must be at least 18 years old")
                }
                
                // Additional business logic validation
                if strings.Contains(req.Email, "blocked-domain.com") {
                    return errors.New("email domain not allowed")
                }
                
                return nil
            },
            
            // Process response before sending to client
            RespAfter: func(resp *CreateUserResponse) error {
                // Log successful user creation
                logs.Infof("User created successfully: ID=%d, Name=%s", 
                    resp.ID, resp.Name)
                
                // Could modify response or trigger side effects
                return nil
            },
        },
    )
}
```

## Standard HTTP Handler Usage

```go
func CreateUserHTTPHandler(w http.ResponseWriter, r *http.Request) {
    htr.CallHttp[CreateUserRequest, CreateUserResponse](
        w, r,
        grpcClient.CreateUser,
        grpcClient,
        &htr.Option[CreateUserRequest, CreateUserResponse]{
            BindAfter: func(req *CreateUserRequest) error {
                // Custom validation logic
                return validateUserRequest(req)
            },
        },
    )
}

func main() {
    http.HandleFunc("/users", CreateUserHTTPHandler)
    http.ListenAndServe(":8080", nil)
}
```

## Error Handling

The htr module integrates with the errorx module for consistent error handling:

```go
// Custom error codes (using errorx/gen or manual registration)
const (
    ErrUserAlreadyExists = 1001001
    ErrInvalidAge       = 1001002
)

func CreateUserWithErrorHandling(c *gin.Context) {
    htr.Call[CreateUserRequest, CreateUserResponse](
        c,
        grpcClient.CreateUser,
        grpcClient,
        &htr.Option[CreateUserRequest, CreateUserResponse]{
            BindAfter: func(req *CreateUserRequest) error {
                // Check if user already exists
                if userExists(req.Email) {
                    return errorx.New(ErrUserAlreadyExists,
                        errorx.KV("email", req.Email))
                }
                
                if req.Age < 18 {
                    return errorx.New(ErrInvalidAge,
                        errorx.KV("provided_age", req.Age),
                        errorx.KV("minimum_age", 18))
                }
                
                return nil
            },
        },
    )
}
```

## Response Format

The htr module provides consistent JSON response formatting:

**Success Response:**

```json
{
    "code": 0,
    "message": "",
    "data": {
        "id": 12345,
        "name": "John Doe"
    }
}
```

**Error Response:**

```json
{
    "code": 1001001,
    "message": "user already exists",
    "data": null
}
```

## Multiple Validation Steps

```go
func ComplexUserHandler(c *gin.Context) {
    htr.Call[CreateUserRequest, CreateUserResponse](
        c,
        grpcClient.CreateUser,
        grpcClient,
        &htr.Option[CreateUserRequest, CreateUserResponse]{
            BindAfter: func(req *CreateUserRequest) error {
                // Step 1: Business logic validation
                if err := validateBusinessRules(req); err != nil {
                    return err
                }
                
                // Step 2: External service validation
                if err := validateWithExternalService(req); err != nil {
                    return err
                }
                
                // Step 3: Database constraints
                if err := validateDatabaseConstraints(req); err != nil {
                    return err
                }
                
                return nil
            },
            
            RespAfter: func(resp *CreateUserResponse) error {
                // Send welcome email
                go sendWelcomeEmail(resp.ID)
                
                // Update analytics
                go updateUserCreationMetrics()
                
                return nil
            },
        },
    )
}
```

## Integration with Context Caching

```go
func UserHandlerWithCaching(c *gin.Context) {
    htr.Call[GetUserRequest, GetUserResponse](
        c,
        grpcClient.GetUser,
        grpcClient,
        &htr.Option[GetUserRequest, GetUserResponse]{
            BindAfter: func(req *GetUserRequest) error {
                // Cache user permissions for this request
                permissions, err := getUserPermissions(req.UserID)
                if err != nil {
                    return err
                }
                
                ctxcache.Store(c.Request.Context(), "user_permissions", permissions)
                return nil
            },
            
            RespAfter: func(resp *GetUserResponse) error {
                // Use cached permissions for response filtering
                if permissions, ok := ctxcache.Get[[]string](c.Request.Context(), "user_permissions"); ok {
                    resp = filterResponseByPermissions(resp, permissions)
                }
                return nil
            },
        },
    )
}
```
