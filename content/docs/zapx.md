---
title: "zapx（enhanced Zap logging）"
linkTitle: "zapx"
weight: 90
description: >
  Enhanced logging capabilities built on top of Uber's Zap logger, with additional features like sensitive data masking.
---

The zapx module provides enhanced logging capabilities built on top of Uber's Zap logger, with additional features like sensitive data masking.

## Features

- Sensitive data masking (e.g., phone numbers)
- Custom core implementation
- Enhanced field processing
- Built on Zap's high-performance logging

## Basic Usage

```go
package main

import (
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
	
    "github.com/crazyfrankie/frx/zapx"
)

func main() {
    // Create standard Zap core
    config := zap.NewProductionConfig()
    core, err := config.Build()
    if err != nil {
        panic(err)
    }
    
    // Wrap with custom core for sensitive data handling
    customCore := zapx.NewCustomCore(core.Core())
    logger := zap.New(customCore)
    
    // Log with sensitive data - phone numbers will be masked
    logger.Info("User login",
        zap.String("user", "john_doe"),
        zap.String("phone", "1234567890"), // Will be masked as "123****890"
        zap.String("action", "login"),
    )
    
    logger.Sync()
}
```

The zapx module automatically masks sensitive fields like phone numbers, replacing the middle digits with asterisks for privacy protection while maintaining log readability.
