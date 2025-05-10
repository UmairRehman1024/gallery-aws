import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, GalleryImageSchema, type GalleryImage } from "../db";
import { env } from "@/env";

// export async function getAllImages1() {
//   const result = await ddb.send(
//     new ScanCommand({
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       TableName: env.AWS_DYNAMO_DB_TABLE,
//     }),
//   );
//   return (result.Items ?? []).sort(
//     (a, b) => (b.uploadedAt as number) - (a.uploadedAt as number),
//   );
// }

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
