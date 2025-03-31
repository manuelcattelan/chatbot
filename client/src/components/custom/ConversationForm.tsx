import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useAnswer from "@/hooks/useAnswer";
import {
  ATTACHMENTS_ALLOWED_FILETYPE,
  ATTACHMENTS_FILESIZE_LIMIT,
  ATTACHMENTS_FILESIZE_LIMIT_MB,
  MAXIMUM_MESSAGE_LENGTH,
  MINIMUM_MESSAGE_LENGTH,
} from "@/lib/constants";
import {
  ConversationMessage,
  ConversationMessageApplication,
  ConversationMessageOwner,
} from "@/types/ConversationMessage";
import {
  GetAnswerResponseError,
  GetAnswerResponseSuccess,
} from "@/types/communication/GetAnswer";
import { Status } from "@/types/communication/Status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMutating } from "@tanstack/react-query";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const ConversationFormSchema = z.object({
  message: z
    .string()
    .min(MINIMUM_MESSAGE_LENGTH, {
      message: `Message must be at least ${MINIMUM_MESSAGE_LENGTH} character long`,
    })
    .max(MAXIMUM_MESSAGE_LENGTH, {
      message: `Message must be less than ${MAXIMUM_MESSAGE_LENGTH} characters long`,
    }),
  attachment: z
    .instanceof(File)
    .refine((attachment) => attachment.type === ATTACHMENTS_ALLOWED_FILETYPE, {
      message: `Attachment must be a valid ${ATTACHMENTS_ALLOWED_FILETYPE} document`,
    })
    .refine((attachment) => attachment.size <= ATTACHMENTS_FILESIZE_LIMIT, {
      message: `Attachment must be less than ${ATTACHMENTS_FILESIZE_LIMIT_MB}MB`,
    })
    .optional(),
});

export default function ConversationForm({
  conversationRef,
  setConversationMessages,
}: {
  conversationRef: RefObject<HTMLDivElement | null>;
  setConversationMessages: Dispatch<SetStateAction<ConversationMessage[]>>;
}) {
  const conversationForm = useForm<z.infer<typeof ConversationFormSchema>>({
    resolver: zodResolver(ConversationFormSchema),
  });
  const getAnswer = useAnswer();
  const isSubmittingQuestion = Boolean(
    useIsMutating({ mutationKey: ["getAnswer"] }),
  );

  function scrollToBottom() {
    setTimeout(() => {
      if (conversationRef !== null && conversationRef.current !== null) {
        conversationRef.current.scroll({
          behavior: "smooth",
          top: conversationRef.current.scrollHeight,
        });
      }
    }, 0);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      conversationForm.handleSubmit(onConversationFormSubmit)();
    }
  }

  async function onConversationFormSubmit(
    conversationFormData: z.infer<typeof ConversationFormSchema>,
  ) {
    conversationForm.reset({
      message: "",
      attachment: undefined,
    });

    setConversationMessages((conversationMessages) => [
      ...conversationMessages,
      {
        id: uuidv4(),
        owner: ConversationMessageOwner.User,
        message: conversationFormData.message,
      },
      {
        owner: ConversationMessageOwner.Application,
        isLoading: true,
      },
    ]);

    const conversationFormDataToSubmit = new FormData();
    conversationFormDataToSubmit.append(
      "message",
      conversationFormData.message,
    );
    if (conversationFormData.attachment) {
      conversationFormDataToSubmit.append(
        "attachment",
        conversationFormData.attachment,
      );
    }

    scrollToBottom();

    try {
      const response = await getAnswer.mutateAsync(
        conversationFormDataToSubmit,
      );

      if (response.data.status === Status.Success) {
        setConversationMessages((conversationMessages) => {
          const updatedConversationMessages = [...conversationMessages];
          const lastConversationMessage = updatedConversationMessages.pop();

          if (lastConversationMessage) {
            updatedConversationMessages.push({
              ...lastConversationMessage,
              id: (response.data as GetAnswerResponseSuccess).data.answer_id,
              message: (response.data as GetAnswerResponseSuccess).data.answer,
              isLoading: false,
            } as ConversationMessageApplication);
          }

          return updatedConversationMessages;
        });

        scrollToBottom();
      }
    } catch (error: any) {
      toast.error("Uh oh! Something went wrong.", {
        description: (error.response.data as GetAnswerResponseError).message,
      });

      setConversationMessages((conversationMessages) =>
        conversationMessages.slice(0, -1),
      );
    }
  }

  return (
    <Form {...conversationForm}>
      <form onSubmit={conversationForm.handleSubmit(onConversationFormSubmit)}>
        <FormField
          control={conversationForm.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  onKeyDown={onKeyDown}
                  placeholder="Type your message here..."
                  className="max-h-16 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={conversationForm.control}
          name="attachment"
          render={({ field: { value, onChange, ...props } }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="attachment"
                  type="file"
                  {...props}
                  accept={ATTACHMENTS_ALLOWED_FILETYPE}
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmittingQuestion}>
          {isSubmittingQuestion ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ArrowUpIcon />
          )}
        </Button>
      </form>
    </Form>
  );
}
