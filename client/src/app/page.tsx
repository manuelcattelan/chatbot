"use client";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

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

import {
  ATTACHMENTS_ALLOWED_FILETYPE,
  ATTACHMENTS_FILESIZE_LIMIT,
  MAXIMUM_MESSAGE_LENGTH,
  MINIMUM_MESSAGE_LENGTH,
} from "@/lib/constants";

const FormSchema = z.object({
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const formMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axios.post("/api/messages", formData);
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    formData.append("message", data.message);
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    formMutation.mutate(formData);
  }

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
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
            control={form.control}
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
