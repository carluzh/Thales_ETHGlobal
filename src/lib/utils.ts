import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// merges tailwind classes without conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
