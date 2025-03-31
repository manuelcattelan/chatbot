import { z } from "zod";

import {
  ATTACHMENTS_ALLOWED_FILETYPE,
  ATTACHMENTS_FILESIZE_LIMIT,
  ATTACHMENTS_FILESIZE_LIMIT_MB,
  MAXIMUM_MESSAGE_LENGTH,
  MINIMUM_MESSAGE_LENGTH,
} from "@/lib/constants";

export const ConversationFormSchema = z.object({
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
