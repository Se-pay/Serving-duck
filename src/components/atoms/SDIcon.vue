<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue';

import type { TSDSize, TSDStatus } from '../../types/common';
import { SD_ICONS, type TSDIconName } from '../../utils/icons';
import { getSizeClasses, getStatusClasses } from '../../utils/variantStyling';

export interface ISDIconProps {
  name?: TSDIconName;
  status?: TSDStatus;
  size?: TSDSize;
  label?: string;
}

const props: ISDIconProps = withDefaults(defineProps<ISDIconProps>(), {
  name: undefined,
  status: 'neutral',
  size: 'md',
  label: undefined,
});

const normalizedLabel: ComputedRef<string | undefined> = computed((): string | undefined => {
  const trimmed: string | undefined = props.label?.trim();
  return trimmed ? trimmed : undefined;
});

const isDecorative: ComputedRef<boolean> = computed((): boolean => !normalizedLabel.value);

const resolvedPaths: ComputedRef<readonly string[]> = computed((): readonly string[] => {
  if (!props.name) {
    return [];
  }

  return SD_ICONS[props.name] ?? [];
});
</script>

<template>
  <span
    :role="isDecorative ? undefined : 'img'"
    :aria-label="normalizedLabel"
    :aria-hidden="isDecorative ? 'true' : undefined"
    class="inline-flex shrink-0 items-center justify-center leading-none select-none forced-color-adjust-auto [&>svg]:size-[1em] [&>svg]:shrink-0"
    :class="[
      getStatusClasses(status ?? 'neutral', 'text'),
      getSizeClasses(size ?? 'md', 'text'),
    ]"
  >
    <slot>
      <svg
        v-if="resolvedPaths.length > 0"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path
          v-for="(pathData, index) in resolvedPaths"
          :key="index"
          :d="pathData"
        />
      </svg>
    </slot>
  </span>
</template>
