"use server";

import { nanoid } from "nanoid/non-secure";
import { ddb, GalleryImageSchema } from "../db/dynamo";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { env } from "@/env";

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
  // Validate the input data
  const parsedData = GalleryImageSchema.parse({
    ID: nanoid(),
    key,
    url,
    filename,
    uploadedAt: Date.now(),
    userID,
  });

  await ddb.send(
    new PutCommand({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      TableName: env.AWS_DYNAMO_DB_TABLE,
      Item: {
        ...parsedData, // <-- Spread the fields here
      },
    }),
  );
}
