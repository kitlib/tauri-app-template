[根目录](../CLAUDE.md) > **src**

# 前端模块 (src)

## 模块职责

负责用户界面的渲染、交互和样式管理。基于 React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui 构建现代化组件库。

## 入口与启动

- **入口文件**: `main.tsx`
- **主组件**: `App.tsx`
- **构建工具**: Vite 7
- **开发端口**: 1420

启动命令：
```bash
pnpm dev        # 仅前端开发服务器
pnpm tauri dev  # 完整 Tauri 应用开发
```

## 对外接口

### 页面组件

| 文件 | 说明 |
|------|------|
| `App.tsx` | 主应用组件，包含 Tauri 命令调用示例 |

### UI 组件

| 组件 | 路径 | 说明 |
|------|------|------|
| Button | `components/ui/button.tsx` | shadcn/ui 按钮组件，支持多种变体 |

### Tauri API 调用

```typescript
// 调用 Rust 后端命令示例
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("greet", { name: "World" });
// 返回: "Hello, World! You've been greeted from Rust!"
```

## 关键依赖与配置

### 生产依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^19.1.0 | UI 框架 |
| react-dom | ^19.1.0 | React DOM 渲染 |
| @tauri-apps/api | ^2 | Tauri 前端 API |
| @tauri-apps/plugin-opener | ^2 | 外部链接打开插件 |
| tailwindcss | ^4.2.1 | CSS 框架 |
| @tailwindcss/vite | ^4.2.1 | Vite 集成 |
| class-variance-authority | ^0.7.1 | CSS 变体管理 |
| clsx | ^2.1.1 | 类名合并工具 |
| tailwind-merge | ^3.5.0 | Tailwind 类名合并 |
| lucide-react | ^0.577.0 | 图标库 |
| radix-ui | ^1.4.3 | 无样式 UI 原语 |

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| typescript | ~5.8.3 | TypeScript 编译 |
| vite | ^7.0.4 | 构建工具 |
| @vitejs/plugin-react | ^4.6.0 | React 插件 |
| prettier | ^3.8.1 | 代码格式化 |
| prettier-plugin-tailwindcss | ^0.7.2 | Tailwind 类名排序 |

### 配置文件

- `../tsconfig.json` - TypeScript 严格模式配置
- `../vite.config.ts` - Vite 构建配置，包含路径别名 `@/`
- `../components.json` - shadcn/ui 组件配置

### 路径别名

```typescript
// tsconfig.json 中配置
"@/*": ["./src/*"]

// 使用示例
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## 数据模型

当前为模板项目，无持久化数据模型。

## 测试与质量

### 代码格式化

```bash
pnpm format        # 格式化代码
pnpm format:check  # 检查格式
```

### Prettier 配置

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### TypeScript 配置

- 严格模式启用
- 未使用变量检查
- 未使用参数检查

## 常见问题 (FAQ)

### 如何添加 shadcn/ui 组件？

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
```

### 如何调用 Tauri 后端？

```typescript
import { invoke } from "@tauri-apps/api/core";

// 在 Rust 端定义命令
// #[tauri::command]
// fn my_command(arg: &str) -> String { ... }

// 在前端调用
const result = await invoke("my_command", { arg: "value" });
```

### 如何添加新页面？

当前为单页应用模板，建议：
1. 安装路由库：`pnpm add react-router-dom`
2. 创建 `src/pages/` 目录
3. 在 `App.tsx` 中配置路由

## 相关文件清单

```
src/
├── main.tsx          # 入口文件，挂载 React 应用
├── App.tsx           # 主应用组件
├── App.css           # 应用特定样式
├── index.css         # 全局样式 + Tailwind 主题变量
├── vite-env.d.ts     # Vite 类型声明
├── assets/
│   └── react.svg     # React logo 资源
├── components/
│   └── ui/
│       └── button.tsx # shadcn/ui Button 组件
└── lib/
    └── utils.ts      # 工具函数 (cn 类名合并)
```

## 变更记录 (Changelog)

| 日期 | 变更内容 |
|------|----------|
| 2026-03-16 | 初始化模块文档 |