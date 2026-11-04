<script lang="ts" setup>
import { getStatusClasses } from '@/utils/variantStyling';

export interface ISDErrorMessageProps {
  invalid?: boolean;
  errorMessage?: string;
  errorId?: string;
}

withDefaults(defineProps<ISDErrorMessageProps>(), {
  invalid: false,
  errorMessage: '',
  errorId: '',
});

</script>

<template>
  <div
    v-if="invalid && errorMessage"
    :id="errorId"
    class="text-xs tracking-wider"
    :class="[
      getStatusClasses('danger', 'text')
    ]"
    role="alert"
    aria-live="polite"
  >
    {{ errorMessage }}
  </div>
</template>
