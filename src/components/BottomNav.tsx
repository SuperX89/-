"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "หน้าหลัก", icon: HomeIcon },
  { href: "/products", label: "สินค้า", icon: BoxIcon },
  { href: "/add", label: "เพิ่ม", icon: PlusIcon, primary: true },
  { href: "/drafts", label: "แบบร่าง", icon: DraftIcon },
  { href: "/sales", label: "ยอดขาย", icon: SalesIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-3 mb-3 rounded-3xl bg-white/90 backdrop-blur-xl shadow-lift ring-1 ring-ink-900/[0.05]">
        <div className="grid grid-cols-5 px-2 py-1.5">
          {items.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.primary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center py-1"
                  aria-label={item.label}
                >
                  <span
                    className="flex items-center justify-center h-12 w-12 rounded-2xl text-white shadow-brand"
                    style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center py-2.5 gap-0.5"
              >
                <Icon
                  className={`h-[22px] w-[22px] transition-colors ${
                    active ? "text-brand-600" : "text-ink-500"
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold tracking-tight transition-colors ${
                    active ? "text-brand-700" : "text-ink-500"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 10.2 12 3l9 7.2V21a.8.8 0 0 1-.8.8h-4.9v-7.3h-6.6v7.3H3.8A.8.8 0 0 1 3 21z" />
    </svg>
  );
}
function BoxIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7.4 12 3l9 4.4v9L12 21l-9-4.6z" />
      <path d="M3 7.4 12 12l9-4.6" />
      <path d="M12 12v9" />
    </svg>
  );
}
function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function DraftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 4h11l4 4v12H5z" />
      <path d="M14 4v4h4" />
      <path d="M9 13h6M9 16h4" />
    </svg>
  );
}
function SalesIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3h2.2l1.3 3M7 18h11l2.5-10H6.5" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}
