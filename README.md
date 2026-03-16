# Tauri App Template

English | [简体中文](./README.zh-CN.md)

A modern desktop application template built with Tauri v2 + React 19 + TypeScript + shadcn/ui.

## Preview

![App Screenshot](./screenshots/app.png)

## Features

- ✨ **Modern Tech Stack** - Tauri v2 + React 19 + TypeScript + Vite
- 🎨 **Beautiful UI Components** - Integrated shadcn/ui component library and Tailwind CSS v4
- 🌓 **Dark Mode Support** - Built-in light/dark theme toggle
- 🖼️ **Custom Titlebar** - Frameless transparent window with drag, minimize, maximize, and close support
- 🗂️ **Multi-Window Management** - Support for child windows, window lifecycle management, and delayed destruction
- 🔔 **System Tray Integration** - Tray icon, menu, and window show/hide support
- 📦 **Ready to Use** - Pre-configured with Prettier and TypeScript strict mode
- 🚀 **Fast Development** - Vite HMR + Tauri hot reload

## Tech Stack

- **Desktop Framework**: [Tauri v2](https://tauri.app/)
- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Code Formatting**: [Prettier](https://prettier.io/)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- Rust >= 1.70

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm tauri dev
```

### Build for Production

```bash
pnpm tauri build
```

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

Examples:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
```

## Code Formatting

```bash
pnpm format        # Format code
pnpm format:check  # Check code formatting
```

## Project Structure

```
.
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── src-tauri/             # Tauri/Rust backend
│   ├── src/               # Rust source code
│   └── tauri.conf.json    # Tauri configuration
├── components.json        # shadcn/ui configuration
└── package.json
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT