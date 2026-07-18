/**
 * helpers.ts
 * Utility helper functions for DocuFlow PDF Converter
 * Created: 2026-07-18
 */

// ─── File Size Formatting ────────────────────────────────────────────────────

/**
 * Formats a byte count into a human-readable file size string.
 * @example formatFileSize(1048576) → "1.00 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

// ─── MIME Type Detection ─────────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG Image",
  "image/png": "PNG Image",
  "image/webp": "WebP Image",
  "image/gif": "GIF Image",
  "application/msword": "Word Document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document (DOCX)",
  "application/vnd.ms-excel": "Excel Spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel Spreadsheet (XLSX)",
  "application/vnd.ms-powerpoint": "PowerPoint Presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint (PPTX)",
  "text/plain": "Plain Text",
  "text/html": "HTML Document",
};

/**
 * Returns a human-friendly label for a MIME type.
 * @example getMimeLabel("application/pdf") → "PDF"
 */
export function getMimeLabel(mimeType: string): string {
  return MIME_MAP[mimeType] ?? mimeType;
}

/**
 * Checks if a file is a supported input type for DocuFlow.
 */
export function isSupportedFile(mimeType: string): boolean {
  return mimeType in MIME_MAP;
}

// ─── Date & Time Utilities ───────────────────────────────────────────────────

/**
 * Formats a Date (or ISO string) to a short readable format.
 * @example formatDate(new Date()) → "Jul 18, 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Returns a relative time string like "2 minutes ago".
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
  }

  return "just now";
}

// ─── String Utilities ────────────────────────────────────────────────────────

/**
 * Truncates a filename to a max length, preserving the extension.
 * @example truncateFilename("very-long-document-name.pdf", 20) → "very-long-docum….pdf"
 */
export function truncateFilename(filename: string, maxLength = 30): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1 || filename.length <= maxLength) return filename;

  const ext = filename.slice(dotIndex);
  const name = filename.slice(0, dotIndex);
  const allowedName = maxLength - ext.length - 1;

  return `${name.slice(0, allowedName)}…${ext}`;
}

/**
 * Converts a string to a URL-safe slug.
 * @example slugify("My PDF File!") → "my-pdf-file"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Array Utilities ─────────────────────────────────────────────────────────

/**
 * Chunks an array into sub-arrays of the given size.
 * @example chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Returns unique items from an array.
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// ─── Download Utility ────────────────────────────────────────────────────────

/**
 * Triggers a browser download for a given Blob or data URL.
 */
export function downloadFile(data: Blob | string, filename: string): void {
  const url = typeof data === "string" ? data : URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof data !== "string") URL.revokeObjectURL(url);
}
