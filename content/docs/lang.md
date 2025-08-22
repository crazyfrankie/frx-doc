---
title: "lang（Go language extensions）"
linkTitle: "lang"
weight: 70
description: >
  Utility functions and extensions for common Go programming tasks, organized into several sub-packages.
---

The lang module provides utility functions and extensions for common Go programming tasks, organized into several sub-packages.

## Sub-packages

- **conv**: Type conversion utilities
- **ptr**: Pointer manipulation helpers
- **maps**: Map operation utilities
- **sets**: Set data structure operations
- **slices**: Slice manipulation functions
- **crypto**: Cryptographic utilities

## conv - Type Conversion

```go
package main

import (
    "fmt"
	
    "github.com/crazyfrankie/frx/lang/conv"
)

func main() {
    // String to int64 conversion
    num, err := conv.StrToInt64("12345")
    if err != nil {
        panic(err)
    }
    fmt.Printf("Converted number: %d\n", num)
    
    // String to int64 with default value
    numWithDefault := conv.StrToInt64D("invalid", 0)
    fmt.Printf("Number with default: %d\n", numWithDefault)
    
    // Int64 to string
    str := conv.Int64ToStr(12345)
    fmt.Printf("Converted string: %s\n", str)
    
    // Debug JSON conversion
    data := map[string]interface{}{
        "name": "John",
        "age":  30,
    }
    jsonStr := conv.DebugJsonToStr(data)
    fmt.Printf("JSON string: %s\n", jsonStr)
    
    // Bool to int conversion
    intVal := conv.BoolToInt(true)  // returns 1
    fmt.Printf("Bool to int: %d\n", intVal)
}
```

## ptr - Pointer Utilities

```go
package main

import (
    "fmt"
	
    "github.com/crazyfrankie/frx/lang/ptr"
)

func main() {
    // Create pointer from value
    value := 42
    valuePtr := ptr.Of(value)
    fmt.Printf("Pointer value: %d\n", *valuePtr)
    
    // Get value from pointer
    retrievedValue := ptr.From(valuePtr)
    fmt.Printf("Retrieved value: %d\n", retrievedValue)
    
    // Get value from pointer with default
    var nilPtr *int
    defaultValue := ptr.FromOrDefault(nilPtr, 100)
    fmt.Printf("Default value: %d\n", defaultValue)
}
```
