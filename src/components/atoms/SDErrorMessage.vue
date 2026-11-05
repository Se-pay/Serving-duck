<script lang="ts" setup>
import { computed, useSlots, type ComputedRef, type Slots } from 'vue';
import { getStatusClasses } from '../../utils/variantStyling';

export interface ISDErrorMessageProps {
  invalid?: boolean;
  errorMessage?: string;
  errorId?: string;
}

const slots: Slots = useSlots();
const props: ISDErrorMessageProps = withDefaults(defineProps<ISDErrorMessageProps>(), {
  invalid: false,
  errorMessage: '',
  errorId: '',
});

const isErrorMessageVisible: ComputedRef<boolean> = computed((): boolean => {
  return Boolean(
    props.invalid &&
    (props.errorMessage || !!slots['default']),
  );
});
</script>

<template>
  <div
    v-if="isErrorMessageVisible"
    :id="errorId || undefined"
    class="text-xs tracking-wider"
    :class="[
      getStatusClasses('danger', 'text')
    ]"
    role="alert"
    aria-live="polite"
  >
    <slot>{{ errorMessage }}</slot>
  </div>
</template>
