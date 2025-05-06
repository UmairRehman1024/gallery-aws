"use client";

import { useState } from "react";
import Image from "next/image";
import type { PresignResponse } from "@/app/api/presign/route";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    // 1. Get pre-signed URL from server action
    const presignRes = await fetch("/api/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, filetype: file.type }),
    });
    const { url, key } = (await presignRes.json()) as PresignResponse;

    // 2. Upload file directly to S3
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (res.ok) {
      // 3. Optionally, save metadata to your DB here
      setUploadedUrl(
        `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      );
    } else {
      alert("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadedUrl && (
        <div>
          <p>Uploaded!</p>
          <Image
            src={uploadedUrl}
            alt="Uploaded"
            width={200}
            height={200}
            style={{ maxWidth: 200 }}
          />
        </div>
      )}
    </div>
  );
}
