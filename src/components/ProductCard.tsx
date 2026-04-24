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
}: {
  product: ProductDTO;
  onClick?: () => void;
  onReserve?: () => void;
  onSold?: () => void;
  onCancelReserve?: () => void;
}) {
  const profit = product.sellingPrice - product.costPrice;
  const cover = product.coverImage || product.images[0] || null;
  const isSold = product.status === "sold";

  return (
    <div className="card overflow-hidden group">
      <button
        onClick={onClick}
        className="w-full text-left active:scale-[0.99] transition"
        aria-label={`ดูรายละเอียด ${product.name}`}
      >
        <div className="relative aspect-[4/3] bg-ink-100 overflow-hidden">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={cover}
              alt={product.name}
              className={`w-full h-full object-cover transition ${
                isSold ? "opacity-80 grayscale-[0.3]" : "group-hover:scale-[1.02]"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-300">
              <CategoryIcon value={product.category} className="h-16 w-16" />
            </div>
          )}
          {/* Gradient fade for status/condition visibility */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <StatusBadge status={product.status} />
          </div>
          <div className="absolute top-2.5 right-2.5">
            <ConditionBadge condition={product.condition} />
          </div>
        </div>

        <div className="p-3.5">
          <div className="text-[11px] font-semibold text-ink-500 flex items-center gap-1.5 tracking-tight">
            <CategoryIcon value={product.category} className="h-3 w-3" />
            <span className="uppercase">{categoryLabel(product.category)}</span>
          </div>
          <div className="font-bold text-ink-900 truncate mt-0.5 tracking-tight">
            {product.name}
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <div className="text-[22px] font-bold text-ink-900 leading-none tracking-tight">
                ฿{formatMoney(product.sellingPrice)}
              </div>
              <div className="text-[11px] text-ink-500 mt-1">
                ทุน ฿{formatMoney(product.costPrice)}
              </div>
            </div>
            <div
              className={`pill ${
                profit < 0
                  ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                  : "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
              }`}
            >
              {profit < 0 ? "−" : "+"}฿{formatMoney(Math.abs(profit))}
            </div>
          </div>

          {product.status === "reserved" && product.reservation ? (
            <div className="mt-3 text-[12px] bg-amber-50 text-amber-800 rounded-xl px-2.5 py-2 ring-1 ring-amber-100 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
              <span className="truncate">
                <span className="font-semibold">{product.reservation.customerName}</span>
                {product.reservation.contact ? ` · ${product.reservation.contact}` : ""}
              </span>
            </div>
          ) : null}
        </div>
      </button>

      {!isSold && (
        <div className="flex gap-2 px-3.5 pb-3.5">
          {product.status === "available" && (
            <>
              <button
                className="flex-1 rounded-xl bg-ink-100 text-ink-800 font-semibold py-2.5 text-[13px] hover:bg-ink-200 active:scale-95 transition"
                onClick={onReserve}
              >
                จอง
              </button>
              <button
                className="flex-1 rounded-xl text-white font-semibold py-2.5 text-[13px] active:scale-95 transition inline-flex items-center justify-center gap-1.5"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                  boxShadow: "0 6px 20px -8px rgba(16,185,129,0.4)",
                }}
                onClick={onSold}
              >
                <CheckIcon className="h-4 w-4" /> ขายแล้ว
              </button>
            </>
          )}
          {product.status === "reserved" && (
            <>
              <button
                className="flex-1 rounded-xl bg-red-50 text-red-700 font-semibold py-2.5 text-[13px] ring-1 ring-red-200 hover:bg-red-100 active:scale-95 transition"
                onClick={onCancelReserve}
              >
                ยกเลิกจอง
              </button>
              <button
                className="flex-1 rounded-xl text-white font-semibold py-2.5 text-[13px] active:scale-95 transition inline-flex items-center justify-center gap-1.5"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                  boxShadow: "0 6px 20px -8px rgba(16,185,129,0.4)",
                }}
                onClick={onSold}
              >
                <CheckIcon className="h-4 w-4" /> ขายแล้ว
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
