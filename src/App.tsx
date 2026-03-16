import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { MainTitleBar } from "@/components/main-title-bar";
import { UpdaterDialog } from "@/components/updater-dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const appWindow = getCurrentWebviewWindow();

    appWindow.isMaximized().then(setIsMaximized);

    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    // Listen for language change events from other windows
    const unlistenLanguage = listen<{ language: string }>("language-changed", (event) => {
      console.log("Language changed event received:", event.payload.language);
      i18n.changeLanguage(event.payload.language);
    });

    // Initialize tray menu with current language
    const initTrayMenu = async () => {
      try {
        await invoke("update_tray_menu", {
          showText: t("tray.show"),
          quitText: t("tray.quit"),
        });
      } catch (error) {
        console.error("Failed to initialize tray menu:", error);
      }
    };
    initTrayMenu();

    return () => {
      unlisten.then((fn) => fn());
      unlistenLanguage.then((fn) => fn());
    };
  }, [i18n, t]);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="tauri-ui-theme">
      <UpdaterDialog />
      <div
        className={cn(
          "bg-background flex h-screen w-screen flex-col overflow-hidden",
          isMaximized ? "" : "border-border rounded-lg border"
        )}
      >
        <MainTitleBar />

        <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden p-8">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{t("app.welcome")}</h1>
            <p className="text-muted-foreground">{t("app.description")}</p>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="https://vite.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <img src="/vite.svg" className="h-24 w-24" alt="Vite logo" />
            </a>
            <a
              href="https://tauri.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <img src="/tauri.svg" className="h-24 w-24" alt="Tauri logo" />
            </a>
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <img src={reactLogo} className="h-24 w-24" alt="React logo" />
            </a>
          </div>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t("greet.title")}</CardTitle>
              <CardDescription>{t("greet.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  greet();
                }}
              >
                <Input
                  id="greet-input"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder={t("greet.placeholder")}
                  className="flex-1"
                />
                <Button type="submit">{t("greet.button")}</Button>
              </form>
              {greetMsg && <p className="bg-muted mt-4 rounded-md p-3 text-sm">{greetMsg}</p>}
            </CardContent>
          </Card>

          <div className="text-muted-foreground flex flex-wrap justify-center gap-4 text-sm">
            <span>React 19</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS v4</span>
            <span>•</span>
            <span>shadcn/ui</span>
            <span>•</span>
            <span>Tauri v2</span>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
