"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import ConfirmDialog from "./ConfirmDialog";
import { StatusBadge, ConditionBadge } from "./Badges";
import { CategoryIcon, CheckIcon, ClockIcon, EditIcon, TrashIcon } from "./Icons";
import { useToast } from "./Toaster";
import { formatMoney, formatDateTime } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import type { ProductDTO } from "@/lib/types";

export default function ProductDetailSheet({
  product,
  open,
  onClose,
  onChanged,
  onEdit,
  onReserve,
  onSold,
  onCancelReserve,
}: {
  product: ProductDTO | null;
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
  onEdit: () => void;
  onReserve: () => void;
  onSold: () => void;
  onCancelReserve: () => void;
}) {
  const toast = useToast();
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!product) return null;

  const profit = product.sellingPrice - product.costPrice;

  async function del() {
    if (!product) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "ลบไม่สำเร็จ");
      toast("ลบสินค้าแล้ว");
      setConfirmDel(false);
      onChanged();
      onClose();
    } catch (e) {
      toast(e instanceof Error ? e.message : "ลบไม่สำเร็จ", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="รายละเอียดสินค้า">
      <div className="space-y-4 pt-2">
        {product.images.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x snap-mandatory">
            {product.images.map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={src}
                alt=""
                className="h-56 w-56 rounded-2xl object-cover flex-shrink-0 bg-ink-100 snap-start ring-1 ring-ink-900/[0.04]"
              />
            ))}
          </div>
        ) : (
          <div className="h-48 rounded-2xl bg-ink-100 flex items-center justify-center text-ink-300">
            <CategoryIcon value={product.category} className="h-20 w-20" />
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-ink-500 font-semibold uppercase tracking-wide">
            <CategoryIcon value={product.category} className="h-3.5 w-3.5" />
            <span>{categoryLabel(product.category)}</span>
          </div>
          <h3 className="text-[22px] font-bold text-ink-900 mt-1 tracking-tight">
            {product.name}
          </h3>
          <div className="flex gap-2 mt-2.5">
            <StatusBadge status={product.status} />
            <ConditionBadge condition={product.condition} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-ink-50 rounded-2xl p-4 ring-1 ring-ink-900/[0.04]">
          <div>
            <div className="text-[11px] text-ink-500 font-medium">ราคาขาย</div>
            <div className="font-bold text-ink-900 tracking-tight">
              ฿{formatMoney(product.sellingPrice)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 font-medium">ทุน</div>
            <div className="font-semibold text-ink-800">
              ฿{formatMoney(product.costPrice)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 font-medium">กำไรคาด</div>
            <div className={`font-bold ${profit < 0 ? "text-red-600" : "text-brand-600"}`}>
              {profit < 0 ? "−" : "+"}฿{formatMoney(Math.abs(profit))}
            </div>
          </div>
        </div>

        {product.reservation ? (
          <div className="bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-4 text-[13px]">
            <div className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" /> ข้อมูลการจอง
            </div>
            <div className="space-y-1 text-amber-900">
              <div>
                <span className="text-amber-700/80">ลูกค้า:</span>{" "}
                <span className="font-semibold">{product.reservation.customerName}</span>
              </div>
              {product.reservation.contact ? (
                <div>
                  <span className="text-amber-700/80">ติดต่อ:</span> {product.reservation.contact}
                </div>
              ) : null}
              <div>
                <span className="text-amber-700/80">เวลา:</span>{" "}
                {formatDateTime(product.reservation.reservedAt)}
              </div>
              {product.reservation.note ? (
                <div>
                  <span className="text-amber-700/80">หมายเหตุ:</span> {product.reservation.note}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {product.note ? (
          <div className="card-flat p-3">
            <div className="label mb-1">หมายเหตุ</div>
            <div className="text-[13px] text-ink-700 whitespace-pre-wrap">{product.note}</div>
          </div>
        ) : null}

        <div className="text-[11px] text-ink-400">
          เพิ่มเมื่อ {formatDateTime(product.createdAt)}
          <br />
          อัปเดตล่าสุด {formatDateTime(product.updatedAt)}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button className="btn-secondary" onClick={onEdit}>
            <EditIcon /> แก้ไข
          </button>
          {product.status === "available" && (
            <>
              <button className="btn-secondary" onClick={onReserve}>
                จอง
              </button>
              <button className="btn-primary col-span-2" onClick={onSold}>
                <CheckIcon /> ขายแล้ว
              </button>
            </>
          )}
          {product.status === "reserved" && (
            <>
              <button className="btn-danger" onClick={onCancelReserve}>
                ยกเลิกจอง
              </button>
              <button className="btn-primary col-span-2" onClick={onSold}>
                <CheckIcon /> ขายแล้ว
              </button>
            </>
          )}
          {product.status !== "sold" && (
            <button className="btn-danger col-span-2" onClick={() => setConfirmDel(true)}>
              <TrashIcon /> ลบสินค้า
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDel}
        danger
        title="ลบสินค้านี้?"
        message={`"${product.name}" จะถูกลบถาวร`}
        confirmText="ลบ"
        loading={deleting}
        onConfirm={del}
        onCancel={() => setConfirmDel(false)}
      />
    </BottomSheet>
  );
}
