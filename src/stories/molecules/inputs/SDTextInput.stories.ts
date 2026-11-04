import SDTextInput from '@/components/molecules/inputs/SDTextInput.vue';
import type { Meta, StoryContext, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';

const meta: Meta<typeof SDTextInput> = {
  title: 'Molecules/Inputs/SDTextInput',
  component: SDTextInput,
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
      description: 'Whether the input value is invalid'
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
  }
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Test: Story = {
  args: {
    label: 'Default',
    id: 'test-story-id'
  },
  play: async ({ canvas, userEvent }: StoryContext) => {
    await userEvent.hover(canvas.getByLabelText('Default'));
    await expect(canvas.getByLabelText('Default').parentElement?.classList).toContain('hover:ring-[1.5px]');

    await userEvent.click(canvas.getByLabelText('Default'));
    await expect(canvas.getByLabelText('Default').parentElement?.classList).toContain('focus-within:outline-2');
  }
};

export const Small: Story = {
  args: {
    label: 'Small',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Large',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required',
    required: true,
  },
};

export const Readonly: Story = {
  args: {
    label: 'Readonly',
    readonly: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid',
    invalid: true,
    errorMessage: 'Invalid message'
  },
};

export const Success: Story = {
  args: {
    label: 'Success',
    status: 'success',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    status: 'warning',
  },
};

export const Danger: Story = {
  args: {
    label: 'Danger',
    status: 'danger',
  },
};

export const Info: Story = {
  args: {
    label: 'Info',
    status: 'info',
  },
};

export const Neutral: Story = {
  args: {
    label: 'Neutral',
    status: 'neutral',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary',
    status: 'primary',
  },
};

export const Accent: Story = {
  args: {
    label: 'Accent',
    status: 'accent',
  },
};

export const Lowercase: Story = {
  args: {
    label: 'Lowercase',
    uppercase: false,
  },
};
