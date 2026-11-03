<script lang="ts" setup>
import { computed, type ComputedRef, type ModelRef } from 'vue';
import SDBaseInput from '../atoms/SDBaseInput.vue';
import SDFormField from '../atoms/SDFormField.vue';

export interface ISDTextInputProps {
  modelValue: string | undefined | null;
  label?: string;
  placeholder?: string;
  id?: string | undefined;
  describedBy?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

defineEmits(['update:modelValue']);
const props: ISDTextInputProps = defineProps<ISDTextInputProps>();

const value: ModelRef<string | undefined | null> = defineModel<string | undefined | null, 'modelValue'>({ default: '' });

const formFieldId: ComputedRef<string> = computed(() => props.id || 'TODO');

/*
** TODO Issues found:
**
** Missing SDLabel import: <SDLabel> is used on line 22 without importing SDLabel.vue. Vue emits [Vue warn]: Failed to resolve component: SDLabel and renders an invalid <sdlabel> tag instead of <label>.
** Fails Storybook Axe (Form elements must have labels): SDTextInput wraps <SDLabel> and <SDBaseInput> in a plain <div> with no id/for association instead of composing SDFormField.vue! Also, when label is omitted, <SDLabel>{{ label }}</SDLabel> renders an empty <label></label>.
** placeholder prop is dropped: ISDTextInputProps accepts placeholder?: string, and SDTextInput.stories.ts passes placeholder: 'Default', but <SDBaseInput v-model="value" /> never binds :placeholder="placeholder".
** Missing core molecule props & attribute forwarding: As a molecule combining SDFormField + SDLabel + SDBaseInput, SDTextInput should expose and forward id, name, type, size, status, required, disabled, readonly, invalid, describedBy, and autocomplete (and consider defineOptions({ inheritAttrs: false }) + v-bind="$attrs" on SDBaseInput so native attributes/listeners like @blur or maxlength land on <input>, not the outer <div>).
*/
</script>

<template>
  <SDFormField
    :id="formFieldId"
    :described-by="describedBy"
  >
    <SDLabel>{{ label }}</SDLabel>

    <SDBaseInput
      v-model="value"
      :placeholder="placeholder"
    />
  </SDFormField>
</template>
