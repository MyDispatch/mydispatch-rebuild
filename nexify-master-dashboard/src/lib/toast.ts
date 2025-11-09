import { nanoid } from "nanoid";
import { useSyncExternalStore } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type Subscriber = (toasts: ToastMessage[]) => void;

const subscribers = new Set<Subscriber>();
let queue: ToastMessage[] = [];

function emit() {
  const snapshot = [...queue];
  subscribers.forEach((subscriber) => subscriber(snapshot));
}

export function toast(message: Omit<ToastMessage, "id"> & { id?: string }) {
  const next: ToastMessage = {
    id: message.id ?? nanoid(),
    title: message.title,
    description: message.description,
    variant: message.variant ?? "default"
  };

  queue = [...queue.filter((item) => item.id !== next.id), next];
  emit();

  window.setTimeout(() => {
    queue = queue.filter((item) => item.id !== next.id);
    emit();
  }, 4500);

  return next.id;
}

export function subscribeToToasts(subscriber: Subscriber) {
  subscribers.add(subscriber);
  subscriber(queue);
  return () => {
    subscribers.delete(subscriber);
  };
}

export function useToastStore() {
  return useSyncExternalStore(subscribeToToasts, () => queue, () => queue);
}
