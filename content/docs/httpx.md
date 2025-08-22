---
title: "httpx（enhanced HTTP client）"
linkTitle: "httpx"
weight: 40
description: >
  A fluent, chainable HTTP client with enhanced functionality for building and executing HTTP requests with automatic error handling and JSON support.
---

The httpx module provides a fluent, chainable HTTP client with enhanced functionality for building and executing HTTP requests with automatic error handling and JSON support.

## Features

- **Fluent API design** with method chaining
- **Automatic JSON handling** for request/response bodies
- **Custom HTTP client support** for advanced configurations
- **Query parameter management** with automatic URL encoding
- **Header manipulation** with multiple value support
- **Error propagation** throughout the chain
- **Context support** for request cancellation and timeouts

## Basic HTTP Operations

```go
package main

import (
    "context"
    "fmt"
    "net/http"
    "time"

    "github.com/crazyfrankie/frx/httpx"
)

func main() {
    ctx := context.Background()
    
    // Simple GET request
    resp := httpx.NewRequest(ctx, http.MethodGet, "https://api.example.com/users").
        AddParam("page", "1").
        AddParam("limit", "10").
        AddHeader("Authorization", "Bearer token123").
        Do()
    
    if resp.err != nil {
        panic(resp.err)
    }
    defer resp.Body.Close()
    
    fmt.Printf("Status: %d\n", resp.StatusCode)
}
```

## JSON Request/Response Handling

```go
type CreateUserRequest struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}

type User struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func CreateUser(ctx context.Context, req CreateUserRequest) (*User, error) {
    var user User
    
    resp := httpx.NewRequest(ctx, http.MethodPost, "https://api.example.com/users").
        AddHeader("Content-Type", "application/json").
        AddHeader("Authorization", "Bearer token123").
        JSONBody(req).  // Automatically marshals to JSON
        Do()
    
    if resp.err != nil {
        return nil, resp.err
    }
    defer resp.Body.Close()
    
    // Automatically unmarshal JSON response
    if err := resp.JSONReceive(&user); err != nil {
        return nil, err
    }
    
    return &user, nil
}
```

## Custom HTTP Client Configuration

```go
func main() {
    // Custom client with timeout and retry logic
    customClient := &http.Client{
        Timeout: 30 * time.Second,
        Transport: &http.Transport{
            MaxIdleConns:        100,
            MaxIdleConnsPerHost: 10,
            IdleConnTimeout:     90 * time.Second,
        },
    }
    
    resp := httpx.NewRequest(ctx, http.MethodGet, "https://api.example.com/data").
        Client(customClient).  // Use custom client
        AddParam("format", "json").
        AddHeader("User-Agent", "MyApp/1.0").
        Do()
    
    // Handle response...
}
```

## Error Handling and Chaining

```go
func FetchUserData(ctx context.Context, userID string) (*User, error) {
    var user User
    
    resp := httpx.NewRequest(ctx, http.MethodGet, "https://api.example.com/users/"+userID).
        AddHeader("Authorization", "Bearer token123").
        AddParam("include", "profile,settings").
        Do()
    
    // Error is propagated through the chain
    if resp.err != nil {
        return nil, fmt.Errorf("failed to fetch user: %w", resp.err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("API returned status %d", resp.StatusCode)
    }
    
    if err := resp.JSONReceive(&user); err != nil {
        return nil, fmt.Errorf("failed to decode response: %w", err)
    }
    
    return &user, nil
}
```
