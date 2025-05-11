import { z } from "zod";

export const GalleryImageSchema = z.object({
  ID: z.string(),
  key: z.string(),
  url: z.string().url(),
  filename: z.string(),
  uploadedAt: z.number(),
  userID: z.string(),
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;
