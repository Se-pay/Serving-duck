import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick, ref, type Ref } from 'vue';

import SDLabel from '@/components/atoms/SDLabel.vue';
import { type ISDFormFieldContext, SD_FORM_FIELD_KEY } from '@/composables/useFormFieldContext';
import type { TSDSize } from '@/types/common';

describe('SDLabel', (): void => {
  it('renders a label with xs uppercase defaults and clean empty state when no props are given', (): void => {
    const bareWrapper: VueWrapper = mount(SDLabel);
    expect(bareWrapper.element.tagName).toBe('LABEL');
    expect(bareWrapper.attributes('for')).toBeUndefined();
    expect(bareWrapper.text()).toBe('');
    expect(bareWrapper.find('span[aria-hidden="true"]').exists()).toBe(false);

    const wrapper: VueWrapper = mount(SDLabel, {
      props: {
        label: 'Player Name',
        for: 'player-name',
      },
    });

    expect(wrapper.attributes('for')).toBe('player-name');
    expect(wrapper.text()).toBe('Player Name');
    expect(wrapper.classes()).toContain('text-xs');
    expect(wrapper.classes()).toContain('uppercase');
    expect(wrapper.classes()).toContain('tracking-wider');
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

  it('applies all TSDSize classes, required indicator, normal case, and disabled state', (): void => {
    const sizeMap: Record<TSDSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const sizes: TSDSize[] = Object.keys(sizeMap) as TSDSize[];
    for (const size of sizes) {
      const sizedWrapper: VueWrapper = mount(SDLabel, {
        props: {
          label: 'Label',
          size,
        },
      });
      expect(sizedWrapper.classes()).toContain(sizeMap[size]);
    }

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
    expect(asterisk.classes()).toContain('text-sd-status-danger');
  });

  it('reactively inherits id, required, and disabled from SDFormField context while allowing explicit prop overrides', async (): Promise<void> => {
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

    fieldId.value = 'updated-input-id';
    isRequired.value = false;
    isDisabled.value = false;
    await nextTick();

    expect(inheritedWrapper.attributes('for')).toBe('updated-input-id');
    expect(inheritedWrapper.find('span[aria-hidden="true"]').exists()).toBe(false);
    expect(inheritedWrapper.classes()).toContain('text-sd-fg-muted');

    isRequired.value = true;
    isDisabled.value = true;
    await nextTick();

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
