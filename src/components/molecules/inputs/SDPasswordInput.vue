<script lang="ts" setup>
import { computed, ref, useId, type ComputedRef, type ModelRef, type Ref } from 'vue';
import type { TSDMediumSize, TSDStatus } from '../../../types/common';
import SDIcon from '../../atoms/SDIcon.vue';
import SDTextInput from './SDTextInput.vue';

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
  autocomplete?: 'current-password' | 'new-password' | 'off' | (string & {});
}

const props: ISDPasswordInputProps = withDefaults(defineProps<ISDPasswordInputProps>(), {
  size: 'md',
  status: 'neutral',
  required: undefined,
  disabled: undefined,
  invalid: undefined,
  uppercase: undefined,
});

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });

const resolvedId: ComputedRef<string> = computed(() => props.id ?? useId());

const type: Ref<'password' | 'text'> = ref('password');

function toggleShow(): void {
  if (props.disabled) return;
  type.value = type.value === 'password' ? 'text' : 'password';
};
</script>

<template>
  <SDTextInput
    :id="resolvedId"
    v-model="value"
    :type="type"
    :name="name"
    :label="label"
    :described-by="describedBy"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :size="size"
    :status="status"
    :uppercase="uppercase"
    :error-message="errorMessage"
    :container-class="containerClass"
    :autocomplete="autocomplete"
  >
    <template #suffix>
      <slot name="eye-icon-prefix"></slot>

      <!-- TODO:: Refactor to be an Icon Button as soon as buttons are implemented: Eye Icon -->
      <button
        type="button"
        :aria-label="type === 'password' ? 'Show password' : 'Hide password'"
        :aria-controls="resolvedId"
        :aria-pressed="type === 'text'"
        :disabled="disabled"
        role="button"
        data-testid="password-eye-icon"
        @click="toggleShow"
      >
        <SDIcon
          :icon="type === 'password' ? 'eye' : 'eye-off'"
          :size="size"
        >
          <slot
            name="eyeIcon"
            v-bind="{ show: type !== 'password' }"
          ></slot>
        </SDIcon>
      </button>

      <slot name="eye-icon-suffix"></slot>
    </template>

    <template
      v-if="$slots.errorIcon"
      #errorIcon
    >
      <slot name="errorIcon"></slot>
    </template>
    <template
      v-if="$slots.errorMessage"
      #errorMessage
    >
      <slot name="errorMessage"></slot>
    </template>
    <template
      v-if="$slots.prefix"
      #prefix
    >
      <slot name="prefix"></slot>
    </template>
  </SDTextInput>
</template>
