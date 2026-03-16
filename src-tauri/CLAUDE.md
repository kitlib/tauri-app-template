[Root](../CLAUDE.md) > **src-tauri**

# Backend Module (src-tauri)

## Responsibilities

System-level calls, native features, and cross-platform desktop app wrapper. Built with Tauri v2 + Rust for secure, high-performance desktop applications.

## Entry Points

- **Entry**: `src/main.rs`
- **App Logic**: `src/lib.rs`
- **Build Config**: `Cargo.toml`

```bash
pnpm tauri dev   # Development build
pnpm tauri build # Production build
```

## Commands

| Command | Parameters | Returns | Description |
|---------|------------|---------|-------------|
| `greet` | `name: &str` | `String` | Example greeting command |

### Define Command

```rust
// src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

### Call from Frontend

```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("greet", { name: "World" });
// Returns: "Hello, World! You've been greeted from Rust!"
```

### Register Command

```rust
// src/lib.rs
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| tauri | 2 | Tauri framework core |
| tauri-plugin-opener | 2 | Open external links |
| serde | 1 | Serialization framework |
| serde_json | 1 | JSON serialization |
| tauri-build | 2 | Build scripts (dev) |

## Configuration

### tauri.conf.json

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
  }
}
```

### capabilities/default.json

```json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": ["core:default", "opener:default"]
}
```

## Testing

```bash
cd src-tauri
cargo test
```

## Common Tasks

### Add New Command

1. Define in `src/lib.rs`:
```rust
#[tauri::command]
fn my_command(arg: &str) -> String {
    format!("Result: {}", arg)
}
```

2. Register:
```rust
.invoke_handler(tauri::generate_handler![greet, my_command])
```

### Add Plugin

1. Add to `Cargo.toml`:
```toml
[dependencies]
tauri-plugin-clipboard = "2"
```

2. Initialize:
```rust
.plugin(tauri_plugin_clipboard::init())
```

3. Update `capabilities/default.json`

### Configure App Icons

Icons in `icons/` directory:
- `icon.png` - Base icon
- `icon.ico` - Windows
- `icon.icns` - macOS
- Various PNG sizes for different platforms

## File Structure

```
src-tauri/
├── Cargo.toml           # Rust dependencies
├── tauri.conf.json      # Tauri app config
├── build.rs             # Build script
├── src/
│   ├── main.rs          # Entry point
│   └── lib.rs           # App logic & commands
├── capabilities/
│   └── default.json     # Permissions
└── icons/               # App icons
```
