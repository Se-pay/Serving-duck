<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  ref,
  useId,
  watch,
  type ComputedRef,
  type ModelRef,
  type Ref
} from 'vue';
import type { TSDMediumSize, TSDStatus } from '../../../types/common';
import {
  validateEmail,
  type ISDEmailValidationResult,
  type TSDEmailValidator,
} from '../../../utils/validation';
import SDTextInput from './SDTextInput.vue';

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
  <SDTextInput
    :id="resolvedId"
    v-model="value"
    type="email"
    :name="name"
    :label="label"
    :described-by="describedBy"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :invalid="resolvedInvalid"
    :size="size"
    :status="status"
    :error-message="resolvedErrorMessage"
    :container-class="containerClass"
    :uppercase="uppercase"
    @blur="handleBlur"
  >
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
    <template
      v-if="$slots.suffix"
      #suffix
    >
      <slot name="suffix"></slot>
    </template>
  </SDTextInput>
</template>
