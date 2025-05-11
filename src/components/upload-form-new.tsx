"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { saveImageMetadata } from "@/server/actions/save-image-metadata";
import { useAuth } from "@clerk/nextjs";
import type { PresignResponse } from "@/app/api/getPresignedURL/route";

export function UploadForm() {
  const { userId } = useAuth();

  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
      });
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      });
    }

    setFile(selectedFile);
    setTitle(selectedFile.name);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("No file selected", {
        description: "Please select an image to upload.",
      });
      return;
    }
    if (!userId) {
      toast.error("Not signed in", {
        description: "You must be signed in to upload files.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      toast.loading("Getting Presigned URL...", {
        id: `uploading-${file.name}`,
      });

      // 1. Get pre-signed URL from your API
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
        setIsUploading(false);
        return;
      }

      toast.loading("Uploading to S3 bucket...", {
        id: `uploading-${file.name}`,
      });

      // 2. Upload file directly to S3 with progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

      toast.success("Upload successful", {
        id: `uploading-${file.name}`,
      });

      toast.loading("Saving metadata...", {
        id: `uploading-${file.name}`,
      });

      // 3. Save metadata
      await saveImageMetadata({
        key,
        url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        filename: file.name,
        userID: userId,
      });

      setIsUploading(false);
      setFile(null);
      toast.dismiss(`saving-${file.name}`);
      toast.success("Metadata saved", {
        id: `uploading-${file.name}`,
      });

      router.push(isPublic ? "/" : "/my-gallery");
    } catch (err) {
      setIsUploading(false);
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
        id: `uploading-${file?.name}`,
      });
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Image</Label>
        {!preview ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="bg-muted mb-4 rounded-full p-6">
                  <Upload className="text-muted-foreground h-10 w-10" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Upload an image</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Drag and drop or click to upload. Supports JPG, PNG, WebP, and
                  GIF.
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="cursor-pointer"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="relative rounded-md border">
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="bg-background/80 absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        )}
      </div>

      {file && (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your image"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your image"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Make this image public</Label>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </>
      )}
    </form>
  );
}
