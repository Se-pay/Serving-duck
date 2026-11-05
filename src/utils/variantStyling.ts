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

const statusBgHoverClasses: Record<TSDStatus, string> = {
  success: 'hover:bg-sd-status-success-hover',
  warning: 'hover:bg-sd-status-warning-hover',
  danger: 'hover:bg-sd-status-danger-hover',
  info: 'hover:bg-sd-status-info-hover',
  neutral: 'hover:bg-sd-status-neutral-hover',
  primary: 'hover:bg-sd-primary-hover',
  accent: 'hover:bg-sd-accent-hover',
};

const statusBgFocusClasses: Record<TSDStatus, string> = {
  success: 'focus:bg-sd-status-success-focus',
  warning: 'focus:bg-sd-status-warning-focus',
  danger: 'focus:bg-sd-status-danger-focus',
  info: 'focus:bg-sd-status-info-focus',
  neutral: 'focus:bg-sd-status-neutral-focus',
  primary: 'focus:bg-sd-primary-focus',
  accent: 'focus:bg-sd-accent-focus',
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

const statusBorderClasses: Record<TSDStatus, string> = {
  success: 'border-sd-status-success',
  warning: 'border-sd-status-warning',
  danger: 'border-sd-status-danger',
  info: 'border-sd-status-info',
  neutral: 'border-sd-status-neutral',
  primary: 'border-sd-primary',
  accent: 'border-sd-accent',
};

const statusBorderHoverClasses: Record<TSDStatus, string> = {
  success: 'hover:border-sd-status-success-hover hover:ring-sd-status-success-hover',
  warning: 'hover:border-sd-status-warning-hover hover:ring-sd-status-warning-hover',
  danger: 'hover:border-sd-status-danger-hover hover:ring-sd-status-danger-hover',
  info: 'hover:border-sd-status-info-hover hover:ring-sd-status-info-hover',
  neutral: 'hover:border-sd-status-neutral-hover hover:ring-sd-status-neutral-hover',
  primary: 'hover:border-sd-primary-hover hover:ring-sd-primary-hover',
  accent: 'hover:border-sd-accent-hover hover:ring-sd-accent-hover',
};

const statusBorderFocusClasses: Record<TSDStatus, string> = {
  success: 'focus-visible:outline-sd-status-success-focus focus-within:outline-sd-status-success-focus',
  warning: 'focus-visible:outline-sd-status-warning-focus focus-within:outline-sd-status-warning-focus',
  danger: 'focus-visible:outline-sd-status-danger-focus focus-within:outline-sd-status-danger-focus',
  info: 'focus-visible:outline-sd-status-info-focus focus-within:outline-sd-status-info-focus',
  neutral: 'focus-visible:outline-sd-primary-focus focus-visible:border-sd-primary-focus focus-within:outline-sd-primary-focus focus-within:border-sd-primary-focus',
  primary: 'focus-visible:outline-sd-primary-focus focus-within:outline-sd-primary-focus',
  accent: 'focus-visible:outline-sd-accent-focus focus-within:outline-sd-accent-focus',
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
  lg: 'text-lg',
  xl: 'text-xl',
};

const sizePaddingClasses: Record<TSDSize, string> = {
  xs: 'py-0.5 px-1.5',
  sm: 'py-1 px-2',
  md: 'py-1.5 px-3',
  lg: 'py-2 px-4',
  xl: 'py-3 px-6',
};

export function getStatusClasses(
  status: TSDStatus,
  variant: 'bg' | 'text' | 'border',
  options: { hover?: boolean, focus?: boolean } = { },
): string {
  switch (variant) {
  case 'bg':
    return statusBgClasses[status] +
      (options.hover ? (' ' + statusBgHoverClasses[status]) : '') +
      (options.focus ? (' ' + statusBgFocusClasses[status]) : '');
  case 'text':
    return statusTextClasses[status];
  case 'border':
    return 'border ' + statusBorderClasses[status] +
      (options.hover ? ' hover:ring-[1.5px] ' + statusBorderHoverClasses[status] : '') +
      (options.focus ? ' focus-within:outline-2 focus-within:-outline-offset-1 ' + statusBorderFocusClasses[status] : '');
  default:
    return '';
  }
}

export function getWeightClasses(weight: TSDWeight): string {
  return weightClasses[weight] ?? '';
}

export function getSizeClasses(size: TSDSize, variant: 'p' | 'text'): string {
  switch (variant) {
  case 'p':
    return sizePaddingClasses[size];
  case 'text':
    return sizeTextClasses[size];
  default:
    return '';
  }
}
