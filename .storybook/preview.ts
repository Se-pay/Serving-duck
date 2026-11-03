import '../src/styles/style.css';

import type { Decorator, Preview } from '@storybook/vue3-vite';

type TStoryTheme = 'dark' | 'light' | 'side-by-side';
type TDecoratorParams = Parameters<Decorator>;
type TDecoratorReturn = ReturnType<Decorator>;

const withServingDuckTheme: Decorator = (
  _story: TDecoratorParams[0],
  context: TDecoratorParams[1],
): TDecoratorReturn => {
  const rawTheme: unknown = context.globals['theme'];
  const selectedTheme: TStoryTheme =
    rawTheme === 'light' || rawTheme === 'side-by-side' ? rawTheme : 'dark';

  if (selectedTheme === 'side-by-side') {
    return {
      setup(): Record<string, never> {
        return {};
      },
      template: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-theme="dark" class="bg-sd-canvas text-sd-fg p-6 rounded-sd-md border border-sd-border">
            <story />
          </div>
          <div data-theme="light" class="bg-sd-canvas text-sd-fg p-6 rounded-sd-md border border-sd-border">
            <story />
          </div>
        </div>
      `,
    };
  }

  return {
    setup(): { selectedTheme: TStoryTheme } {
      return { selectedTheme };
    },
    template: `
      <div :data-theme="selectedTheme" class="bg-sd-canvas text-sd-fg p-6 rounded-sd-md border border-sd-border">
        <story />
      </div>
    `,
  };
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Serving Duck color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark (Default)' },
          { value: 'light', title: 'Light' },
          { value: 'side-by-side', title: 'Side by Side' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  decorators: [withServingDuckTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
  },
};

export default preview;
