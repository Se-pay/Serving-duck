import type { App, Plugin } from 'vue';

import { SDLabel, SDTitle } from './components/atoms';

export * from './components/atoms';
export {
  type ISDFormFieldContext,
  type ISDResolvedFormFieldContext,
  resolveFormFieldValue,
  SD_FORM_FIELD_KEY,
  useFormFieldContext,
} from './composables/useFormFieldContext';
export * from './types/common';

export const ServingDuck: Plugin = {
  install(app: App): void {
    app.component('SDTitle', SDTitle);
    app.component('SDLabel', SDLabel);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    SDLabel: typeof SDLabel;
    SDTitle: typeof SDTitle;
  }
}
