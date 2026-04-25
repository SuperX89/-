"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { useToast } from "@/components/Toaster";
import { CategoryIcon, CashIcon, CheckIcon } from "@/components/Icons";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";

type Mode = "stock" | "draft";

export default function AddProductPage() {
  const router = useRouter();
  const toast = useToast();

  const [mode, setMode] = useState<Mode>("stock");

  const [name, setName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("toy");
  const [condition, setCondition] = useState<string>("good");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const profit = (Number(sellingPrice) || 0) - (Number(costPrice) || 0);
  const hasProfit = costPrice && sellingPrice;
  const isDraft = mode === "draft";

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (!isDraft && !name.trim()) return toast("กรุณากรอกชื่อสินค้า", "error");
    if (!isDraft && (!sellingPrice || Number(sellingPrice) < 0))
      return toast("กรุณากรอกราคาขาย", "error");
    if (isDraft && images.length === 0)
      return toast("กรุณาแนบรูปอย่างน้อย 1 รูป", "error");

    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          images,
          coverImage,
          category,
          condition: isDraft ? "unchecked" : condition,
          costPrice: Number(costPrice) || 0,
          sellingPrice: isDraft ? 0 : Number(sellingPrice) || 0,
          note,
          status: isDraft ? "draft" : "available",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "เกิดข้อผิดพลาด");
      toast(isDraft ? "บันทึกแบบร่างแล้ว" : "เพิ่มสินค้าสำเร็จ");
      router.push("/products");
    } catch (e) {
      toast(e instanceof Error ? e.message : "เกิดข้อผิดพลาด", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5 pb-28 md:pb-6">
      <header>
        <p className="text-[13px] text-ink-500 font-medium">สินค้าชิ้นใหม่</p>
        <h1 className="h-page mt-0.5">เพิ่มสินค้า</h1>
        <p className="text-[13px] text-ink-500 mt-1">
          {isDraft
            ? "ใส่แค่ทุน + รูปก่อน — ไปตั้งราคา/เช็คตำหนิทีหลังได้"
            : "ถ่ายรูป กรอกข้อมูล แล้วกดบันทึก"}
        </p>
      </header>

      {/* Mode toggle */}
      <section className="card p-1.5">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setMode("stock")}
            className={
              mode === "stock"
                ? "rounded-xl text-white font-semibold py-2.5 text-[13px] tracking-tight"
                : "rounded-xl text-ink-600 font-semibold py-2.5 text-[13px] tracking-tight"
            }
            style={
              mode === "stock"
                ? { background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }
                : undefined
            }
          >
            สต็อกพร้อมขาย
          </button>
          <button
            type="button"
            onClick={() => setMode("draft")}
            className={
              mode === "draft"
                ? "rounded-xl text-white font-semibold py-2.5 text-[13px] tracking-tight"
                : "rounded-xl text-ink-600 font-semibold py-2.5 text-[13px] tracking-tight"
            }
            style={
              mode === "draft"
                ? { background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }
                : undefined
            }
          >
            แบบร่าง (รอเพิ่มทีหลัง)
          </button>
        </div>
      </section>

      <section className="card p-4">
        <label className="label">
          รูปสินค้า (สูงสุด 5 รูป) {isDraft && <span className="text-red-500">*</span>}
        </label>
        <ImageUploader
          images={images}
          coverImage={coverImage}
          onChange={(imgs, c) => {
            setImages(imgs);
            setCoverImage(c);
          }}
        />
      </section>

      <section className="card p-4 space-y-4">
        <div>
          <label className="label">
            ชื่อสินค้า {!isDraft && <span className="text-red-500">*</span>}
            {isDraft && <span className="text-ink-400 font-normal text-[12px]"> (ใส่ทีหลังได้)</span>}
          </label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isDraft ? "เช่น lot1, ของจากญาติ" : "เช่น รถหัดเดิน Fisher-Price"}
          />
        </div>

        <div>
          <label className="label">หมวดหมู่</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={category === c.value ? "chip-on justify-center" : "chip-off justify-center"}
              >
                <CategoryIcon value={c.value} className="h-4 w-4" />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {!isDraft && (
          <div>
            <label className="label">สภาพสินค้า</label>
            <div className="grid grid-cols-3 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCondition(c.value)}
                  className={condition === c.value ? "chip-on justify-center" : "chip-off justify-center"}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="h-section flex items-center gap-2">
          <CashIcon className="h-4 w-4 text-brand-600" />
          ราคา
        </h2>
        <div className={isDraft ? "" : "grid grid-cols-2 gap-2"}>
          <div>
            <label className="label">ราคาทุน</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-medium">฿</span>
              <input
                className="input pl-8"
                type="number"
                inputMode="decimal"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          {!isDraft && (
            <div>
              <label className="label">
                ราคาขาย <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-medium">฿</span>
                <input
                  className="input pl-8"
                  type="number"
                  inputMode="decimal"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>

        {!isDraft && hasProfit ? (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between ${
              profit < 0
                ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                : "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
            }`}
          >
            <span>กำไรคาดการณ์</span>
            <span className="text-lg font-bold">
              {profit < 0 ? "−" : "+"}฿{formatMoney(Math.abs(profit))}
            </span>
          </div>
        ) : null}
      </section>

      <section className="card p-4">
        <label className="label">หมายเหตุ</label>
        <textarea
          className="input min-h-[90px]"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isDraft ? "เช่น รับมาจาก lot โครงการ" : "เช่น มีรอยนิดหน่อย, ไม่มีฝาครอบ"}
        />
      </section>

      {/* Sticky save button on mobile — sits above BottomNav */}
      <div
        className="fixed inset-x-0 md:static z-50"
        style={{ bottom: "calc(84px + env(safe-area-inset-bottom))" }}
      >
        <div className="glass md:bg-transparent border-t border-ink-200 md:border-0 p-3 md:p-0">
          <div className="max-w-3xl mx-auto flex gap-2">
            <button
              type="button"
              className="btn-secondary flex-1 md:flex-none md:px-6"
              onClick={() => router.back()}
              disabled={saving}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={saving}
              style={
                isDraft
                  ? { background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }
                  : undefined
              }
            >
              {saving ? (
                <>
                  <span className="spinner" /> กำลังบันทึก…
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  {isDraft ? "บันทึกแบบร่าง" : "บันทึกสินค้า"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
