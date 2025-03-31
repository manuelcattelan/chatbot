import { Dispatch, SetStateAction } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import ConversationMessageOwner from "@/components/custom/ConversationMessage/Owner";
import ConversationMessageText from "@/components/custom/ConversationMessage/Text";
import ConversationMessageSourceButton from "@/components/custom/ConversationMessage/SourceButton";

import {
  ConversationMessage as ConversationMessageType,
  ConversationMessageOwner as ConversationMessageOwnerEnum,
} from "@/types/ConversationMessage";
import { GetAnswerSourcesResponse } from "@/types/communication/GetAnswerSources";

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
  const messageTextAlignment =
    message.owner === ConversationMessageOwnerEnum.Application
      ? "self-start"
      : "self-end";

  return (
    <div
      role="article"
      aria-labelledby={`message-owner-${message.id}`}
      aria-live="polite"
      className="flex flex-col pb-4"
    >
      {message.owner === ConversationMessageOwnerEnum.Application &&
      message.isLoading ? (
        <Skeleton className="mb-1 h-4 w-16 rounded-sm" />
      ) : (
        <ConversationMessageOwner
          message={message}
          messageTextAlignment={messageTextAlignment}
        />
      )}
      <div className={`${messageTextAlignment} flex items-center gap-1`}>
        {message.owner === ConversationMessageOwnerEnum.Application &&
        message.isLoading ? (
          <Skeleton className="h-[38px] w-[292px] rounded-sm" />
        ) : (
          <ConversationMessageText message={message} />
        )}
        {message.owner === ConversationMessageOwnerEnum.Application &&
          !message.isLoading && (
            <ConversationMessageSourceButton
              message={message}
              answerSources={answerSources}
              setAnswerSources={setAnswerSources}
              getAnswerSources={getAnswerSources}
            />
          )}
      </div>
    </div>
  );
}
