"use client";

let pendingSpreadsheetFile: File | null = null;

export function setPendingSpreadsheetFile(file: File | null) {
  pendingSpreadsheetFile = file;
}

export function takePendingSpreadsheetFile(): File | null {
  const file = pendingSpreadsheetFile;
  pendingSpreadsheetFile = null;
  return file;
}
