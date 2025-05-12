// import { getImagesByUser } from "../server/queries/images";
// import Image from "next/image";
// import { auth } from "@clerk/nextjs/server";
// import { DeleteButton } from "./delete-button";

// export default async function Gallery() {
//   const userID = (await auth()).userId;

//   if (!userID) {
//     return (
//       <main className="flex min-h-screen flex-col items-center p-24">
//         <h1>Gallery</h1>
//         <p className="mt-5">You must be signed in to view your gallery.</p>
//       </main>
//     );
//   }
//   const images = await getImagesByUser(userID);

//   return (
//     <main className="flex min-h-screen flex-col items-center p-24">
//       <h1>Gallery</h1>
//       <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
//         {images.map((img) => (
//           <div key={img.ID} className="rounded border p-2">
//             <Image
//               src={img.url}
//               alt={img.filename}
//               width={200}
//               height={200}
//               className="h-48 w-full object-cover"
//             />
//             <p className="mt-1 truncate text-sm">{img.filename}</p>
//             <DeleteButton id={img.ID} />
//           </div>
//         ))}
//       </div>
//       {images.length === 0 && <p className="mt-5">No images uploaded yet.</p>}
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImageModal } from "@/components/image-modal";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { deleteImage } from "@/server/actions/delete-image";
import type { GalleryImage } from "@/types/gallery-image";

interface GalleryProps {
  images: GalleryImage[];
  isPersonal?: boolean;
}
export function Gallery({ images: initialImages }: GalleryProps) {
  const { userId } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId); // Call your server action or API
      setImages((prev) => prev.filter((img) => img.ID !== imageId));
      toast("Image deleted", {
        description: "The image has been successfully deleted.",
      });
      setImageToDelete(null);
    } catch (err) {
      toast.error("Failed to delete image", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <>
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted rounded-full p-6">
            <ImageIcon className="text-muted-foreground h-10 w-10" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No images found</h3>
          <p className="text-muted-foreground mt-2 text-center">
            No images to display.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <Card key={image.ID} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.filename}
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 p-4">
                <div className="w-full">
                  <h3 className="truncate font-medium" title={image.filename}>
                    {image.filename}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Uploaded on{" "}
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between">
                  {/* <p className="text-muted-foreground text-xs">
                    {image.owner ? `By ${image.owner}` : ""}
                  </p> */}
                  {image.userID === userId && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setImageToDelete(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Image Details Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onDelete={
          selectedImage?.userID === userId
            ? () => setImageToDelete(selectedImage)
            : undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => imageToDelete && handleDelete(imageToDelete.ID)}
        filename={imageToDelete?.filename ?? ""}
      />
    </>
  );
}
