"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
// import { useAdjustmentStore } from "@/hooks/use-adjustment";
import { FileWithPreview } from "@/types";

type PostCloseConfirmationProps = {
  isConfirmOpen: boolean;
  onConfirmClose: () => void;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
};

const PostCloseConfirmation = ({
  isConfirmOpen,
  onConfirmClose,
  setFiles,
}: PostCloseConfirmationProps) => {
  //   const { updateBrightness, updateHue, updateSaturation, updateContrast } =
  //     useAdjustmentStore();

  return (
    <Dialog open={isConfirmOpen} onOpenChange={onConfirmClose}>
      <DialogContent className="w-[400px] h-[202px] p-0 flex flex-col gap-0 border-none bg-background-accent">
        <DialogHeader className="flex-1 items-center justify-center">
          <DialogTitle className="text-xl">Discard post?</DialogTitle>
          <DialogDescription className="text-sm">
            If you leave, your edits won&apos;t be saved.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center">
          <Separator
            orientation="horizontal"
            className="bg-border bg-igElevatedSeparatorV2"
          />
          <Button
            onClick={() => {
              onConfirmClose();
              setFiles([]);
              //   updateBrightness(0);
              //   updateContrast(0);
              //   updateSaturation(0);
            }}
            className="text-red-500 w-full rounded-none bg-transparent font-semibold text-sm hover:bg-transparent h-12"
          >
            Discard
          </Button>
          <Separator
            orientation="horizontal"
            className="bg-border bg-igElevatedSeparatorV2"
          />
          <Button
            onClick={onConfirmClose}
            className="text-primary w-full text-sm bg-transparent hover:bg-transparent h-12"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PostCloseConfirmation;
