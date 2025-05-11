"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={cn(
          "hover:text-primary text-sm font-medium transition-colors",
          pathname === "/" && "text-primary underline",
        )}
      >
        Public Gallery
      </Link>
      <Link
        href="/my-gallery"
        className={cn(
          "hover:text-primary text-sm font-medium transition-colors",
          pathname === "/my-gallery" && "text-primary underline",
        )}
      >
        My Gallery
      </Link>
    </nav>
  );
}
