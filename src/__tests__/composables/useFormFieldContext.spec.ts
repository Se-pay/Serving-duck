import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref, type Ref, type VNode } from 'vue';

import {
  type ISDFormFieldContext,
  resolveFormFieldValue,
  SD_FORM_FIELD_KEY,
  useFormFieldContext,
} from '@/composables/useFormFieldContext';

describe('useFormFieldContext composable', (): void => {
  describe('resolveFormFieldValue', (): void => {
    it('prioritizes explicit propValue even when falsy (false, empty string, 0)', (): void => {
      expect(resolveFormFieldValue<boolean>(false, ref(true), true)).toBe(false);
      expect(resolveFormFieldValue<string>('', (): string => 'ctx-val', 'fallback')).toBe('');
      expect(resolveFormFieldValue<number>(0, 42, 99)).toBe(0);
    });

    it('resolves contextValue from plain values, refs, and getter functions when propValue is undefined', (): void => {
      const reactiveId: Ref<string> = ref('ref-id');

      expect(resolveFormFieldValue<string>(undefined, 'plain-id', 'fallback')).toBe('plain-id');
      expect(resolveFormFieldValue<string>(undefined, reactiveId, 'fallback')).toBe('ref-id');
      expect(resolveFormFieldValue<string>(undefined, (): string => 'getter-id', 'fallback')).toBe('getter-id');

      reactiveId.value = 'updated-ref-id';
      expect(resolveFormFieldValue<string>(undefined, reactiveId, 'fallback')).toBe('updated-ref-id');
    });

    it('falls back to fallback when both propValue and resolved contextValue are undefined', (): void => {
      expect(resolveFormFieldValue<string>(undefined, undefined, 'default-id')).toBe('default-id');
      expect(resolveFormFieldValue<boolean>(undefined, ref<boolean | undefined>(undefined), false)).toBe(false);
      expect(resolveFormFieldValue<string | undefined>(undefined, (): undefined => undefined, undefined)).toBeUndefined();
    });
  });

  describe('useFormFieldContext', (): void => {
    const ContextProbe: ReturnType<typeof defineComponent> = defineComponent({
      setup(): () => VNode {
        const ctx: ISDFormFieldContext | undefined = useFormFieldContext();
        return (): VNode =>
          h('div', {
            'data-has-context': String(ctx !== undefined),
            'data-id': ctx ? resolveFormFieldValue<string>(undefined, ctx.id, 'none') : 'none',
          });
      },
    });

    it('returns undefined when invoked outside an SDFormField provider', (): void => {
      const wrapper: VueWrapper = mount(ContextProbe);

      expect(wrapper.attributes('data-has-context')).toBe('false');
      expect(wrapper.attributes('data-id')).toBe('none');
    });

    it('returns the injected context when provided via SD_FORM_FIELD_KEY', (): void => {
      const providedContext: ISDFormFieldContext = {
        id: (): string => 'provided-field-id',
      };

      const wrapper: VueWrapper = mount(ContextProbe, {
        global: {
          provide: {
            [SD_FORM_FIELD_KEY as symbol]: providedContext,
          },
        },
      });

      expect(wrapper.attributes('data-has-context')).toBe('true');
      expect(wrapper.attributes('data-id')).toBe('provided-field-id');
    });
  });
});

