"use client";

import { StatusBadge, ConditionBadge } from "./Badges";
import { CategoryIcon, CheckIcon } from "./Icons";
import { formatMoney } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import type { ProductDTO } from "@/lib/types";

export default function ProductCard({
  product,
  onClick,
  onReserve,
  onSold,
  onCancelReserve,
  onPromote,
}: {
  product: ProductDTO;
  onClick?: () => void;
  onReserve?: () => void;
  onSold?: () => void;
  onCancelReserve?: () => void;
  onPromote?: () => void;
}) {
  const profit = product.sellingPrice - product.costPrice;
  const cover = product.coverImage || product.images[0] || null;
  const isSold = product.status === "sold";
  const isDraft = product.status === "draft";

  return (
    <div className="card overflow-hidden">
      <button
        onClick={onClick}
        className="w-full text-left flex items-center gap-3 p-3 active:bg-ink-50 transition"
        aria-label={`ดูรายละเอียด ${product.name}`}
      >
        {/* Thumbnail */}
        <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-ink-100">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={product.name}
              className={`w-full h-full object-cover ${isSold ? "grayscale-[0.4] opacity-70" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-300">
              <CategoryIcon value={product.category} className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <StatusBadge status={product.status} />
            <ConditionBadge condition={product.condition} />
          </div>
          <div className="font-bold text-ink-900 truncate text-[14px] tracking-tight leading-tight">
            {product.name}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <CategoryIcon value={product.category} className="h-3 w-3 text-ink-400" />
            <span className="text-[11px] text-ink-400 font-medium">{categoryLabel(product.category)}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          {isDraft ? (
            <>
              <div className="text-[11px] text-ink-400 font-medium">ทุน</div>
              <div className="font-bold text-ink-700 text-[15px] tracking-tight">
                ฿{formatMoney(product.costPrice)}
              </div>
              <div className="text-[10px] text-purple-600 font-semibold mt-0.5">ยังไม่ตั้งราคา</div>
            </>
          ) : (
            <>
              <div className="font-bold text-ink-900 text-[15px] tracking-tight">
                ฿{formatMoney(product.sellingPrice)}
              </div>
              <div
                className={`text-[11px] font-semibold mt-0.5 ${
                  profit < 0 ? "text-red-500" : "text-brand-600"
                }`}
              >
                {profit < 0 ? "−" : "+"}฿{formatMoney(Math.abs(profit))}
              </div>
            </>
          )}
        </div>
      </button>

      {/* Reservation info */}
      {product.status === "reserved" && product.reservation && (
        <div className="mx-3 mb-2 text-[11px] bg-amber-50 text-amber-800 rounded-lg px-2.5 py-1.5 ring-1 ring-amber-100 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
          <span className="truncate font-semibold">{product.reservation.customerName}</span>
          {product.reservation.contact && (
            <span className="text-amber-600 truncate">· {product.reservation.contact}</span>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!isSold && (
        <div className="flex gap-1.5 px-3 pb-3">
          {product.status === "available" && (
            <>
              <button
                className="flex-1 rounded-lg bg-ink-100 text-ink-800 font-semibold py-2 text-[12px] hover:bg-ink-200 active:scale-95 transition"
                onClick={onReserve}
              >
                จอง
              </button>
              <button
                className="flex-1 rounded-lg text-white font-semibold py-2 text-[12px] active:scale-95 transition inline-flex items-center justify-center gap-1"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }}
                onClick={onSold}
              >
                <CheckIcon className="h-3.5 w-3.5" /> ขายแล้ว
              </button>
            </>
          )}
          {product.status === "reserved" && (
            <>
              <button
                className="flex-1 rounded-lg bg-red-50 text-red-700 font-semibold py-2 text-[12px] ring-1 ring-red-200 hover:bg-red-100 active:scale-95 transition"
                onClick={onCancelReserve}
              >
                ยกเลิกจอง
              </button>
              <button
                className="flex-1 rounded-lg text-white font-semibold py-2 text-[12px] active:scale-95 transition inline-flex items-center justify-center gap-1"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }}
                onClick={onSold}
              >
                <CheckIcon className="h-3.5 w-3.5" /> ขายแล้ว
              </button>
            </>
          )}
          {isDraft && (
            <button
              className="flex-1 rounded-lg text-white font-semibold py-2 text-[12px] active:scale-95 transition inline-flex items-center justify-center gap-1"
              style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
              onClick={onPromote}
            >
              <CheckIcon className="h-3.5 w-3.5" /> เพิ่มเข้าสต็อก
            </button>
          )}
        </div>
      )}
    </div>
  );
}
