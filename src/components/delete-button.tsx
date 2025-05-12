"use client";

import { Button } from "@/components/ui/button";
import { deleteImage } from "@/server/actions/delete-image";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteButton({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteImage(id);
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={isLoading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
