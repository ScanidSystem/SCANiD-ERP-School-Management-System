import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the data from our servers.",
  loading = false
}: DeleteConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl overflow-hidden p-0 max-w-md">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100/50">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <Trash2 size={32} strokeWidth={2.5} />
          </div>
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-black text-slate-900 tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed px-4">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        
        <AlertDialogFooter className="p-6 bg-white sm:justify-center gap-3">
          <AlertDialogCancel 
            className="rounded-xl px-8 h-12 font-bold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all border-2"
          >
            Cancel, Keep it
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="rounded-xl px-8 h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all border-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                Processing...
              </div>
            ) : (
              "Yes, Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
