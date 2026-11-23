"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cn("max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl sm:rounded-2xl", size === "sm" && "sm:max-w-md", size === "md" && "sm:max-w-xl", size === "lg" && "sm:max-w-3xl")}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button type="button" onClick={onClose} aria-label="close" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
