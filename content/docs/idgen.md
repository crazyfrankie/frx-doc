---
title: "idgen（distributed unique ID generator）"
linkTitle: "idgen"
weight: 50
description: >
  Distributed unique ID generation using Redis as the coordination backend, suitable for high-concurrency scenarios.
---

The idgen module provides distributed unique ID generation using Redis as the coordination backend, suitable for high-concurrency scenarios.

## Features

- Distributed unique ID generation
- Redis-based coordination
- Batch ID generation support
- Time-based ID structure
- Collision avoidance mechanisms

## Basic Usage

```go
package main

import (
    "context"
    "fmt"
    
    "github.com/redis/go-redis/v9"
	
    "github.com/crazyfrankie/frx/idgen"
)

func main() {
    // Initialize Redis client
    rdb := redis.NewClient(&redis.Options{
        Addr: "localhost:6379",
    })
    
    // Create ID generator
    generator, err := idgen.New(rdb)
    if err != nil {
        panic(err)
    }
    
    ctx := context.Background()
    
    // Generate single ID
    id, err := generator.GenID(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Generated ID: %d\n", id)
    
    // Generate multiple IDs (batch)
    ids, err := generator.GenMultiIDs(ctx, 10)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Generated IDs: %v\n", ids)
}
```
