import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface PresignRequest {
  filename: string;
  filetype: string;
}

export interface PresignResponse {
  url: string;
  key: string;
}

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: NextRequest) {
  const { filename, filetype } = (await req.json()) as PresignRequest;
  const { url, key } = await getPresignedUrl(filename, filetype);
  return NextResponse.json({ url, key });
}

async function getPresignedUrl(filename: string, filetype: string) {
  const key = `uploads/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: key,
    ContentType: filetype,
    // ACL: "public-read", // or private, depending on your use case
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds

  return { url, key };
}
