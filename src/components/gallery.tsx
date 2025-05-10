import { getAllImages } from "../server/queries/get-all-images";
import Image from "next/image";

export default async function Gallery() {
  const images = await getAllImages();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Gallery</h1>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((img) => (
          <div key={img.id} className="rounded border p-2">
            <Image
              src={img.url}
              alt={img.filename}
              width={200}
              height={200}
              className="h-48 w-full object-cover"
            />
            <p className="mt-1 truncate text-sm">{img.filename}</p>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="mt-5">No images uploaded yet.</p>}
    </main>
  );
}
