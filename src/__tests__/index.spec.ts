import { describe, expect, it } from 'vitest';
import { type App, createApp, defineComponent } from 'vue';

import { SDLabel, SDTitle, ServingDuck } from '@/index';

describe('ServingDuck entry & Vue plugin', (): void => {
  it('exports named components and registers them globally when installed via app.use()', (): void => {
    expect(SDTitle).toBeDefined();
    expect(SDLabel).toBeDefined();

    const RootComponent: ReturnType<typeof defineComponent> = defineComponent({
      template: '<div></div>',
    });

    const app: App<Element> = createApp(RootComponent);
    app.use(ServingDuck);

    expect(app.component('SDTitle')).toBeDefined();
    expect(app.component('SDLabel')).toBeDefined();
  });
});

