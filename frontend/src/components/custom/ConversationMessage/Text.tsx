import { ConversationMessage } from "@/types/ConversationMessage";

export default function ConversationMessageText({
  message,
}: {
  message: ConversationMessage;
}) {
  return (
    <div className="bg-accent rounded-sm border px-4 py-2 text-sm">
      {message.message}
    </div>
  );
}
