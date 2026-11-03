import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SDFormField from '@/components/atoms/SDFormField.vue';

describe('SDFormField', () => {
  it('renders with minimal props', () => {
    const wrapper: VueWrapper = mount(SDFormField, {
      props: {
        id: 'test-field',
        describedBy: 'test-description',
        required: false,
        readonly: false,
        disabled: false,
        invalid: false
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('div').exists()).toBe(true);
  });
});
