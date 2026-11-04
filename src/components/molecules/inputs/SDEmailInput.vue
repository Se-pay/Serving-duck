<script lang="ts" setup>
import SDBaseInput from '../../atoms/SDBaseInput.vue';
import SDFormField from '../../atoms/SDFormField.vue';
import SDIcon from '../../atoms/SDIcon.vue';
import SDLabel from '../../atoms/SDLabel.vue';
import type { TSDMediumSize, TSDStatus } from '../../../types/common';
import {
  type ISDEmailValidationResult,
  type TSDEmailValidator,
  validateEmail,
} from '../../../utils/validation';
import { getSizeClasses, getStatusClasses } from '../../../utils/variantStyling';
import {
  computed,
  getCurrentInstance,
  ref,
  useId,
  useSlots,
  watch,
  type ComputedRef,
  type ModelRef,
  type Ref,
  type Slots,
} from 'vue';

export interface ISDEmailInputProps {
  modelValue?: string | undefined | null;
  id?: string;
  name?: string;
  label?: string;
  size?: TSDMediumSize;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  status?: TSDStatus;
  errorMessage?: string;
  describedBy?: string;
  uppercase?: boolean;
  containerClass?: string;
  validator?: TSDEmailValidator;
  disableValidation?: boolean;
  validateOn?: 'blur' | 'input';
}

defineOptions({ inheritAttrs: false });

const props: ISDEmailInputProps = withDefaults(defineProps<ISDEmailInputProps>(), {
  id: undefined,
  name: undefined,
  label: undefined,
  size: 'md',
  disabled: undefined,
  required: undefined,
  readonly: undefined,
  invalid: undefined,
  status: undefined,
  errorMessage: undefined,
  describedBy: undefined,
  uppercase: undefined,
  containerClass: undefined,
  validator: undefined,
  disableValidation: false,
  validateOn: 'blur',
});

const emit: (evt: 'blur', event: FocusEvent) => void = defineEmits<{
  blur: [event: FocusEvent];
}>();

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null>({ default: '' });
const invalidModel: ModelRef<boolean | undefined> = defineModel<boolean | undefined>('invalid', { default: undefined });

const hasBlurred: Ref<boolean> = ref(false);

const slots: Slots = useSlots();
const instance: ReturnType<typeof getCurrentInstance> = getCurrentInstance();

const hasUpdateInvalidListener: boolean =
  instance?.vnode?.props?.['onUpdate:invalid'] != null;

const isExternallyControlled: ComputedRef<boolean> = computed((): boolean => {
  return !hasUpdateInvalidListener && props.invalid !== undefined;
});

const isObjectValidator: ComputedRef<boolean> = computed((): boolean => {
  return (
    typeof props.validator === 'object' &&
    props.validator !== null &&
    !(props.validator instanceof RegExp)
  );
});

const shouldValidate: ComputedRef<boolean> = computed((): boolean => {
  if (props.disableValidation) {
    return false;
  }

  if (props.validateOn === 'input' || isObjectValidator.value) {
    return true;
  }

  return hasBlurred.value;
});

const internalValidationResult: ComputedRef<ISDEmailValidationResult> = computed((): ISDEmailValidationResult => {
  if (!shouldValidate.value) {
    return { isValid: true, errorMessage: undefined };
  }

  return validateEmail(value.value, {
    required: props.required,
    errorMessage: props.errorMessage,
    validator: props.validator,
  });
});

const resolvedInvalid: ComputedRef<boolean> = computed((): boolean => {
  if (isExternallyControlled.value) {
    return Boolean(props.invalid);
  }

  return !internalValidationResult.value.isValid;
});

watch(
  resolvedInvalid,
  (newVal: boolean): void => {
    if (invalidModel.value !== newVal) {
      invalidModel.value = newVal;
    }
  },
  { immediate: true },
);

const resolvedErrorMessage: ComputedRef<string | undefined> = computed((): string | undefined => {
  if (props.errorMessage !== undefined) {
    return props.errorMessage;
  }

  return internalValidationResult.value.errorMessage;
});

const fallbackId: string = useId();
const resolvedId: ComputedRef<string> = computed((): string => props.id ?? fallbackId);
const errorId: ComputedRef<string> = computed((): string => `${resolvedId.value}-error`);

const isErrorMessageVisible: ComputedRef<boolean> = computed((): boolean => {
  return Boolean(
    resolvedInvalid.value &&
    (resolvedErrorMessage.value || slots.errorMessage),
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

const resolvedStatus: ComputedRef<TSDStatus> = computed((): TSDStatus => {
  if (resolvedInvalid.value) {
    return 'danger';
  }

  return props.status ?? 'neutral';
});

const touchExternalValidator = (): void => {
  if (
    props.validator &&
    typeof props.validator === 'object' &&
    !(props.validator instanceof RegExp) &&
    typeof props.validator.$touch === 'function'
  ) {
    props.validator.$touch();
  }
};

const handleBlur = (event: FocusEvent): void => {
  hasBlurred.value = true;
  touchExternalValidator();
  emit('blur', event);
};

const validate = (): boolean => {
  hasBlurred.value = true;
  touchExternalValidator();
  return !resolvedInvalid.value;
};

const resetValidation = (): void => {
  hasBlurred.value = false;
};

defineExpose({
  validate,
  resetValidation,
  hasBlurred,
  resolvedInvalid,
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
    :invalid="resolvedInvalid"
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
        type="email"
        @blur="handleBlur"
      />

      <!-- suffix placeholder (icons, units, etc.) -->
      <slot name="suffix"></slot>

      <!-- Error Icon -->
      <SDIcon
        v-if="resolvedInvalid"
        name="x-circle"
        :status="resolvedStatus"
        :size="size"
      >
        <slot name="errorIcon"></slot>
      </SDIcon>
    </div>

    <!-- error-message -->
    <div
      v-if="isErrorMessageVisible"
      :id="errorId"
      class="text-xs tracking-wider"
      :class="[
        getStatusClasses(resolvedStatus, 'text'),
      ]"
      role="alert"
      aria-live="polite"
    >
      <slot name="errorMessage">{{ resolvedErrorMessage }}</slot>
    </div>
  </SDFormField>
</template>
