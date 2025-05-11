import { ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import MainNav from "./main-nav";

export default function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ImageIcon className="h-6 w-6" />
          <span className="hidden sm:inline-block">PixelVault</span>
        </Link>
        <MainNav />
        <div className="flex items-center gap-2">
          <SignedIn>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline-block">Upload</span>
              </Link>
            </Button>
            <UserButton
              fallback={
                <div className="bg-muted h-7 w-7 animate-pulse rounded-full" />
              }
            />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
