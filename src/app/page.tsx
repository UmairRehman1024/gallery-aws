import Gallery from "@/components/gallery";
import UploadForm from "@/components/upload-form";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SignedIn>
        <UploadForm />
        <Gallery />
      </SignedIn>
      <SignedOut>
        <h1 className="text-2xl font-bold">Please sign in to upload files</h1>
      </SignedOut>
    </main>
  );
}
