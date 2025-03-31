import {
  ConversationMessage,
  ConversationMessageOwner as ConversationMessageOwnerEnum,
} from "@/types/ConversationMessage";

export default function ConversationMessageOwner({
  message,
  messageTextAlignment,
}: {
  message: ConversationMessage;
  messageTextAlignment: string;
}) {
  const messageTextOwner =
    message.owner === ConversationMessageOwnerEnum.Application
      ? "Application"
      : "You";
  const messageTextOwnerAlignment =
    message.owner === ConversationMessageOwnerEnum.Application
      ? "ml-4"
      : "mr-4";

  return (
    <p
      className={`${messageTextAlignment} ${messageTextOwnerAlignment} text-muted-foreground mb-1 text-xs`}
      id={`message-owner-${message.id}`}
    >
      {messageTextOwner}
    </p>
  );
}
