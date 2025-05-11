"use server";

import { auth } from "@clerk/nextjs/server";
import { ddb } from "@/server/db";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";

// S3 client setup
const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function deleteImage(ID: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  console.log("Deleting image with ID:", ID);
  console.log("User ID:", userId);

  // 1. Get the image item from DynamoDB
  const getResult = await ddb.send(
    new GetCommand({
      TableName: env.AWS_DYNAMO_DB_TABLE,
      Key: { ID },
    }),
  );
  const image = getResult.Item;
  if (!image) throw new Error("Image not found");

  // 2. Check ownership
  if (image.userID !== userId) throw new Error("Unauthorized");

  // 3. Delete from S3
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Key: image.key,
    }),
  );

  // 4. Delete from DynamoDB
  await ddb.send(
    new DeleteCommand({
      TableName: env.AWS_DYNAMO_DB_TABLE,
      Key: { ID },
    }),
  );

  return { success: true };
}
