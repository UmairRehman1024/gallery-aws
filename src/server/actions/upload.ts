// "use server";

// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// // The @t3-oss/env-nextjs package guarantees the env variables are strings.

// import { env } from "@/env";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3 = new S3Client({
//   region: env.AWS_REGION,
//   credentials: {
//     accessKeyId: env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function getPresignedUrl(filename: string, filetype: string) {
//   const key = `uploads/${Date.now()}-${filename}`;
//   const command = new PutObjectCommand({
//     Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
//     Key: key,
//     ContentType: filetype,
//     ACL: "public-read", // or private, depending on your use case
//   });

//   const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds

//   return { url, key };
// }
