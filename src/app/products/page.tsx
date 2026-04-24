"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import ReserveSheet from "@/components/ReserveSheet";
import SellSheet from "@/components/SellSheet";
import EditProductSheet from "@/components/EditProductSheet";
import { useToast } from "@/components/Toaster";
import { CategoryIcon, PlusIcon, SearchIcon } from "@/components/Icons";
import { STATUSES, CATEGORIES } from "@/lib/constants";
import type { ProductDTO } from "@/lib/types";

type SheetKind = "detail" | "reserve" | "sell" | "edit" | null;

export default function ProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const [selected, setSelected] = useState<ProductDTO | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);
      if (category !== "all") params.set("category", category);
      const res = await fetch("/api/products?" + params.toString());
      const data = (await res.json()) as ProductDTO[];
      setProducts(data);
      setLoading(false);
    },
    [q, status, category]
  );

  useEffect(() => {
    load();
  }, [load]);

  function openDetail(p: ProductDTO) {
    setSelected(p);
    setSheet("detail");
  }

  async function cancelReservation(p: ProductDTO) {
    try {
      const res = await fetch(`/api/products/${p.id}/cancel-reservation`, {
        method: "POST",
      });
      if (!res.ok) throw new Error((await res.json()).error || "ยกเลิกไม่สำเร็จ");
      const updated = (await res.json()) as ProductDTO;
      toast("ยกเลิกการจองแล้ว");
      if (selected?.id === p.id) setSelected(updated);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "ยกเลิกไม่สำเร็จ", "error");
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[13px] text-ink-500 font-medium">จัดการสต็อก</p>
          <h1 className="h-page mt-0.5">สินค้า</h1>
        </div>
        <Link href="/add" className="btn-primary hidden md:inline-flex">
          <PlusIcon /> เพิ่มสินค้า
        </Link>
      </header>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 h-4 w-4" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า…"
          className="input pl-11"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-ink-100 text-ink-500 flex items-center justify-center text-sm"
            aria-label="ล้าง"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <FilterChip label="ทั้งหมด" active={status === "all"} onClick={() => setStatus("all")} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s.value}
            label={s.label}
            active={status === s.value}
            onClick={() => setStatus(s.value)}
          />
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <FilterChip
          label="ทุกหมวด"
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={category === c.value ? "chip-on" : "chip-off"}
          >
            <CategoryIcon value={c.value} className="h-3.5 w-3.5" />
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState hasFilter={q !== "" || status !== "all" || category !== "all"} />
      ) : (
        <>
          <div className="text-[12px] text-ink-500 font-medium">
            พบ <span className="text-ink-900 font-bold">{products.length}</span> รายการ
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => openDetail(p)}
                onReserve={() => {
                  setSelected(p);
                  setSheet("reserve");
                }}
                onSold={() => {
                  setSelected(p);
                  setSheet("sell");
                }}
                onCancelReserve={() => cancelReservation(p)}
              />
            ))}
          </div>
        </>
      )}

      <ProductDetailSheet
        product={selected}
        open={sheet === "detail"}
        onClose={() => setSheet(null)}
        onChanged={load}
        onEdit={() => setSheet("edit")}
        onReserve={() => setSheet("reserve")}
        onSold={() => setSheet("sell")}
        onCancelReserve={() => selected && cancelReservation(selected)}
      />

      <ReserveSheet
        product={selected}
        open={sheet === "reserve"}
        onClose={() => setSheet("detail")}
        onDone={(updated) => {
          setSelected(updated);
          setSheet("detail");
          load();
        }}
      />

      <SellSheet
        product={selected}
        open={sheet === "sell"}
        onClose={() => setSheet("detail")}
        onDone={() => {
          setSheet(null);
          load();
        }}
      />

      <EditProductSheet
        product={selected}
        open={sheet === "edit"}
        onClose={() => setSheet("detail")}
        onSaved={(updated) => {
          setSelected(updated);
          setSheet("detail");
          load();
        }}
      />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={active ? "chip-on" : "chip-off"}>
      {label}
    </button>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="card p-10 text-center">
      <div
        className="h-20 w-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-brand-600"
        style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}
      >
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7.4 12 3l9 4.4v9L12 21l-9-4.6z" />
          <path d="M3 7.4 12 12l9-4.6" />
          <path d="M12 12v9" />
        </svg>
      </div>
      <p className="text-ink-900 font-bold mb-1 tracking-tight">
        {hasFilter ? "ไม่พบสินค้าตามตัวกรอง" : "ยังไม่มีสินค้าในสต็อก"}
      </p>
      <p className="text-[13px] text-ink-500 mb-5">
        {hasFilter ? "ลองเปลี่ยนตัวกรองหรือค้นหาคำอื่น" : "เริ่มต้นเพิ่มสินค้าชิ้นแรกได้เลย"}
      </p>
      {!hasFilter && (
        <Link href="/add" className="btn-primary inline-flex">
          <PlusIcon /> เพิ่มสินค้า
        </Link>
      )}
    </div>
  );
}
