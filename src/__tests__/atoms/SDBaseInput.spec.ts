import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import SDBaseInput, { type ISDBaseInputProps } from '@/components/atoms/SDBaseInput.vue';
import { type ISDFormFieldContext, SD_FORM_FIELD_KEY } from '@/composables/useFormFieldContext';

describe('SDBaseInput', (): void => {
  it('renders a structural input element with sensible accessibility and layout defaults', (): void => {
    const wrapper: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.element.tagName).toBe('INPUT');
    expect(wrapper.attributes('type')).toBe('text');
    expect(wrapper.classes()).toEqual(['outline-none', 'bg-transparent', 'w-full', 'h-full']);

    const generatedId: string | undefined = wrapper.attributes('id');
    expect(generatedId).toBeTruthy();
    expect(wrapper.attributes('name')).toBe(generatedId);
    expect(wrapper.attributes('aria-label')).toBe(generatedId);
    expect(wrapper.attributes('aria-invalid')).toBe('false');
    expect(wrapper.attributes('aria-describedby')).toBeUndefined();
    expect(wrapper.attributes('required')).toBeUndefined();
    expect(wrapper.attributes('readonly')).toBeUndefined();
    expect(wrapper.attributes('disabled')).toBeUndefined();
  });

  it('binds modelValue and emits update:modelValue when user types', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: 'Initial',
      },
    });

    const inputEl: HTMLInputElement = wrapper.element as HTMLInputElement;
    expect(inputEl.value).toBe('Initial');

    await wrapper.setValue('Commander Duck');

    const emitted: Record<string, unknown[][]> = wrapper.emitted();
    expect(emitted['update:modelValue']).toBeTruthy();
    expect(emitted['update:modelValue']?.[0]).toEqual(['Commander Duck']);

    await wrapper.setProps({ modelValue: null });
    expect(inputEl.value).toBe('');
  });

  it('supports all permitted native input types', (): void => {
    const types: NonNullable<ISDBaseInputProps['type']>[] = [
      'text',
      'password',
      'email',
      'number',
      'search',
      'tel',
      'url',
    ];

    for (const type of types) {
      const wrapper: VueWrapper = mount(SDBaseInput, {
        props: {
          modelValue: '',
          type,
        },
      });
      expect(wrapper.attributes('type')).toBe(type);
    }
  });

  it('applies explicit identity, state, ARIA, and fallthrough attributes accurately', (): void => {
    const wrapper: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: 'secret',
        id: 'api-token-id',
        name: 'api_token',
        label: 'API Token',
        describedBy: 'token-help',
        invalid: true,
        required: true,
        readonly: true,
        disabled: true,
      },
      attrs: {
        placeholder: 'Enter token...',
        maxlength: '64',
      },
    });

    expect(wrapper.attributes('id')).toBe('api-token-id');
    expect(wrapper.attributes('name')).toBe('api_token');
    expect(wrapper.attributes('aria-label')).toBe('API Token');
    expect(wrapper.attributes('aria-describedby')).toBe('token-help');
    expect(wrapper.attributes('aria-invalid')).toBe('true');
    expect(wrapper.attributes('required')).toBeDefined();
    expect(wrapper.attributes('readonly')).toBeDefined();
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('placeholder')).toBe('Enter token...');
    expect(wrapper.attributes('maxlength')).toBe('64');
  });

  it('cascades id -> name -> aria-label when optional naming props are omitted', (): void => {
    const withIdOnly: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: '',
        id: 'callsign-input',
      },
    });

    expect(withIdOnly.attributes('id')).toBe('callsign-input');
    expect(withIdOnly.attributes('name')).toBe('callsign-input');
    expect(withIdOnly.attributes('aria-label')).toBe('callsign-input');

    const withIdAndName: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: '',
        id: 'callsign-input',
        name: 'player_callsign',
      },
    });

    expect(withIdAndName.attributes('id')).toBe('callsign-input');
    expect(withIdAndName.attributes('name')).toBe('player_callsign');
    expect(withIdAndName.attributes('aria-label')).toBe('player_callsign');
  });

  it('inherits SDFormField context and allows explicit props (including false) to override it', (): void => {
    const context: ISDFormFieldContext = {
      id: ref('ctx-id'),
      name: ref('ctx-name'),
      label: ref('Context Label'),
      describedBy: ref('ctx-desc'),
      invalid: ref(true),
      required: ref(true),
      readonly: ref(true),
      disabled: ref(true),
    };

    const inheritedWrapper: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: '',
      },
      global: {
        provide: {
          [SD_FORM_FIELD_KEY as symbol]: context,
        },
      },
    });

    expect(inheritedWrapper.attributes('id')).toBe('ctx-id');
    expect(inheritedWrapper.attributes('name')).toBe('ctx-name');
    expect(inheritedWrapper.attributes('aria-label')).toBe('Context Label');
    expect(inheritedWrapper.attributes('aria-describedby')).toBe('ctx-desc');
    expect(inheritedWrapper.attributes('aria-invalid')).toBe('true');
    expect(inheritedWrapper.attributes('required')).toBeDefined();
    expect(inheritedWrapper.attributes('readonly')).toBeDefined();
    expect(inheritedWrapper.attributes('disabled')).toBeDefined();

    const overriddenWrapper: VueWrapper = mount(SDBaseInput, {
      props: {
        modelValue: '',
        id: 'prop-id',
        name: 'prop-name',
        label: 'Prop Label',
        describedBy: 'prop-desc',
        invalid: false,
        required: false,
        readonly: false,
        disabled: false,
      },
      global: {
        provide: {
          [SD_FORM_FIELD_KEY as symbol]: context,
        },
      },
    });

    expect(overriddenWrapper.attributes('id')).toBe('prop-id');
    expect(overriddenWrapper.attributes('name')).toBe('prop-name');
    expect(overriddenWrapper.attributes('aria-label')).toBe('Prop Label');
    expect(overriddenWrapper.attributes('aria-describedby')).toBe('prop-desc');
    expect(overriddenWrapper.attributes('aria-invalid')).toBe('false');
    expect(overriddenWrapper.attributes('required')).toBeUndefined();
    expect(overriddenWrapper.attributes('readonly')).toBeUndefined();
    expect(overriddenWrapper.attributes('disabled')).toBeUndefined();
  });
});
