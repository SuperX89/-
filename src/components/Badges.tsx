import { statusLabel, conditionLabel } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    available: {
      cls: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
      dot: "bg-brand-500",
    },
    reserved: {
      cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      dot: "bg-amber-500",
    },
    sold: {
      cls: "bg-ink-100 text-ink-700 ring-1 ring-ink-200",
      dot: "bg-ink-500",
    },
    draft: {
      cls: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
      dot: "bg-purple-500",
    },
  };
  const s = map[status] ?? map.sold;
  return (
    <span className={`pill ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {statusLabel(status)}
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: string }) {
  const map: Record<string, string> = {
    "like-new": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    good: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    defect: "bg-red-50 text-red-700 ring-1 ring-red-200",
    unchecked: "bg-ink-100 text-ink-600 ring-1 ring-ink-200 italic",
  };
  return (
    <span className={`pill ${map[condition] ?? "bg-ink-100 text-ink-700 ring-1 ring-ink-200"}`}>
      {conditionLabel(condition)}
    </span>
  );
}
