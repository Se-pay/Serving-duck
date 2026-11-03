import SDBaseInput from '@/components/atoms/SDBaseInput.vue';
import SDFormField from '@/components/atoms/SDFormField.vue';
import SDLabel from '@/components/atoms/SDLabel.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof SDFormField> = {
  title: 'Atoms/SDFormField',
  component: SDFormField,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Id and for field for the components inside',
    },
    describedBy: {
      control: 'text',
      description: 'Id of the described component',
    },
    required: {
      control: 'boolean',
      description: 'Whether the form field is required',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the form field is readonly',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the form field is disabled',
    },
    invalid: {
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
      return {args};
    },
    template: `
      <SDFormField v-bind="args" id="demo">
        <SDLabel>Server Region</SDLabel>
        <SDBaseInput />
      </SDFormField>
    `
  })
};
