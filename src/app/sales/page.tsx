"use client";

import { useEffect, useMemo, useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import {
  BoxIcon,
  CalendarIcon,
  ChatIcon,
  EditIcon,
  NoteIcon,
  PackageIcon,
  ReceiptIcon,
  SearchIcon,
  UserIcon,
} from "@/components/Icons";
import { formatMoney, formatDate, formatDateTime, toInputDate } from "@/lib/format";
import type { SaleDTO } from "@/lib/types";

type Summary = { count: number; totalRevenue: number; totalProfit: number; totalShipping: number };

export default function SalesPage() {
  const [sales, setSales] = useState<SaleDTO[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [preset, setPreset] = useState<"all" | 7 | 30 | 90 | "custom">("all");
  const [selected, setSelected] = useState<SaleDTO | null>(null);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await fetch("/api/sales?" + params.toString());
      const data = await res.json();
      setSales(data.sales);
      setSummary(data.summary);
      setLoading(false);
    },
    [q, from, to]
  );

  useEffect(() => {
    load();
  }, [load]);

  function applyRange(days: number | null) {
    if (days == null) {
      setFrom("");
      setTo("");
      setPreset("all");
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    setFrom(toInputDate(start));
    setTo(toInputDate(end));
    setPreset(days as 7 | 30 | 90);
  }

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[13px] text-ink-500 font-medium">ประวัติการขาย</p>
        <h1 className="h-page mt-0.5">รายการขาย</h1>
      </header>

      {/* Hero summary */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 text-white shadow-peach"
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 120%)",
        }}
      >
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="text-white/80 text-[13px] font-medium">ยอดขายทั้งหมด</div>
          <div className="mt-1 text-[32px] font-bold tracking-tight leading-none">
            ฿{formatMoney(summary?.totalRevenue ?? 0)}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[13px]">
            <div>
              <div className="text-white/70 text-[11px] font-medium">กำไรรวม</div>
              <div className="font-semibold">฿{formatMoney(summary?.totalProfit ?? 0)}</div>
            </div>
            <div className="h-8 w-px bg-white/25" />
            <div>
              <div className="text-white/70 text-[11px] font-medium">ค่าส่ง</div>
              <div className="font-semibold">฿{formatMoney(summary?.totalShipping ?? 0)}</div>
            </div>
            <div className="h-8 w-px bg-white/25" />
            <div>
              <div className="text-white/70 text-[11px] font-medium">จำนวน</div>
              <div className="font-semibold">{summary?.count ?? 0} รายการ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 h-4 w-4" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหา ชื่อสินค้า / ลูกค้า"
          className="input pl-11"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <button
          className={preset === "all" ? "chip-on" : "chip-off"}
          onClick={() => applyRange(null)}
        >
          ทั้งหมด
        </button>
        <button className={preset === 7 ? "chip-on" : "chip-off"} onClick={() => applyRange(7)}>
          7 วัน
        </button>
        <button className={preset === 30 ? "chip-on" : "chip-off"} onClick={() => applyRange(30)}>
          30 วัน
        </button>
        <button className={preset === 90 ? "chip-on" : "chip-off"} onClick={() => applyRange(90)}>
          90 วัน
        </button>
      </div>

      <details className="card p-3">
        <summary className="cursor-pointer text-[13px] font-semibold text-ink-700 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" /> เลือกช่วงเอง
        </summary>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="label">จากวันที่</label>
            <input
              type="date"
              className="input"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPreset("custom");
              }}
            />
          </div>
          <div>
            <label className="label">ถึงวันที่</label>
            <input
              type="date"
              className="input"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPreset("custom");
              }}
            />
          </div>
        </div>
      </details>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl shimmer" />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <div className="card p-10 text-center">
          <div
            className="h-20 w-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-peach-500"
            style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)" }}
          >
            <ReceiptIcon className="h-10 w-10" />
          </div>
          <p className="text-ink-900 font-bold mb-1 tracking-tight">ยังไม่มีรายการขาย</p>
          <p className="text-[13px] text-ink-500">เมื่อขายสินค้าแล้วจะแสดงที่นี่</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sales.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="card p-3 w-full text-left flex items-center gap-3 active:scale-[0.99] transition"
            >
              <div className="h-16 w-16 rounded-xl bg-ink-100 overflow-hidden flex-shrink-0 ring-1 ring-ink-900/[0.03] flex items-center justify-center text-ink-400">
                {s.snapshotImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.snapshotImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <BoxIcon className="h-7 w-7" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink-900 truncate tracking-tight">
                  {s.snapshotName}
                </div>
                <div className="text-[12px] text-ink-500 truncate mt-0.5">
                  <span>{s.customerName ?? "—"}</span>
                  <span className="mx-1.5 text-ink-300">·</span>
                  <span>{formatDate(s.soldAt)}</span>
                </div>
                {s.trackingNumber ? (
                  <div className="text-[11px] text-brand-600 font-medium mt-0.5 truncate flex items-center gap-1">
                    <PackageIcon className="h-3 w-3" /> {s.trackingNumber}
                  </div>
                ) : null}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-ink-900 tracking-tight">
                  ฿{formatMoney(s.actualSalePrice)}
                </div>
                <div
                  className={`pill mt-1 ${
                    s.profit < 0
                      ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                      : "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
                  }`}
                >
                  {s.profit < 0 ? "−" : "+"}฿{formatMoney(Math.abs(s.profit))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <SaleDetailSheet sale={selected} onClose={() => setSelected(null)} onUpdated={load} />
    </div>
  );
}

