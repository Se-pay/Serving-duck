import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SDIcon from '@/components/atoms/SDIcon.vue';
import type { TSDSize, TSDStatus } from '@/types/common';
import { SD_ICON_NAMES, SD_ICONS, type TSDIconName } from '@/utils/icons';

describe('SDIcon', (): void => {
  it('renders a decorative inline-flex span with md and neutral defaults', (): void => {
    const wrapper: VueWrapper = mount(SDIcon, {
      props: {
        name: 'check',
      },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.attributes('aria-hidden')).toBe('true');
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect(wrapper.classes()).toContain('inline-flex');
    expect(wrapper.classes()).toContain('shrink-0');
    expect(wrapper.classes()).toContain('text-base');
    expect(wrapper.classes()).toContain('text-sd-status-neutral');

    const svg: ReturnType<VueWrapper['find']> = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.findAll('path')).toHaveLength(SD_ICONS.check.length);
  });

  it('renders every built-in icon from SD_ICON_NAMES', (): void => {
    for (const iconName of SD_ICON_NAMES) {
      const wrapper: VueWrapper = mount(SDIcon, {
        props: {
          name: iconName,
        },
      });

      const paths: ReturnType<VueWrapper['findAll']> = wrapper.findAll('svg > path');
      expect(paths).toHaveLength(SD_ICONS[iconName].length);
    }
  });

  it('prefers default slot content over the built-in name prop', (): void => {
    const wrapper: VueWrapper = mount(SDIcon, {
      props: {
        name: 'check',
      },
      slots: {
        default: '<svg data-testid="custom-svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>',
      },
    });

    expect(wrapper.find('[data-testid="custom-svg"]').exists()).toBe(true);
    expect(wrapper.findAll('path')).toHaveLength(0);
  });

  it('renders an empty wrapper cleanly when name is omitted or unrecognized at runtime', (): void => {
    const emptyWrapper: VueWrapper = mount(SDIcon);
    expect(emptyWrapper.find('svg').exists()).toBe(false);
    expect(emptyWrapper.attributes('aria-hidden')).toBe('true');

    const unknownName: TSDIconName = 'non-existent-icon' as unknown as TSDIconName;
    const unknownWrapper: VueWrapper = mount(SDIcon, {
      props: {
        name: unknownName,
      },
    });
    expect(unknownWrapper.find('svg').exists()).toBe(false);
  });

  it('exposes role="img" and trimmed aria-label when a non-empty label prop is set', (): void => {
    const informativeWrapper: VueWrapper = mount(SDIcon, {
      props: {
        name: 'x-circle',
        status: 'danger',
        label: '  Connection failed  ',
      },
    });

    expect(informativeWrapper.attributes('role')).toBe('img');
    expect(informativeWrapper.attributes('aria-label')).toBe('Connection failed');
    expect(informativeWrapper.attributes('aria-hidden')).toBeUndefined();

    const blankLabelWrapper: VueWrapper = mount(SDIcon, {
      props: {
        name: 'info',
        label: '   ',
      },
    });

    expect(blankLabelWrapper.attributes('role')).toBeUndefined();
    expect(blankLabelWrapper.attributes('aria-label')).toBeUndefined();
    expect(blankLabelWrapper.attributes('aria-hidden')).toBe('true');
  });

  it('applies all size and status variant classes accurately', (): void => {
    const sizeMap: Record<TSDSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const sizes: TSDSize[] = Object.keys(sizeMap) as TSDSize[];
    for (const size of sizes) {
      const wrapper: VueWrapper = mount(SDIcon, {
        props: {
          name: 'info',
          size,
        },
      });
      expect(wrapper.classes()).toContain(sizeMap[size]);
    }

    const statusMap: Record<TSDStatus, string> = {
      success: 'text-sd-status-success',
      warning: 'text-sd-status-warning',
      danger: 'text-sd-status-danger',
      info: 'text-sd-status-info',
      neutral: 'text-sd-status-neutral',
      primary: 'text-sd-primary',
      accent: 'text-sd-accent',
    };

    const statuses: TSDStatus[] = Object.keys(statusMap) as TSDStatus[];
    for (const status of statuses) {
      const wrapper: VueWrapper = mount(SDIcon, {
        props: {
          name: 'info',
          status,
        },
      });
      expect(wrapper.classes()).toContain(statusMap[status]);
    }
  });
});
