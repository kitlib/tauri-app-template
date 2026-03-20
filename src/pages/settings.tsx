import { useCallback, useEffect, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { listen, emit } from "@tauri-apps/api/event";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { TitleBar } from "@/components/title-bar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ShortcutInput } from "@/components/shortcut-input";
import { Moon, Sun, Monitor, Palette, Keyboard } from "lucide-react";
import { registerShortcut, unregisterShortcut } from "@/lib/shortcut";
import { toggleWindow } from "@/lib/window";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const SHORTCUT_KEY = "global-shortcut-show-main";

type SettingSection = "appearance" | "shortcut";

function SettingsContent() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [shortcut, setShortcut] = useState<string>("");
  const [activeSection, setActiveSection] = useState<SettingSection>("appearance");
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const handleShowMainWindow = useCallback(async () => {
    await toggleWindow("main");
  }, []);

  useEffect(() => {
    const appWindow = getCurrentWebviewWindow();

    appWindow.isMaximized().then(setIsMaximized);

    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    // Load saved shortcut
    const savedShortcut = localStorage.getItem(SHORTCUT_KEY);
    if (savedShortcut) {
      setShortcut(savedShortcut);
      registerShortcut(savedShortcut, handleShowMainWindow);
    }

    // Listen for language change events
    const unlistenLanguage = listen<{ language: string }>("language-changed", (event) => {
      i18n.changeLanguage(event.payload.language);
    });

    return () => {
      unlisten.then((fn) => fn());
      unlistenLanguage.then((fn) => fn());
    };
  }, [handleShowMainWindow, i18n]);

  const handleShortcutChange = async (newShortcut: string) => {
    const oldShortcut = shortcut;
    setShortcut(newShortcut);

    if (newShortcut) {
      localStorage.setItem(SHORTCUT_KEY, newShortcut);
      await registerShortcut(newShortcut, handleShowMainWindow, oldShortcut);
      // Notify main window to update shortcut
      await emit("shortcut-changed", { shortcut: newShortcut });
      toast.success(t("settings.shortcut.setSuccess", { shortcut: newShortcut }));
    } else {
      localStorage.removeItem(SHORTCUT_KEY);
      if (oldShortcut) {
        await unregisterShortcut(oldShortcut);
      }
      // Notify main window to clear shortcut
      await emit("shortcut-changed", { shortcut: "" });
      toast.info(t("settings.shortcut.cleared"));
    }
  };

  const menuItems = [
    {
      id: "appearance" as SettingSection,
      label: t("settings.appearance.title"),
      icon: Palette,
    },
    {
      id: "shortcut" as SettingSection,
      label: t("settings.shortcut.title"),
      icon: Keyboard,
    },
  ];

  return (
    <div
      className={cn(
        "bg-background flex h-screen w-screen flex-col overflow-hidden",
        isMaximized ? "" : "border-border rounded-lg border"
      )}
    >
      <TitleBar title={t("settings.title")} showMaximize={false} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar menu */}
        <aside className="border-border flex w-40 flex-col border-r p-4">
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    activeSection === item.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl p-4">
            {activeSection === "appearance" && (
              <div className="space-y-4">
                <div>
                  <h2 className="mb-1 text-lg font-semibold">{t("settings.appearance.title")}</h2>
                  <p className="text-muted-foreground text-sm">
                    {t("settings.appearance.description")}
                  </p>
                </div>

                <div className="space-y-0">
                  <div className="flex items-center justify-between py-2.5">
                    <label className="text-sm font-medium">{t("settings.appearance.theme")}</label>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="flex items-center gap-1.5"
                      >
                        <Sun className="h-3.5 w-3.5" />
                        {t("settings.appearance.light")}
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="flex items-center gap-1.5"
                      >
                        <Moon className="h-3.5 w-3.5" />
                        {t("settings.appearance.dark")}
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("system")}
                        className="flex items-center gap-1.5"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        {t("settings.appearance.system")}
                      </Button>
                    </div>
                  </div>

                  <div className="border-t" />

                  <div className="flex items-center justify-between py-2.5">
                    <label className="text-sm font-medium">
                      {t("settings.appearance.language")}
                    </label>
                    <LanguageToggle />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "shortcut" && (
              <div className="space-y-4">
                <div>
                  <h2 className="mb-1 text-lg font-semibold">{t("settings.shortcut.title")}</h2>
                  <p className="text-muted-foreground text-sm">
                    {t("settings.shortcut.description")}
                  </p>
                </div>

                <div className="space-y-0">
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex-1">
                      <label className="text-sm font-medium">
                        {t("settings.shortcut.showMain")}
                      </label>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {t("settings.shortcut.showMainDesc")}
                      </p>
                    </div>
                    <ShortcutInput value={shortcut} onChange={handleShortcutChange} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="tauri-ui-theme">
      <Toaster />
      <SettingsContent />
    </ThemeProvider>
  );
}
