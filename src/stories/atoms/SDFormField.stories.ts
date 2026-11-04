import SDBaseInput from '@/components/atoms/SDBaseInput.vue';
import SDFormField from '@/components/atoms/SDFormField.vue';
import SDLabel from '@/components/atoms/SDLabel.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, type Ref } from 'vue';

const meta: Meta<typeof SDFormField> = {
  title: 'Atoms/SDFormField',
  component: SDFormField,
  tags: ['autodocs'],
  argTypes: {
    id: {
      type: { name: 'string' },
      control: 'text',
      description: 'Id and for field for the components inside',
    },
    name: {
      type: { name: 'string' },
      control: 'text',
      description: 'The name of the input',
    },
    label: {
      type: { name: 'string' },
      control: 'text',
      description: 'Displayed label',
    },
    describedBy: {
      type: { name: 'string' },
      control: 'text',
      description: 'Id of the described component',
    },
    required: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the form field is required',
    },
    readonly: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the form field is readonly',
    },
    disabled: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the form field is disabled',
    },
    invalid: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Whether the form field is invalid',
    }
  }
};

export default meta;

export type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: (args: unknown) => ({
    components: {SDFormField, SDLabel, SDBaseInput},
    setup: (): unknown => {
      const value: Ref<string> = ref('');

      return {args, value};
    },
    template: `
      <SDFormField v-bind="args" id="demo">
        <SDLabel>Server Region</SDLabel>
        <SDBaseInput v-model="value" />
      </SDFormField>
    `
  })
};
