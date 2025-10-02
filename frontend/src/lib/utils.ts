import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "AED") {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPhoneNumber(phone: string) {
  // Simple phone number formatting for UAE
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("971")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

export function getStatusColor(status: string) {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    denied: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    void: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    noShow: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    posted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    reversed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function downloadCSV(data: any[], filename: string) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(data: any[]) {
  if (data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(",");
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === "string" && value.includes(",") 
        ? `"${value}"` 
        : value;
    }).join(",")
  );
  
  return [csvHeaders, ...csvRows].join("\n");
}