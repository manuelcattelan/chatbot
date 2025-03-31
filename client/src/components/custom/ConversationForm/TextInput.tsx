import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { ConversationFormSchema } from "@/types/ConversationForm";

export default function ConversationFormTextInput({
  conversationForm,
  onConversationFormSubmit,
}: {
  conversationForm: UseFormReturn<z.infer<typeof ConversationFormSchema>>;
  onConversationFormSubmit: (
    conversationFormData: z.infer<typeof ConversationFormSchema>,
  ) => Promise<void>;
}) {
  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      conversationForm.handleSubmit(onConversationFormSubmit)();
    }
  }

  return (
    <FormField
      control={conversationForm.control}
      name="message"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Textarea
              onKeyDown={onKeyDown}
              placeholder="Type your message here..."
              className="h-[76px] resize-none text-sm"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
