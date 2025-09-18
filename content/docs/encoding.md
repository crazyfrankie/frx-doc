---
title: "encoding（serialization codec system）"
linkTitle: "encoding"
weight: 25
description: >
  Thread-safe serialization codec system supporting multiple formats (JSON, XML, YAML, Protocol Buffers, Form) with automatic registration and content-type handling.
---

The encoding module provides a thread-safe serialization codec system that supports multiple formats (JSON, XML, YAML, Protocol Buffers, Form) with automatic registration and content-type handling.

## Features

- **Multiple encoding formats** support (JSON, XML, YAML, Protocol Buffers, Form)
- **Thread-safe codec interface** for concurrent usage
- **Automatic codec registration** system
- **Content-type based codec selection** 
- **Protocol Buffers integration** with enhanced JSON support
- **Custom marshaler/unmarshaler** support
- **Extensible codec system** for custom formats

## Core Codec Interface

```go
package main

import (
    "fmt"
    "log"

    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/json" // Auto-register JSON codec
)

type User struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func main() {
    user := User{
        ID:    1,
        Name:  "John Doe",
        Email: "john@example.com",
    }

    // Get codec by name
    codec := encoding.GetCodec("json")
    if codec == nil {
        log.Fatal("JSON codec not found")
    }

    // Marshal data
    data, err := codec.Marshal(user)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Marshaled: %s\n", string(data))

    // Unmarshal data
    var decoded User
    if err := codec.Unmarshal(data, &decoded); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Unmarshaled: %+v\n", decoded)
}
```

## JSON Encoding

```go
package main

import (
    "fmt"
    "log"

    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/json"
)

type Product struct {
    ID          int64   `json:"id"`
    Name        string  `json:"name"`
    Price       float64 `json:"price"`
    Available   bool    `json:"available"`
    Tags        []string `json:"tags,omitempty"`
}

func main() {
    product := Product{
        ID:        123,
        Name:      "Laptop",
        Price:     999.99,
        Available: true,
        Tags:      []string{"electronics", "computers"},
    }

    // JSON encoding
    jsonCodec := encoding.GetCodec("json")
    
    data, err := jsonCodec.Marshal(product)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("JSON: %s\n", string(data))

    // JSON decoding
    var decoded Product
    if err := jsonCodec.Unmarshal(data, &decoded); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Decoded: %+v\n", decoded)
}
```

## Protocol Buffers Support

```go
package main

import (
    "fmt"
    "log"

    "google.golang.org/protobuf/proto"
    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/json"
)

// Assuming you have a protobuf message
// message UserProto {
//   int64 id = 1;
//   string name = 2;
//   string email = 3;
// }

func main() {
    // Create protobuf message
    userProto := &UserProto{
        Id:    1,
        Name:  "John Doe",
        Email: "john@example.com",
    }

    // JSON codec automatically handles protobuf messages
    jsonCodec := encoding.GetCodec("json")
    
    // Marshal protobuf to JSON
    data, err := jsonCodec.Marshal(userProto)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Protobuf as JSON: %s\n", string(data))

    // Unmarshal JSON back to protobuf
    var decoded UserProto
    if err := jsonCodec.Unmarshal(data, &decoded); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Decoded protobuf: %+v\n", &decoded)
}
```

## XML Encoding

```go
package main

import (
    "fmt"
    "log"

    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/xml"
)

type Book struct {
    XMLName xml.Name `xml:"book"`
    ID      int64    `xml:"id,attr"`
    Title   string   `xml:"title"`
    Author  string   `xml:"author"`
    ISBN    string   `xml:"isbn"`
}

func main() {
    book := Book{
        ID:     1,
        Title:  "Go Programming",
        Author: "John Smith",
        ISBN:   "978-0123456789",
    }

    // XML encoding
    xmlCodec := encoding.GetCodec("xml")
    
    data, err := xmlCodec.Marshal(book)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("XML: %s\n", string(data))

    // XML decoding
    var decoded Book
    if err := xmlCodec.Unmarshal(data, &decoded); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Decoded: %+v\n", decoded)
}
```

## YAML Encoding

