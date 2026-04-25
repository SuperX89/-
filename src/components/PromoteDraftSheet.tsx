"use client";

import { useEffect, useState } from "react";
import BottomSheet from "./BottomSheet";
import { CheckIcon } from "./Icons";
import { useToast } from "./Toaster";
import { CONDITIONS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export default function PromoteDraftSheet({
  product,
  open,
  onClose,
  onDone,
}: {
  product: ProductDTO | null;
  open: boolean;
  onClose: () => void;
  onDone: (p: ProductDTO) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("good");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && open) {
      setName(
        product.name === "(ยังไม่ได้ตั้งชื่อ)" || !product.name ? "" : product.name
      );
      setCondition(product.condition === "unchecked" ? "good" : product.condition);
      setSellingPrice(product.sellingPrice ? String(product.sellingPrice) : "");
      setCostPrice(String(product.costPrice));
      setNote(product.note ?? "");
    }
  }, [product, open]);

  const profit = (Number(sellingPrice) || 0) - (Number(costPrice) || 0);
  const hasProfit = costPrice && sellingPrice;

  async function submit() {
    if (!product) return;
    if (!name.trim()) {
      toast("กรุณากรอกชื่อสินค้า", "error");
      return;
    }
    if (!sellingPrice || Number(sellingPrice) < 0) {
      toast("กรุณากรอกราคาขาย", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          condition,
          sellingPrice: Number(sellingPrice) || 0,
          costPrice: Number(costPrice) || 0,
          note,
          status: "available",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "บันทึกไม่สำเร็จ");
      const updated = (await res.json()) as ProductDTO;
      toast("เพิ่มเข้าสต็อกแล้ว");
      onDone(updated);
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
      title="เพิ่มเข้าสต็อก"
      footer={
        <button
          className="btn-primary w-full"
          onClick={submit}
          disabled={loading}
          style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <CheckIcon className="h-4 w-4" /> ยืนยันเพิ่มเข้าสต็อก
            </>
          )}
        </button>
      }
    >
      <div className="space-y-4 pt-2">
        <div className="bg-purple-50 ring-1 ring-purple-100 rounded-xl px-4 py-3 text-[13px] text-purple-800">
          ตั้งชื่อ + ราคา + เช็คตำหนิ ก่อนเพิ่มเข้าสต็อกพร้อมขาย
        </div>

        <div>
          <label className="label">
            ชื่อสินค้า <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น รถหัดเดิน Fisher-Price"
            autoFocus
          />
        </div>

        <div>
          <label className="label">สภาพสินค้า</label>
          <div className="grid grid-cols-3 gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCondition(c.value)}
                className={
                  condition === c.value
                    ? "chip-on justify-center"
                    : "chip-off justify-center"
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
        </div>

        {hasProfit && (
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
        )}

        <div>
          <label className="label">หมายเหตุ</label>
          <textarea
            className="input min-h-[70px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น มีรอยนิดหน่อย"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
