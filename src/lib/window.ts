import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit, once } from "@tauri-apps/api/event";

const createWindowLoading: Record<string, boolean> = {};
const destroyTimers: Record<string, number> = {};

export async function showWindow(label: string) {
  const window = await WebviewWindow.getByLabel(label);
  if (!window) {
    return;
  }

  // Clear destroy timer
  if (destroyTimers[label]) {
    clearTimeout(destroyTimers[label]);
    delete destroyTimers[label];
    console.log("Cleared window destroy timer:", label);
  }

  if (!(await window.isVisible())) {
    await window.show();
  }
  if (await window.isMinimized()) {
    await window.unminimize();
  }
  if (!(await window.isFocused())) {
    await window.setFocus();
  }
}

export async function hideWindow(label: string, destroyDelay = 5000) {
  const window = await WebviewWindow.getByLabel(label);
  if (!window) {
    return;
  }

  await window.hide();

  // Destroy after hiding with delay
  await destroyWindow(label, destroyDelay);
}

/**
 * Calculate centered position of child window relative to parent window
 * @param width Child window width (logical pixels)
 * @param height Child window height (logical pixels)
 * @param parentLabel Parent window label, defaults to current window
 * @returns Centered position coordinates or center flag
 */
export async function calcCenterPosition(
  width: number,
  height: number,
  parentLabel?: string
) {
  const parentWindow = parentLabel
    ? await WebviewWindow.getByLabel(parentLabel)
    : WebviewWindow.getCurrent();

  if (!parentWindow) {
    return { center: true };
  }

  try {
    // Use screen center if parent window is minimized
    if (await parentWindow.isMinimized()) {
      return { center: true };
    }

    const position = await parentWindow.outerPosition();
    const size = await parentWindow.outerSize();
    const scaleFactor = await parentWindow.scaleFactor();

    // Validate all values exist
    if (!position || !size || !scaleFactor) {
      console.warn("Unable to get parent window info, using screen center");
      return { center: true };
    }

    // Calculate centered position (considering DPI scaling)
    const x = (position.x + (size.width - width * scaleFactor) / 2) / scaleFactor;
    const y = (position.y + (size.height - height * scaleFactor) / 2) / scaleFactor;

    // Validate calculation result
    if (isNaN(x) || isNaN(y)) {
      console.warn("Position calculation failed, using screen center");
      return { center: true };
    }

    return { x, y };
  } catch (e) {
    console.warn("Failed to calculate centered position:", e);
    return { center: true };
  }
}

export async function destroyWindow(label: string, delay = 0) {
  const window = await WebviewWindow.getByLabel(label);
  if (!window) {
    return;
  }

  if (!delay) {
    // Destroy immediately
    await emit("destroy-window:" + label);
    await window.destroy();
  } else {
    // Destroy with delay
    if (destroyTimers[label]) {
      clearTimeout(destroyTimers[label]);
    }
    await window.hide();
    destroyTimers[label] = setTimeout(async () => {
      await emit("destroy-window:" + label);
      await window.destroy();
      delete destroyTimers[label];
    }, delay) as unknown as number;
    console.log(`Window will be destroyed in ${delay}ms:`, label);
  }
}

export async function createWindow(
  label: string,
  options: {
    title?: string;
    url?: string;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    resizable?: boolean;
    maximizable?: boolean;
    minimizable?: boolean;
    closable?: boolean;
    center?: boolean;
    x?: number;
    y?: number;
    decorations?: boolean;
    transparent?: boolean;
    alwaysOnTop?: boolean;
    skipTaskbar?: boolean;
    shadow?: boolean;
    parent?: string;
  },
  handlers?: {
    onCreated?: () => void;
    onDestroy?: () => void;
    onError?: () => void;
  }
) {
  if (createWindowLoading[label]) {
    return;
  }
  createWindowLoading[label] = true;

  // Clear destroy timer
  if (destroyTimers[label]) {
    clearTimeout(destroyTimers[label]);
    delete destroyTimers[label];
  }

  try {
    let window = await WebviewWindow.getByLabel(label);

    // If window already exists, show it directly and center it
    if (window) {
      console.log("Window already exists, showing:", label);

      // If parent window is specified, recalculate centered position
      if (options.parent) {
        try {
          const childWidth = options.width || 500;
          const childHeight = options.height || 400;
          const centerPos = await calcCenterPosition(
            childWidth,
            childHeight,
            options.parent
          );

          if ("x" in centerPos && "y" in centerPos) {
            // Use Logical type to set window position
            await window.setPosition({
              type: "Logical",
              x: centerPos.x,
              y: centerPos.y,
            });
            console.log("Window centered:", centerPos);
          }
        } catch (e) {
          console.log("Failed to set window position:", e);
        }
      }

      // Show window after setting position
      await showWindow(label);
      createWindowLoading[label] = false;
      return;
    }

    // If need to center relative to parent window, calculate position
    let finalOptions = { ...options };
    if (options.parent && !options.x && !options.y) {
      const childWidth = options.width || 500;
      const childHeight = options.height || 400;

      const centerPos = await calcCenterPosition(
        childWidth,
        childHeight,
        options.parent
      );

      if ("center" in centerPos) {
        finalOptions.center = true;
      } else {
        finalOptions.x = centerPos.x;
        finalOptions.y = centerPos.y;
        finalOptions.center = false;
      }
    }

    const webview = new WebviewWindow(label, finalOptions);
    await webview.once("tauri://created", async () => {
      console.log("Window created successfully:", label);
      handlers?.onCreated?.();

      // Register destroy callback
      if (handlers?.onDestroy) {
        await once("destroy-window:" + label, () => {
          console.log("Window destroyed:", label);
          handlers.onDestroy?.();
        });
      }
    });
    await webview.once("tauri://error", (e) => {
      console.log("Failed to create window:", label, e);
      handlers?.onError?.();
    });
  } finally {
    createWindowLoading[label] = false;
  }
}
