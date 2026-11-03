<script lang="ts" setup>
import { computed, type ComputedRef, type ModelRef } from 'vue';
import { resolveFormFieldValue, useFormFieldContext, type ISDFormFieldContext } from '../../composables/useFormFieldContext';
import { useSizeClasses, useStatusClasses } from '../../composables/useVariantStyling';
import type { TSDBasicSize, TSDStatus } from '../../types/common';

export interface ISDBaseInputProps {
  modelValue: string | undefined | null;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  id?: string;
  size?: TSDBasicSize;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  status?: TSDStatus;
}

defineEmits(['update:modelValue']);
const props: ISDBaseInputProps = withDefaults(defineProps<ISDBaseInputProps>(), {
  type: 'text',
  size: 'md',
  id: undefined,
  describedBy: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
  disabled: undefined,
  placeholder: '',
});

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });
const fieldContext: ISDFormFieldContext | undefined = useFormFieldContext();

const resolvedId: ComputedRef<string | undefined> = computed((): string | undefined =>
  resolveFormFieldValue<string | undefined>(props.id, fieldContext?.id, undefined),
);
const resolvedDescribedBy: ComputedRef<string | undefined> = computed((): string | undefined =>
  resolveFormFieldValue<string | undefined>(props.describedBy, fieldContext?.describedBy, undefined),
);
const resolvedInvalid: ComputedRef<boolean> = computed((): boolean =>
  resolveFormFieldValue<boolean>(props.invalid, fieldContext?.invalid, false),
);
const resolvedRequired: ComputedRef<boolean> = computed((): boolean =>
  resolveFormFieldValue<boolean>(props.required, fieldContext?.required, false),
);
const resolvedReadonly: ComputedRef<boolean> = computed((): boolean =>
  resolveFormFieldValue<boolean>(props.readonly, fieldContext?.readonly, false)
);
const resolvedDisabled: ComputedRef<boolean> = computed((): boolean =>
  resolveFormFieldValue<boolean>(props.disabled, fieldContext?.disabled, false),
);
</script>

<template>
  <input
    v-model="value"
    :type="type"
    class="w-full bg-sd-surface border-sd-border rounded-lg focus:ring-1 focus:outline-none transition"
    :class="[
      resolvedDisabled ? 'text-sd-fg-disabled cursor-not-allowed' : 'placeholder-sd-fg-disabled text-sd-fg-muted',
      useSizeClasses(size ?? 'md', 'p'),
      useSizeClasses(size ?? 'md', 'text'),
      useStatusClasses(status ?? 'neutral', 'border'),
      useStatusClasses(status ?? 'neutral', 'focus'),
    ]"
    :id="resolvedId"
    :required="resolvedRequired"
    :readonly="resolvedReadonly"
    :disabled="resolvedDisabled"
    :placeholder="placeholder"
    :aria-describedby="resolvedDescribedBy"
    :aria-invalid="(resolvedInvalid || status === 'danger') ? 'true' : undefined"
  />
</template>
