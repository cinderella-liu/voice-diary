#!/bin/bash
# 语音记事本 - 一键构建脚本
# 用法: ./build.sh        # 构建 Android APK
#       ./build.sh dev    # 启动开发服务器

set -e

cd "$(dirname "$0")"

case "${1:-dev}" in
  dev)
    echo "🚀 启动开发服务器..."
    npx expo start
    ;;
  apk)
    echo "📦 构建 Android APK..."
    npx expo run:android --variant release
    ;;
  build)
    echo "📦 EAS Build (云构建)..."
    npx eas build --platform android --profile production
    ;;
  clean)
    echo "🧹 清理..."
    rm -rf node_modules .expo
    npm install
    ;;
  check)
    echo "🔍 类型检查..."
    npx tsc --noEmit
    echo "✅ 类型检查通过"
    ;;
  *)
    echo "用法: ./build.sh [dev|apk|build|clean|check]"
    echo "  dev   - 启动开发服务器 (默认)"
    echo "  apk   - 本地构建 APK"
    echo "  build - EAS 云构建"
    echo "  clean - 清理重装"
    echo "  check - TypeScript 类型检查"
    ;;
esac
