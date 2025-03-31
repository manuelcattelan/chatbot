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
      <DialogContent className="max-h-full">
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
          <p className="text-sm">
            Unfortunately, we weren't able to retrieve any source for this
            particular answer. This could be due to a variety of reasons,
            including the nature of the question or the limitations of our data
            sources. We appreciate your understanding and encourage you to ask
            another question or provide more context for better results.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
