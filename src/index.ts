import type { App, Plugin } from 'vue';

import { SDBaseInput, SDErrorMessage, SDFormField, SDIcon, SDLabel, SDTitle } from './components/atoms';
import { SDEmailInput, SDPasswordInput, SDTextInput } from './components/molecules';

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
  DEFAULT_EMAIL_REGEX, validateEmail, type ISDEmailValidationOptions,
  type ISDEmailValidationResult,
  type ISDVuelidateField,
  type TSDEmailValidator,
  type TSDEmailValidatorFn
} from './utils/validation';

export const ServingDuck: Plugin = {
  install(app: App): void {
    // atoms
    app.component('SDBaseInput', SDBaseInput);
    app.component('SDErrorMessage', SDErrorMessage);
    app.component('SDFormField', SDFormField);
    app.component('SDIcon', SDIcon);
    app.component('SDTitle', SDTitle);
    app.component('SDLabel', SDLabel);

    // molecules
    app.component('SDEmailInput', SDEmailInput);
    app.component('SDPasswordInput', SDPasswordInput);
    app.component('SDTextInput', SDTextInput);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // atoms
    SDBaseInput: typeof SDBaseInput;
    SDErrorMessage: typeof SDErrorMessage;
    SDFormField: typeof SDFormField;
    SDIcon: typeof SDIcon;
    SDLabel: typeof SDLabel;
    SDTitle: typeof SDTitle;

    // molecules
    SDEmailInput: typeof SDEmailInput;
    SDPasswordInput: typeof SDPasswordInput;
    SDTextInput: typeof SDTextInput;
  }
}
