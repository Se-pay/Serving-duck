import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import SDIcon from '@/components/atoms/SDIcon.vue';
import SDLabel from '@/components/atoms/SDLabel.vue';
import SDTextInput from '@/components/molecules/SDTextInput.vue';
import type { TSDMediumSize, TSDStatus } from '@/types/common';

describe('SDTextInput', (): void => {
  it('renders an SDFormField container and text input without label, error icon, or error message by default', (): void => {
    const wrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.findComponent(SDLabel).exists()).toBe(false);
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('aria-invalid')).toBe('false');

    const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
    expect(inputContainer.classes()).toContain('py-1.5');
    expect(inputContainer.classes()).toContain('px-3');
    expect(inputContainer.classes()).toContain('text-base');
    expect(inputContainer.classes()).toContain('border-sd-status-neutral');
    expect(inputContainer.classes()).toContain('text-sd-fg-muted');
  });

  it('supports two-way v-model binding via modelValue and update:modelValue', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: 'Duck-01',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('Duck-01');

    await input.setValue('Duck-02');

    const emitted: Record<string, unknown[][]> = wrapper.emitted();
    expect(emitted['update:modelValue']).toBeTruthy();
    expect(emitted['update:modelValue']?.[0]).toEqual(['Duck-02']);
  });

  it('renders SDLabel when label is set, wires label[for] to input[id], and forwards uppercase & required', (): void => {
    const autoIdWrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: '',
        label: 'Squadron Name',
        required: true,
        uppercase: false,
      },
    });

    const label: ReturnType<VueWrapper['find']> = autoIdWrapper.find('label');
    const input: ReturnType<VueWrapper['find']> = autoIdWrapper.find('input');

    expect(label.exists()).toBe(true);
    expect(label.text()).toContain('Squadron Name');
    expect(label.classes()).not.toContain('uppercase');
    expect(label.find('span[aria-hidden="true"]').text()).toBe('*');

    const autoId: string | undefined = input.attributes('id');
    expect(autoId).toBeTruthy();
    expect(label.attributes('for')).toBe(autoId);
    expect(input.attributes('aria-label')).toBe('Squadron Name');
    expect(input.attributes('required')).toBeDefined();

    const customIdWrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: '',
        id: 'custom-squad-id',
        name: 'squad_name',
        label: 'Squadron',
      },
    });

    expect(customIdWrapper.find('label').attributes('for')).toBe('custom-squad-id');
    expect(customIdWrapper.find('input').attributes('id')).toBe('custom-squad-id');
    expect(customIdWrapper.find('input').attributes('name')).toBe('squad_name');
  });

  it('forwards readonly, disabled, and describedBy to input and styles the wrapper when disabled', (): void => {
    const wrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: 'Locked Value',
        label: 'Region',
        describedBy: 'region-note',
        readonly: true,
        disabled: true,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('disabled')).toBeDefined();
    expect(input.attributes('aria-describedby')).toBe('region-note');

    const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
    expect(inputContainer.classes()).toContain('text-sd-fg-disabled');
    expect(inputContainer.classes()).toContain('opacity-50');
    expect(inputContainer.classes()).toContain('cursor-not-allowed');
    expect(wrapper.find('label').classes()).toContain('text-sd-fg-disabled');
  });

  it('forwards fallthrough attributes and DOM event listeners to the inner input rather than the outer wrapper', async (): Promise<void> => {
    const onFocus: ReturnType<typeof vi.fn<() => void>> = vi.fn<() => void>();

    const wrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: '',
      },
      attrs: {
        placeholder: 'Search sector...',
        autocomplete: 'off',
        maxlength: '20',
        onFocus,
      },
    });

    expect(wrapper.attributes('placeholder')).toBeUndefined();
    expect(wrapper.attributes('maxlength')).toBeUndefined();

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('Search sector...');
    expect(input.attributes('autocomplete')).toBe('off');
    expect(input.attributes('maxlength')).toBe('20');

    await input.trigger('focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('applies size classes (sm, md, lg) to the input wrapper and forwards size to the error icon', (): void => {
    const expectedSizes: Record<TSDMediumSize, { padding: string[]; text: string }> = {
      sm: { padding: ['py-1', 'px-2'], text: 'text-sm' },
      md: { padding: ['py-1.5', 'px-3'], text: 'text-base' },
      lg: { padding: ['py-2', 'px-4'], text: 'text-lg' },
    };

    const sizes: TSDMediumSize[] = Object.keys(expectedSizes) as TSDMediumSize[];
    for (const size of sizes) {
      const wrapper: VueWrapper = mount(SDTextInput, {
        props: {
          modelValue: '',
          size,
          invalid: true,
        },
      });

      const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
      for (const padClass of expectedSizes[size].padding) {
        expect(inputContainer.classes()).toContain(padClass);
      }
      expect(inputContainer.classes()).toContain(expectedSizes[size].text);
      expect(wrapper.findComponent(SDIcon).classes()).toContain(expectedSizes[size].text);
    }
  });

  it('applies semantic status border classes and overrides status to danger when invalid is true', (): void => {
    const borderStatusMap: Record<TSDStatus, string> = {
      success: 'border-sd-status-success',
      warning: 'border-sd-status-warning',
      danger: 'border-sd-status-danger',
      info: 'border-sd-status-info',
      neutral: 'border-sd-status-neutral',
      primary: 'border-sd-primary',
      accent: 'border-sd-accent',
    };

    const statuses: TSDStatus[] = Object.keys(borderStatusMap) as TSDStatus[];
    for (const status of statuses) {
      const wrapper: VueWrapper = mount(SDTextInput, {
        props: {
          modelValue: '',
          status,
        },
      });
      const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
      expect(inputContainer.classes()).toContain(borderStatusMap[status]);
    }

    const invalidOverrideWrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: '',
        status: 'success',
        invalid: true,
      },
    });

    const invalidContainer: ReturnType<VueWrapper['find']> = invalidOverrideWrapper.find('.bg-sd-surface');
    expect(invalidContainer.classes()).toContain('border-sd-status-danger');
    expect(invalidContainer.classes()).not.toContain('border-sd-status-success');
  });

  it('renders error icon and errorMessage only when invalid, and supports errorIcon / errorMessage slots', (): void => {
    const validWithErrorProp: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: 'ok',
        invalid: false,
        errorMessage: 'Should stay hidden',
      },
    });
    expect(validWithErrorProp.findComponent(SDIcon).exists()).toBe(false);
    expect(validWithErrorProp.text()).not.toContain('Should stay hidden');

    const invalidWithoutMessage: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: 'bad',
        invalid: true,
      },
    });
    expect(invalidWithoutMessage.findComponent(SDIcon).exists()).toBe(true);
    expect(invalidWithoutMessage.findComponent(SDIcon).classes()).toContain('text-sd-status-danger');
    expect(invalidWithoutMessage.find('.text-xs.tracking-wider').exists()).toBe(false);

    const invalidWithMessage: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: 'bad',
        invalid: true,
        errorMessage: 'Callsign already taken',
      },
    });
    expect(invalidWithMessage.text()).toContain('Callsign already taken');
    expect(invalidWithMessage.find('.text-xs.tracking-wider').classes()).toContain('text-sd-status-danger');

    const customErrorSlots: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: 'bad',
        invalid: true,
        errorMessage: 'Fallback error',
      },
      slots: {
        errorIcon: '<svg data-testid="custom-err-icon" />',
        errorMessage: '<strong data-testid="custom-err-msg">Custom validation failure</strong>',
      },
    });
    expect(customErrorSlots.find('[data-testid="custom-err-icon"]').exists()).toBe(true);
    expect(customErrorSlots.find('[data-testid="custom-err-msg"]').text()).toBe('Custom validation failure');
  });

  it('renders suffix and prefix slot content inside the input container', (): void => {
    const wrapper: VueWrapper = mount(SDTextInput, {
      props: {
        modelValue: '100',
      },
      slots: {
        suffix: '<span data-testid="slot-suffix">$</span>',
        prefix: '<span data-testid="slot-prefix">USD</span>',
      },
    });

    expect(wrapper.find('[data-testid="slot-suffix"]').text()).toBe('$');
    expect(wrapper.find('[data-testid="slot-prefix"]').text()).toBe('USD');
  });
});
