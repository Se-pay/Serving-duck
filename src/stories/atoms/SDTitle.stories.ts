import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SDTitle from '@/components/atoms/SDTitle.vue';

const meta: Meta<typeof SDTitle> = {
  title: 'Atoms/SDTitle',
  component: SDTitle,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Displayed text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the title',
    },
    fontWeight: {
      control: 'select',
      options: ['normal', 'semibold', 'bold', 'bolder'],
      description: 'Font weight of the title',
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Tag that is used for the title',
    },
    status: {
      control: 'select',
      options: [undefined, 'success', 'warning', 'danger', 'info', 'neutral', 'primary', 'accent'],
      description: 'Status of the title (coloring)',
    },
    uppercase: {
      control: 'boolean',
      description: 'Toggle uppercase'
    },
  },
  args: {
    title: 'System Overview',
    size: 'md',
    fontWeight: 'semibold',
    as: 'h1',
    status: undefined,
    uppercase: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'System Overview',
  },
};

export const Small: Story = {
  args: {
    title: 'Telemetry Feed',
    size: 'sm',
    as: 'h3',
  },
};

export const Medium: Story = {
  args: {
    title: 'Lobby Configuration',
    size: 'md',
    as: 'h2',
  },
};

export const Large: Story = {
  args: {
    title: 'Royal Duck Command',
    size: 'lg',
    as: 'h1',
  },
};

export const FontWeights: Story = {
  render: () => ({
    components: { SDTitle },
    template: `
      <div class="flex flex-col gap-3">
        <SDTitle as="h2" font-weight="normal" title="Normal Weight Heading" />
        <SDTitle as="h2" font-weight="semibold" title="Semibold Weight Heading" />
        <SDTitle as="h2" font-weight="bold" title="Bold Weight Heading" />
        <SDTitle as="h2" font-weight="bolder" title="Bolder Weight Heading" />
      </div>
    `,
  }),
};

export const WithStatusIndicators: Story = {
  render: () => ({
    components: { SDTitle },
    template: `
      <div class="flex flex-col gap-3">
        <SDTitle as="h2" status="success" title="Server Online" />
        <SDTitle as="h2" status="warning" title="High Latency" />
        <SDTitle as="h2" status="danger" title="Connection Lost" />
        <SDTitle as="h2" status="info" title="Patch Available" />
        <SDTitle as="h2" status="primary" title="Primary Channel" />
        <SDTitle as="h2" status="accent" title="Royal Ranked Match" />
        <SDTitle as="h2" status="neutral" title="Idle Lobby" />
      </div>
    `,
  }),
};

export const NormalCaseSlotContent: Story = {
  render: () => ({
    components: { SDTitle },
    template: `
      <SDTitle as="h2" size="lg" :uppercase="false" status="accent">
        Welcome back, Commander
      </SDTitle>
    `,
  }),
};

export const LightThemeVerification: Story = {
  globals: {
    theme: 'light',
  },
  render: () => ({
    components: { SDTitle },
    template: `
      <div class="flex flex-col gap-3">
        <SDTitle as="h1" size="lg" status="primary" title="Light Mode Dashboard" />
        <SDTitle as="h2" size="md" status="success" title="All Services Healthy" />
        <SDTitle as="h3" size="sm" status="warning" title="Maintenance Window" />
      </div>
    `,
  }),
};
