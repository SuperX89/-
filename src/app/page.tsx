"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BoxIcon,
  CashIcon,
  ClockIcon,
  PlusIcon,
  ReceiptIcon,
  SparkleIcon,
} from "@/components/Icons";
import { formatMoney, formatDate } from "@/lib/format";
import type { DashboardSummary } from "@/lib/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[13px] text-ink-500 font-medium">สวัสดีคุณแม่</p>
          <h1 className="h-page mt-0.5">แดชบอร์ด</h1>
        </div>
        <Link href="/add" className="btn-primary hidden md:inline-flex">
          <PlusIcon /> เพิ่มสินค้า
        </Link>
      </header>

      {loading ? (
        <>
          <div className="h-40 rounded-3xl shimmer" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl shimmer" />
            ))}
          </div>
        </>
      ) : data ? (
        <>
          {/* HERO — total profit */}
          <div
            className="relative overflow-hidden rounded-3xl p-5 text-white shadow-brand"
            style={{
              background:
                "linear-gradient(135deg, #0d9488 0%, #10b981 55%, #34d399 100%)",
            }}
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-white/80 text-[13px] font-medium">
                <SparkleIcon className="h-4 w-4" />
                กำไรรวมสะสม
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[34px] font-bold tracking-tight leading-none">
                  ฿{formatMoney(data.totalProfit)}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-[13px] text-white/90">
                <div>
                  <div className="text-white/70 text-[11px] font-medium">ยอดขาย</div>
                  <div className="font-semibold">฿{formatMoney(data.totalRevenue)}</div>
                </div>
                <div className="h-8 w-px bg-white/25" />
                <div>
                  <div className="text-white/70 text-[11px] font-medium">ทุนคงค้าง</div>
                  <div className="font-semibold">฿{formatMoney(data.unsoldCostValue)}</div>
                </div>
                <div className="h-8 w-px bg-white/25" />
                <div>
                  <div className="text-white/70 text-[11px] font-medium">ขายแล้ว</div>
                  <div className="font-semibold">{data.sold} ชิ้น</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick status tiles */}
          <section className="grid grid-cols-4 gap-2.5">
            <StatusTile
              label="พร้อมขาย"
              value={data.available}
              color="bg-brand-500 text-white"
            />
            <StatusTile
              label="จองแล้ว"
              value={data.reserved}
              color="bg-amber-400 text-amber-950"
            />
            <StatusTile
              label="ขายแล้ว"
              value={data.sold}
              color="bg-ink-200 text-ink-700"
            />
            <StatusTile
              label="รอเพิ่มสต็อก"
              value={data.draft}
              color="bg-purple-500 text-white"
            />
          </section>

          {/* Quick actions on mobile */}
          <section className="grid grid-cols-2 gap-2.5 md:hidden">
            <Link
              href="/products"
              className="card p-4 flex items-center gap-3 active:scale-[0.98] transition"
            >
              <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center ring-1 ring-brand-100">
                <BoxIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-ink-900 text-sm">สินค้า</div>
                <div className="text-[11px] text-ink-500">ดูทั้งหมด</div>
              </div>
            </Link>
            <Link
              href="/sales"
              className="card p-4 flex items-center gap-3 active:scale-[0.98] transition"
            >
              <div className="h-11 w-11 rounded-xl bg-peach-50 text-peach-500 flex items-center justify-center ring-1 ring-peach-100">
                <ReceiptIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-ink-900 text-sm">ยอดขาย</div>
                <div className="text-[11px] text-ink-500">ประวัติการขาย</div>
              </div>
            </Link>
          </section>

          {data.pendingShipping > 0 && (
            <Link
              href="/sales?shippingStatus=pending"
              className="card p-3 flex items-center gap-3 ring-1 ring-orange-200 active:scale-[0.98] transition"
              style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)" }}
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h18l-1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
                  <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-orange-900 tracking-tight text-[14px]">
                  มีพัสดุรอส่ง {data.pendingShipping} รายการ
                </div>
                <div className="text-[11px] text-orange-700">กดเพื่อดูและบันทึกว่าส่งแล้ว →</div>
              </div>
            </Link>
          )}

          {data.draftProducts.length > 0 && (
            <section>
              <SectionHeader
                title="สินค้ารอเพิ่มสต็อก"
                count={data.draft}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                }
                link={{ href: "/products?status=draft", label: "ตั้งราคา" }}
              />
              <div className="space-y-2">
                {data.draftProducts.map((p) => (
                  <MiniProductRow
                    key={p.id}
                    name={p.name}
                    image={p.coverImage}
                    category={p.category}
                    right={
                      <div className="text-right">
                        <div className="text-[11px] text-ink-400">ทุน</div>
                        <div className="font-semibold text-ink-700">
                          ฿{formatMoney(p.costPrice)}
                        </div>
                        <div className="pill bg-purple-50 text-purple-700 ring-1 ring-purple-200 mt-0.5">
                          ยังไม่ตั้งราคา
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {data.reservedProducts.length > 0 && (
            <section>
              <SectionHeader
                title="สินค้าจองอยู่"
                count={data.reservedProducts.length}
                icon={<ClockIcon className="h-4 w-4 text-amber-600" />}
              />
              <div className="space-y-2">
                {data.reservedProducts.map((p) => (
                  <MiniProductRow
                    key={p.id}
                    name={p.name}
                    image={p.coverImage}
                    category={p.category}
                    right={
                      <div className="text-right">
                        <div className="font-bold text-ink-900">
                          ฿{formatMoney(p.sellingPrice)}
                        </div>
                        <div className="pill bg-amber-50 text-amber-700 ring-1 ring-amber-200 mt-0.5">
                          {p.reservation?.customerName}
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHeader
              title="รายการขายล่าสุด"
              icon={<CashIcon className="h-4 w-4 text-brand-600" />}
              link={{ href: "/sales", label: "ทั้งหมด" }}
            />
            {data.recentSales.length === 0 ? (
              <EmptyInline text="ยังไม่มีรายการขาย" />
            ) : (
              <div className="space-y-2">
                {data.recentSales.map((s) => (
                  <MiniProductRow
                    key={s.id}
                    name={s.snapshotName}
                    image={s.snapshotImage}
                    right={
                      <div className="text-right">
                        <div className="font-bold text-ink-900">
                          ฿{formatMoney(s.actualSalePrice)}
                        </div>
                        <div
                          className={`text-[11px] font-semibold ${
                            s.profit < 0 ? "text-red-600" : "text-brand-600"
                          }`}
                        >
                          {s.profit < 0 ? "" : "+"}฿{formatMoney(s.profit)}
                        </div>
                        <div className="text-[10px] text-ink-400">{formatDate(s.soldAt)}</div>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {data.recentAvailable.length > 0 && (
            <section>
              <SectionHeader
                title="พร้อมขายล่าสุด"
                icon={<SparkleIcon className="h-4 w-4 text-brand-500" />}
                link={{ href: "/products", label: "ดูทั้งหมด" }}
              />
              <div className="space-y-2">
                {data.recentAvailable.map((p) => (
                  <MiniProductRow
                    key={p.id}
                    name={p.name}
                    image={p.coverImage}
                    category={p.category}
                    right={
                      <div className="text-right">
                        <div className="font-bold text-ink-900">
                          ฿{formatMoney(p.sellingPrice)}
                        </div>
                        <div className="text-[11px] text-ink-400">
                          ทุน ฿{formatMoney(p.costPrice)}
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="card p-8 text-center text-ink-500">ไม่สามารถโหลดข้อมูลได้</div>
      )}
    </div>
  );
}

function StatusTile({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card p-3 text-center">
      <div
        className={`h-9 rounded-xl flex items-center justify-center font-bold tracking-tight ${color}`}
      >
        {value}
      </div>
      <div className="text-[11px] text-ink-500 font-medium mt-1.5">{label}</div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  link,
  icon,
}: {
  title: string;
  count?: number;
  link?: { href: string; label: string };
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-2.5 mt-5">
      <h2 className="h-section flex items-center gap-2">
        {icon ?? null}
        {title}
        {count !== undefined ? (
          <span className="text-[11px] font-semibold text-ink-500 bg-ink-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        ) : null}
      </h2>
      {link ? (
        <Link href={link.href} className="text-[13px] font-semibold text-brand-600">
          {link.label} →
        </Link>
      ) : null}
    </div>
  );
}

function MiniProductRow({
  name,
  image,
  category,
  right,
}: {
  name: string;
  image: string | null;
  category?: string;
  right: React.ReactNode;
}) {
  return (
    <div className="card p-2.5 flex items-center gap-3">
      <div className="h-14 w-14 rounded-xl bg-ink-100 overflow-hidden flex-shrink-0 ring-1 ring-ink-900/[0.03] flex items-center justify-center text-ink-400">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <BoxIcon className="h-6 w-6" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink-900 truncate tracking-tight">{name}</div>
      </div>
      {right}
    </div>
  );
}

function EmptyInline({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 py-8 text-center text-[13px] text-ink-500">
      {text}
    </div>
  );
}

