import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "@/env"; // or your env loader
import { z } from "zod";

const client = new DynamoDBClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const ddb = DynamoDBDocumentClient.from(client);

export const GalleryImageSchema = z.object({
  ID: z.string(),
  key: z.string(),
  url: z.string().url(),
  filename: z.string(),
  uploadedAt: z.number(),
  userID: z.string(),
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;
