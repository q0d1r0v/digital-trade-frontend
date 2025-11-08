import type { AlertColor } from "@mui/material";

export interface ToastMessage {
  id: string;
  type: AlertColor;
  message: string;
  description?: string;
  duration?: number;
}

export interface ToastContextType {
  success: (message: string, description?: string, duration?: number) => void;
  error: (message: string, description?: string, duration?: number) => void;
  warning: (message: string, description?: string, duration?: number) => void;
  info: (message: string, description?: string, duration?: number) => void;
}
