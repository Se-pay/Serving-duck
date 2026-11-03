import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SDLabel from '@/components/atoms/SDLabel.vue';

const meta: Meta<typeof SDLabel> = {
  title: 'Atoms/SDLabel',
  component: SDLabel,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Displayed label',
    },
    for: {
      control: 'text',
      description: 'For input element',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md'],
      description: 'Size of the label',
    },
    required: {
      control: 'boolean',
      description: 'Shows a star next to the label'
    },
    disabled: {
      control: 'boolean',
      description: 'Shows the label as disabled'
    },
    uppercase: {
      control: 'boolean',
      description: 'Toggle label beeing displayed as uppercase'
    },
  },
  args: {
    label: 'Player Callsign',
    size: 'xs',
    required: false,
    disabled: false,
    uppercase: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Player Callsign',
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { SDLabel },
    template: `
      <div class="flex flex-col gap-3">
        <SDLabel size="xs" label="Extra Small Label (Default)" />
        <SDLabel size="sm" label="Small Label" />
        <SDLabel size="md" label="Medium Label" />
      </div>
    `,
  }),
};

export const RequiredAndDisabled: Story = {
  render: () => ({
    components: { SDLabel },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <SDLabel for="demo-server-region" required>Server Region</SDLabel>
          <input
            id="demo-server-region"
            name="region"
            type="text"
            required
            value="EU-Central"
            class="bg-sd-surface text-sd-fg border border-sd-border rounded-sd-md px-3 py-1.5 text-sm"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <SDLabel for="demo-locked-seed" disabled>Map Seed (Locked)</SDLabel>
          <input
            id="demo-locked-seed"
            name="seed"
            type="text"
            disabled
            value="ROYAL-DUCK-42"
            class="bg-sd-elevated text-sd-fg-disabled border border-sd-border-subtle rounded-sd-md px-3 py-1.5 text-sm cursor-not-allowed"
          />
        </div>
      </div>
    `,
  }),
};

export const NormalCase: Story = {
  args: {
    label: 'Enable vertical sync (VSync)',
    size: 'sm',
    uppercase: false,
  },
};

export const LightThemeVerification: Story = {
  globals: {
    theme: 'light',
  },
  render: () => ({
    components: { SDLabel },
    template: `
      <div class="flex flex-col gap-3">
        <SDLabel label="Default Light Label" />
        <SDLabel label="Required Light Label" required />
        <SDLabel label="Disabled Light Label" disabled />
      </div>
    `,
  }),
};
