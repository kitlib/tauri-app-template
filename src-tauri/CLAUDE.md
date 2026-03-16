[根目录](../CLAUDE.md) > **src-tauri**

# 后端模块 (src-tauri)

## 模块职责

负责系统级调用、原生功能集成和跨平台桌面应用封装。基于 Tauri v2 + Rust 构建安全、高性能的桌面应用后端。

## 入口与启动

- **入口文件**: `src/main.rs`
- **应用逻辑**: `src/lib.rs`
- **构建配置**: `Cargo.toml`

构建命令：
```bash
pnpm tauri dev   # 开发模式构建
pnpm tauri build # 生产版本构建
```

## 对外接口

### Tauri 命令

| 命令名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `greet` | `name: &str` | `String` | 示例命令，返回问候语 |

### 命令定义示例

```rust
// src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

### 前端调用示例

```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("greet", { name: "World" });
console.log(result); // "Hello, World! You've been greeted from Rust!"
```

### 注册命令

```rust
// src/lib.rs
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])  // 注册命令
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 关键依赖与配置

### Cargo 依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| tauri | 2 | Tauri 框架核心 |
| tauri-plugin-opener | 2 | 外部链接打开插件 |
| serde | 1 | 序列化框架 |
| serde_json | 1 | JSON 序列化 |

### 构建依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| tauri-build | 2 | Tauri 构建脚本 |

### 配置文件

#### tauri.conf.json

```json
{
  "productName": "tauri-app-template",
  "version": "0.1.0",
  "identifier": "com.template.tauri-app",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "tauri-app-template",
        "width": 800,
        "height": 600
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": "all"
  }
}
```

#### capabilities/default.json

```json
{
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default"
  ]
}
```

### 库配置

```toml
# Cargo.toml
[lib]
name = "tauri_app_template_lib"
crate-type = ["staticlib", "cdylib", "rlib"]
```

## 数据模型

当前为模板项目，无持久化数据模型。

## 测试与质量

### 运行测试

```bash
cd src-tauri
cargo test
```

### Rust 编码规范

- 遵循 Rust 标准命名规范
- 使用 `#[tauri::command]` 宏暴露命令
- Windows 发布版不显示控制台窗口

### Windows 配置

```rust
// src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
```

## 常见问题 (FAQ)

### 如何添加新的 Tauri 命令？

1. 在 `src/lib.rs` 中定义命令：
```rust
#[tauri::command]
fn my_command(arg: &str) -> String {
    format!("Result: {}", arg)
}
```

2. 注册命令：
```rust
.invoke_handler(tauri::generate_handler![greet, my_command])
```

### 如何添加新插件？

1. 添加依赖到 `Cargo.toml`：
```toml
[dependencies]
tauri-plugin-clipboard = "2"
```

2. 初始化插件：
```rust
.plugin(tauri_plugin_clipboard::init())
```

3. 更新权限配置 `capabilities/default.json`

### 如何配置应用图标？

图标位于 `icons/` 目录：
- `icon.png` - 基础图标
- `icon.ico` - Windows 图标
- `icon.icns` - macOS 图标
- 各尺寸 PNG 文件用于不同平台

## 相关文件清单

```
src-tauri/
├── Cargo.toml           # Rust 依赖配置
├── tauri.conf.json      # Tauri 应用配置
├── build.rs             # Rust 构建脚本
├── .gitignore           # Git 忽略配置
├── src/
│   ├── main.rs          # Rust 入口
│   └── lib.rs           # Tauri 应用逻辑和命令定义
├── capabilities/
│   └── default.json     # 权限配置
└── icons/               # 应用图标
    ├── icon.png         # 基础图标
    ├── icon.ico         # Windows 图标
    ├── icon.icns        # macOS 图标
    ├── 32x32.png
    ├── 128x128.png
    ├── 128x128@2x.png
    └── ... (其他尺寸)
```

## 变更记录 (Changelog)

| 日期 | 变更内容 |
|------|----------|
| 2026-03-16 | 初始化模块文档 |