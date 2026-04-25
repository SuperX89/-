export const CATEGORIES = [
  { value: "toy", label: "ของเล่น", emoji: "🧸" },
  { value: "kids-goods", label: "ของใช้เด็ก", emoji: "🍼" },
  { value: "clothes", label: "เสื้อผ้าเด็ก", emoji: "👕" },
  { value: "stroller-carseat", label: "รถเข็น / คาร์ซีท", emoji: "🚼" },
  { value: "other", label: "อื่น ๆ", emoji: "📦" },
] as const;

export const CONDITIONS = [
  { value: "good", label: "ดี" },
  { value: "like-new", label: "ใหม่/แทบไม่ได้ใช้" },
  { value: "defect", label: "มีตำหนิ" },
] as const;

export const CONDITION_UNCHECKED = "unchecked";

export const STATUSES = [
  { value: "available", label: "พร้อมขาย" },
  { value: "reserved", label: "จองแล้ว" },
  { value: "sold", label: "ขายแล้ว" },
  { value: "draft", label: "รอเพิ่มสต็อก" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type ConditionValue = (typeof CONDITIONS)[number]["value"];
export type StatusValue = (typeof STATUSES)[number]["value"];

export function categoryLabel(v: string): string {
  return CATEGORIES.find((c) => c.value === v)?.label ?? v;
}
export function categoryEmoji(v: string): string {
  return CATEGORIES.find((c) => c.value === v)?.emoji ?? "📦";
}
export function conditionLabel(v: string): string {
  if (v === CONDITION_UNCHECKED) return "ยังไม่ได้เช็ค";
  return CONDITIONS.find((c) => c.value === v)?.label ?? v;
}
export function statusLabel(v: string): string {
  return STATUSES.find((s) => s.value === v)?.label ?? v;
}
