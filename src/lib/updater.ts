import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export interface UpdateProgress {
  event: "Started" | "Progress" | "Finished";
  data?: {
    contentLength?: number;
    chunkLength?: number;
  };
}

export async function checkForUpdates() {
  try {
    const update = await check();
    return update;
  } catch (error) {
    console.error("Failed to check for updates:", error);
    return null;
  }
}

export async function downloadAndInstall(onProgress?: (progress: UpdateProgress) => void) {
  const update = await check();

  if (!update) {
    return false;
  }

  console.log(`Found update ${update.version} from ${update.date} with notes: ${update.body}`);

  let downloaded = 0;
  let contentLength = 0;

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case "Started":
        contentLength = event.data.contentLength!;
        console.log(`Started downloading ${event.data.contentLength} bytes`);
        onProgress?.({ event: "Started", data: event.data });
        break;
      case "Progress":
        downloaded += event.data.chunkLength;
        console.log(`Downloaded ${downloaded} from ${contentLength}`);
        onProgress?.({ event: "Progress", data: { ...event.data, contentLength } });
        break;
      case "Finished":
        console.log("Download finished");
        onProgress?.({ event: "Finished" });
        break;
    }
  });

  console.log("Update installed");
  await relaunch();
  return true;
}
