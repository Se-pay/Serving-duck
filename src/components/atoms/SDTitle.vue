<script lang="ts" setup>
import type { TSDSize, TSDStatus, TSDWeight } from '../../types/common';
import { getSizeClasses, getStatusClasses, getWeightClasses } from '../../utils/variantStyling';

export type TSDTitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface ISDTitleProps {
  title?: string;
  size?: TSDSize;
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
      getSizeClasses(size ?? 'md', 'text'),
      getWeightClasses(fontWeight ?? 'semibold'),
      uppercase ? 'uppercase tracking-wider' : '',
    ]"
  >
    <span
      v-if="status"
      aria-hidden="true"
      class="w-3 h-3 shrink-0 rounded-full forced-colors:border forced-colors:border-[CanvasText]"
      :class="[
        getStatusClasses(status, 'bg')
      ]"
    ></span>

    <slot>{{ title }}</slot>
  </component>
</template>
