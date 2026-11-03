<script lang="ts" setup>
import type { TSDStatus } from '../../types/common';

export type TSDTitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TSDTitleSize = 'sm' | 'md' | 'lg';
export type TSDTitleWeight = 'normal' | 'semibold' | 'bold' | 'bolder';

export interface ISDTitleProps {
  title?: string;
  size?: TSDTitleSize;
  fontWeight?: TSDTitleWeight;
  as?: TSDTitleTag;
  status?: TSDStatus;
  uppercase?: boolean;
}

const props: ISDTitleProps = withDefaults(defineProps<ISDTitleProps>(), {
  title: '',
  size: 'md',
  fontWeight: 'semibold',
  as: 'h1',
  status: undefined,
  uppercase: true,
});

const sizeClasses: Record<TSDTitleSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

const weightClasses: Record<TSDTitleWeight, string> = {
  normal: 'font-normal',
  semibold: 'font-semibold',
  bold: 'font-bold',
  bolder: 'font-extrabold',
};

const statusDotClasses: Record<TSDStatus, string> = {
  success: 'bg-sd-status-success',
  warning: 'bg-sd-status-warning',
  danger: 'bg-sd-status-danger',
  info: 'bg-sd-status-info',
  neutral: 'bg-sd-status-neutral',
  primary: 'bg-sd-primary',
  accent: 'bg-sd-accent',
};
</script>

<template>
  <component
    :is="props.as ?? 'h1'"
    class="font-sd-display text-sd-fg-heading flex items-center gap-2"
    :class="[
      sizeClasses[props.size ?? 'md'],
      weightClasses[props.fontWeight ?? 'semibold'],
      props.uppercase ? 'uppercase tracking-wider' : '',
    ]"
  >
    <span
      v-if="props.status"
      aria-hidden="true"
      class="w-3 h-3 shrink-0 rounded-full forced-colors:border forced-colors:border-[CanvasText]"
      :class="statusDotClasses[props.status]"
    ></span>

    <slot>{{ props.title }}</slot>
  </component>
</template>
