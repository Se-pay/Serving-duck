<script lang="ts" setup>
import type { TSDMediumSize, TSDStatus } from '@/types/common';
import { getSizeClasses, getStatusClasses } from '@/utils/variantStyling';
import { computed, ref, useId, type ComputedRef, type ModelRef, type Ref } from 'vue';
import SDBaseInput from '../atoms/SDBaseInput.vue';
import SDErrorMessage from '../atoms/SDErrorMessage.vue';
import SDFormField from '../atoms/SDFormField.vue';
import SDIcon from '../atoms/SDIcon.vue';
import SDLabel from '../atoms/SDLabel.vue';

export interface ISDPasswordInputProps {
  modelValue: string | undefined | null;
  label?: string;
  id?: string;
  name?: string;
  describedBy?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: TSDMediumSize;
  status?: TSDStatus;
  uppercase?: boolean;
  errorMessage?: string;
  containerClass?: string;
}

defineOptions({ inheritAttrs: false });
const props: ISDPasswordInputProps = withDefaults(defineProps<ISDPasswordInputProps>(), {
  size: 'md',
  status: 'neutral',
  required: undefined,
  disabled: undefined,
  invalid: undefined,
  uppercase: undefined,
});

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });

const resolvedId: Ref<string> = ref(props.id ?? useId());
const errorId: Ref<string> = ref(`${resolvedId.value}-error`);

const type: Ref<'password' | 'text'> = ref('password');

function toggleShow(): void {
  type.value = type.value === 'password' ? 'text' : 'password';
};

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
    :described-by="(invalid && (errorMessage || $slots['errorMessage'])) ? errorId : describedBy"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :class="containerClass"
  >
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
        :type="type"
      />

      <!-- Eye Icon -->
      <SDIcon
        :name="type === 'password' ? 'eye' : 'eye-off'"
        :size="size"
        label="Show password"
        role="button"
        :aria-controls="resolvedId"
        :aria-expanded="type === 'text'"
        data-testid="password-eye-icon"
        @click="toggleShow"
      >
        <slot
          name="eyeIcon"
          v-bind="{ show: type !== 'password' }"
        ></slot>
      </SDIcon>

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

    <!-- TODO:: Add a password strength meter -->

    <SDErrorMessage
      :invalid="invalid"
      :error-id="errorId"
    >
      <slot name="errorMessage">{{ errorMessage }}</slot>
    </SDErrorMessage>
  </SDFormField>
</template>
