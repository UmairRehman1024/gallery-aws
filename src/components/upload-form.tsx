"use client";

import { useState } from "react";
import type { PresignResponse } from "@/app/api/getPresignedURL/route";
import { saveImageMetadata } from "@/server/actions/save-image-metadata";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const userId = useAuth().userId;

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!userId) {
      alert("You must be signed in to upload files.");
      return;
    }
    toast.loading("Getting Presigned URL...", {
      id: `uploading-${file.name}`,
    });

    // 1. Get pre-signed URL from server action
    const presignRes = await fetch("/api/getPresignedURL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, filetype: file.type }),
    });
    const { url, key } = (await presignRes.json()) as PresignResponse;

    if (!url || !key) {
      toast.dismiss(`uploading-${file.name}`);
      toast.error("Failed to get presigned URL", {
        id: `uploading-${file.name}`,
      });
      return;
    }

    toast.loading("Uploading to S3 bucket...", {
      id: `uploading-${file.name}`,
    });

    // 2. Upload file directly to S3
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (res.ok) {
      toast.success("Upload successful", {
        id: `uploading-${file.name}`,
      });
      toast.loading("Saving metadata...", {
        id: `uploading-${file.name}`,
      });
      await saveImageMetadata({
        key,
        url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        filename: file.name,
        userID: userId,
      });
      setUploading(false);
      setFile(null);
      toast.dismiss(`saving-${file.name}`);
      toast.success("Metadata saved", {
        id: `uploading-${file.name}`,
      });
      router.refresh();
    } else {
      toast.error("Upload failed", {
        id: `uploading-${file.name}`,
      });
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
