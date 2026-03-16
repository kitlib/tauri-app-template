# 自动更新配置

本指南说明如何为 Tauri 应用配置自动更新功能。

## 前置条件

1. 应用必须发布到 GitHub Releases
2. 需要生成签名密钥对以确保更新安全

## 步骤 1：生成签名密钥

运行以下命令生成密钥对：

```bash
pnpm tauri signer generate -w ~/.tauri/myapp.key
```

这将输出：
- **私钥**：保存到 `~/.tauri/myapp.key`（保密！）
- **公钥**：以 `dW50cnVzdGVkIGNvbW1lbnQ6...` 开头的字符串

## 步骤 2：配置 GitHub Secrets

在 GitHub 仓库中添加以下 Secrets（Settings → Secrets and variables → Actions）：

1. `TAURI_SIGNING_PRIVATE_KEY` - `~/.tauri/myapp.key` 的内容
2. `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` - 设置的密码（如果有）

## 步骤 3：更新 tauri.conf.json

替换 `src-tauri/tauri.conf.json` 中的占位符：

```json
{
  "plugins": {
    "updater": {
      "pubkey": "YOUR_PUBLIC_KEY_HERE",
      "endpoints": [
        "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/latest.json"
      ],
      "windows": {
        "installMode": "passive"
      }
    }
  }
}
```

替换：
- `YOUR_PUBLIC_KEY_HERE` 为步骤 1 中的公钥
- `YOUR_USERNAME/YOUR_REPO` 为你的 GitHub 用户名和仓库名

## 步骤 4：发布新版本

1. 更新 `src-tauri/tauri.conf.json` 中的版本号
2. 创建并推送标签：

```bash
git tag v0.1.0
git push origin v0.1.0
```

3. GitHub Actions 将自动构建并发布到 Releases

## 工作原理

### 更新检查流程

1. 应用启动时检查 `endpoints` 中的 `latest.json`
2. 比较远程版本与本地版本
3. 如果有新版本，下载更新文件
4. 使用公钥验证签名
5. 安装更新并重启应用

### 文件结构

GitHub Release 包含：
- `latest.json` - 更新元数据（版本、下载链接、签名）
- `*.nsis.zip` - Windows 安装包
- `*.nsis.zip.sig` - 安装包签名

### 安装模式

```json
{
  "windows": {
    "installMode": "passive"  // 静默安装，无需用户交互
  }
}
```

可选值：
- `passive` - 静默安装（推荐）
- `basicUi` - 显示基本 UI
- `quiet` - 完全静默

## 前端集成

### 检查更新

```typescript
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

async function checkForUpdates() {
  const update = await check();

  if (update?.available) {
    console.log(`发现新版本: ${update.version}`);
    console.log(`更新说明: ${update.body}`);

    // 下载并安装
    await update.downloadAndInstall();

    // 重启应用
    await relaunch();
  }
}
```

### 带进度的更新

```typescript
import { check } from "@tauri-apps/plugin-updater";

async function updateWithProgress() {
  const update = await check();

  if (update?.available) {
    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          console.log(`开始下载，总大小: ${event.data.contentLength} 字节`);
          break;
        case "Progress":
          console.log(`已下载: ${event.data.chunkLength} 字节`);
          break;
        case "Finished":
          console.log("下载完成");
          break;
      }
    });

    await relaunch();
  }
}
```

## 测试更新

### 本地测试

1. 构建应用：`pnpm tauri build`
2. 安装构建的应用
3. 修改版本号并重新构建
4. 手动创建 `latest.json` 并托管
5. 运行已安装的应用测试更新

### 生产测试

1. 发布 v0.1.0 版本
2. 安装 v0.1.0
3. 发布 v0.1.1 版本
4. 运行 v0.1.0 应用，验证自动更新

## 故障排查

### 更新检查失败

**问题**：无法连接到更新服务器

**解决方案**：
1. 检查 `endpoints` URL 是否正确
2. 确认 GitHub Release 已发布
3. 验证 `latest.json` 文件存在

### 签名验证失败

**问题**：`Invalid signature`

**解决方案**：
1. 确认 `pubkey` 与私钥匹配
2. 检查 GitHub Secrets 配置正确
3. 重新生成密钥对

### 安装失败

**问题**：下载完成但安装失败

**解决方案**：
1. 检查安装包完整性
2. 尝试不同的 `installMode`
3. 查看 Windows 事件日志

## 安全注意事项

1. **私钥保护**：
   - 永远不要提交私钥到代码仓库
   - 仅在 GitHub Secrets 中存储
   - 定期轮换密钥

2. **HTTPS 要求**：
   - 更新端点必须使用 HTTPS
   - 防止中间人攻击

3. **签名验证**：
   - 始终启用签名验证
   - 不要跳过验证步骤

## 高级配置

### 自定义更新对话框

```typescript
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";

async function customUpdateDialog() {
  const update = await check();

  if (update?.available) {
    const yes = await ask(
      `发现新版本 ${update.version}，是否立即更新？\n\n${update.body}`,
      {
        title: "更新可用",
        kind: "info",
      }
    );

    if (yes) {
      await update.downloadAndInstall();
      await relaunch();
    }
  }
}
```

### 定时检查更新

```typescript
import { check } from "@tauri-apps/plugin-updater";

// 每小时检查一次
setInterval(async () => {
  const update = await check();
  if (update?.available) {
    // 通知用户
  }
}, 60 * 60 * 1000);
```

## 参考资源

- [Tauri Updater 插件文档](https://v2.tauri.app/plugin/updater/)
- [GitHub Actions 工作流](./.github/workflows/release.yml)
- [Tauri 签名指南](https://v2.tauri.app/distribute/sign/)
