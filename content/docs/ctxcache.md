---
title: "ctxcache（context caching middleware）"
linkTitle: "ctxcache"
weight: 10
description: >
  Thread-safe context caching for HTTP requests, enabling efficient data sharing within request lifecycles without repeated computations or database queries.
---

The ctxcache module provides thread-safe context caching for HTTP requests, enabling efficient data sharing within request lifecycles without repeated computations or database queries.

## Features

- **Thread-safe caching** using sync.Map for concurrent access
- **Generic type support** with compile-time type safety
- **Context-based lifecycle** - cache lives within request context
- **Key existence checking** with HasKey function
- **Zero-value handling** for missing keys
- **Any key type support** - strings, structs, or custom types

## Basic Usage

Initialize ctxcache as your first middleware (recommended for frameworks like Gin):

```go
func InitRouter() {
    srv := gin.Default()

    // Initialize context cache first
    srv.Use(func(c *gin.Context) {
        ctx := ctxcache.Init(c.Request.Context())
        c.Request = c.Request.WithContext(ctx)
        c.Next()
    })
    
    // Other middlewares follow
    // srv.Use(CORS())
    // srv.Use(Auth())
}
```

## Storing and Retrieving Data

```go
// Store different types of data
ctxcache.Store(ctx, "user_id", int64(12345))
ctxcache.Store(ctx, "user_name", "john_doe")
ctxcache.Store(ctx, "is_admin", true)

// Store complex structures
type User struct {
    ID   int64  `json:"id"`
    Name string `json:"name"`
}
user := User{ID: 123, Name: "John"}
ctxcache.Store(ctx, "current_user", user)

// Retrieve with type safety
userID, ok := ctxcache.Get[int64](ctx, "user_id")
if !ok {
    // Handle missing key
    return errors.New("user_id not found in cache")
}

userName, ok := ctxcache.Get[string](ctx, "user_name")
if ok {
    fmt.Printf("User: %s (ID: %d)\n", userName, userID)
}

// Retrieve complex structures
cachedUser, ok := ctxcache.Get[User](ctx, "current_user")
if ok {
    fmt.Printf("Current user: %+v\n", cachedUser)
}
```

## Advanced Usage

```go
// Using custom key types for better organization
type CacheKey struct {
    Module string
    ID     int64
}

userKey := CacheKey{Module: "user", ID: 123}
ctxcache.Store(ctx, userKey, userData)

// Check if key exists before retrieval
if ctxcache.HasKey(ctx, userKey) {
    user, _ := ctxcache.Get[User](ctx, userKey)
    // Process user data
}

// Cache expensive operations
func GetUserPermissions(ctx context.Context, userID int64) ([]string, error) {
    cacheKey := fmt.Sprintf("permissions_%d", userID)
    
    // Check cache first
    if permissions, ok := ctxcache.Get[[]string](ctx, cacheKey); ok {
        return permissions, nil
    }
    
    // Expensive database query
    permissions, err := database.GetUserPermissions(userID)
    if err != nil {
        return nil, err
    }
    
    // Cache the result
    ctxcache.Store(ctx, cacheKey, permissions)
    return permissions, nil
}
```
