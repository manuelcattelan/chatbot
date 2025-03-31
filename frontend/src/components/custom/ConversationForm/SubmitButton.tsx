import { ArrowUpIcon, Loader2 } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

export default function ConversationFormSubmitButton() {
  const isSubmittingQuestion = Boolean(
    useIsMutating({ mutationKey: ["getAnswer"] }),
  );

  return (
    <Button type="submit" disabled={isSubmittingQuestion}>
      {isSubmittingQuestion ? (
        <Loader2 className="animate-spin" />
      ) : (
        <ArrowUpIcon />
      )}
    </Button>
  );
}
