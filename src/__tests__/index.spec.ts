import { describe, expect, it } from 'vitest';
import { type App, createApp, defineComponent } from 'vue';

import {
  resolveFormFieldValue,
  SD_FORM_FIELD_KEY,
  SD_ICON_NAMES,
  SD_ICONS,
  SDBaseInput,
  SDFormField,
  SDIcon,
  SDLabel,
  SDTextInput,
  SDTitle,
  ServingDuck,
  useFormFieldContext,
} from '@/index';

describe('ServingDuck entry & Vue plugin', (): void => {
  it('exports all public components, composables, and icon utilities', (): void => {
    expect(SDBaseInput).toBeDefined();
    expect(SDFormField).toBeDefined();
    expect(SDIcon).toBeDefined();
    expect(SDLabel).toBeDefined();
    expect(SDTitle).toBeDefined();
    expect(SDTextInput).toBeDefined();

    expect(SD_FORM_FIELD_KEY).toBeTypeOf('symbol');
    expect(useFormFieldContext).toBeTypeOf('function');
    expect(resolveFormFieldValue).toBeTypeOf('function');

    expect(SD_ICONS).toBeDefined();
    expect(SD_ICON_NAMES.length).toBeGreaterThan(0);
  });

  it('registers all atoms and molecules globally when installed via app.use()', (): void => {
    const RootComponent: ReturnType<typeof defineComponent> = defineComponent({
      template: '<div></div>',
    });

    const app: App<Element> = createApp(RootComponent);
    app.use(ServingDuck);

    const expectedComponents: string[] = [
      'SDBaseInput',
      'SDFormField',
      'SDIcon',
      'SDLabel',
      'SDTitle',
      'SDTextInput',
    ];

    for (const componentName of expectedComponents) {
      expect(app.component(componentName)).toBeDefined();
    }
  });
});
