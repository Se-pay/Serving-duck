import SDBaseInput from '@/components/atoms/SDBaseInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof SDBaseInput> = {
  title: 'Atoms/SDBaseInput',
  component: SDBaseInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      type: { name: 'string' },
      description: 'The v-model binding for the input',
    },
    size: {
      type: { name: 'string' },
      description: 'The size of the input',
      control: 'select',
      options: ['xs', 'sm', 'md'],
    },
    type: {
      type: { name: 'string' },
      description: 'The type of input',
      control: {
        type: 'radio',
      },
    },
    status: {
      type: { name: 'string' },
      description: 'Status of the input',
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral', 'primary', 'accent'],
    },
    id: {
      type: { name: 'string' },
      description: 'The id of the input',
    },
    placeholder: {
      type: { name: 'string' },
      description: 'The placeholder of the input',
    },
    disabled: {
      type: { name: 'boolean' },
      description: 'Whether the input is disabled',
    },
    required: {
      type: { name: 'boolean' },
      description: 'Whether the input is required',
    },
    readonly: {
      type: { name: 'boolean' },
      description: 'Whether the input is readonly',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: '',
    size: 'md',
    type: 'text',
    id: 'sd-base-input-default',
    placeholder: 'Enter text',
    disabled: false,
    required: false,
    readonly: false,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
  },
};

export const Readonly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
  },
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
  },
};

export const WithPlaceholder: Story = {
  args: {
    ...Default.args,
    placeholder: 'Placeholder',
  },
};

export const LightThemeVerification: Story = {
  globals: {
    theme: 'light',
  },
  render: (args: unknown) => ({
    components: { SDBaseInput },
    setup(): { args: unknown } {
      return { args };
    },
    template: `
      <div class="flex flex-col gap-3">
        <SDBaseInput v-bind="args" modelValue="Test" />
        <SDBaseInput v-bind="args" modelValue="Test" required />
        <SDBaseInput v-bind="args" modelValue="Test" disabled />
      </div>
    `,
  }),
};
