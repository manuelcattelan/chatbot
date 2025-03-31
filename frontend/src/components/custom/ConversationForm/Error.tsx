import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { FormMessage } from "@/components/ui/form";

import { ConversationFormSchema } from "@/types/ConversationForm";

export default function ConversationFormError({
  conversationForm,
}: {
  conversationForm: UseFormReturn<z.infer<typeof ConversationFormSchema>>;
}) {
  const conversationFromHasErrors =
    conversationForm.formState.errors.message ||
    conversationForm.formState.errors.attachment;

  return (
    <div>
      {conversationFromHasErrors && (
        <FormMessage>
          {conversationForm.formState.errors.message?.message ||
            // NOTE: casting to string is only required because we used z.any()
            // to perform validation on the attachment field.
            (conversationForm.formState.errors.attachment?.message as string)}
        </FormMessage>
      )}
    </div>
  );
}
