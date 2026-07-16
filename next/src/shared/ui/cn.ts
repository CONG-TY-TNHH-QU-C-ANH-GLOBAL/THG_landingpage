import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Parity source: src/lib/utils.ts (shadcn class combiner).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
