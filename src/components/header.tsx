import { ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ImageIcon className="h-6 w-6" />
          <span className="hidden sm:inline-block">PixelVault</span>
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Public Gallery
          </Link>
          <Link
            href="/my-gallery"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            My Gallery
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <SignedIn>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline-block">Upload</span>
              </Link>
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
