import { db } from "../db";
import { images } from "../db/schema";
import { desc } from "drizzle-orm";

export async function getAllImages() {
  return db.select().from(images).orderBy(desc(images.uploadedAt));
}
