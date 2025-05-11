import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../db";
import { env } from "@/env";
import { GalleryImageSchema, type GalleryImage } from "@/types/gallery-image";

export async function getAllImages(): Promise<GalleryImage[]> {
  const result = await ddb.send(
    new ScanCommand({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      TableName: env.AWS_DYNAMO_DB_TABLE,
    }),
  );
  const items = (result.Items ?? []).sort(
    (a, b) => (b.uploadedAt as number) - (a.uploadedAt as number),
  );
  return items.map((item) => GalleryImageSchema.parse(item));
}

export async function getImagesByUser(userID: string): Promise<GalleryImage[]> {
  const result = await ddb.send(
    new ScanCommand({
      TableName: env.AWS_DYNAMO_DB_TABLE,
      FilterExpression: "#userID = :userID",
      ExpressionAttributeNames: {
        "#userID": "userID",
      },
      ExpressionAttributeValues: {
        ":userID": userID,
      },
    }),
  );
  const items = (result.Items ?? []).sort(
    (a, b) => (b.uploadedAt as number) - (a.uploadedAt as number),
  );
  return items.map((item) => GalleryImageSchema.parse(item));
}
