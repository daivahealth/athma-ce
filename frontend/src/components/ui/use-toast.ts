import * as React from 'react';
import { create } from 'zustand';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
};

type ToastStore = {
  toasts: Toast[];
  publish: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  publish: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), ...toast }],
    })),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export function useToast() {
  const publish = useToastStore((state) => state.publish);
  return publish;
}

export function useToasts() {
  return useToastStore((state) => state.toasts);
}

export function useDismissToast() {
  return useToastStore((state) => state.dismiss);
}
