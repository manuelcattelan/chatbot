import { RefObject, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationMessage from "@/components/custom/ConversationMessage/Index";

import useAnswerSources from "@/hooks/useAnswerSources";
import { ConversationMessage as ConversationMessageType } from "@/types/ConversationMessage";

export default function Conversation({
  conversationRef,
  conversationMessages,
}: {
  conversationRef: RefObject<HTMLDivElement | null>;
  conversationMessages: ConversationMessageType[];
}) {
  const [answerSources, setAnswerSources] = useState<string[]>([]);
  const getAnswerSources = useAnswerSources(useQueryClient());

  return (
    <div role="log" className="h-full overflow-y-hidden pb-2">
      <ScrollArea className="h-full overflow-y-auto" viewport={conversationRef}>
        {conversationMessages.map(
          (conversationMessage, conversationMessageKey) => (
            <ConversationMessage
              key={conversationMessageKey}
              message={conversationMessage}
              answerSources={answerSources}
              setAnswerSources={setAnswerSources}
              getAnswerSources={getAnswerSources}
            />
          ),
        )}
      </ScrollArea>
    </div>
  );
}
