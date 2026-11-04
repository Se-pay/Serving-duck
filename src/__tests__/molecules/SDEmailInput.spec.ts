import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, ref } from 'vue';

import SDIcon from '@/components/atoms/SDIcon.vue';
import SDLabel from '@/components/atoms/SDLabel.vue';
import SDEmailInput from '@/components/molecules/inputs/SDEmailInput.vue';
import type { ISDVuelidateField } from '@/utils/validation';

describe('SDEmailInput', (): void => {
  it('renders an SDFormField container and email input with default classes', (): void => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.findComponent(SDLabel).exists()).toBe(false);
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('email');
    expect(input.attributes('aria-invalid')).toBe('false');

    const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
    expect(inputContainer.classes()).toContain('py-1.5');
    expect(inputContainer.classes()).toContain('px-3');
    expect(inputContainer.classes()).toContain('text-base');
    expect(inputContainer.classes()).toContain('border-sd-status-neutral');
  });

  it('supports two-way v-model binding via modelValue and update:modelValue', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'pilot@royalduck.com',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('pilot@royalduck.com');

    await input.setValue('admiral@royalduck.com');

    const emitted: Record<string, unknown[][]> = wrapper.emitted();
    expect(emitted['update:modelValue']).toBeTruthy();
    expect(emitted['update:modelValue']?.[0]).toEqual(['admiral@royalduck.com']);
  });

  it('does not trigger validation error while typing before blur occurs', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.setValue('invalid-email-while-typing');

    expect(input.attributes('aria-invalid')).toBe('false');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);
    expect(wrapper.find('.text-xs.tracking-wider').exists()).toBe(false);
  });

  it('triggers validation on blur and displays error message and icon when email is invalid', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'invalid-email-address',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    // Initially not invalid because blur has not happened yet
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);

    // Trigger blur
    await input.trigger('blur');

    expect(input.attributes('aria-invalid')).toBe('true');

    const icon: ReturnType<VueWrapper['findComponent']> = wrapper.findComponent(SDIcon);
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('text-sd-status-danger');

    const errorDiv: ReturnType<VueWrapper['find']> = wrapper.find('.text-xs.tracking-wider');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toBe('Please enter a valid email address');
    expect(errorDiv.classes()).toContain('text-sd-status-danger');

    const inputContainer: ReturnType<VueWrapper['find']> = wrapper.find('.bg-sd-surface');
    expect(inputContainer.classes()).toContain('border-sd-status-danger');
  });

  it('clears the error message and danger state once corrected after blur', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'bad-email',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');
    expect(input.attributes('aria-invalid')).toBe('true');

    // User corrects the email
    await input.setValue('good.duck@royalduck.com');
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);
    expect(wrapper.find('.text-xs.tracking-wider').exists()).toBe(false);
  });

  it('treats an optional empty email as valid even after blur', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
        required: false,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');

    expect(input.attributes('aria-invalid')).toBe('false');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);
    expect(wrapper.find('.text-xs.tracking-wider').exists()).toBe(false);
  });

  it('marks a required empty email as invalid on blur and shows "Email is required"', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
        required: true,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    expect(input.attributes('aria-invalid')).toBe('false');

    await input.trigger('blur');

    expect(input.attributes('aria-invalid')).toBe('true');

    const errorDiv: ReturnType<VueWrapper['find']> = wrapper.find('.text-xs.tracking-wider');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toBe('Email is required');
  });

  it('uses custom errorMessage prop when provided for invalid inputs on blur', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'bad-email',
        errorMessage: 'Custom email error description',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');

    const errorDiv: ReturnType<VueWrapper['find']> = wrapper.find('.text-xs.tracking-wider');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toBe('Custom email error description');
  });

  it('allows the including project to overwrite validation via external invalid prop (e.g. Vuelidate)', async (): Promise<void> => {
    // Even if blurred with an incomplete email, if external validator says invalid: false,
    // the component stays valid.
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'incomplete-email',
        invalid: false,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');

    expect(input.attributes('aria-invalid')).toBe('false');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);
    expect(wrapper.find('.text-xs.tracking-wider').exists()).toBe(false);

    // When external validator (e.g. Vuelidate) flags invalid: true with external errorMessage:
    await wrapper.setProps({
      invalid: true,
      errorMessage: 'Vuelidate: Must be a valid email format',
    });

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(true);
    expect(wrapper.find('.text-xs.tracking-wider').text()).toBe(
      'Vuelidate: Must be a valid email format',
    );
  });

  it('supports two-way v-model:invalid binding on blur', async (): Promise<void> => {
    const ParentComponent: ReturnType<typeof defineComponent> = defineComponent({
      components: { SDEmailInput },
      setup() {
        const email: ReturnType<typeof ref<string>> = ref('initial@duck.com');
        const isInvalid: ReturnType<typeof ref<boolean | undefined>> = ref<boolean | undefined>(undefined);
        return { email, isInvalid };
      },
      template: '<SDEmailInput v-model="email" v-model:invalid="isInvalid" />',
    });

    const wrapper: VueWrapper<InstanceType<typeof ParentComponent>> = mount(ParentComponent);
    expect(wrapper.vm.isInvalid).toBe(false);

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.setValue('invalid-email');
    // Not invalid yet before blur
    expect(wrapper.vm.isInvalid).toBe(false);

    await input.trigger('blur');
    expect(wrapper.vm.isInvalid).toBe(true);

    await input.setValue('repaired@duck.com');
    expect(wrapper.vm.isInvalid).toBe(false);
  });

  it('supports custom validator function evaluated on blur', async (): Promise<void> => {
    const customValidator = (val: string | undefined | null): boolean | string => {
      if (!val?.endsWith('@royalduck.com')) {
        return 'Only @royalduck.com domain is permitted';
      }
      return true;
    };

    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'quack@other.com',
        validator: customValidator,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');

    const errorDiv: ReturnType<VueWrapper['find']> = wrapper.find('.text-xs.tracking-wider');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toBe('Only @royalduck.com domain is permitted');

    await input.setValue('quack@royalduck.com');

    expect(wrapper.find('.text-xs.tracking-wider').exists()).toBe(false);
    expect(input.attributes('aria-invalid')).toBe('false');
  });

  it('supports custom RegExp validator evaluated on blur without bypassing blur gating', async (): Promise<void> => {
    const customRegex: RegExp = /^duck\d+@royalduck\.com$/;

    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'notduck@royalduck.com',
        validator: customRegex,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    // Must NOT validate immediately before blur, even though RegExp is typeof === 'object'
    expect(input.attributes('aria-invalid')).toBe('false');

    await input.trigger('blur');
    expect(input.attributes('aria-invalid')).toBe('true');

    await input.setValue('duck01@royalduck.com');
    expect(input.attributes('aria-invalid')).toBe('false');
  });

  it('supports Vuelidate field object without waiting for blur and calls $touch on blur', async (): Promise<void> => {
    let touched: boolean = false;
    const vuelidateField: ISDVuelidateField & { $touch: () => void } = {
      $error: true,
      $errors: [{ $message: 'Field is required by Vuelidate' }],
      $touch: (): void => {
        touched = true;
      },
    };

    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
        validator: vuelidateField,
      },
    });

    // Object validators evaluate immediately because Vuelidate manages $error & $dirty externally
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.find('.text-xs.tracking-wider').text()).toBe(
      'Field is required by Vuelidate',
    );

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');

    expect(touched).toBe(true);
  });

  it('supports validateOn="input" for instant validation without blur', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
        validateOn: 'input',
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.setValue('immediate-invalid');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(true);
    expect(wrapper.find('.text-xs.tracking-wider').text()).toBe(
      'Please enter a valid email address',
    );
  });

  it('exposes validate() to programmatically trigger validation, invoke $touch, and respect external invalid', async (): Promise<void> => {
    let touched: boolean = false;
    const vuelidateField: ISDVuelidateField & { $touch: () => void } = {
      $error: true,
      $errors: [{ $message: 'External error' }],
      $touch: (): void => {
        touched = true;
      },
    };

    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'valid@duck.com',
        validator: vuelidateField,
      },
    });

    const isValid: boolean = (wrapper.vm as unknown as { validate: () => boolean }).validate();
    expect(touched).toBe(true);
    expect(isValid).toBe(false);

    // Also test with external invalid override
    const externalWrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'valid@duck.com',
        invalid: true,
      },
    });

    const isExternalValid: boolean = (externalWrapper.vm as unknown as { validate: () => boolean }).validate();
    expect(isExternalValid).toBe(false);
  });

  it('manages aria-describedby without pointing to non-existent errorId and combines with consumer describedBy', async (): Promise<void> => {
    // 1. Without error message, aria-describedby should not point to non-existent errorId
    const noMsgWrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
        id: 'email-field',
        describedBy: 'help-text',
      },
    });

    const inputNoMsg: ReturnType<VueWrapper['find']> = noMsgWrapper.find('input');
    expect(inputNoMsg.attributes('aria-describedby')).toBe('help-text');

    // 2. With error message visible on blur, errorId is prepended to describedBy
    const withMsgWrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'bad-email',
        id: 'email-field',
        describedBy: 'help-text',
        errorMessage: 'Invalid format',
      },
    });

    await withMsgWrapper.find('input').trigger('blur');

    const inputWithMsg: ReturnType<VueWrapper['find']> = withMsgWrapper.find('input');
    expect(inputWithMsg.attributes('aria-describedby')).toBe('email-field-error help-text');
  });

  it('reactively updates resolvedId and errorId when id prop changes', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'bad-email',
        id: 'first-id',
        errorMessage: 'Invalid email',
      },
    });

    await wrapper.find('input').trigger('blur');

    expect(wrapper.find('input').attributes('id')).toBe('first-id');
    expect(wrapper.find('.text-xs.tracking-wider').attributes('id')).toBe('first-id-error');

    await wrapper.setProps({ id: 'second-id' });

    expect(wrapper.find('input').attributes('id')).toBe('second-id');
    expect(wrapper.find('.text-xs.tracking-wider').attributes('id')).toBe('second-id-error');
  });

  it('disables internal validation when disableValidation is true even after blur', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'not-an-email',
        disableValidation: true,
      },
    });

    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');
    await input.trigger('blur');

    expect(input.attributes('aria-invalid')).toBe('false');
    expect(wrapper.findComponent(SDIcon).exists()).toBe(false);
  });

  it('renders custom slots: prefix, suffix, errorIcon, and errorMessage', async (): Promise<void> => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: 'invalid',
      },
      slots: {
        prefix: '<span data-testid="prefix-icon">📧</span>',
        suffix: '<span data-testid="suffix-btn">Clear</span>',
        errorIcon: '<span data-testid="custom-err-icon">⚠️</span>',
        errorMessage: '<strong data-testid="custom-err-msg">Slot error</strong>',
      },
    });

    await wrapper.find('input').trigger('blur');

    expect(wrapper.find('[data-testid="prefix-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="suffix-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="custom-err-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="custom-err-msg"]').text()).toBe('Slot error');
  });

  it('wires up label, id, and aria attributes properly', (): void => {
    const wrapper: VueWrapper = mount(SDEmailInput, {
      props: {
        modelValue: '',
        label: 'Squadron Email',
        id: 'squad-email-id',
        name: 'squad_email',
        required: true,
        uppercase: true,
      },
    });

    const label: ReturnType<VueWrapper['find']> = wrapper.find('label');
    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');

    expect(label.exists()).toBe(true);
    expect(label.text()).toContain('Squadron Email');
    expect(label.attributes('for')).toBe('squad-email-id');
    expect(input.attributes('id')).toBe('squad-email-id');
    expect(input.attributes('name')).toBe('squad_email');
    expect(input.attributes('required')).toBeDefined();
  });
});
