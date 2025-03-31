import { Dispatch, RefObject, SetStateAction } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Form, FormMessage } from "@/components/ui/form";
import ConversationFormTextInput from "@/components/custom/ConversationForm/TextInput";
import ConversationFormSubmitButton from "@/components/custom/ConversationForm/SubmitButton";

import useAnswer from "@/hooks/useAnswer";
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
import { ConversationFormSchema } from "@/types/ConversationForm";
import ConversationFormAttachmentInput from "./AttachmentInput";
import ConversationFormError from "./Error";

export default function ConversationForm({
  conversationRef,
  setConversationMessages,
}: {
  conversationRef: RefObject<HTMLDivElement | null>;
  setConversationMessages: Dispatch<SetStateAction<ConversationMessage[]>>;
}) {
  const conversationForm = useForm<z.infer<typeof ConversationFormSchema>>({
    resolver: zodResolver(ConversationFormSchema),
    defaultValues: {
      message: "",
      attachment: undefined,
    },
  });
  const getAnswer = useAnswer();

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

  async function onConversationFormSubmit(
    conversationFormData: z.infer<typeof ConversationFormSchema>,
  ) {
    conversationForm.reset();

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
        conversationMessages.slice(0, -2),
      );
    }
  }

  return (
    <Form {...conversationForm}>
      <form
        onSubmit={conversationForm.handleSubmit(onConversationFormSubmit)}
        className="flex flex-col gap-1"
      >
        <div className="flex gap-2">
          <ConversationFormTextInput
            conversationForm={conversationForm}
            onConversationFormSubmit={onConversationFormSubmit}
          />
          <div className="flex flex-col gap-1">
            <ConversationFormAttachmentInput
              conversationForm={conversationForm}
            />
            <ConversationFormSubmitButton />
          </div>
        </div>
        <ConversationFormError conversationForm={conversationForm} />
      </form>
    </Form>
  );
}
