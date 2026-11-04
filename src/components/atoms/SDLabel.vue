<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue';

import type { TSDSize } from '../../types/common';
import { getSizeClasses } from '../../utils/variantStyling';
import {
  type ISDFormFieldContext,
  resolveFormFieldValue,
  useFormFieldContext,
} from '../../composables/useFormFieldContext';

export interface ISDLabelProps {
  label?: string;
  for?: string;
  size?: TSDSize;
  required?: boolean;
  disabled?: boolean;
  uppercase?: boolean;
}

const props: ISDLabelProps = withDefaults(defineProps<ISDLabelProps>(), {
  label: '',
  for: undefined,
  size: 'xs',
  required: undefined,
  disabled: undefined,
  uppercase: true,
});

const fieldContext: ISDFormFieldContext | undefined = useFormFieldContext();

const resolvedFor: ComputedRef<string | undefined> = computed((): string | undefined =>
  resolveFormFieldValue<string | undefined>(props.for, fieldContext?.id, undefined),
);

const resolvedRequired: ComputedRef<boolean> = computed((): boolean =>
  resolveFormFieldValue<boolean>(props.required, fieldContext?.required, false),
);

const resolvedDisabled: ComputedRef<boolean> = computed((): boolean =>
  resolveFormFieldValue<boolean>(props.disabled, fieldContext?.disabled, false),
);

</script>

<template>
  <label
    :for="resolvedFor"
    class="font-sd-sans font-medium inline-flex items-center gap-1"
    :class="[
      getSizeClasses(size ?? 'md', 'text'),
      uppercase ? 'uppercase tracking-wider' : '',
      resolvedDisabled ? 'text-sd-fg-disabled cursor-not-allowed' : 'text-sd-fg-muted',
    ]"
  >
    <slot>{{ label }}</slot>

    <span
      v-if="resolvedRequired"
      aria-hidden="true"
      class="text-sd-status-danger"
    >*</span>
  </label>
</template>
