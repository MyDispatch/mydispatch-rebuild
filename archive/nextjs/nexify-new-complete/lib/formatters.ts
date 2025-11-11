import { format } from "date-fns";
import { de } from "date-fns/locale";

export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  try {
    const parsed = new Date(date);
    return format(parsed, "dd.MM.yyyy", { locale: de });
  } catch {
    return "-";
  }
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("49")) {
    const area = digits.slice(2, 5);
    const rest = digits.slice(5);
    return `+49 ${area} ${rest}`;
  }
  return phone;
}

