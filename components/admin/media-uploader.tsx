"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/getMediaUrl";

interface Props {
  value?: string;
  onChange: (value: string, file?: File) => void;
  accept?: string;
  fileType?: "image" | "video";
}

export function MediaUploader({
  value,
  onChange,
  accept,
  fileType = "image",
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null); // 🔥 clave
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setCurrentFile(file); // 🔥 guardamos el file real
    onChange(url, file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setCurrentFile(null); // 🔥 reset
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // 🔥 URL final (backend + blob)
  const previewUrl = value ? getMediaUrl(value) : null;

  // 🔥 DETECCIÓN REAL (este es el fix importante)
  let isPdf = false;
  let isVideo = false;

  // 👉 archivo nuevo (blob)
  if (currentFile) {
    isPdf = currentFile.type === "application/pdf";
    isVideo = currentFile.type.startsWith("video/");
  }
  // 👉 backend
  else if (previewUrl) {
    isPdf = previewUrl.toLowerCase().includes(".pdf");
    isVideo = fileType === "video" || !!previewUrl?.match(/\.(mp4|webm|ogg)$/i);
  }

  const isImage = previewUrl && !isPdf && !isVideo;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-xl border overflow-hidden cursor-pointer transition-all",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-muted-foreground/50",
        value ? "bg-black" : "bg-muted/30",
      )}
    >
      {previewUrl ? (
        <>
          {/* 🔥 PDF */}
          {isPdf && (
            <iframe src={previewUrl} className="w-full h-[260px] bg-white" />
          )}

          {/* 🔥 VIDEO */}
          {isVideo && !isPdf && (
            <video
              src={previewUrl}
              className="w-full h-[260px] object-cover"
              autoPlay
              loop
              muted
            />
          )}

          {/* 🔥 IMAGE */}
          {isImage && (
            <img src={previewUrl} className="w-full h-[260px] object-cover" />
          )}

          {/* overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-sm">
            Replace file
          </div>

          {/* remove */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
          >
            <X className="size-4" />
          </button>
        </>
      ) : (
        <div className="h-[260px] flex flex-col items-center justify-center gap-2">
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Click or drag & drop
          </p>
          <span className="text-xs text-muted-foreground">
            Images, Videos or PDF
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
