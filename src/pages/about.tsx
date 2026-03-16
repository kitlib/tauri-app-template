import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Github } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { TitleBar } from "@/components/title-bar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { destroyWindow } from "@/lib/window";

export function AboutPage() {
  const [isMaximized, setIsMaximized] = useState(false);

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

    return () => {
      unlistenResize.then((fn) => fn());
      unlistenClose.then((fn) => fn());
    };
  }, []);

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
          title="About"
          showMinimize={false}
          showMaximize={false}
        />

        {/* Content area */}}
        <main className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Tauri App Template</CardTitle>
              <CardDescription>Modern Desktop Application Template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
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

              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Built with Tauri v2 + React 19 + TypeScript + shadcn/ui
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleOpenGithub} className="flex-1" variant="outline">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button onClick={handleClose} className="flex-1" variant="outline">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ThemeProvider>
  );
}
