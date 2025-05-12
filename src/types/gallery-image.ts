import { z } from "zod";

export const GalleryImageSchema = z.object({
  ID: z.string().min(1),
  key: z.string().min(1),
  url: z.string().url().min(1),
  filename: z.string().min(1),
  uploadedAt: z.number().min(0),
  userID: z.string().min(1),
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;
