"use client";

import { useRef, useState } from "react";

type Props = {
  images: string[];
  coverImage: string | null;
  onChange: (images: string[], cover: string | null) => void;
  max?: number;
  disabled?: boolean;
};

export default function ImageUploader({
  images,
  coverImage,
  onChange,
  max = 5,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const slots = max - images.length;
    if (slots <= 0) {
      setErr(`อัปโหลดได้สูงสุด ${max} รูป`);
      return;
    }

    const chosen = Array.from(files).slice(0, slots);
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      for (const f of chosen) fd.append("files", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      }
      const { paths } = (await res.json()) as { paths: string[] };
      const newImages = [...images, ...paths];
      const newCover = coverImage || newImages[0] || null;
      onChange(newImages, newCover);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    let nextCover = coverImage;
    if (coverImage && !next.includes(coverImage)) nextCover = next[0] || null;
    onChange(next, nextCover);
  }

  function setCover(path: string) {
    onChange(images, path);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((src, idx) => {
          const isCover = src === coverImage;
          return (
            <div
              key={src + idx}
              className={`relative aspect-square rounded-2xl overflow-hidden transition ${
                isCover ? "ring-2 ring-brand-500 shadow-brand" : "ring-1 ring-ink-200"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-ink-900/70 backdrop-blur text-white text-xs flex items-center justify-center hover:bg-ink-900/90 transition"
                aria-label="ลบรูป"
              >
                ✕
              </button>
              {isCover ? (
                <div className="absolute bottom-1.5 left-1.5 bg-brand-500 text-white text-[10px] rounded-lg px-2 py-0.5 font-bold shadow-soft">
                  รูปหลัก
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCover(src)}
                  className="absolute bottom-1.5 left-1.5 right-1.5 bg-ink-900/70 backdrop-blur text-white text-[10px] rounded-lg py-1 font-semibold hover:bg-ink-900/90 transition"
                >
                  ตั้งเป็นรูปหลัก
                </button>
              )}
            </div>
          );
        })}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="aspect-square rounded-2xl border-2 border-dashed border-ink-300 bg-ink-50 flex flex-col items-center justify-center text-ink-500 text-[12px] gap-1.5 font-semibold hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-50 transition"
          >
            {uploading ? (
              <>
                <span className="spinner-dark" />
                <span>กำลังอัปโหลด</span>
              </>
            ) : (
              <>
                <CameraIcon className="h-7 w-7" />
                <span>เพิ่มรูป</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-[11px] text-ink-500 mt-2 font-medium">
        {images.length}/{max} รูป · กดที่รูปเพื่อตั้งเป็นรูปหลัก
      </p>
      {err ? <p className="text-[12px] text-red-600 mt-1 font-medium">{err}</p> : null}
    </div>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 8a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
