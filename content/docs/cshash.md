---
title: "cshash（consistent hashing）"
linkTitle: "cshash"
weight: 15
description: >
  Thread-safe consistent hashing implementation with virtual nodes support, ideal for distributed systems and load balancing scenarios.
---

The cshash module provides a thread-safe consistent hashing implementation with virtual nodes support, ideal for distributed systems and load balancing scenarios.

## Features

- **Thread-safe operations** using read-write mutex for concurrent access
- **Virtual nodes support** for better load distribution
- **Custom hash functions** with default FNV-1a implementation
- **Dynamic node management** with batch update operations
- **Efficient key lookup** using binary search on sorted hash ring

## Basic Usage

```go
package main

import (
    "fmt"
    "hash/fnv"
    
    "github.com/crazyfrankie/frx/cshash"
)

func main() {
    // Create a new consistent hash map with 3 virtual nodes per physical node
    hashMap := cshash.NewMap(3, nil) // nil uses default FNV-1a hash function
    
    // Add initial nodes
    nodes := []string{"server1", "server2", "server3"}
    hashMap.Update(nil, nodes)
    
    // Get node for a key
    node := hashMap.Get("user123")
    fmt.Printf("Key 'user123' maps to: %s\n", node)
    
    node = hashMap.Get("session456")
    fmt.Printf("Key 'session456' maps to: %s\n", node)
}
```

## Custom Hash Function

```go
// Using a custom hash function
func customHash(data []byte) uint64 {
    h := fnv.New64()
    h.Write(data)
    return h.Sum64()
}

func main() {
    // Create hash map with custom hash function
    hashMap := cshash.NewMap(5, customHash)
    
    // Add nodes
    hashMap.Update(nil, []string{"node1", "node2", "node3"})
    
    // Test key distribution
    keys := []string{"key1", "key2", "key3", "key4", "key5"}
    for _, key := range keys {
        node := hashMap.Get(key)
        fmt.Printf("Key '%s' -> Node '%s'\n", key, node)
    }
}
```

## Dynamic Node Management

```go
func main() {
    hashMap := cshash.NewMap(3, nil)
    
    // Initial setup
    initialNodes := []string{"server1", "server2", "server3"}
    hashMap.Update(nil, initialNodes)
    
    fmt.Println("Initial mapping:")
    testKey := "user123"
    fmt.Printf("Key '%s' -> %s\n", testKey, hashMap.Get(testKey))
    
    // Add new nodes and remove old ones
    toRemove := []string{"server1"}
    toAdd := []string{"server4", "server5"}
    
    hashMap.Update(toRemove, toAdd)
    
    fmt.Println("After update:")
    fmt.Printf("Key '%s' -> %s\n", testKey, hashMap.Get(testKey))
    
    // Add more nodes
    hashMap.Update(nil, []string{"server6", "server7"})
    
    fmt.Println("After adding more nodes:")
    fmt.Printf("Key '%s' -> %s\n", testKey, hashMap.Get(testKey))
}
```

## Load Balancing Example

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
    
    "github.com/crazyfrankie/frx/cshash"
)

func main() {
    // Create hash map for load balancing
    hashMap := cshash.NewMap(10, nil) // More virtual nodes for better distribution
    
    // Available servers
    servers := []string{
        "web-server-1:8080",
        "web-server-2:8080", 
        "web-server-3:8080",
        "web-server-4:8080",
    }
    
    hashMap.Update(nil, servers)
    
    // Simulate client requests
    rand.Seed(time.Now().UnixNano())
    
    serverCounts := make(map[string]int)
    
    // Generate 1000 random client IDs and see distribution
    for i := 0; i < 1000; i++ {
        clientID := fmt.Sprintf("client_%d", rand.Intn(10000))
        server := hashMap.Get(clientID)
        serverCounts[server]++
    }
    
    fmt.Println("Request distribution:")
    for server, count := range serverCounts {
        fmt.Printf("%s: %d requests (%.1f%%)\n", 
            server, count, float64(count)/10.0)
    }
    
    // Simulate server failure and recovery
    fmt.Println("\nSimulating server failure...")
    hashMap.Update([]string{"web-server-2:8080"}, nil)
    
    // Test same keys after server removal
    fmt.Println("Key mapping after server failure:")
    testKeys := []string{"client_1234", "client_5678", "client_9999"}
    for _, key := range testKeys {
        server := hashMap.Get(key)
        fmt.Printf("Key '%s' -> %s\n", key, server)
    }
}
```

## Cache Sharding Example

```go
package main

import (
    "fmt"
    "strconv"
    
    "github.com/crazyfrankie/frx/cshash"
)

type CacheCluster struct {
    hashMap *cshash.HashMap
    caches  map[string]*Cache
}

type Cache struct {
    name string
    data map[string]interface{}
}

func NewCacheCluster(cacheNodes []string) *CacheCluster {
    cluster := &CacheCluster{
        hashMap: cshash.NewMap(5, nil),
        caches:  make(map[string]*Cache),
    }
    
    // Initialize cache instances
    for _, node := range cacheNodes {
        cluster.caches[node] = &Cache{
            name: node,
            data: make(map[string]interface{}),
        }
    }
    
    // Update hash map
    cluster.hashMap.Update(nil, cacheNodes)
    
    return cluster
}

func (cc *CacheCluster) Set(key string, value interface{}) {
    node := cc.hashMap.Get(key)
    if cache, exists := cc.caches[node]; exists {
        cache.data[key] = value
        fmt.Printf("Stored '%s' in cache '%s'\n", key, node)
    }
}

func (cc *CacheCluster) Get(key string) (interface{}, bool) {
    node := cc.hashMap.Get(key)
    if cache, exists := cc.caches[node]; exists {
        value, found := cache.data[key]
        return value, found
    }
    return nil, false
}

func main() {
    // Create cache cluster
    cacheNodes := []string{"cache-1", "cache-2", "cache-3"}
    cluster := NewCacheCluster(cacheNodes)
    
    // Store some data
    for i := 0; i < 10; i++ {
        key := "key" + strconv.Itoa(i)
        value := "value" + strconv.Itoa(i)
        cluster.Set(key, value)
    }
    
    // Retrieve data
    fmt.Println("\nRetrieving data:")
    for i := 0; i < 10; i++ {
        key := "key" + strconv.Itoa(i)
        if value, found := cluster.Get(key); found {
            fmt.Printf("Found '%s' = '%s'\n", key, value)
        }
    }
}
```
