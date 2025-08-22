---
title: "jsoncache（JSON caching）"
linkTitle: "jsoncache"
weight: 60
description: >
  Type-safe JSON caching functionality with Redis backend, supporting generic types for compile-time type safety.
---

The jsoncache module provides type-safe JSON caching functionality with Redis backend, supporting generic types for compile-time type safety.

## Features

- Type-safe JSON caching with generics
- Redis backend support
- Automatic JSON marshaling/unmarshaling
- Prefix-based key management
- Error handling with context

## Basic Usage

```go
package main

import (
    "context"
    "fmt"
    
    "github.com/redis/go-redis/v9"
	
    "github.com/crazyfrankie/frx/jsoncache"
)

type User struct {
    ID   int64  `json:"id"`
    Name string `json:"name"`
    Email string `json:"email"`
}

func main() {
    // Initialize Redis client
    rdb := redis.NewClient(&redis.Options{
        Addr: "localhost:6379",
    })
    
    // Create JSON cache for User type
    userCache := jsoncache.New[User]("user:", rdb)
    
    ctx := context.Background()
    
    // Save user to cache
    user := &User{
        ID:   1,
        Name: "John Doe",
        Email: "john@example.com",
    }
    
    err := userCache.Save(ctx, "123", user)
    if err != nil {
        panic(err)
    }
    
    // Get user from cache
    cachedUser, err := userCache.Get(ctx, "123")
    if err != nil {
        panic(err)
    }
    
    fmt.Printf("Cached user: %+v\n", cachedUser)
    
    // Delete user from cache
    err = userCache.Delete(ctx, "123")
    if err != nil {
        panic(err)
    }
}
```
