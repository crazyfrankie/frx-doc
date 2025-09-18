---
title: "config（configuration management）"
linkTitle: "config"
weight: 16
description: >
  Flexible configuration management system supporting multiple sources (files, environment variables, remote config centers) with unified reading, watching, and parsing interfaces. Protobuf is recommended for defining configuration structures.
---

The config module provides a flexible configuration management system that supports multiple configuration sources (files, environment variables, remote configuration centers) with unified reading, watching, and parsing interfaces. **We recommend using Protocol Buffers (protobuf) to define configuration structures** for better type safety, schema validation, and cross-language compatibility.

## Features

- **Multiple configuration sources** support (files, environment variables, remote config centers)
- **Unified configuration interface** for consistent access patterns
- **Real-time configuration watching** with observer pattern
- **Automatic configuration merging** from multiple sources
- **Type-safe configuration scanning** to structs
- **Hierarchical configuration** with key-value access
- **Configuration caching** for improved performance
- **Extensible source system** for custom configuration providers

## Basic Configuration Usage (Recommended: Protobuf)

First, define your configuration structure using Protocol Buffers:

```proto
// config.proto
syntax = "proto3";

package config;

option go_package = "github.com/yourproject/config";

message AppConfig {
  ServerConfig server = 1;
  DatabaseConfig database = 2;
}

message ServerConfig {
  string host = 1;
  int32 port = 2;
}

message DatabaseConfig {
  string host = 1;
  int32 port = 2;
  string username = 3;
  string password = 4;
}
```

Then use it in your Go application:

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/crazyfrankie/frx/config"
    "github.com/crazyfrankie/frx/config/file"
    "github.com/crazyfrankie/frx/config/env"
    
    // Import your generated protobuf config
    configpb "github.com/yourproject/config"
)

func main() {
    // Create configuration with multiple sources
    c := config.New(
        config.WithSource(
            file.NewSource("config.yaml"),
            env.NewSource("APP_"),
        ),
    )
    defer c.Close()

    // Load configuration
    if err := c.Load(); err != nil {
        log.Fatal(err)
    }

    // Scan configuration into protobuf struct
    var cfg configpb.AppConfig
    if err := c.Scan(&cfg); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Server: %s:%d\n", cfg.Server.Host, cfg.Server.Port)
    fmt.Printf("Database: %s:%d\n", cfg.Database.Host, cfg.Database.Port)
}
```

## Alternative: Traditional Struct Usage

If you prefer not to use protobuf, you can still use traditional Go structs:

```go
type AppConfig struct {
    Server struct {
        Host string `json:"host"`
        Port int    `json:"port"`
    } `json:"server"`
    Database struct {
        Host     string `json:"host"`
        Port     int    `json:"port"`
        Username string `json:"username"`
        Password string `json:"password"`
    } `json:"database"`
}
```

## Configuration Sources

### File Source

```go
import "github.com/crazyfrankie/frx/config/file"

// YAML file source
yamlSource := file.NewSource("config.yaml")

// JSON file source  
jsonSource := file.NewSource("config.json")

// Multiple file sources
c := config.New(
    config.WithSource(
        file.NewSource("config.yaml"),
        file.NewSource("config.local.yaml"), // Override with local config
    ),
)
```

### Environment Variable Source

```go
import "github.com/crazyfrankie/frx/config/env"

// Environment variables with prefix
envSource := env.NewSource("APP_")

c := config.New(
    config.WithSource(envSource),
)

// Environment variables will be mapped:
// APP_SERVER_HOST -> server.host
// APP_DATABASE_PORT -> database.port
```

## Configuration Watching

```go
func main() {
    c := config.New(
        config.WithSource(file.NewSource("config.yaml")),
    )
    defer c.Close()

    if err := c.Load(); err != nil {
        log.Fatal(err)
    }

    // Watch for configuration changes
    if err := c.Watch("server", func(key string, value config.Value) {
        fmt.Printf("Configuration changed - %s: %v\n", key, value)
        
        // Reload application configuration
        var cfg AppConfig
        if err := c.Scan(&cfg); err != nil {
            log.Printf("Failed to reload config: %v", err)
            return
        }
        
        // Apply new configuration
        applyNewConfig(cfg)
    }); err != nil {
        log.Fatal(err)
    }

    // Keep application running
    select {}
}

func applyNewConfig(cfg AppConfig) {
    // Restart server with new configuration
    fmt.Printf("Applying new config: %+v\n", cfg)
}
```

## Value Access and Type Conversion

```go
func main() {
    c := config.New(
        config.WithSource(file.NewSource("config.yaml")),
    )
    defer c.Close()

    if err := c.Load(); err != nil {
        log.Fatal(err)
    }

    // Get values by key
    serverHost := c.Value("server.host")
    if serverHost == nil {
        log.Fatal("server.host not found")
    }

    // Type-safe value conversion
    host, err := serverHost.String()
    if err != nil {
        log.Fatal(err)
    }

    port, err := c.Value("server.port").Int()
    if err != nil {
        log.Fatal(err)
    }

    enabled, err := c.Value("features.enabled").Bool()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Server: %s:%d, Features enabled: %v\n", host, port, enabled)
}
```

## Configuration Merging

```go
func main() {
    // Configuration sources are merged in order
    // Later sources override earlier ones
    c := config.New(
        config.WithSource(
            file.NewSource("config.default.yaml"), // Default configuration
            file.NewSource("config.yaml"),         // Environment-specific config
            env.NewSource("APP_"),                  // Environment variables (highest priority)
        ),
    )
    defer c.Close()

    if err := c.Load(); err != nil {
        log.Fatal(err)
    }

    // The final configuration is a merge of all sources
    var cfg AppConfig
    if err := c.Scan(&cfg); err != nil {
        log.Fatal(err)
    }
}
```

## Custom Configuration Source

```go
import "github.com/crazyfrankie/frx/config"

// Implement custom source
type customSource struct {
    data map[string]interface{}
}

func (s *customSource) Load() ([]*config.KeyValue, error) {
    var kvs []*config.KeyValue
    for k, v := range s.data {
        kvs = append(kvs, &config.KeyValue{
            Key:   k,
            Value: []byte(fmt.Sprintf("%v", v)),
        })
    }
    return kvs, nil
}

func (s *customSource) Watch() (config.Watcher, error) {
    // Implement watcher if needed
    return nil, nil
}

func NewCustomSource(data map[string]interface{}) config.Source {
    return &customSource{data: data}
}

// Usage
customData := map[string]interface{}{
    "app.name":    "MyApp",
    "app.version": "1.0.0",
}

c := config.New(
    config.WithSource(NewCustomSource(customData)),
)
```
