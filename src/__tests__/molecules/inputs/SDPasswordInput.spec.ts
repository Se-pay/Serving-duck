import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import SDIcon from '@/components/atoms/SDIcon.vue';
import SDLabel from '@/components/atoms/SDLabel.vue';
import SDPasswordInput from '@/components/molecules/inputs/SDPasswordInput.vue';
import type { TSDMediumSize, TSDStatus } from '@/types/common';
import { SD_ICONS } from '@/utils/icons';

describe('SDPasswordInput', (): void => {
  it('renders an SDFormField container and password input with eye icon and default styles', (): void => {
    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.findComponent(SDLabel).exists()).toBe(false);

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('password');
    expect(input.attributes('aria-invalid')).toBe('false');

    const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
    expect(inputContainer.classes()).toContain('py-1.5');
    expect(inputContainer.classes()).toContain('px-3');
    expect(inputContainer.classes()).toContain('text-base');
    expect(inputContainer.classes()).toContain('border-sd-status-neutral');
    expect(inputContainer.classes()).toContain('text-sd-fg-muted');

    const eyeButton: ReturnType<VueWrapper['find']> = wrapper.find('[data-testid="password-eye-icon"]');
    expect(eyeButton.exists()).toBe(true);
    expect(eyeButton.attributes('role')).toBe('button');
    expect(eyeButton.attributes('aria-pressed')).toBe('false');
    expect(eyeButton.attributes('aria-controls')).toBe(input.attributes('id'));

    const eyePaths: ReturnType<VueWrapper['findAll']> = eyeButton.findAll('svg > path');
    expect(eyePaths).toHaveLength(SD_ICONS.eye.length);

    // Error icon and message should not exist
    expect(wrapper.findAllComponents(SDIcon)).toHaveLength(1);
    expect(wrapper.find('.text-xs.tracking-wider').exists()).toBe(false);
  });

  it('supports two-way v-model binding via modelValue and update:modelValue', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'P@ssword123',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('P@ssword123');

    await input.setValue('Secret!987');

    const emitted: Record<string, unknown[][]> = wrapper.emitted();
    expect(emitted['update:modelValue']).toBeTruthy();
    expect(emitted['update:modelValue']?.[0]).toEqual(['Secret!987']);
  });

  it('toggles password visibility and updates input type, aria-pressed, and eye icon on click', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'SuperSecret',
        id: 'test-password-field',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    const eyeButton: ReturnType<VueWrapper['find']> = wrapper.find('[data-testid="password-eye-icon"]');

    expect(input.attributes('type')).toBe('password');
    expect(eyeButton.attributes('aria-pressed')).toBe('false');
    expect(eyeButton.findAll('svg > path')).toHaveLength(SD_ICONS.eye.length);

    // Toggle to visible (text)
    await eyeButton.trigger('click');

    expect(input.attributes('type')).toBe('text');
    expect(eyeButton.attributes('aria-pressed')).toBe('true');
    expect(eyeButton.findAll('svg > path')).toHaveLength(SD_ICONS['eye-off'].length);

    // Toggle back to hidden (password)
    await eyeButton.trigger('click');

    expect(input.attributes('type')).toBe('password');
    expect(eyeButton.attributes('aria-pressed')).toBe('false');
    expect(eyeButton.findAll('svg > path')).toHaveLength(SD_ICONS.eye.length);
  });

  it('renders SDLabel when label is set, wires label[for] to input[id], and forwards uppercase & required', (): void => {
    const autoIdWrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
        label: 'Security Pin',
        required: true,
        uppercase: false,
      },
    });

    const label: ReturnType<VueWrapper['find']> = autoIdWrapper.find('label');
    const input: ReturnType<VueWrapper['find']> = autoIdWrapper.find('input');
    const eyeButton: ReturnType<VueWrapper['find']> = autoIdWrapper.find('[data-testid="password-eye-icon"]');

    expect(label.exists()).toBe(true);
    expect(label.text()).toContain('Security Pin');
    expect(label.classes()).not.toContain('uppercase');
    expect(label.find('span[aria-hidden="true"]').text()).toBe('*');

    const autoId: string | undefined = input.attributes('id');
    expect(autoId).toBeTruthy();
    expect(label.attributes('for')).toBe(autoId);
    expect(eyeButton.attributes('aria-controls')).toBe(autoId);
    expect(input.attributes('aria-label')).toBe('Security Pin');
    expect(input.attributes('required')).toBeDefined();

    const customIdWrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
        id: 'custom-pwd-id',
        name: 'password_field',
        label: 'Password',
      },
    });

    expect(customIdWrapper.find('label').attributes('for')).toBe('custom-pwd-id');
    expect(customIdWrapper.find('input').attributes('id')).toBe('custom-pwd-id');
    expect(customIdWrapper.find('input').attributes('name')).toBe('password_field');
    expect(customIdWrapper.find('[data-testid="password-eye-icon"]').attributes('aria-controls')).toBe('custom-pwd-id');
  });

  it('forwards disabled to input, applies disabled styling to wrapper, and disables hover/focus styles', (): void => {
    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'HiddenValue',
        label: 'Master Password',
        disabled: true,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.attributes('disabled')).toBeDefined();

    const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
    expect(inputContainer.classes()).toContain('text-sd-fg-disabled');
    expect(inputContainer.classes()).toContain('opacity-50');
    expect(inputContainer.classes()).toContain('cursor-not-allowed');
    expect(wrapper.find('label').classes()).toContain('text-sd-fg-disabled');
  });

  it('wires describedBy correctly and switches to errorId when invalid', (): void => {
    const validWithDescWrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
        id: 'my-input',
        describedBy: 'pwd-hints',
        invalid: false,
      },
    });
    expect(validWithDescWrapper.find('input').attributes('aria-describedby')).toBe('pwd-hints');

    const invalidWrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
        id: 'my-input',
        describedBy: 'pwd-hints',
        invalid: true,
      },
    });
    expect(invalidWrapper.find('input').attributes('aria-describedby')).toBe('pwd-hints');

    const invalidWrapperError: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
        id: 'my-input',
        describedBy: 'pwd-hints',
        invalid: true,
        errorMessage: 'Invalid password'
      },
    });
    expect(invalidWrapperError.find('input').attributes('aria-describedby')).toBe('my-input-error pwd-hints');
  });

  it('forwards fallthrough attributes and DOM event listeners to the inner input rather than outer wrapper', async (): Promise<void> => {
    const onFocus: ReturnType<typeof vi.fn<() => void>> = vi.fn<() => void>();

    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
      },
      attrs: {
        placeholder: 'Enter password...',
        autocomplete: 'current-password',
        maxlength: '32',
        onFocus,
      },
    });

    expect(wrapper.attributes('placeholder')).toBeUndefined();
    expect(wrapper.attributes('maxlength')).toBeUndefined();

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('Enter password...');
    expect(input.attributes('autocomplete')).toBe('current-password');
    expect(input.attributes('maxlength')).toBe('32');

    await input.trigger('focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('applies containerClass to the outer SDFormField container', (): void => {
    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '',
        containerClass: 'custom-container-class my-4',
      },
    });

    expect(wrapper.classes()).toContain('custom-container-class');
    expect(wrapper.classes()).toContain('my-4');
  });

  it('applies size classes (sm, md, lg) to the input wrapper and forwards size to icons', (): void => {
    const expectedSizes: Record<TSDMediumSize, { padding: string[]; text: string }> = {
      sm: { padding: ['py-1', 'px-2'], text: 'text-sm' },
      md: { padding: ['py-1.5', 'px-3'], text: 'text-base' },
      lg: { padding: ['py-2', 'px-4'], text: 'text-lg' },
    };

    const sizes: TSDMediumSize[] = Object.keys(expectedSizes) as TSDMediumSize[];
    for (const size of sizes) {
      const wrapper: VueWrapper = mount(SDPasswordInput, {
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

      const icons: ReturnType<VueWrapper['findAllComponents']> = wrapper.findAllComponents(SDIcon);
      expect(icons).toHaveLength(2); // eye icon and error icon
      for (const icon of icons) {
        expect(icon.classes()).toContain(expectedSizes[size].text);
      }
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
      const wrapper: VueWrapper = mount(SDPasswordInput, {
        props: {
          modelValue: '',
          status,
        },
      });
      const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
      expect(inputContainer.classes()).toContain(borderStatusMap[status]);
    }

    const invalidOverrideWrapper: VueWrapper = mount(SDPasswordInput, {
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

  it('renders error icon and errorMessage only when invalid, and supports errorIcon slot', (): void => {
    const validWithErrorProp: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'secret',
        invalid: false,
        errorMessage: 'Should stay hidden',
      },
    });
    // Only the eye icon exists when not invalid
    expect(validWithErrorProp.findAllComponents(SDIcon)).toHaveLength(1);
    expect(validWithErrorProp.text()).not.toContain('Should stay hidden');

    const invalidWithoutMessage: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'secret',
        invalid: true,
      },
    });
    // 2 icons: eye icon + error icon
    const icons: ReturnType<VueWrapper['findAllComponents']> = invalidWithoutMessage.findAllComponents(SDIcon);
    expect(icons).toHaveLength(2);
    expect(icons[1]?.classes()).toContain('text-sd-status-danger');
    expect(invalidWithoutMessage.find('.text-xs.tracking-wider').exists()).toBe(false);

    const invalidWithMessage: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'secret',
        invalid: true,
        errorMessage: 'Password is too weak',
      },
    });
    expect(invalidWithMessage.text()).toContain('Password is too weak');
    const errorEl: ReturnType<VueWrapper['find']> = invalidWithMessage.find('.text-xs.tracking-wider');
    expect(errorEl.classes()).toContain('text-sd-status-danger');
    expect(errorEl.attributes('role')).toBe('alert');

    const customErrorSlot: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: 'secret',
        invalid: true,
      },
      slots: {
        errorIcon: '<svg data-testid="custom-err-icon" />',
      },
    });
    expect(customErrorSlot.find('[data-testid="custom-err-icon"]').exists()).toBe(true);
  });

  it('renders prefix slot content and supports scoped eyeIcon slot with show state', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDPasswordInput, {
      props: {
        modelValue: '123456',
      },
      slots: {
        prefix: '<span data-testid="slot-prefix">🔒</span>',
        eyeIcon: `
          <template #eyeIcon="{ show }">
            <span data-testid="custom-eye-slot">{{ show ? 'HIDE' : 'SHOW' }}</span>
          </template>
        `,
      },
    });

    expect(wrapper.find('[data-testid="slot-prefix"]').text()).toBe('🔒');

    const eyeSlot: ReturnType<VueWrapper['find']> = wrapper.find('[data-testid="custom-eye-slot"]');
    expect(eyeSlot.exists()).toBe(true);
    expect(eyeSlot.text()).toBe('SHOW');

    // Click to toggle
    await wrapper.find('[data-testid="password-eye-icon"]').trigger('click');
    expect(eyeSlot.text()).toBe('HIDE');

    // Click again to toggle back
    await wrapper.find('[data-testid="password-eye-icon"]').trigger('click');
    expect(eyeSlot.text()).toBe('SHOW');
  });
});
