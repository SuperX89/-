"use client";

import { useEffect, useState } from "react";
import BottomSheet from "./BottomSheet";
import { useToast } from "./Toaster";
import { formatMoney, toInputDate } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export default function SellSheet({
  product,
  open,
  onClose,
  onDone,
}: {
  product: ProductDTO | null;
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const toast = useToast();
  const [actualSalePrice, setActualSalePrice] = useState("");
  const [shippingCost, setShippingCost] = useState("0");
  const [soldAt, setSoldAt] = useState(() => toInputDate(new Date()));
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && open) {
      setActualSalePrice(String(product.sellingPrice));
      setShippingCost("0");
      setSoldAt(toInputDate(new Date()));
      setCustomerName(product.reservation?.customerName ?? "");
      setContact(product.reservation?.contact ?? "");
      setTrackingNumber("");
      setNote("");
    }
  }, [product, open]);

  const price = Number(actualSalePrice) || 0;
  const ship = Number(shippingCost) || 0;
  const cost = product?.costPrice ?? 0;
  const profit = price - cost - ship;

  async function submit() {
    if (!product) return;
    if (!Number.isFinite(price) || price < 0) {
      toast("ราคาขายจริงไม่ถูกต้อง", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actualSalePrice: price,
          shippingCost: ship,
          soldAt: new Date(soldAt).toISOString(),
          customerName,
          contact,
          trackingNumber,
          note,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "เกิดข้อผิดพลาด");
      toast("บันทึกการขายสำเร็จ");
      onDone();
    } catch (e) {
      toast(e instanceof Error ? e.message : "เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={`บันทึกการขาย: ${product?.name ?? ""}`}
      footer={
        <button className="btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : "บันทึกการขาย"}
        </button>
      }
    >
      <div className="space-y-3 pt-2">
        <div className="bg-surface-muted rounded-xl p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">ทุน</span>
            <span>฿{formatMoney(cost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">ราคาขาย (ตั้ง)</span>
            <span>฿{formatMoney(product?.sellingPrice ?? 0)}</span>
          </div>
          <div className="flex justify-between mt-1 pt-1 border-t border-ink-300/40 font-semibold">
            <span>กำไรจริง</span>
            <span className={profit < 0 ? "text-red-600" : "text-brand-600"}>
              ฿{formatMoney(profit)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">ราคาขายจริง *</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={actualSalePrice}
              onChange={(e) => setActualSalePrice(e.target.value)}
            />
          </div>
          <div>
            <label className="label">ค่าส่ง</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">วันที่ขาย</label>
          <input
            type="date"
            className="input"
            value={soldAt}
            onChange={(e) => setSoldAt(e.target.value)}
          />
        </div>

        <div>
          <label className="label">ชื่อลูกค้า</label>
          <input
            className="input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">ช่องทางติดต่อ</label>
          <input
            className="input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div>
          <label className="label">เลขพัสดุ</label>
          <input
            className="input"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="ถ้ายังไม่มี เว้นว่างได้"
          />
        </div>
        <div>
          <label className="label">หมายเหตุการขาย</label>
          <textarea
            className="input min-h-[70px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </BottomSheet>
  );
}
