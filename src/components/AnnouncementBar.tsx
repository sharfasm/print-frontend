"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const { brandInfo } = useShop();
  const [dismissed, setDismissed] = useState(false);

  if (!brandInfo?.announcementBar?.enabled || dismissed) {
    return null;
  }

  const { text, link, backgroundColor, textColor } = brandInfo.announcementBar;

  if (!text) return null;

  const isExternal = link?.startsWith("http");
  const content = (
    <div className="flex items-center justify-between px-4 py-2 md:py-3 max-w-full">
      <div className="flex-1 text-center text-sm font-semibold">
        {link ? (
          isExternal ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {text}
            </a>
          ) : (
            <Link href={link} className="hover:underline">
              {text}
            </Link>
          )
        ) : (
          text
        )}
      </div>
      <button onClick={() => setDismissed(true)} className="ml-4 p-1 hover:opacity-70 flex-shrink-0" aria-label="Dismiss announcement">
        <X size={18} />
      </button>
    </div>
  );

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: backgroundColor || "#b8860b",
        color: textColor || "#ffffff",
      }}
    >
      {content}
    </div>
  );
}
