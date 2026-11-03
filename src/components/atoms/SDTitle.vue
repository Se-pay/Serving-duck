<script lang="ts" setup>
import { useSizeClasses, useStatusClasses, useWeightClasses } from '../../composables/useVariantStyling';
import type { TSDBasicSize, TSDStatus, TSDWeight } from '../../types/common';

export type TSDTitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface ISDTitleProps {
  title?: string;
  size?: TSDBasicSize;
  fontWeight?: TSDWeight;
  as?: TSDTitleTag;
  status?: TSDStatus;
  uppercase?: boolean;
}

withDefaults(defineProps<ISDTitleProps>(), {
  title: '',
  size: 'md',
  fontWeight: 'semibold',
  as: 'h1',
  status: undefined,
  uppercase: true,
});

</script>

<template>
  <component
    :is="as ?? 'h1'"
    class="font-sd-display text-sd-fg-heading flex items-center gap-2"
    :class="[
      useSizeClasses(size ?? 'md', 'text'),
      useWeightClasses(fontWeight ?? 'semibold'),
      uppercase ? 'uppercase tracking-wider' : '',
    ]"
  >
    <span
      v-if="status"
      aria-hidden="true"
      class="w-3 h-3 shrink-0 rounded-full forced-colors:border forced-colors:border-[CanvasText]"
      :class="[
        useStatusClasses(status, 'bg')
      ]"
    ></span>

    <slot>{{ title }}</slot>
  </component>
</template>
