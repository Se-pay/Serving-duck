<script lang="ts" setup>
import { provide, useId } from 'vue';
import { SD_FORM_FIELD_KEY } from '../../composables/useFormFieldContext';

export interface ISDFormFieldProps {
  id?: string;
  name?: string;
  label?: string;
  describedBy?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

const props: ISDFormFieldProps = defineProps<ISDFormFieldProps>();
const fallbackId: string = useId();

provide(SD_FORM_FIELD_KEY, {
  id: () => props.id ?? fallbackId,
  name: () => props.name ?? props.id ?? fallbackId,
  label: () => props.label,
  describedBy: () => props.describedBy,
  required: () => props.required,
  readonly: () => props.readonly,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
});

</script>

<template>
  <div class="flex flex-col gap-1">
    <slot></slot>
  </div>
</template>
