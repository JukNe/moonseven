"use client";

import { useCallback, useState } from "react";

/**
 * The file must be H.264 (AVC) + yuv420p in an MP4 container. HEVC/H.265 in MP4
 * often fails in Chrome/Firefox with “format not supported”. Run
 * `npm run encode:hero-video` (requires ffmpeg) to re-encode from source.
 */
export default function HeroBackgroundVideo() {
  const [decodeFailed, setDecodeFailed] = useState(false);

  const onVideoError = useCallback(() => {
    setDecodeFailed(true);
  }, []);

  if (decodeFailed) {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-0 scale-[1.02] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-950 dark:to-black"
        aria-hidden
      />
    );
  }

  return (
    <video
      className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.02] object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={onVideoError}
      aria-hidden
    >
      <source src="/background-video.webm" type="video/webm" />
    </video>
  );
}
