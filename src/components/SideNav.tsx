"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, PlusIcon, ReceiptIcon } from "./Icons";

function HomeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10.2 12 3l9 7.2V21a.8.8 0 0 1-.8.8h-4.9v-7.3h-6.6v7.3H3.8A.8.8 0 0 1 3 21z" />
    </svg>
  );
}

const items = [
  { href: "/", label: "แดชบอร์ด", Icon: HomeIcon },
  { href: "/products", label: "สินค้า", Icon: BoxIcon },
  { href: "/add", label: "เพิ่มสินค้า", Icon: PlusIcon },
  { href: "/sales", label: "รายการขาย", Icon: ReceiptIcon },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 px-5 py-8 gap-1 min-h-screen sticky top-0">
      <div className="px-2 mb-8">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-2xl text-white flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
              boxShadow: "0 6px 20px -8px rgba(16,185,129,0.4)",
            }}
          >
            <BoxIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-ink-900 tracking-tight">Toy Resale</div>
            <div className="text-xs text-ink-500">มือสองเด็ก</div>
          </div>
        </div>
      </div>
      {items.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              active
                ? "bg-white text-brand-700 shadow-card ring-1 ring-ink-900/[0.04]"
                : "text-ink-600 hover:bg-white/60"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span>{label}</span>
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
          </Link>
        );
      })}
    </aside>
  );
}
