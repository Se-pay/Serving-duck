<script lang="ts" setup>
import { computed, useId, useSlots, type ComputedRef, type ModelRef, type Slots } from 'vue';
import type { TSDMediumSize, TSDStatus } from '../../../types/common.ts';
import { getSizeClasses, getStatusClasses } from '../../../utils/variantStyling.ts';
import SDBaseInput from '../../atoms/SDBaseInput.vue';
import SDErrorMessage from '../../atoms/SDErrorMessage.vue';
import SDFormField from '../../atoms/SDFormField.vue';
import SDIcon from '../../atoms/SDIcon.vue';
import SDLabel from '../../atoms/SDLabel.vue';

export interface ISDTextInputProps {
  modelValue: string | undefined | null;
  type?: 'text' | 'password' | 'email';
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
  type: 'text',
  size: 'md',
  status: 'neutral',
  required: undefined,
  readonly: undefined,
  disabled: undefined,
  invalid: undefined,
  uppercase: undefined,
});

const slots: Slots = useSlots();
const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });

const resolvedId: ComputedRef<string> = computed(() =>  props.id ?? useId());
const errorId: ComputedRef<string> = computed(() => `${resolvedId.value}-error`);

const resolvedStatus: ComputedRef<TSDStatus> = computed(() => {
  if (props.invalid) {
    return 'danger';
  }

  return props.status ?? 'neutral';
});

const isErrorMessageVisible: ComputedRef<boolean> = computed((): boolean => {
  return Boolean(
    props.invalid &&
    (props.errorMessage || slots.errorMessage),
  );
});

const resolvedDescribedBy: ComputedRef<string | undefined> = computed((): string | undefined => {
  const ids: string[] = [];

  if (isErrorMessageVisible.value) {
    ids.push(errorId.value);
  }

  if (props.describedBy) {
    ids.push(props.describedBy);
  }

  return ids.length > 0 ? ids.join(' ') : undefined;
});
</script>

<template>
  <SDFormField
    :id="resolvedId"
    :name="name"
    :label="label"
    :described-by="resolvedDescribedBy"
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
        getStatusClasses(resolvedStatus, 'border', {hover: !disabled, focus: !disabled}),
      ]"
    >
      <!-- prefix placeholder (icons, units, etc.) -->
      <slot name="prefix"></slot>

      <SDBaseInput
        v-bind="$attrs"
        v-model="value"
        :type="type"
      />

      <!-- suffix placeholder (icons, units, etc.) -->
      <slot name="suffix"></slot>

      <!-- Error Icon -->
      <SDIcon
        v-if="invalid"
        icon="x-circle"
        :status="resolvedStatus"
        :size="size"
      >
        <slot name="errorIcon"></slot>
      </SDIcon>
    </div>

    <!-- TODO: Add hint field or tooltip-->
    <!-- error-message -->
    <SDErrorMessage
      :invalid="invalid"
      :error-message="errorMessage"
      :error-id="errorId"
    >
      <template
        v-if="$slots.errorMessage"
        #default
      >
        <slot name="errorMessage"></slot>
      </template>
    </SDErrorMessage>
  </SDFormField>
</template>
