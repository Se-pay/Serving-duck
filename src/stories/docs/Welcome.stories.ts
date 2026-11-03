import type { Meta, StoryObj } from '@storybook/vue3-vite';

import WelcomeShowcase from './WelcomeShowcase.vue';

const meta: Meta<typeof WelcomeShowcase> = {
  title: 'Overview/Welcome',
  component: WelcomeShowcase,
  tags: ['unlisted'],
  parameters: {
    docs: {
      description: {
        component:
          'Welcome to @royal-duck/serving-duck — Atomic Design System for dashboards, SaaS apps, and browser game menus.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: () => ({
    components: { WelcomeShowcase },
    template: '<WelcomeShowcase />',
  }),
};

