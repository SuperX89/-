"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import EditProductSheet from "@/components/EditProductSheet";
import PromoteDraftSheet from "@/components/PromoteDraftSheet";
import { useToast } from "@/components/Toaster";
import { NoteIcon, PlusIcon, SearchIcon } from "@/components/Icons";
import type { ProductDTO } from "@/lib/types";

type SheetKind = "detail" | "edit" | "promote" | null;

export default function DraftsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [selected, setSelected] = useState<ProductDTO | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("status", "draft");
      if (q) params.set("q", q);
      const res = await fetch("/api/products?" + params.toString());
      const data = (await res.json()) as ProductDTO[];
      setProducts(data);
      setLoading(false);
    },
    [q]
  );

  useEffect(() => {
    load();
  }, [load]);

  function openDetail(p: ProductDTO) {
    setSelected(p);
    setSheet("detail");
  }

  const totalCost = products.reduce((s, p) => s + p.costPrice, 0);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[13px] text-ink-500 font-medium">รอตั้งราคา / เช็คตำหนิ</p>
          <h1 className="h-page mt-0.5">แบบร่าง</h1>
        </div>
        <Link
          href="/add"
          className="hidden md:inline-flex btn-primary"
          style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
        >
          <PlusIcon /> เพิ่มแบบร่าง
        </Link>
      </header>

      {/* Summary */}
      <section
        className="rounded-2xl p-4 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
      >
        <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center">
            <NoteIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[12px] text-white/80 font-medium">รวมแบบร่าง</div>
            <div className="text-[20px] font-bold tracking-tight leading-tight">
              {products.length} รายการ
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-white/80 font-medium">รวมทุน</div>
            <div className="font-bold tracking-tight">฿{totalCost.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 h-4 w-4" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาชื่อแบบร่าง…"
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

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[88px] rounded-2xl shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState hasFilter={q !== ""} />
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => openDetail(p)}
              onPromote={() => {
                setSelected(p);
                setSheet("promote");
              }}
            />
          ))}
        </div>
      )}

      <ProductDetailSheet
        product={selected}
        open={sheet === "detail"}
        onClose={() => setSheet(null)}
        onChanged={load}
        onEdit={() => setSheet("edit")}
        onReserve={() => {}}
        onSold={() => {}}
        onCancelReserve={() => {}}
        onPromote={() => setSheet("promote")}
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

      <PromoteDraftSheet
        product={selected}
        open={sheet === "promote"}
        onClose={() => setSheet("detail")}
        onDone={() => {
          setSheet(null);
          load();
          toast("เพิ่มเข้าสต็อกแล้ว — ดูที่หน้าสินค้าได้เลย");
        }}
      />
    </div>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="card p-10 text-center">
      <div
        className="h-20 w-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-purple-600"
        style={{ background: "linear-gradient(135deg, #faf5ff, #f3e8ff)" }}
      >
        <NoteIcon className="h-10 w-10" />
      </div>
      <p className="text-ink-900 font-bold mb-1 tracking-tight">
        {hasFilter ? "ไม่พบแบบร่างตามคำค้นหา" : "ยังไม่มีแบบร่าง"}
      </p>
      <p className="text-[13px] text-ink-500 mb-5">
        {hasFilter
          ? "ลองเปลี่ยนคำค้นหา"
          : "บันทึกแบบร่างไว้ก่อน เมื่อรับสินค้ามาแต่ยังไม่ได้ตั้งราคา"}
      </p>
      {!hasFilter && (
        <Link
          href="/add"
          className="btn-primary inline-flex"
          style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
        >
          <PlusIcon /> เพิ่มแบบร่าง
        </Link>
      )}
    </div>
  );
}
