"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import { useToast } from "./Toaster";
import type { ProductDTO } from "@/lib/types";

export default function ReserveSheet({
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
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [reservedAt, setReservedAt] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!product) return;
    if (!customerName.trim()) {
      toast("กรุณากรอกชื่อลูกค้า", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          contact,
          reservedAt: new Date(reservedAt).toISOString(),
          note,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "เกิดข้อผิดพลาด");
      const updated = (await res.json()) as ProductDTO;
      toast("จองสินค้าสำเร็จ");
      onDone(updated);
      setCustomerName("");
      setContact("");
      setNote("");
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
      title={`จองสินค้า: ${product?.name ?? ""}`}
      footer={
        <button className="btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : "บันทึกการจอง"}
        </button>
      }
    >
      <div className="space-y-3 pt-2">
        <div>
          <label className="label">ชื่อลูกค้า *</label>
          <input
            className="input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="เช่น คุณแม่มะลิ"
            autoFocus
          />
        </div>
        <div>
          <label className="label">ช่องทางติดต่อ</label>
          <input
            className="input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Facebook / LINE / เบอร์โทร"
          />
        </div>
        <div>
          <label className="label">เวลาจอง</label>
          <input
            type="datetime-local"
            className="input"
            value={reservedAt}
            onChange={(e) => setReservedAt(e.target.value)}
          />
        </div>
        <div>
          <label className="label">หมายเหตุ</label>
          <textarea
            className="input min-h-[80px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น นัดรับวันเสาร์"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
