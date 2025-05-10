"use server";

import { db } from "@/server/db"; // Your Drizzle db instance
import { images } from "@/server/db/schema";
import { nanoid } from "nanoid/non-secure"; // or use cuid if you prefer

export async function saveImageMetadata({
  key,
  url,
  filename,
  userID,
}: {
  key: string;
  url: string;
  filename: string;
  userID: string;
}) {
  await db.insert(images).values({
    id: nanoid(),
    key,
    url,
    filename,
    uploadedAt: new Date(),
    userID,
  });
}
