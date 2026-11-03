import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SDBaseInput from '@/components/atoms/SDBaseInput.vue';


describe('SDBaseInput', (): void => {
  it('renders a base input with defaults', (): void => {
    const wrapper: VueWrapper = mount(SDBaseInput);

    expect(wrapper.element.tagName).toBe('INPUT');
    expect(wrapper.find('input').attributes('type')).toBe('text');
    expect(wrapper.classes()).toContain('text-sd-fg-muted');
  });
});
