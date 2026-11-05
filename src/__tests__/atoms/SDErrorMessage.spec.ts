import SDErrorMessage from '@/components/atoms/SDErrorMessage.vue';
import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('SDErrorMessage', (): void => {
  it('renders an error message', (): void =>  {
    const wrapper: VueWrapper = mount(SDErrorMessage, {
      props: {
        invalid: true,
        errorMessage: 'This is an error message',
        errorId: 'test-id'
      }
    });

    expect(wrapper.get('div').attributes('id')).toBe('test-id');
    expect(wrapper.text()).toBe('This is an error message');
  });

  it('renders an error message from the slot (with slot-first)', (): void => {
    const wrapper: VueWrapper = mount(SDErrorMessage, {
      props: {
        invalid: true,
        errorMessage: 'Overwritten',
      },
      slots: {
        default: 'This is an error message'
      }
    });

    expect(wrapper.text()).toBe('This is an error message');
  });
});
