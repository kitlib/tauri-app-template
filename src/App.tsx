import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { TitleBar } from "@/components/title-bar";
import { cn } from "@/lib/utils";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWebviewWindow();

    appWindow.isMaximized().then(setIsMaximized);

    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="tauri-ui-theme">
      <div
        className={cn(
          "h-screen w-screen flex flex-col overflow-hidden bg-background",
          isMaximized ? "" : "rounded-md border border-border"
        )}
      >
        <TitleBar />

        <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 p-8 overflow-auto">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Tauri + React</h1>
          <p className="text-muted-foreground">
            Modern desktop application template with Tauri v2, React 19, and shadcn/ui
          </p>
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
            <CardTitle>Greet from Rust</CardTitle>
            <CardDescription>
              Test the communication between frontend and Tauri backend
            </CardDescription>
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
                placeholder="Enter your name..."
                className="flex-1"
              />
              <Button type="submit">Greet</Button>
            </form>
            {greetMsg && (
              <p className="mt-4 rounded-md bg-muted p-3 text-sm">{greetMsg}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
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
