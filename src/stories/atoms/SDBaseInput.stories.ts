import SDBaseInput from '@/components/atoms/SDBaseInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof SDBaseInput> = {
  title: 'Atoms/SDBaseInput',
  component: SDBaseInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      type: { name: 'string' },
      control: 'text',
      description: 'The v-model binding for the input',
    },
    type: {
      type: { name: 'string' },
      control: 'select',
      options: ['number', 'text', 'password', 'email', 'search', 'tel', 'url'],
      description: 'The type of input',
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
    label: {
      type: { name: 'string' },
      control: 'text',
      description: 'The label of the input, for aria-label',
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
      description: 'Whether the input value is invalid'
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: '',
    type: 'text',
    id: 'sd-base-input-default',
    label: 'sd-base-label',
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

export const LightThemeVerification: Story = {
  globals: {
    theme: 'light',
  },
  args: {
    ...Default.args,
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
