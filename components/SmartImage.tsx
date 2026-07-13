"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SmartImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  fallbackLabel?: string;
  fallbackClassName?: string;
};

export function SmartImage({
  alt,
  fallbackLabel,
  fallbackClassName = "",
  className,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_78%_20%,rgba(255,204,83,0.2),transparent_24%),linear-gradient(135deg,#002C5D,#002C5D)] p-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white ${fallbackClassName}`}
      >
        <span>{fallbackLabel ?? "Replace image asset"}</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
