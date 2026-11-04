<script lang="ts" setup>
import type { TSDMediumSize, TSDStatus } from '@/types/common.ts';
import { getSizeClasses, getStatusClasses } from '@/utils/variantStyling.ts';
import { computed, ref, useId, type ComputedRef, type ModelRef, type Ref } from 'vue';
import SDBaseInput from '../atoms/SDBaseInput.vue';
import SDFormField from '../atoms/SDFormField.vue';
import SDIcon from '../atoms/SDIcon.vue';
import SDLabel from '../atoms/SDLabel.vue';

export interface ISDTextInputProps {
  modelValue: string | undefined | null;
  label?: string;
  id?: string;
  name?: string;
  describedBy?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: TSDMediumSize;
  status?: TSDStatus;
  uppercase?: boolean;
  errorMessage?: string;
  containerClass?: string;
}

defineOptions({ inheritAttrs: false });
const props: ISDTextInputProps = withDefaults(defineProps<ISDTextInputProps>(), {
  size: 'md',
  status: 'neutral',
  required: undefined,
  readonly: undefined,
  disabled: undefined,
  invalid: undefined,
  uppercase: undefined,
});

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });

const resolvedId: Ref<string> = ref(props.id ?? useId());
const errorId: Ref<string> = ref(`${resolvedId.value}-error`);

const resolvedStatus: ComputedRef<TSDStatus> = computed(() => {
  if (props.invalid) {
    return 'danger';
  }

  return props.status ?? 'neutral';
});

</script>

<template>
  <SDFormField
    :id="resolvedId"
    :name="name"
    :label="label"
    :described-by="invalid ? errorId : describedBy"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :invalid="invalid"
    :class="containerClass"
  >
    <!-- TODO: refactor to be a floating label in form field -->
    <SDLabel
      v-if="label"
      size="xs"
      :uppercase="uppercase"
    >
      {{ label }}
    </SDLabel>

    <div
      class="w-full bg-sd-surface rounded-lg transition flex gap-1 items-center"
      :class="[
        disabled ? 'text-sd-fg-disabled opacity-50 cursor-not-allowed' : 'text-sd-fg-muted',
        getSizeClasses(size ?? 'md', 'p'),
        getSizeClasses(size ?? 'md', 'text'),
        getStatusClasses(resolvedStatus, 'border'),
        !disabled && getStatusClasses(resolvedStatus, 'focus'),
        !disabled && getStatusClasses(resolvedStatus, 'hover'),
      ]"
    >
      <!-- prefix placeholder (icons, units, etc.) -->
      <slot name="prefix"></slot>

      <SDBaseInput
        v-bind="$attrs"
        v-model="value"
        type="text"
      />

      <!-- suffix placeholder (icons, units, etc.) -->
      <slot name="suffix"></slot>

      <!-- Error Icon -->
      <SDIcon
        name="x-circle"
        :status="resolvedStatus"
        :size="size"
        v-if="invalid"
      >
        <slot name="errorIcon"></slot>
      </SDIcon>
    </div>

    <!-- TODO: Add hint field or tooltip-->
    <!-- error-message -->
    <div
      v-if="invalid && errorMessage"
      :id="errorId"
      class="text-xs tracking-wider"
      :class="[
        getStatusClasses(resolvedStatus, 'text')
      ]"
      role="alert"
      aria-live="polite"
    >
      <slot name="errorMessage">{{ errorMessage }}</slot>
    </div>
  </SDFormField>
</template>
