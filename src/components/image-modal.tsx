"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, User, Trash2, Download, ExternalLink } from "lucide-react";
import type { GalleryImage } from "@/types/gallery-image";

interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export function ImageModal({
  image,
  isOpen,
  onClose,
  onDelete,
}: ImageModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{image.filename}</DialogTitle>
          <DialogDescription>
            Uploaded by {image.userID} on{" "}
            {new Date(image.uploadedAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.filename}
            fill
            className="object-contain"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span>
              Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <span>Owner: {image.userID}</span>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Original
            </Button>
          </div>
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Image
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
