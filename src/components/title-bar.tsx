import { useEffect, useState, ReactNode } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Minus, Maximize2, Minimize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TitleBarProps {
  title?: string;
  showMinimize?: boolean;
  showMaximize?: boolean;
  showClose?: boolean;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  onDoubleClick?: () => void;
}

export function TitleBar({
  title,
  showMinimize = true,
  showMaximize = true,
  showClose = true,
  leftActions,
  rightActions,
  onDoubleClick,
}: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!showMaximize) return;

    const appWindow = getCurrentWebviewWindow();

    // Initialize maximized state
    appWindow.isMaximized().then(setIsMaximized);

    // Listen for window resize events
    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [showMaximize]);

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

  const handleDragRegionDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick();
    } else if (showMaximize) {
      handleToggleMaximize();
    }
  };

  return (
    <div
      className={cn(
        "h-8 flex items-center justify-between select-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40",
        showMaximize && isMaximized ? "" : "rounded-t-lg"
      )}
    >
      {/* Left: Title + Drag region */}
      <div
        data-tauri-drag-region
        onDoubleClick={handleDragRegionDoubleClick}
        className="flex-grow flex items-center pl-2 gap-2"
      >
        {title && <span className="text-sm font-medium text-muted-foreground">{title}</span>}
        {leftActions}
      </div>

      {/* Right: Control buttons */}
      <div className="flex items-center">
        {rightActions}

        {(rightActions && (showMinimize || showMaximize || showClose)) && (
          <div className="h-4 w-px bg-border/40 mx-1" />
        )}

        {showMinimize && (
          <button
            onClick={handleMinimize}
            className="title-bar-control"
            aria-label="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
        )}

        {showMaximize && (
          <button
            onClick={handleToggleMaximize}
            className="title-bar-control"
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        )}

        {showClose && (
          <button
            onClick={handleClose}
            className="title-bar-control hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