function SaleDetailSheet({
  sale,
  onClose,
  onUpdated,
}: {
  sale: SaleDTO | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sale) {
      setCustomerName(sale.customerName ?? "");
      setContact(sale.contact ?? "");
      setTrackingNumber(sale.trackingNumber ?? "");
      setNote(sale.note ?? "");
      setEditing(false);
    }
  }, [sale]);

  async function save() {
    if (!sale) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/sales/${sale.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, contact, trackingNumber, note }),
      });
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      setEditing(false);
      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet
      open={sale !== null}
      onClose={onClose}
      title="รายละเอียดการขาย"
      footer={
        editing ? (
          <button className="btn-primary w-full" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : "บันทึก"}
          </button>
        ) : (
          <button className="btn-secondary w-full" onClick={() => setEditing(true)}>
            <EditIcon /> แก้ไขข้อมูลลูกค้า / พัสดุ
          </button>
        )
      }
    >
      {!sale ? null : (
        <div className="space-y-4 pt-2">
          <div className="flex gap-3 items-center">
            <div className="h-16 w-16 rounded-2xl bg-ink-100 overflow-hidden ring-1 ring-ink-900/[0.04] flex items-center justify-center text-ink-400">
              {sale.snapshotImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={sale.snapshotImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <BoxIcon className="h-7 w-7" />
              )}
            </div>
            <div>
              <div className="font-bold text-ink-900 tracking-tight">{sale.snapshotName}</div>
              <div className="text-[12px] text-ink-500 mt-0.5">
                ขายเมื่อ {formatDateTime(sale.soldAt)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-ink-50 rounded-2xl p-4 ring-1 ring-ink-900/[0.04]">
            <Row label="ราคาขายจริง" value={`฿${formatMoney(sale.actualSalePrice)}`} bold />
            <Row label="ค่าส่ง" value={`฿${formatMoney(sale.shippingCost)}`} />
            <Row label="ทุน" value={`฿${formatMoney(sale.snapshotCostPrice)}`} />
            <Row
              label="กำไรจริง"
              value={`${sale.profit < 0 ? "−" : "+"}฿${formatMoney(Math.abs(sale.profit))}`}
              color={sale.profit < 0 ? "text-red-600 font-bold" : "text-brand-600 font-bold"}
            />
          </div>

          {editing ? (
            <div className="space-y-3">
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
                />
              </div>
              <div>
                <label className="label">หมายเหตุ</label>
                <textarea
                  className="input min-h-[70px]"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-[13px]">
              <InfoRow label="ลูกค้า" value={sale.customerName} icon={<UserIcon />} />
              <InfoRow label="ช่องทางติดต่อ" value={sale.contact} icon={<ChatIcon />} />
              <InfoRow label="เลขพัสดุ" value={sale.trackingNumber} icon={<PackageIcon />} />
              {sale.note ? <InfoRow label="หมายเหตุ" value={sale.note} icon={<NoteIcon />} /> : null}
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}

function Row({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] text-ink-500 font-medium">{label}</div>
      <div className={color ?? (bold ? "text-ink-900 font-bold" : "text-ink-900")}>{value}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 p-3 bg-ink-50 rounded-xl">
      <span className="text-ink-500 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-ink-500 font-medium">{label}</div>
        <div className="text-ink-900 break-words">{value || "—"}</div>
      </div>
    </div>
  );
}
