import { Button } from "@/components/ui/button";
import { getVersion } from "@tauri-apps/api/app";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Github, RefreshCw } from "lucide-react";
import { TitleBar } from "@/components/title-bar";
import { WindowFrame } from "@/components/window-frame";
import { useAppTranslation } from "@/hooks/use-app-translation";
import { useEffect, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { destroyWindow } from "@/lib/window";
import { useManualUpdateCheck } from "@/components/updater-dialog";
import packageJson from "../../package.json";

const techVersions = {
  tauri: packageJson.dependencies["@tauri-apps/api"].replace(/^\^/, "v"),
  react: packageJson.dependencies.react.replace(/^\^/, "v"),
  typescript: packageJson.devDependencies.typescript.replace(/^~/, "v"),
};

export default function AboutPage() {
  const [appVersion, setAppVersion] = useState("");
  const { t } = useAppTranslation();
  const { checkUpdate, checking, showNoUpdate } = useManualUpdateCheck();

  useEffect(() => {
    void getVersion().then(setAppVersion);
  }, []);

  useEffect(() => {
    const appWindow = getCurrentWebviewWindow();

    // Listen for window close request, destroy after 5 seconds delay
    const unlistenClose = appWindow.onCloseRequested(async (event) => {
      // Prevent default close behavior
      event.preventDefault();
      console.log("About window close requested, will destroy in 5 seconds");
      // Destroy after 5 seconds delay
      await destroyWindow(appWindow.label, 5000);
    });

    return () => {
      unlistenClose.then((fn) => fn());
    };
  }, []);

  const handleOpenGithub = async () => {
    await openUrl("https://github.com/kitlib/tauri-app-template");
  };

  return (
    <WindowFrame
      titleBar={<TitleBar title={t("about.title")} showMinimize={false} showMaximize={false} />}
      contentClassName="flex flex-1 items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("about.appName")}</h2>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("about.version")}</span>
            <span className="font-medium">{appVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tauri</span>
            <span className="font-medium">{techVersions.tauri}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">React</span>
            <span className="font-medium">{techVersions.react}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TypeScript</span>
            <span className="font-medium">{techVersions.typescript}</span>
          </div>
        </div>

        <Button onClick={handleOpenGithub} className="w-full" variant="outline">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>

        <Button onClick={checkUpdate} className="w-full" variant="outline" disabled={checking}>
          <RefreshCw className={`mr-2 h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? t("updater.checking") : t("updater.checkForUpdates")}
        </Button>

        {showNoUpdate && (
          <p className="text-muted-foreground text-center text-sm">{t("updater.upToDate")}</p>
        )}
      </div>
    </WindowFrame>
  );
}
