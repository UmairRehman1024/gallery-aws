import { Suspense } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/gallery";
import { GallerySkeleton } from "@/components/gallery-skeleton";
import { getImagesByUser } from "@/server/queries/images";
import { auth } from "@clerk/nextjs/server";

export default async function MyGalleryPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight">My Gallery</h1>
          <p className="text-muted-foreground">
            You must be signed in to view your gallery.
          </p>
        </div>
      </main>
    );
  }
  const images = await getImagesByUser(userId);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Gallery</h1>
            <p className="text-muted-foreground">
              Manage your personal image collection.
            </p>
          </div>
          <Button asChild>
            <Link href="/upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Image
            </Link>
          </Button>
        </div>
        <Suspense fallback={<GallerySkeleton />}>
          <Gallery images={images} />
        </Suspense>
      </div>
    </main>
  );
}
