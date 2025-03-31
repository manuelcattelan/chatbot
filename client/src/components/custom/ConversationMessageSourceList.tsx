import { RefObject } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationMessageSource from "@/components/custom/ConversationMessageSource";

export default function ConversationMessageSourceList({
  dialogRef,
  answerSources,
}: {
  dialogRef: RefObject<HTMLDivElement | null>;
  answerSources: string[];
}) {
  return (
    <ul className="max-h-[40vh] overflow-y-hidden">
      <ScrollArea className="h-full overflow-y-auto" viewport={dialogRef}>
        {answerSources.map((source, sourceIndex) => (
          <ConversationMessageSource
            key={sourceIndex}
            source={source}
            sourceIndex={sourceIndex}
          />
        ))}
      </ScrollArea>
    </ul>
  );
}
