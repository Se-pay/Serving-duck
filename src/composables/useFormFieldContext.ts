import { inject, type InjectionKey, type MaybeRefOrGetter, toValue } from 'vue';

export interface ISDFormFieldContext {
  id: MaybeRefOrGetter<string | undefined>;
  describedBy?: MaybeRefOrGetter<string | undefined>;
  required?: MaybeRefOrGetter<boolean | undefined>;
  disabled?: MaybeRefOrGetter<boolean | undefined>;
  invalid?: MaybeRefOrGetter<boolean | undefined>;
}

export interface ISDResolvedFormFieldContext {
  id: string | undefined;
  describedBy: string | undefined;
  required: boolean;
  disabled: boolean;
  invalid: boolean;
}

export const SD_FORM_FIELD_KEY: InjectionKey<ISDFormFieldContext> = Symbol('SDFormField');

export function useFormFieldContext(): ISDFormFieldContext | undefined {
  return inject(SD_FORM_FIELD_KEY, undefined);
}

export function resolveFormFieldValue<T>(
  propValue: T | undefined,
  contextValue: MaybeRefOrGetter<T | undefined> | undefined,
  fallback: T,
): T {
  if (propValue !== undefined) {
    return propValue;
  }
  const fromContext: T | undefined = contextValue !== undefined ? toValue(contextValue) : undefined;
  return fromContext !== undefined ? fromContext : fallback;
}

