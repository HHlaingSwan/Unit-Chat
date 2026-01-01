import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLastSeen(dateString: string): string {
  const now = new Date();
  const lastSeen = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - lastSeen.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return ` ${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return ` ${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return ` ${diffInDays}d ago`;
}
