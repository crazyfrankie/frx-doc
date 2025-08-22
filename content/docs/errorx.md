---
title: "errorx（error code management）"
linkTitle: "errorx"
weight: 20
description: >
  Comprehensive error code management with status codes, stack traces, and configurable error registration for structured error handling.
---

The errorx module provides comprehensive error code management with status codes, stack traces, and configurable error registration for structured error handling.

## Features

- Status code support for errors
- Automatic stack trace generation
- Error registration with templates
- Flexible key-value parameters
- Stability tracking for system errors
- Error wrapping capabilities
- **Code generation tool** for automatic error code registration

## Code Generation

The errorx module includes a powerful code generator (`errorx/gen`) that automatically generates `code.Register` calls from YAML configuration files. This approach ensures consistency and reduces manual coding errors.

### Setting up Code Generation

1. **Create metadata configuration** (`metadata.yaml`):

```yaml
version: 'v1'

error_code:
  # Total length of the error code (default: 9)
  total_length: 6
  # Length of app code (default: 1)
  app_length: 1
  # Length of business code (default: 3)
  biz_length: 2
  # Length of sub code (default: 4)
  sub_length: 3

app:
  - name: myapp
    code: 6  # App identifier (1-9)
    business:
      - name: common
        code: 0
      - name: user
        code: 10
      - name: order
        code: 20
```

2. **Create common error codes** (`common.yaml`):

```yaml
error_code:
  - name: CommonNoPermission
    code: 101
    message: no access permission
    no_affect_stability: true

  - name: CommonInternalError
    code: 500
    message: internal server error
    no_affect_stability: false
```

3. **Create business-specific error codes** (`user.yaml`):

```yaml
error_code:
  - name: UserNotFound
    code: 1001
    message: user not found
    description: the specified user does not exist
    no_affect_stability: true

  - name: UserAlreadyExists
    code: 1002
    message: user already exists
    no_affect_stability: true
```

### Generate Code

Run the generator to create Go code with error registrations:

```bash
go run github.com/crazyfrankie/frx/errorx/gen/code_gen.go \
     --biz user \
     --app-name myapp \
     --app-code 6 \
     --import-path "github.com/crazyfrankie/frx/errorx/code" \
     --output-dir "./generated/user" \
     --script-dir "./config"
```

This generates Go files with automatic error code registration:

```go
// Generated code
package errno

import "github.com/crazyfrankie/frx/errorx/code"

const (
    UserNotFound = int32(610001001)
    UserAlreadyExists = int32(610001002)
)

func init() {
    code.Register(UserNotFound, "user not found", code.WithAffectStability(false))
    code.Register(UserAlreadyExists, "user already exists", code.WithAffectStability(false))
}
```

### Manual Registration (Alternative)

You can also manually register error codes:

```go
package errno

import "github.com/crazyfrankie/frx/errorx/code"

const (
    ErrPermissionDenied = int32(1000001)
    ErrResourceNotFound = int32(1000002)
    ErrInvalidParameter = int32(1000003)
)

func init() {
    code.Register(
        ErrPermissionDenied,
        "unauthorized access: {user}",
        code.WithAffectStability(false),
    )
    
    code.Register(
        ErrResourceNotFound,
        "resource not found: {resource}",
        code.WithAffectStability(true),
    )
}
```

### Using Generated or Registered Errors

Then use the errors in your application:

```go
package main

import (
    "fmt"
	
    "github.com/crazyfrankie/frx/errorx"
    
	"your-project/types/errno"
)

func main() {
    // Create new error with parameters
    err := errorx.New(errno.ErrPermissionDenied, 
        errorx.KV("user", "john_doe"),
        errorx.Extra("request_id", "req-123"),
    )
    
    // Wrap existing error
    originalErr := fmt.Errorf("database connection failed")
    wrappedErr := errorx.WrapByCode(originalErr, errno.ErrResourceNotFound,
        errorx.KV("resource", "user_table"),
    )
    
    // Extract error information
    if statusErr, ok := err.(errorx.StatusError); ok {
        fmt.Printf("Code: %d\n", statusErr.Code())
        fmt.Printf("Message: %s\n", statusErr.Msg())
        fmt.Printf("Affects Stability: %v\n", statusErr.IsAffectStability())
    }
}
```
