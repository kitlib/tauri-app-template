import { Button } from "@/components/ui/button";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Github } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { TitleBar } from "@/components/title-bar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { destroyWindow } from "@/lib/window";
import { useTranslation } from "react-i18next";
import { listen } from "@tauri-apps/api/event";
import "../i18n";

export function AboutPage() {
  const [isMaximized, setIsMaximized] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const appWindow = getCurrentWebviewWindow();

    appWindow.isMaximized().then(setIsMaximized);

    const unlistenResize = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    // Listen for window close request, destroy after 5 seconds delay
    const unlistenClose = appWindow.onCloseRequested(async (event) => {
      // Prevent default close behavior
      event.preventDefault();
      console.log("About window close requested, will destroy in 5 seconds");
      // Destroy after 5 seconds delay
      await destroyWindow(appWindow.label, 5000);
    });

    // Listen for language change events from other windows
    const unlistenLanguage = listen<{ language: string }>("language-changed", (event) => {
      console.log("Language changed event received:", event.payload.language);
      i18n.changeLanguage(event.payload.language);
    });

    return () => {
      unlistenResize.then((fn) => fn());
      unlistenClose.then((fn) => fn());
      unlistenLanguage.then((fn) => fn());
    };
  }, [i18n]);

  const handleClose = async () => {
    const appWindow = getCurrentWebviewWindow();
    // Destroy window after 5 seconds delay
    await destroyWindow(appWindow.label, 5000);
  };

  const handleOpenGithub = async () => {
    await openUrl("https://github.com/kitlib/tauri-app-template");
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="tauri-ui-theme">
      <div
        className={cn(
          "h-screen w-screen flex flex-col bg-background overflow-hidden",
          isMaximized ? "" : "rounded-md border border-border"
        )}
      >
        <TitleBar
          title={t("about.title")}
          showMinimize={false}
          showMaximize={false}
        />

        {/* Content area */}
        <main className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-xs space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">{t("about.appName")}</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("about.version")}</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tauri</span>
                <span className="font-medium">v2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">React</span>
                <span className="font-medium">19</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TypeScript</span>
                <span className="font-medium">5.8</span>
              </div>
            </div>

            <Button onClick={handleOpenGithub} className="w-full" variant="outline">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
