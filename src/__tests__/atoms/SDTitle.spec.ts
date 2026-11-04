import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SDTitle, { type TSDTitleTag } from '@/components/atoms/SDTitle.vue';
import type { TSDBasicSize, TSDStatus, TSDWeight } from '@/types/common';

describe('SDTitle', (): void => {
  it('renders an h1 with md, uppercase, and semibold defaults when mounted without props', (): void => {
    const emptyWrapper: VueWrapper = mount(SDTitle);
    expect(emptyWrapper.element.tagName).toBe('H1');
    expect(emptyWrapper.text()).toBe('');

    const wrapper: VueWrapper = mount(SDTitle, {
      props: {
        title: 'Control Panel',
      },
    });

    expect(wrapper.element.tagName).toBe('H1');
    expect(wrapper.text()).toBe('Control Panel');
    expect(wrapper.classes()).toContain('font-sd-display');
    expect(wrapper.classes()).toContain('text-sd-fg-heading');
    expect(wrapper.classes()).toContain('text-base');
    expect(wrapper.classes()).toContain('font-semibold');
    expect(wrapper.classes()).toContain('uppercase');
    expect(wrapper.classes()).toContain('tracking-wider');
    expect(wrapper.find('span[aria-hidden="true"]').exists()).toBe(false);
  });

  it('prefers default slot content over the title prop', (): void => {
    const wrapper: VueWrapper = mount(SDTitle, {
      props: {
        title: 'Fallback Title',
      },
      slots: {
        default: '<strong>Slot Title</strong>',
      },
    });

    expect(wrapper.text()).toBe('Slot Title');
    expect(wrapper.find('strong').exists()).toBe(true);
  });

  it('supports polymorphic heading tags via the as prop', (): void => {
    const tags: TSDTitleTag[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    for (const tag of tags) {
      const wrapper: VueWrapper = mount(SDTitle, {
        props: {
          as: tag,
          title: 'Heading',
        },
      });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    }
  });

  it('applies all TSDBasicSize, TSDWeight, and uppercase=false classes accurately', (): void => {
    const sizeMap: Record<TSDBasicSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
    };

    const sizes: TSDBasicSize[] = Object.keys(sizeMap) as TSDBasicSize[];
    for (const size of sizes) {
      const wrapper: VueWrapper = mount(SDTitle, {
        props: {
          title: 'Sized Heading',
          size,
        },
      });
      expect(wrapper.classes()).toContain(sizeMap[size]);
    }

    const weightMap: Record<TSDWeight, string> = {
      normal: 'font-normal',
      semibold: 'font-semibold',
      bold: 'font-bold',
      bolder: 'font-extrabold',
    };

    const weights: TSDWeight[] = Object.keys(weightMap) as TSDWeight[];
    for (const fontWeight of weights) {
      const wrapper: VueWrapper = mount(SDTitle, {
        props: {
          title: 'Weighted Heading',
          fontWeight,
          uppercase: false,
        },
      });
      expect(wrapper.classes()).toContain(weightMap[fontWeight]);
      expect(wrapper.classes()).not.toContain('uppercase');
      expect(wrapper.classes()).not.toContain('tracking-wider');
    }
  });

  it('renders an aria-hidden semantic status dot when status is provided', (): void => {
    const statusMap: Record<TSDStatus, string> = {
      success: 'bg-sd-status-success',
      warning: 'bg-sd-status-warning',
      danger: 'bg-sd-status-danger',
      info: 'bg-sd-status-info',
      neutral: 'bg-sd-status-neutral',
      primary: 'bg-sd-primary',
      accent: 'bg-sd-accent',
    };

    const statuses: TSDStatus[] = Object.keys(statusMap) as TSDStatus[];

    for (const status of statuses) {
      const wrapper: VueWrapper = mount(SDTitle, {
        props: {
          title: 'Status Heading',
          status,
        },
      });
      const dot: ReturnType<VueWrapper['find']> = wrapper.find('span[aria-hidden="true"]');
      expect(dot.exists()).toBe(true);
      expect(dot.classes()).toContain('rounded-full');
      expect(dot.classes()).toContain(statusMap[status]);
    }
  });
});
