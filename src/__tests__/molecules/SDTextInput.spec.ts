import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SDTextInput from '@/components/molecules/SDTextInput.vue';

describe('SDTextInput', (): void => {
  it('renders a text input', (): void => {
    const wrapper: VueWrapper = mount(SDTextInput);

    expect(wrapper.element.tagName).toBe('DIV');
  });
});
