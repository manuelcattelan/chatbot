import { useRef } from "react";
import { PaperclipIcon, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ATTACHMENTS_ALLOWED_FILETYPE } from "@/lib/constants";
import { ConversationFormSchema } from "@/types/ConversationForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConversationFormAttachmentInput({
  conversationForm,
}: {
  conversationForm: UseFormReturn<z.infer<typeof ConversationFormSchema>>;
}) {
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const handleAttachmentUploadButtonClick = () => {
    attachmentInputRef.current?.click();
  };
  const handleAttachmentClearButtonClick = () => {
    conversationForm.setValue("attachment", undefined);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  };

  return (
    <FormField
      control={conversationForm.control}
      name="attachment"
      render={({ field: { value, onChange, ...props } }) => (
        <FormItem>
          <FormControl>
            <div>
              <Input
                id="attachment"
                type="file"
                {...props}
                ref={attachmentInputRef}
                className="hidden"
                accept={ATTACHMENTS_ALLOWED_FILETYPE}
                onChange={(event) =>
                  onChange(event.target.files && event.target.files[0])
                }
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {value ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAttachmentClearButtonClick}
                      >
                        <X />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAttachmentUploadButtonClick}
                      >
                        <PaperclipIcon />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {value ? (
                      <p className="text-sm">Remove {value.name}</p>
                    ) : (
                      <p className="text-sm">Upload a file</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
