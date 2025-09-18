---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
---

{{% pageinfo %}}
This is the complete documentation for frx, including detailed usage instructions and examples for all modules.
{{% /pageinfo %}}

## frx v0.0.5

**frx** is a collection of Go libraries designed to provide convenient wrappers for common development tasks. It contains non-business logic code, transport frameworks, and standard libraries for large-scale project development, as well as useful toolkits.

The project is organized into several modules, each focusing on a specific aspect of Go development:

- **ctxcache** - Context caching for HTTP requests
- **errorx** - Comprehensive error code management
- **httpx** - Enhanced HTTP client and server wrappers
- **idgen** - Distributed unique ID generation
- **logs** - Structured logging functionality
- **lang** - Go language extension utilities

## Installation

To use frx in your Go project, you can install individual modules or the entire package:

### Install the entire package

```bash
go get github.com/crazyfrankie/frx@latest
```