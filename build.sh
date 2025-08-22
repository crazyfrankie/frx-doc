#!/bin/bash

# 设置错误时退出
set -e

echo "Starting build process..."

# 安装 Go
echo "Installing Go..."
curl -L https://go.dev/dl/go1.24.4.linux-amd64.tar.gz | tar -xz
export PATH=$PWD/go/bin:$PATH
export GOROOT=$PWD/go
export GOPATH=$PWD/gopath

# 验证 Go 安装
go version

# 初始化和更新 git submodules
echo "Updating git submodules..."
git submodule update --init --recursive

# 下载 Go 模块
echo "Downloading Go modules..."
go mod download

# 构建 Hugo 站点
echo "Building Hugo site..."
hugo --gc --minify -D

echo "Build completed successfully!"
