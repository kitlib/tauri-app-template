# Tauri App Template

[English](./README.md) | 简体中文

基于 Tauri v2 + React 19 + TypeScript + shadcn/ui 的桌面应用模板。

## 预览

![应用截图](./screenshots/app.png)

## 特点

- ✨ **现代化技术栈** - Tauri v2 + React 19 + TypeScript + Vite
- 🎨 **精美 UI 组件** - 集成 shadcn/ui 组件库和 Tailwind CSS v4
- 🌓 **暗色模式支持** - 内置亮色/暗色主题切换
- 🌍 **国际化支持** - 集成 i18next，支持中英文切换
- 🖼️ **自定义标题栏** - 无边框透明窗口，支持拖拽、最小化、最大化、关闭
- 🗂️ **多窗口管理** - 支持创建子窗口、窗口生命周期管理、延迟销毁机制
- 🔔 **系统托盘集成** - 支持托盘图标、菜单和窗口隐藏/显示
- 📦 **开箱即用** - 预配置 Prettier、TypeScript 严格模式
- 🚀 **快速开发** - Vite HMR + Tauri 热重载

## 技术栈

- **桌面框架**: [Tauri v2](https://tauri.app/)
- **前端框架**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vite.dev/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/)
- **样式方案**: [Tailwind CSS v4](https://tailwindcss.com/)
- **代码格式化**: [Prettier](https://prettier.io/)

## 开始使用

### 环境要求

- Node.js >= 18
- pnpm >= 9
- Rust >= 1.70

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm tauri dev
```

### 构建发布

```bash
pnpm tauri build
```

## 添加 shadcn/ui 组件

```bash
pnpm dlx shadcn@latest add <component-name>
```

示例：

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
```

## 代码格式化

```bash
pnpm format        # 格式化代码
pnpm format:check  # 检查代码格式
```

## 项目结构

```
.
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   │   └── ui/            # shadcn/ui 组件
│   ├── i18n/              # 国际化
│   │   ├── index.ts       # i18n 配置
│   │   └── locales/       # 翻译文件
│   ├── lib/               # 工具函数
│   ├── App.tsx            # 主应用组件
│   └── main.tsx           # 入口文件
├── src-tauri/             # Tauri/Rust 后端
│   ├── src/               # Rust 源码
│   └── tauri.conf.json    # Tauri 配置
├── docs/                  # 文档
│   ├── AUTO_UPDATE.md     # 自动更新指南
│   └── I18N.md            # 国际化指南
├── components.json        # shadcn/ui 配置
└── package.json
```

## CI/CD

本项目使用 GitHub Actions 实现自动化构建和发布。

### 自动化发布

工作流通过推送符合 `v*` 格式的标签触发（如 `v0.1.0`）。

**创建并推送标签：**
```bash
git tag v0.1.0
git push origin v0.1.0
```

### 构建产物

工作流会生成：
- **NSIS 安装包** - Windows 安装程序
- **更新文件** - `latest.json` 用于自动更新支持

### 自动更新配置

要启用自动更新功能，需要：

1. 生成签名密钥：`pnpm tauri signer generate -w ~/.tauri/myapp.key`
2. 将公钥添加到 `src-tauri/tauri.conf.json` 的 `plugins.updater.pubkey` 字段
3. 更新 `plugins.updater.endpoints` 中的 GitHub 仓库路径
4. 添加 GitHub Secrets：`TAURI_SIGNING_PRIVATE_KEY` 和 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

详细配置说明请查看 [自动更新配置文档](./docs/AUTO_UPDATE.md)。

### 代码签名（可选）

如需启用代码签名，在 GitHub 仓库设置中添加以下 Secrets：
- `TAURI_SIGNING_PRIVATE_KEY` - 私钥内容
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` - 私钥密码

不配置这些 Secrets 也能正常构建，只是安装包不会被签名。

### 多平台支持

如需启用 macOS 和 Linux 构建，取消 `.github/workflows/release.yml` 中对应平台配置的注释即可。

## IDE 推荐

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT
