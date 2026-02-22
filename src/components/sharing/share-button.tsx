"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  shareData: {
    title: string;
    text: string;
    url: string;
  };
  variant?: "button" | "icon" | "inline";
  className?: string;
}

export function ShareButton({
  shareData,
  variant = "button",
  className,
}: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${shareData.url}`
    : shareData.url;

  const handleShare = async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: fullUrl,
        });
        return;
      } catch {
        // User cancelled or API failed — fall through to dropdown
      }
    }
    setShowDropdown(!showDropdown);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowDropdown(false);
    }, 1500);
  };

  const handleTwitter = () => {
    const tweetText = encodeURIComponent(`${shareData.text}\n${fullUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
    setShowDropdown(false);
  };

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          className={cn(
            "rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600",
            className
          )}
        >
          <Share2 className="h-4 w-4" />
        </button>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {copied ? <Check className="h-4 w-4 text-kpp-green" /> : <LinkIcon className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={handleTwitter}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <XIcon className="h-4 w-4" />
                Share on X
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="relative inline-flex">
        <button
          onClick={handleShare}
          className={cn(
            "flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30",
            className
          )}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {copied ? <Check className="h-4 w-4 text-kpp-green" /> : <LinkIcon className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={handleTwitter}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <XIcon className="h-4 w-4" />
                Share on X
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50",
          className
        )}
      >
        <Share2 className="h-4 w-4" />
        Share Achievement
      </button>
      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-kpp-green" /> : <LinkIcon className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              onClick={handleTwitter}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <XIcon className="h-4 w-4" />
              Share on X
            </button>
          </div>
        </>
      )}
    </div>
  );
}
