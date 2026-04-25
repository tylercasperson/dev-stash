import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const itemDate = new Date(year, month - 1, day);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

  if (itemDate.getTime() === todayMidnight.getTime()) return 'Today';
  if (itemDate.getTime() === yesterdayMidnight.getTime()) return 'Yesterday';
  return itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
