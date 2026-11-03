import type { TSDSize, TSDStatus, TSDWeight } from '../types/common';

const statusBgClasses: Record<TSDStatus, string> = {
  success: 'bg-sd-status-success',
  warning: 'bg-sd-status-warning',
  danger: 'bg-sd-status-danger',
  info: 'bg-sd-status-info',
  neutral: 'bg-sd-status-neutral',
  primary: 'bg-sd-primary',
  accent: 'bg-sd-accent',
};

const statusTextClasses: Record<TSDStatus, string> = {
  success: 'text-sd-status-success',
  warning: 'text-sd-status-warning',
  danger: 'text-sd-status-danger',
  info: 'text-sd-status-info',
  neutral: 'text-sd-status-neutral',
  primary: 'text-sd-primary',
  accent: 'text-sd-accent',
};

/** TODO:: Prefer :focus-visible over :focus, and use CSS outline (focus-visible:outline-2 focus-visible:-outline-offset-1 or focus-visible:outline-offset-2) with the dedicated focus token --color-sd-ring (outline-sd-ring from theme.css)—or if keeping ring-1, use focus-visible:outline-transparent instead of outline-none so High Contrast Mode still paints a visible outline. */
const statusFocusClasses: Record<TSDStatus, string> = {
  success: 'focus:ring-sd-status-success',
  warning: 'focus:ring-sd-status-warning',
  danger: 'focus:ring-sd-status-danger',
  info: 'focus:ring-sd-status-info',
  neutral: 'focus:ring-sd-primary-hover focus:border-sd-primary-hover',
  primary: 'focus:ring-sd-primary',
  accent: 'focus:ring-sd-accent',
};

const statusBorderClasses: Record<TSDStatus, string> = {
  success: 'border-sd-status-success',
  warning: 'border-sd-status-warning',
  danger: 'border-sd-status-danger',
  info: 'border-sd-status-info',
  neutral: 'border-sd-status-neutral',
  primary: 'border-sd-primary',
  accent: 'border-sd-accent',
};

const weightClasses: Record<TSDWeight, string> = {
  normal: 'font-normal',
  semibold: 'font-semibold',
  bold: 'font-bold',
  bolder: 'font-extrabold',
};

const sizeTextClasses: Record<TSDSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

const sizePaddingClasses: Record<TSDSize, string> = {
  xs: 'py-0.5 px-1.5',
  sm: 'py-1 px-2',
  md: 'py-1.5 px-3',
  lg: 'py-2 px-4',
  xl: 'py-3 px-6',
};

export function useStatusClasses(status: TSDStatus, variant: 'bg' | 'text' | 'focus' | 'border'): string | void {
  switch (variant) {
  case 'bg':
    return statusBgClasses[status];
  case 'text':
    return statusTextClasses[status];
  case 'focus':
    return statusFocusClasses[status];
  case 'border':
    return statusBorderClasses[status];
  default:
    return '';
  }
}

export function useWeightClasses(weight: TSDWeight): string | void {
  return weightClasses[weight] ?? '';
}

export function useSizeClasses(size: TSDSize, variant: 'p' | 'text'): string | void {
  switch (variant) {
  case 'p':
    return sizePaddingClasses[size];
  case 'text':
    return sizeTextClasses[size];
  default:
    return '';
  }
}
