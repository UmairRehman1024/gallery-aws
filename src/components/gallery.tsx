// import { getImagesByUser } from "../server/queries/get-all-images";
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

// Mock data for the gallery
const mockImages = [
  {
    id: "1",
    url: "/placeholder.svg?height=400&width=600",
    filename: "mountain-landscape.jpg",
    uploadDate: "2023-10-15",
    owner: "John Doe",
    ownerId: "user1",
  },
  {
    id: "2",
    url: "/placeholder.svg?height=400&width=600",
    filename: "beach-sunset.jpg",
    uploadDate: "2023-10-10",
    owner: "John Doe",
    ownerId: "user1",
  },
  {
    id: "3",
    url: "/placeholder.svg?height=400&width=600",
    filename: "city-skyline.jpg",
    uploadDate: "2023-10-05",
    owner: "Jane Smith",
    ownerId: "user2",
  },
  {
    id: "4",
    url: "/placeholder.svg?height=400&width=600",
    filename: "forest-path.jpg",
    uploadDate: "2023-09-28",
    owner: "John Doe",
    ownerId: "user1",
  },
  {
    id: "5",
    url: "/placeholder.svg?height=400&width=600",
    filename: "autumn-leaves.jpg",
    uploadDate: "2023-09-20",
    owner: "Jane Smith",
    ownerId: "user2",
  },
  {
    id: "6",
    url: "/placeholder.svg?height=400&width=600",
    filename: "snowy-mountain.jpg",
    uploadDate: "2023-09-15",
    owner: "John Doe",
    ownerId: "user1",
  },
];

// For demo purposes, we'll assume the current user is user1
const currentUserId = "user1";

interface GalleryProps {
  isPersonal?: boolean;
}

export function Gallery({ isPersonal = false }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<
    (typeof mockImages)[0] | null
  >(null);
  const [imageToDelete, setImageToDelete] = useState<
    (typeof mockImages)[0] | null
  >(null);
  const [images, setImages] = useState(mockImages);

  // Filter images for personal gallery if needed
  const displayedImages = isPersonal
    ? images.filter((img) => img.ownerId === currentUserId)
    : images;

  const handleDelete = (imageId: string) => {
    setImages(images.filter((img) => img.id !== imageId));
    toast("Image deleted", {
      description: "The image has been successfully deleted.",
    });
    setImageToDelete(null);
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
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
                  Uploaded on {new Date(image.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-muted-foreground text-xs">
                  By {image.owner}
                </p>
                {image.ownerId === currentUserId && (
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

      {displayedImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted rounded-full p-6">
            <ImageIcon className="text-muted-foreground h-10 w-10" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No images found</h3>
          <p className="text-muted-foreground mt-2 text-center">
            {isPersonal
              ? "You haven't uploaded any images yet. Start by uploading your first image."
              : "There are no images in the public gallery yet."}
          </p>
        </div>
      )}

      {/* Image Details Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onDelete={
          selectedImage?.ownerId === currentUserId
            ? () => setImageToDelete(selectedImage)
            : undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => imageToDelete && handleDelete(imageToDelete.id)}
        filename={imageToDelete?.filename ?? ""}
      />
    </>
  );
}
