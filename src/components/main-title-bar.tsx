import { Moon, Sun, Info } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { createWindow } from "@/lib/window";
import { TitleBar } from "@/components/title-bar";

export function MainTitleBar() {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleOpenAbout = async () => {
    await createWindow("about", {
      title: "About",
      url: "/about",
      width: 500,
      height: 400,
      resizable: false,
      maximizable: false,
      minimizable: false,
      decorations: false,
      transparent: true,
      shadow: false,
      alwaysOnTop: true,
      parent: "main",
    });
  };

  return (
    <TitleBar
      title="tauri-app-template"
      rightActions={
        <>
          <button
            onClick={handleOpenAbout}
            className="title-bar-btn mr-1"
            aria-label="About"
          >
            <Info className="h-4 w-4" />
          </button>

          <button
            onClick={handleToggleTheme}
            className="title-bar-btn mr-0.5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </>
      }
    />
  );
}
