import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SDIcon from '@/components/atoms/SDIcon.vue';
import { SD_ICON_NAMES } from '@/utils/icons';

const meta: Meta<typeof SDIcon> = {
  title: 'Atoms/SDIcon',
  component: SDIcon,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      type: { name: 'string' },
      control: 'select',
      options: [undefined, ...SD_ICON_NAMES],
      description: 'Built-in core icon name (falls back to default slot when omitted or overridden)',
    },
    size: {
      type: { name: 'string' },
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the icon',
    },
    status: {
      type: { name: 'string' },
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral', 'primary', 'accent'],
      description: 'Semantic status color of the icon',
    },
    label: {
      type: { name: 'string' },
      control: 'text',
      description: 'Accessible label for standalone informative icons (renders role="img" + aria-label; decorative aria-hidden="true" when omitted)',
    },
  },
  args: {
    icon: 'check-circle',
    size: 'md',
    status: 'neutral',
    label: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: 'check-circle',
    status: 'success',
  },
};

export const IconGallery: Story = {
  render: (): Record<string, unknown> => ({
    components: { SDIcon },
    setup(): { iconNames: typeof SD_ICON_NAMES } {
      return { iconNames: SD_ICON_NAMES };
    },
    template: `
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        <div
          v-for="iconName in iconNames"
          :key="iconName"
          class="flex flex-col items-center justify-center gap-2 p-3 rounded-sd-md bg-sd-surface border border-sd-border-subtle text-sd-fg"
        >
          <SDIcon :icon="iconName" size="lg" status="primary" />
          <span class="font-sd-mono text-xs text-sd-fg-muted">{{ iconName }}</span>
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (): Record<string, unknown> => ({
    components: { SDIcon },
    template: `
      <div class="flex items-center gap-4">
        <SDIcon icon="settings" size="xs" status="primary" />
        <SDIcon icon="settings" size="sm" status="primary" />
        <SDIcon icon="settings" size="md" status="primary" />
        <SDIcon icon="settings" size="lg" status="primary" />
        <SDIcon icon="settings" size="xl" status="primary" />
      </div>
    `,
  }),
};

export const Statuses: Story = {
  render: (): Record<string, unknown> => ({
    components: { SDIcon },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <SDIcon icon="check-circle" size="lg" status="success" label="Server online" />
        <SDIcon icon="warning" size="lg" status="warning" label="High latency" />
        <SDIcon icon="x-circle" size="lg" status="danger" label="Connection lost" />
        <SDIcon icon="info" size="lg" status="info" label="Patch available" />
        <SDIcon icon="settings" size="lg" status="neutral" label="Idle state" />
        <SDIcon icon="user" size="lg" status="primary" label="Active player" />
        <SDIcon icon="lock" size="lg" status="accent" label="Ranked lobby" />
      </div>
    `,
  }),
};

export const CustomSlotSvg: Story = {
  render: (): Record<string, unknown> => ({
    components: { SDIcon },
    template: `
      <div class="flex items-center gap-3 text-sd-fg">
        <SDIcon size="lg" status="accent" label="Royal Crown">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </SDIcon>
        <span class="font-sd-sans text-sm">Custom slotted SVG inheriting size and Royal Duck accent color</span>
      </div>
    `,
  }),
};

export const LightThemeVerification: Story = {
  globals: {
    theme: 'light',
  },
  render: (): Record<string, unknown> => ({
    components: { SDIcon },
    template: `
      <div class="flex items-center gap-4">
        <SDIcon icon="check-circle" size="lg" status="success" label="Healthy" />
        <SDIcon icon="warning" size="lg" status="warning" label="Degraded" />
        <SDIcon icon="x-circle" size="lg" status="danger" label="Offline" />
        <SDIcon icon="info" size="lg" status="info" label="Notice" />
        <SDIcon icon="search" size="lg" status="neutral" label="Search" />
        <SDIcon icon="user" size="lg" status="primary" label="Player" />
        <SDIcon icon="lock" size="lg" status="accent" label="VIP" />
      </div>
    `,
  }),
};

