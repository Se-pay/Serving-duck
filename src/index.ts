import type { App, Plugin } from 'vue';

import { SDBaseInput, SDFormField, SDIcon, SDLabel, SDTitle } from './components/atoms';
import { SDEmailInput, SDTextInput } from './components/molecules';

export * from './components/atoms';
export * from './components/molecules';
export {
  resolveFormFieldValue,
  SD_FORM_FIELD_KEY,
  useFormFieldContext, type ISDFormFieldContext,
  type ISDResolvedFormFieldContext
} from './composables/useFormFieldContext';
export * from './types/common';
export {
  SD_ICON_NAMES,
  SD_ICONS,
  type TSDIconName
} from './utils/icons';
export {
  DEFAULT_EMAIL_REGEX,
  type ISDEmailValidationOptions,
  type ISDEmailValidationResult,
  type ISDVuelidateField,
  type TSDEmailValidator,
  type TSDEmailValidatorFn,
  validateEmail,
} from './utils/validation';

export const ServingDuck: Plugin = {
  install(app: App): void {
    // atoms
    app.component('SDBaseInput', SDBaseInput);
    app.component('SDFormField', SDFormField);
    app.component('SDIcon', SDIcon);
    app.component('SDTitle', SDTitle);
    app.component('SDLabel', SDLabel);

    // molecules
    app.component('SDEmailInput', SDEmailInput);
    app.component('SDTextInput', SDTextInput);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // atoms
    SDBaseInput: typeof SDBaseInput;
    SDFormField: typeof SDFormField;
    SDIcon: typeof SDIcon;
    SDLabel: typeof SDLabel;
    SDTitle: typeof SDTitle;

    // molecules
    SDEmailInput: typeof SDEmailInput;
    SDTextInput: typeof SDTextInput;
  }
}
