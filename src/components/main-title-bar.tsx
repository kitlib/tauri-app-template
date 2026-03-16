import { Moon, Sun, Info } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { createWindow } from "@/lib/window";
import { TitleBar } from "@/components/title-bar";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "react-i18next";

export function MainTitleBar() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleOpenAbout = async () => {
    const devUrl = import.meta.env.DEV ? "http://localhost:1420/about" : "/about";
    await createWindow("about", {
      title: t("about.title"),
      url: devUrl,
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
      title={t("app.title")}
      rightActions={
        <>
          <button
            onClick={handleOpenAbout}
            className="title-bar-btn mr-1"
            aria-label={t("about.button")}
          >
            <Info className="h-4 w-4" />
          </button>

          <LanguageToggle />

          <button
            onClick={handleToggleTheme}
            className="title-bar-btn mr-0.5"
            aria-label={t("theme.toggle")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </>
      }
    />
  );
}
