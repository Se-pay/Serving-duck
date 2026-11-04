import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ThemeOverridesPlayground from './ThemeOverridesPlayground.vue';

const meta: Meta<typeof ThemeOverridesPlayground> = {
  title: 'Overview/Colors & Overrides',
  component: ThemeOverridesPlayground,
  tags: ['unlisted'],
  parameters: {
    docs: {
      description: {
        component:
          'Interactive demonstration of CSS Custom Property color overrides in @royal-duck/serving-duck.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => ({
    components: { ThemeOverridesPlayground },
    template: '<ThemeOverridesPlayground />',
  }),
};

