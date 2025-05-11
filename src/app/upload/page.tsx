import { UploadForm } from "@/components/upload-form-new";

export default function UploadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container max-w-3xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload Image</h1>
          <p className="text-muted-foreground">
            Add a new image to your gallery.
          </p>
        </div>
        <UploadForm />
      </div>
    </main>
  );
}
