# 国际化功能实现说明

## 已完成的功能

### 1. 安装依赖
- `i18next` - 国际化核心库
- `react-i18next` - React 集成
- `i18next-browser-languagedetector` - 自动语言检测

### 2. 创建的文件

#### 配置文件
- `src/i18n/index.ts` - i18n 配置入口
- `src/i18n/locales/en.json` - 英文翻译
- `src/i18n/locales/zh.json` - 中文翻译

#### 组件
- `src/components/language-toggle.tsx` - 语言切换按钮组件

### 3. 修改的文件
- `src/main.tsx` - 导入 i18n 配置
- `src/App.tsx` - 应用主页面国际化
- `src/pages/about.tsx` - 关于页面国际化
- `src/components/main-title-bar.tsx` - 标题栏集成语言切换按钮

## 功能特性

### 语言切换按钮
- 位置：标题栏右侧，About 按钮左侧
- 图标：Languages (地球图标)
- 功能：点击在中英文之间切换
- 提示：鼠标悬停显示切换提示

### 支持的语言
- 英文 (en)
- 中文简体 (zh)

### 自动检测
- 首次访问自动检测浏览器语言
- 语言选择保存在 localStorage
- 下次访问自动加载上次选择的语言

## 使用方法

### 开发模式
```bash
pnpm tauri dev
```

### 测试功能
1. 启动应用后，点击标题栏的语言切换按钮（地球图标）
2. 观察界面文字在中英文之间切换
3. 打开 About 窗口，验证 About 页面也支持国际化
4. 重启应用，验证语言选择被保存

## 翻译内容

### 主页面
- 欢迎标题
- 应用描述
- 问候卡片（标题、描述、输入框占位符、按钮）

### 标题栏
- 应用标题
- About 按钮提示
- 主题切换提示
- 语言切换提示

### About 页面
- 窗口标题
- 应用名称
- 版本信息
- 应用描述
- 关闭按钮

## 扩展方法

### 添加新语言
1. 在 `src/i18n/locales/` 创建新的语言文件（如 `ja.json`）
2. 在 `src/i18n/index.ts` 中导入并注册
3. 修改 `language-toggle.tsx` 支持多语言切换

### 添加新翻译
在对应的语言文件中添加新的键值对，然后在组件中使用 `t("key")` 调用。
