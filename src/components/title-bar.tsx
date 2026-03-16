import { useEffect, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Minus, Maximize2, Minimize2, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const appWindow = getCurrentWebviewWindow();

    // 初始化最大化状态
    appWindow.isMaximized().then(setIsMaximized);

    // 监听窗口尺寸变化
    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const handleMinimize = async () => {
    const appWindow = getCurrentWebviewWindow();
    await appWindow.minimize();
  };

  const handleToggleMaximize = async () => {
    const appWindow = getCurrentWebviewWindow();
    await appWindow.toggleMaximize();
  };

  const handleClose = async () => {
    const appWindow = getCurrentWebviewWindow();
    await appWindow.close();
  };

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-8 flex items-center justify-between select-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      {/* 左侧：应用标题 + 拖拽区域 */}
      <div
        data-tauri-drag-region
        onDoubleClick={handleToggleMaximize}
        className="flex-grow flex items-center pl-2"
      >
        <span className="text-sm font-medium">tauri-app-template</span>
      </div>

      {/* 右侧：控制按钮 */}
      <div className="flex items-center">
        <button
          onClick={handleToggleTheme}
          className="title-bar-btn mr-2"
          aria-label="切换主题"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <div className="h-4 w-px bg-border/40 mr-1" />

        <button
          onClick={handleMinimize}
          className="title-bar-control"
          aria-label="最小化"
        >
          <Minus className="h-4 w-4" />
        </button>

        <button
          onClick={handleToggleMaximize}
          className="title-bar-control"
          aria-label={isMaximized ? "还原" : "最大化"}
        >
          {isMaximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={handleClose}
          className="title-bar-control hover:bg-destructive hover:text-destructive-foreground"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
