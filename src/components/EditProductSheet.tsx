"use client";

import { useEffect, useState } from "react";
import BottomSheet from "./BottomSheet";
import ImageUploader from "./ImageUploader";
import { CategoryIcon } from "./Icons";
import { useToast } from "./Toaster";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export default function EditProductSheet({
  product,
  open,
  onClose,
  onSaved,
}: {
  product: ProductDTO | null;
  open: boolean;
  onClose: () => void;
  onSaved: (p: ProductDTO) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState("other");
  const [condition, setCondition] = useState("good");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && open) {
      setName(product.name === "(ยังไม่ได้ตั้งชื่อ)" ? "" : product.name);
      setImages(product.images);
      setCoverImage(product.coverImage);
      setCategory(product.category);
      setCondition(product.condition === "unchecked" ? "good" : product.condition);
      setCostPrice(String(product.costPrice));
      setSellingPrice(String(product.sellingPrice));
      setNote(product.note ?? "");
    }
  }, [product, open]);

  const profit = (Number(sellingPrice) || 0) - (Number(costPrice) || 0);

  async function submit() {
    if (!product) return;
    if (!name.trim()) {
      toast("กรุณากรอกชื่อสินค้า", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          images,
          coverImage,
          category,
          condition,
          costPrice: Number(costPrice) || 0,
          sellingPrice: Number(sellingPrice) || 0,
          note,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "บันทึกไม่สำเร็จ");
      const updated = (await res.json()) as ProductDTO;
      toast("บันทึกเรียบร้อย");
      onSaved(updated);
    } catch (e) {
      toast(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="แก้ไขสินค้า"
      footer={
        <button className="btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : "บันทึก"}
        </button>
      }
    >
      <div className="space-y-4 pt-2">
        <div>
          <label className="label">รูปสินค้า</label>
          <ImageUploader
            images={images}
            coverImage={coverImage}
            onChange={(imgs, c) => {
              setImages(imgs);
              setCoverImage(c);
            }}
          />
        </div>

        <div>
          <label className="label">ชื่อสินค้า *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">ราคาทุน</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="label">ราคาขาย *</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>
        </div>
        <div
          className={`text-sm rounded-xl px-3 py-2 ${
            profit < 0 ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"
          }`}
        >
          กำไรคาดการณ์ ฿{formatMoney(profit)}
        </div>

        <div>
          <label className="label">หมายเหตุ</label>
          <textarea
            className="input min-h-[80px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </BottomSheet>
  );
}