```go
package main

import (
    "fmt"
    "log"

    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/yaml"
)

type Config struct {
    Server struct {
        Host string `yaml:"host"`
        Port int    `yaml:"port"`
    } `yaml:"server"`
    Database struct {
        Host     string `yaml:"host"`
        Port     int    `yaml:"port"`
        Username string `yaml:"username"`
    } `yaml:"database"`
}

func main() {
    config := Config{}
    config.Server.Host = "localhost"
    config.Server.Port = 8080
    config.Database.Host = "db.example.com"
    config.Database.Port = 5432
    config.Database.Username = "admin"

    // YAML encoding
    yamlCodec := encoding.GetCodec("yaml")
    
    data, err := yamlCodec.Marshal(config)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("YAML:\n%s\n", string(data))

    // YAML decoding
    var decoded Config
    if err := yamlCodec.Unmarshal(data, &decoded); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Decoded: %+v\n", decoded)
}
```

## Form Encoding

```go
package main

import (
    "fmt"
    "log"

    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/form"
)

type LoginForm struct {
    Username string `form:"username"`
    Password string `form:"password"`
    Remember bool   `form:"remember"`
}

func main() {
    form := LoginForm{
        Username: "john_doe",
        Password: "secret123",
        Remember: true,
    }

    // Form encoding
    formCodec := encoding.GetCodec("form")
    
    data, err := formCodec.Marshal(form)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Form data: %s\n", string(data))

    // Form decoding
    var decoded LoginForm
    if err := formCodec.Unmarshal(data, &decoded); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Decoded: %+v\n", decoded)
}
```

## Custom Codec Implementation

```go
package main

import (
    "encoding/csv"
    "bytes"
    "fmt"
    "reflect"
    "strconv"

    "github.com/crazyfrankie/frx/encoding"
)

// Custom CSV codec
type csvCodec struct{}

func (c csvCodec) Marshal(v any) ([]byte, error) {
    // Simple CSV marshaling implementation
    var buf bytes.Buffer
    writer := csv.NewWriter(&buf)
    
    // This is a simplified example
    // In practice, you'd need more sophisticated reflection
    rv := reflect.ValueOf(v)
    if rv.Kind() == reflect.Slice {
        for i := 0; i < rv.Len(); i++ {
            item := rv.Index(i)
            var record []string
            
            // Convert struct fields to strings
            for j := 0; j < item.NumField(); j++ {
                field := item.Field(j)
                record = append(record, fmt.Sprintf("%v", field.Interface()))
            }
            
            writer.Write(record)
        }
    }
    
    writer.Flush()
    return buf.Bytes(), writer.Error()
}

func (c csvCodec) Unmarshal(data []byte, v any) error {
    // CSV unmarshaling implementation
    reader := csv.NewReader(bytes.NewReader(data))
    records, err := reader.ReadAll()
    if err != nil {
        return err
    }
    
    // Simplified unmarshaling logic
    // In practice, you'd need proper reflection handling
    fmt.Printf("CSV records: %v\n", records)
    return nil
}

func (c csvCodec) Name() string {
    return "csv"
}

func main() {
    // Register custom codec
    encoding.RegisterCodec(csvCodec{})
    
    // Use custom codec
    csvCodec := encoding.GetCodec("csv")
    if csvCodec != nil {
        fmt.Println("CSV codec registered successfully")
    }
}
```

## Content-Type Based Codec Selection

```go
package main

import (
    "fmt"
    "net/http"

    "github.com/crazyfrankie/frx/encoding"
    _ "github.com/crazyfrankie/frx/encoding/json"
    _ "github.com/crazyfrankie/frx/encoding/xml"
)

func handleRequest(w http.ResponseWriter, r *http.Request) {
    contentType := r.Header.Get("Content-Type")
    
    var codecName string
    switch contentType {
    case "application/json":
        codecName = "json"
    case "application/xml", "text/xml":
        codecName = "xml"
    default:
        codecName = "json" // default
    }
    
    codec := encoding.GetCodec(codecName)
    if codec == nil {
        http.Error(w, "Unsupported content type", http.StatusBadRequest)
        return
    }
    
    // Use codec for request/response handling
    fmt.Printf("Using codec: %s\n", codec.Name())
}
```
