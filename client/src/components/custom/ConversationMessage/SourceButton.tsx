import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { GlobeIcon, Loader2 } from "lucide-react";
import { useIsFetching } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ConversationMessageDialog from "@/components/custom/ConversationMessage/SourceDialog";

import { ConversationMessage } from "@/types/ConversationMessage";
import { Status } from "@/types/communication/Status";
import {
  GetAnswerSourcesResponse,
  GetAnswerSourcesResponseError,
} from "@/types/communication/GetAnswerSources";

export default function ConversationMessageSourceButton({
  message,
  answerSources,
  setAnswerSources,
  getAnswerSources,
}: {
  message: ConversationMessage;
  answerSources: string[];
  setAnswerSources: Dispatch<SetStateAction<string[]>>;
  getAnswerSources: (
    answerId: string,
  ) => Promise<{ data: GetAnswerSourcesResponse }>;
}) {
  const [isSourcesDialogOpen, setIsSourcesDialogOpen] = useState(false);
  const isFetchingAnswerSources = Boolean(
    useIsFetching({
      queryKey: ["getAnswerSources", message.id],
    }),
  );

  async function onClick() {
    try {
      const response = await getAnswerSources(message.id!);
      if (response.data.status === Status.Success) {
        setAnswerSources(response.data.data.answer_sources);
      }
      setIsSourcesDialogOpen(true);
    } catch (error: any) {
      toast.error("Uh oh, something went wrong.", {
        description: (error.response.data as GetAnswerSourcesResponseError)
          .message,
      });
    }
  }

  return (
    <div>
      <Button
        disabled={isFetchingAnswerSources}
        onClick={onClick}
        variant="ghost"
      >
        {isFetchingAnswerSources ? (
          <Loader2 className="animate-spin" />
        ) : (
          <GlobeIcon />
        )}
      </Button>
      <ConversationMessageDialog
        isSourcesDialogOpen={isSourcesDialogOpen}
        setIsSourcesDialogOpen={setIsSourcesDialogOpen}
        answerSources={answerSources}
      />
    </div>
  );
}
