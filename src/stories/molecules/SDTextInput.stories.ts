import SDTextInput from '@/components/molecules/SDTextInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';


const meta: Meta<typeof SDTextInput> = {
  title: 'Molecules/SDTextInput',
  component: SDTextInput,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default',
    placeholder: 'Default',
  },
};
