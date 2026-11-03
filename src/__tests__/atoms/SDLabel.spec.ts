import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ref, type Ref } from 'vue';

import SDLabel from '@/components/atoms/SDLabel.vue';
import { type ISDFormFieldContext, SD_FORM_FIELD_KEY } from '@/composables/useFormFieldContext';

describe('SDLabel', (): void => {
  it('renders a label with xs uppercase defaults and label prop fallback', (): void => {
    const wrapper: VueWrapper = mount(SDLabel, {
      props: {
        label: 'Player Name',
        for: 'player-name',
      },
    });

    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.attributes('for')).toBe('player-name');
    expect(wrapper.text()).toBe('Player Name');
    expect(wrapper.classes()).toContain('text-xs');
    expect(wrapper.classes()).toContain('uppercase');
    expect(wrapper.classes()).toContain('text-sd-fg-muted');
  });

  it('prefers default slot content over the label prop', (): void => {
    const wrapper: VueWrapper = mount(SDLabel, {
      props: {
        label: 'Prop Label',
      },
      slots: {
        default: 'Slot Label',
      },
    });

    expect(wrapper.text()).toBe('Slot Label');
  });

  it('renders required indicator hidden from screen readers and applies disabled state', (): void => {
    const wrapper: VueWrapper = mount(SDLabel, {
      props: {
        label: 'Server Password',
        size: 'md',
        required: true,
        disabled: true,
        uppercase: false,
      },
    });

    expect(wrapper.classes()).toContain('text-base');
    expect(wrapper.classes()).not.toContain('uppercase');
    expect(wrapper.classes()).toContain('text-sd-fg-disabled');
    expect(wrapper.classes()).toContain('cursor-not-allowed');

    const asterisk: ReturnType<VueWrapper['find']> = wrapper.find('span[aria-hidden="true"]');
    expect(asterisk.exists()).toBe(true);
    expect(asterisk.text()).toBe('*');
  });

  it('inherits id, required, and disabled from reactive SDFormField context while allowing explicit prop overrides', (): void => {
    const fieldId: Ref<string> = ref('injected-input-id');
    const isRequired: Ref<boolean> = ref(true);
    const isDisabled: Ref<boolean> = ref(true);

    const context: ISDFormFieldContext = {
      id: fieldId,
      required: isRequired,
      disabled: isDisabled,
    };

    const inheritedWrapper: VueWrapper = mount(SDLabel, {
      props: {
        label: 'Injected Label',
      },
      global: {
        provide: {
          [SD_FORM_FIELD_KEY as symbol]: context,
        },
      },
    });

    expect(inheritedWrapper.attributes('for')).toBe('injected-input-id');
    expect(inheritedWrapper.find('span[aria-hidden="true"]').exists()).toBe(true);
    expect(inheritedWrapper.classes()).toContain('text-sd-fg-disabled');

    const overriddenWrapper: VueWrapper = mount(SDLabel, {
      props: {
        label: 'Explicit Override Label',
        for: 'custom-id',
        required: false,
        disabled: false,
      },
      global: {
        provide: {
          [SD_FORM_FIELD_KEY as symbol]: context,
        },
      },
    });

    expect(overriddenWrapper.attributes('for')).toBe('custom-id');
    expect(overriddenWrapper.find('span[aria-hidden="true"]').exists()).toBe(false);
    expect(overriddenWrapper.classes()).toContain('text-sd-fg-muted');
  });
});

