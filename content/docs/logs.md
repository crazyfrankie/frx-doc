---
title: "logs（structured logging）"
linkTitle: "logs"
weight: 80
description: >
  A comprehensive logging system with multiple interfaces, level-based filtering, and flexible output configuration, designed for high-performance applications.
---

The logs module provides a comprehensive logging system with multiple interfaces, level-based filtering, and flexible output configuration, designed for high-performance applications.

## Features

- **Multiple logging interfaces**: Logger, FormatLogger, CtxLogger
- **Seven log levels**: Trace, Debug, Info, Notice, Warn, Error, Fatal
- **Context-aware logging** with CtxLogger interface
- **Configurable output destinations** (stderr, files, custom writers)
- **Thread-safe operations** for concurrent applications
- **Microsecond precision timestamps**
- **Short file names** in log output for better readability
- **Global and instance-based usage**

## Log Levels and Usage

```go
package main

import (
    "context"
    "os"
    
    "github.com/crazyfrankie/frx/logs"
)

func main() {
    // Set log level (only logs at this level or higher will be output)
    logs.SetLevel(logs.LevelInfo)
    
    // Different log levels (in order of severity)
    logs.Trace("Detailed trace information")     // Lowest level
    logs.Debug("Debug information for developers")
    logs.Info("General information")             // Default level
    logs.Notice("Notable events")
    logs.Warn("Warning messages")
    logs.Error("Error conditions")
    logs.Fatal("Fatal errors - will call os.Exit(1)")  // Highest level
}
```

## Formatted Logging

```go
func main() {
    // Formatted logging with printf-style formatting
    userID := 12345
    userName := "john_doe"
    
    logs.Infof("User %s (ID: %d) logged in successfully", userName, userID)
    logs.Errorf("Failed to process user %d: %v", userID, err)
    logs.Debugf("Processing request with %d items", len(items))
    
    // All format levels available
    logs.Tracef("Trace: %s", "detailed info")
    logs.Debugf("Debug: %s", "debug info")
    logs.Noticef("Notice: %s", "notable event")
    logs.Warnf("Warning: %s", "warning message")
    logs.Fatalf("Fatal: %s", "fatal error")  // Exits program
}
```

## Context-Aware Logging

```go
func ProcessRequest(ctx context.Context, requestID string) {
    // Context-aware logging for request tracing
    logs.CtxInfof(ctx, "Processing request %s", requestID)
    
    // Simulate processing
    if err := doSomeWork(ctx); err != nil {
        logs.CtxErrorf(ctx, "Request %s failed: %v", requestID, err)
        return
    }
    
    logs.CtxInfof(ctx, "Request %s completed successfully", requestID)
}

func doSomeWork(ctx context.Context) error {
    logs.CtxDebugf(ctx, "Starting work processing")
    
    // Simulate work
    select {
    case <-time.After(100 * time.Millisecond):
        logs.CtxDebugf(ctx, "Work completed")
        return nil
    case <-ctx.Done():
        logs.CtxWarnf(ctx, "Work cancelled: %v", ctx.Err())
        return ctx.Err()
    }
}
```

## Custom Logger Configuration

```go
func main() {
    // Redirect logs to a file
    logFile, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    if err != nil {
        panic(err)
    }
    defer logFile.Close()
    
    logs.SetOutput(logFile)
    logs.SetLevel(logs.LevelDebug)
    
    // Use custom logger instance
    customLogger := logs.DefaultLogger()
    customLogger.SetLevel(logs.LevelWarn)
    customLogger.Info("This won't be logged due to level filtering")
    customLogger.Error("This will be logged")
    
    // Replace default logger
    logs.SetLogger(customLogger)
}
```

## Production Logging Patterns

```go
func HandleAPIRequest(ctx context.Context, req *APIRequest) (*APIResponse, error) {
    requestID := req.ID
    
    logs.CtxInfof(ctx, "API request started: %s", requestID)
    start := time.Now()
    
    defer func() {
        duration := time.Since(start)
        logs.CtxInfof(ctx, "API request completed: %s (took %v)", requestID, duration)
    }()
    
    // Validate request
    if err := validateRequest(req); err != nil {
        logs.CtxWarnf(ctx, "Invalid request %s: %v", requestID, err)
        return nil, err
    }
    
    // Process request
    resp, err := processRequest(ctx, req)
    if err != nil {
        logs.CtxErrorf(ctx, "Failed to process request %s: %v", requestID, err)
        return nil, err
    }
    
    logs.CtxDebugf(ctx, "Request %s processed successfully", requestID)
    return resp, nil
}
```

## Basic Usage

```go
package main

import (
    "github.com/crazyfrankie/frx/logs"
)

func main() {
    logs.SetlogLevel(logs.LevelInfo)
    
    // call log
    logs.Info("Application started")
    logs.Error("Something went wrong", "error", err)
    logs.Debug("Debug information", "data", debugData)
}
```
