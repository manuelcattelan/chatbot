"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { GlobeIcon } from "@radix-ui/react-icons";

import {
  ATTACHMENTS_ALLOWED_FILETYPE,
  ATTACHMENTS_FILESIZE_LIMIT,
  MAXIMUM_MESSAGE_LENGTH,
  MINIMUM_MESSAGE_LENGTH,
} from "@/lib/constants";
import { useRef, useState } from "react";
import {
  ConversationMessage,
  ConversationMessageOwner,
} from "@/types/ConversationMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAnswer from "@/hooks/useAnswer";
import useAnswerSources from "@/hooks/useAnswerSources";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Status } from "@/types/communication/Status";
import {
  GetAnswerResponseError,
  GetAnswerResponseSuccess,
} from "@/types/communication/GetAnswer";
import { toast } from "sonner";
import { GetAnswerSourcesResponseError } from "@/types/communication/GetAnswerSources";

const ConversationFormSchema = z.object({
  message: z
    .string()
    .min(MINIMUM_MESSAGE_LENGTH, {
      message: "Message must be at least 1 character long",
    })
    .max(MAXIMUM_MESSAGE_LENGTH, {
      message: "Message must be less than 1000 characters long",
    }),
  attachment: z
    .instanceof(File)
    .refine((attachment) => attachment.type === ATTACHMENTS_ALLOWED_FILETYPE, {
      message: "Attachment must be a valid PDF document",
    })
    .refine((attachment) => attachment.size <= ATTACHMENTS_FILESIZE_LIMIT, {
      message: "Attachment must be less than 10MB",
    })
    .optional(),
});

export default function Home() {
  const conversationRef = useRef<HTMLDivElement>(null);
  const conversationForm = useForm<z.infer<typeof ConversationFormSchema>>({
    resolver: zodResolver(ConversationFormSchema),
  });
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([]);

  const getAnswer = useAnswer();
  const getAnswerSources = useAnswerSources();

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
    setConversationMessages((conversationMessages) => [
      ...conversationMessages,
      {
        id: uuidv4(),
        message: conversationFormData.message,
        owner: ConversationMessageOwner.User,
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
        setConversationMessages((conversationMessages) => [
          ...conversationMessages,
          {
            id: (response.data as GetAnswerResponseSuccess).data.answer_id,
            message: (response.data as GetAnswerResponseSuccess).data.answer,
            owner: ConversationMessageOwner.Application,
          },
        ]);

        scrollToBottom();
      }
    } catch (error: any) {
      toast.error("Uh oh! Something went wrong.", {
        description: (error.response.data as GetAnswerResponseError).message,
      });
    }
  }

  const [answerSources, setAnswerSources] = useState<string[]>([]);

  return (
    <main className="flex h-full flex-col p-4">
      <div role="log" className="h-full overflow-y-hidden">
        <ScrollArea
          className="h-full overflow-y-auto"
          viewport={conversationRef}
        >
          {conversationMessages.map(
            (conversationMessage, conversationMessageKey) => {
              async function onClick() {
                try {
                  const response = await getAnswerSources(
                    conversationMessage.id,
                  );

                  if (response.data.status === Status.Success) {
                    setAnswerSources(response.data.data.answer_sources);
                  }
                } catch (error: any) {
                  toast.error("Uh oh, something went wrong.", {
                    description: (
                      error.response.data as GetAnswerSourcesResponseError
                    ).message,
                  });
                }
              }

              return (
                <div
                  role="article"
                  aria-live="polite"
                  key={conversationMessageKey}
                >
                  {conversationMessage.message}
                  {conversationMessage.owner ===
                    ConversationMessageOwner.Application && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={onClick}>
                          <GlobeIcon />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Fact-checking sources</DialogTitle>
                          <DialogDescription>
                            Listed below are references to the sources that
                            helped produce this automatically generated answer.
                          </DialogDescription>
                        </DialogHeader>
                        {answerSources.length > 0 ? (
                          <ul className="h-full overflow-y-hidden">
                            <ScrollArea
                              className="h-full overflow-y-auto"
                              viewport={conversationRef}
                            >
                              {answerSources.map((source, index) => (
                                <li key={index}>
                                  <Button variant="link">
                                    {index + 1}. {source}
                                  </Button>
                                </li>
                              ))}
                            </ScrollArea>
                          </ul>
                        ) : (
                          <p>No sources available</p>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            },
          )}
        </ScrollArea>
      </div>
      <Form {...conversationForm}>
        <form
          onSubmit={conversationForm.handleSubmit(onConversationFormSubmit)}
        >
          <FormField
            control={conversationForm.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here..."
                    className="resize-none"
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
          <Button type="submit">
            <ArrowUpIcon />
          </Button>
        </form>
      </Form>
    </main>
  );
}
