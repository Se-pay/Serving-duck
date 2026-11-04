import { describe, expect, it } from 'vitest';

import { SD_ICON_NAMES, SD_ICONS, type TSDIconName } from '@/utils/icons';

describe('icons registry', (): void => {
  it('keeps SD_ICON_NAMES synchronized with SD_ICONS keys', (): void => {
    const iconKeys: TSDIconName[] = Object.keys(SD_ICONS) as TSDIconName[];
    expect(SD_ICON_NAMES).toEqual(iconKeys);
    expect(SD_ICON_NAMES.length).toBeGreaterThan(0);
  });

  it('defines at least one non-empty SVG path string for every icon', (): void => {
    for (const name of SD_ICON_NAMES) {
      const paths: readonly string[] = SD_ICONS[name];
      expect(Array.isArray(paths)).toBe(true);
      expect(paths.length).toBeGreaterThan(0);
      for (const pathData of paths) {
        expect(pathData.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

