import { useEffect, useState } from "react";
import { useUpdater } from "@/hooks/use-updater";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface UpdaterDialogProps {
  manualCheck?: boolean;
  onCheckComplete?: () => void;
}

export function UpdaterDialog({ manualCheck = false, onCheckComplete }: UpdaterDialogProps) {
  const { update, checking, downloading, progress, checkUpdate, installUpdate } = useUpdater();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!manualCheck) {
      // Auto check for updates on mount
      checkUpdate();
    }
  }, [manualCheck]);

  useEffect(() => {
    if (update) {
      setOpen(true);
      onCheckComplete?.();
    } else if (manualCheck && !checking) {
      onCheckComplete?.();
    }
  }, [update, checking, manualCheck, onCheckComplete]);

  const handleInstall = () => {
    installUpdate();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const getProgressPercentage = () => {
    if (!progress || progress.event !== "Progress") return 0;
    const { chunkLength, contentLength } = progress.data || {};
    if (!contentLength) return 0;
    return Math.round((chunkLength! / contentLength) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {downloading ? t("updater.downloading") : t("updater.updateAvailable")}
          </DialogTitle>
          <DialogDescription>
            {downloading ? (
              <div className="space-y-2">
                <p>{t("updater.installingVersion", { version: update?.version })}</p>
                <Progress value={getProgressPercentage()} />
              </div>
            ) : (
              <div className="space-y-2">
                <p>{t("updater.versionAvailable", { version: update?.version })}</p>
                {update?.body && (
                  <div className="bg-muted mt-2 rounded-md p-3 text-sm">
                    <p className="font-semibold">{t("updater.releaseNotes")}</p>
                    <p className="mt-1 whitespace-pre-wrap">{update.body}</p>
                  </div>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        {!downloading && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {t("updater.later")}
            </Button>
            <Button onClick={handleInstall}>{t("updater.installNow")}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function useManualUpdateCheck() {
  const { checkUpdate, checking, update } = useUpdater();
  const [showNoUpdate, setShowNoUpdate] = useState(false);

  const handleCheckUpdate = async () => {
    setShowNoUpdate(false);
    const result = await checkUpdate();
    if (!result) {
      setShowNoUpdate(true);
    }
  };

  return {
    checkUpdate: handleCheckUpdate,
    checking,
    hasUpdate: !!update,
    showNoUpdate,
    dismissNoUpdate: () => setShowNoUpdate(false),
  };
}
