<script lang="ts" setup>
import { computed, useId, type ComputedRef, type ModelRef } from 'vue';
import { resolveFormFieldValue, useFormFieldContext, type ISDFormFieldContext } from '../../composables/useFormFieldContext';

export interface ISDBaseInputProps {
  modelValue: string | undefined | null;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  id?: string;
  name?: string;
  label?: string;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

const props: ISDBaseInputProps = withDefaults(defineProps<ISDBaseInputProps>(), {
  type: 'text',
  id: undefined,
  name: undefined,
  label: undefined,
  describedBy: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
  disabled: undefined,
});

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });
const fieldContext: ISDFormFieldContext | undefined = useFormFieldContext();
const fallbackId: string = useId();

const resolvedId: ComputedRef<string> = computed((): string =>
  resolveFormFieldValue<string>(props.id, fieldContext?.id, fallbackId),
);
const resolvedName: ComputedRef<string> = computed((): string =>
  resolveFormFieldValue<string>(props.name, fieldContext?.name, resolvedId.value),
);
const resolvedLabel: ComputedRef<string | undefined> = computed((): string | undefined =>
  resolveFormFieldValue<string | undefined>(props.label, fieldContext?.label, undefined),
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
    class="outline-none bg-transparent w-full h-full"
    :type="type"
    :id="resolvedId"
    :name="resolvedName"
    :required="resolvedRequired"
    :readonly="resolvedReadonly"
    :disabled="resolvedDisabled"
    :aria-describedby="resolvedDescribedBy"
    :aria-invalid="resolvedInvalid"
    :aria-label="resolvedLabel"
  />
</template>
