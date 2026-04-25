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

export const SHIPPING_STATUSES = [
  { value: "pending", label: "รอส่ง" },
  { value: "shipped", label: "ส่งแล้ว" },
  { value: "delivered", label: "ลูกค้ารับแล้ว" },
  { value: "no-shipping", label: "ไม่ส่งของ" },
] as const;

export const SHIPPING_PROVIDERS = [
  { value: "kerry", label: "Kerry" },
  { value: "flash", label: "Flash" },
  { value: "j-and-t", label: "J&T" },
  { value: "thai-post", label: "ไปรษณีย์ไทย" },
  { value: "ninjavan", label: "Ninja Van" },
  { value: "shopee", label: "Shopee Express" },
  { value: "other", label: "อื่น ๆ" },
] as const;

export function shippingStatusLabel(v: string): string {
  return SHIPPING_STATUSES.find((s) => s.value === v)?.label ?? v;
}
export function shippingProviderLabel(v: string): string {
  return SHIPPING_PROVIDERS.find((s) => s.value === v)?.label ?? v;
}

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type ConditionValue = (typeof CONDITIONS)[number]["value"];
export type StatusValue = (typeof STATUSES)[number]["value"];
export type ShippingStatusValue = (typeof SHIPPING_STATUSES)[number]["value"];

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
