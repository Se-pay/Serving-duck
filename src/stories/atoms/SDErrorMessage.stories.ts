import SDErrorMessage from '@/components/atoms/SDErrorMessage.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof SDErrorMessage> = {
  title: 'Atoms/SDErrorMessage',
  component: SDErrorMessage,
  tags: ['autodocs'],
  argTypes: {
    invalid: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Defines if the error message should be rendered'
    },
    errorMessage: {
      type: { name: 'string' },
      control: 'text',
      description: 'Content of the error message'
    },
    errorId: {
      type: { name: 'string' },
      control: 'text',
      description: 'Id for the div to link to the element that threw the error'
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    invalid: true,
    errorMessage: 'Message',
  },
};

export const Valid: Story = {
  args: {
    invalid: false,
    errorMessage: 'Message',
  }
};

export const LightThemeVerification: Story = {
  globals: {
    theme: 'light',
  },
  render: () => ({
    components: { SDErrorMessage },
    template: `
      <div class="grid grid-cols-2 gap-3 w-[300px]">
        Error: <SDErrorMessage invalid error-message="Message" />
        No Error: <SDErrorMessage :invalid="false" error-message="Message"/>
      </div>
    `,
  }),
};
