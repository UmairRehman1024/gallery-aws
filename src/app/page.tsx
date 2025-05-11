// import Gallery from "@/components/gallery";
// import UploadForm from "@/components/upload-form";
// import { SignedIn, SignedOut } from "@clerk/nextjs";

// export default function HomePage() {
//   return (
//     <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//       <SignedIn>
//         <UploadForm />
//         <Gallery />
//       </SignedIn>
//       <SignedOut>
//         <h1 className="text-2xl font-bold">Please sign in to upload files</h1>
//       </SignedOut>
//     </main>
//   );
// }

import { Suspense } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/gallery";
import { GallerySkeleton } from "@/components/gallery-skeleton";
import { SignedIn } from "@clerk/nextjs";
import { getAllImages } from "@/server/queries/images";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight">Public Gallery</h1>
          <p className="text-muted-foreground">
            Browse all public images from our community.
          </p>
        </div>
      </main>
    );
  }
  const images = await getAllImages();
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Public Gallery
            </h1>
            <p className="text-muted-foreground">
              Browse all public images from our community.
            </p>
          </div>
          <SignedIn>
            <Button asChild>
              <Link href="/upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Image
              </Link>
            </Button>
          </SignedIn>
        </div>
        <Suspense fallback={<GallerySkeleton />}>
          <Gallery images={images} />
        </Suspense>
      </div>
    </main>
  );
}
