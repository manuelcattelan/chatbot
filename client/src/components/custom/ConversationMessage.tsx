import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GlobeIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useIsFetching } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ConversationMessageDialog from "@/components/custom/ConversationMessageDialog";

import {
  ConversationMessage as ConversationMessageType,
  ConversationMessageOwner,
} from "@/types/ConversationMessage";
import { Status } from "@/types/communication/Status";
import {
  GetAnswerSourcesResponse,
  GetAnswerSourcesResponseError,
} from "@/types/communication/GetAnswerSources";

export default function ConversationMessage({
  message,
  answerSources,
  setAnswerSources,
  getAnswerSources,
}: {
  message: ConversationMessageType;
  answerSources: string[];
  setAnswerSources: Dispatch<SetStateAction<string[]>>;
  getAnswerSources: (
    answerId: string,
  ) => Promise<{ data: GetAnswerSourcesResponse }>;
}) {
  const [isSourcesDialogOpen, setIsSourcesDialogOpen] = useState(false);
  const isFetchingAnswerSources = useIsFetching({
    queryKey: ["getAnswerSources", message.id],
  });

  async function onClick() {
    try {
      const response = await getAnswerSources(message.id);
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
    <div role="article" aria-live="polite">
      {message.message}
      {message.owner === ConversationMessageOwner.Application && (
        <div>
          <Button
            disabled={Boolean(isFetchingAnswerSources)}
            onClick={onClick}
            variant="ghost"
          >
            {Boolean(isFetchingAnswerSources) ? (
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
      )}
    </div>
  );
}
