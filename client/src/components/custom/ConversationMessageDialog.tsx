import { Dispatch, SetStateAction, useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConversationMessageSourceList from "@/components/custom/ConversationMessageSourceList";

export default function ConversationMessageDialog({
  isSourcesDialogOpen,
  setIsSourcesDialogOpen,
  answerSources,
}: {
  isSourcesDialogOpen: boolean;
  setIsSourcesDialogOpen: Dispatch<SetStateAction<boolean>>;
  answerSources: string[];
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={isSourcesDialogOpen} onOpenChange={setIsSourcesDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fact-checking sources</DialogTitle>
          <DialogDescription>
            Listed below are references to the sources that helped produce this
            automatically generated answer.
          </DialogDescription>
        </DialogHeader>
        {answerSources.length > 0 ? (
          <ConversationMessageSourceList
            dialogRef={dialogRef}
            answerSources={answerSources}
          />
        ) : (
          <p>No sources available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
