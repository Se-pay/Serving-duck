import SDEmailInput from '@/components/molecules/inputs/SDEmailInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof SDEmailInput> = {
  title: 'Molecules/Inputs/SDEmailInput',
  component: SDEmailInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      type: { name: 'string' },
      control: 'text',
      description: 'The v-model binding for the input',
    },
    label: {
      type: { name: 'string' },
      control: 'text',
      description: 'Displayed label',
    },
    id: {
      type: { name: 'string' },
      control: 'text',
      description: 'The id of the input',
    },
    name: {
      type: { name: 'string' },
      control: 'text',
      description: 'The name of the input',
    },
    describedBy: {
      type: { name: 'string' },
      control: 'text',
      description: 'Ids of the elements that describe the input',
    },
    disabled: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the input is required',
    },
    readonly: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    invalid: {
      type: { name: 'boolean' },
      control: 'boolean',
      description:
        'Whether the input value is invalid, this is a reactive value that can be listened to with v-model:invalid="<name>" or overwritten by external validators',
    },
    errorMessage: {
      type: { name: 'string' },
      control: 'text',
      description: 'Custom or external error message',
    },
    size: {
      type: { name: 'string' },
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input',
    },
    status: {
      type: { name: 'string' },
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral', 'primary', 'accent'],
      description: 'Status of the input',
    },
    disableValidation: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Disables built-in email validation',
    },
    validateOn: {
      type: { name: 'string' },
      control: 'select',
      options: ['blur', 'input'],
      description: 'When to trigger validation ("blur" or "input")',
    },
    uppercase: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether to show the label in upper or lowercase',
    },
    containerClass: {
      type: { name: 'string'},
      control: 'text',
      description: 'CSS classes to apply to the container'
    },
    validator: {
      type: { name: 'function'},
      control: false,
      description: 'Custom validator function'
    }
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    modelValue: '',
  },
};

export const ValidEmail: Story = {
  args: {
    label: 'Valid Email',
    modelValue: 'captain@royalduck.com',
  },
};

export const InvalidEmail: Story = {
  args: {
    label: 'Invalid Email',
    modelValue: 'captain-invalid',
    validateOn: 'input',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Email',
    modelValue: '',
    required: true,
    validateOn: 'input',
  },
};

export const CustomValidator: Story = {
  args: {
    label: 'Corporate Email (@royalduck.com)',
    modelValue: 'pilot@otherdomain.com',
    validateOn: 'input',
    validator: (val: string | undefined | null): boolean | string => {
      if (!val?.endsWith('@royalduck.com')) {
        return 'Only @royalduck.com domain is permitted';
      }
      return true;
    },
  },
};

export const ExternalVuelidateOverrideValid: Story = {
  name: 'Vuelidate Override (Pending/Not Dirty)',
  args: {
    label: 'Vuelidate Controlled (Valid)',
    modelValue: 'user-in-the-middle-of-typing',
    invalid: false,
  },
};

export const ExternalVuelidateOverrideError: Story = {
  name: 'Vuelidate Override (Touched/Error)',
  args: {
    label: 'Vuelidate Controlled (Error)',
    modelValue: 'taken@royalduck.com',
    invalid: true,
    errorMessage: 'This email is already registered in the Royal Duck squadron',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Email',
    modelValue: 'locked@royalduck.com',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Email',
    size: 'sm',
    modelValue: 'small@royalduck.com',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Email',
    size: 'md',
    modelValue: 'medium@royalduck.com',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Email',
    size: 'lg',
    modelValue: 'large@royalduck.com',
  },
};
