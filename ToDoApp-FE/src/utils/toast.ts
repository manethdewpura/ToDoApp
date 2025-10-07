type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  durationMs: number;
}

type Listener = (toast: ToastMessage) => void;

class ToastBus {
  private listeners: Set<Listener> = new Set();
  private nextId = 1;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(type: ToastType, message: string, durationMs = 3000) {
    const toast: ToastMessage = {
      id: this.nextId++,
      type,
      message,
      durationMs,
    };
    this.listeners.forEach(l => l(toast));
  }
}

const bus = new ToastBus();

export const toast = {
  success(message: string, durationMs?: number) {
    bus.emit('success', message, durationMs);
  },
  error(message: string, durationMs?: number) {
    bus.emit('error', message, durationMs);
  },
  info(message: string, durationMs?: number) {
    bus.emit('info', message, durationMs);
  },
  warning(message: string, durationMs?: number) {
    bus.emit('warning', message, durationMs);
  },
  subscribe(listener: Listener): () => void {
    return bus.subscribe(listener);
  },
};


