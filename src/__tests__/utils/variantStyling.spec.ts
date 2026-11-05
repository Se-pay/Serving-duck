import { describe, expect, it } from 'vitest';

import type { TSDSize, TSDStatus, TSDWeight } from '@/types/common';
import { getSizeClasses, getStatusClasses, getWeightClasses } from '@/utils/variantStyling';

describe('variantStyling utilities', (): void => {
  describe('getStatusClasses', (): void => {
    const statuses: TSDStatus[] = [
      'success',
      'warning',
      'danger',
      'info',
      'neutral',
      'primary',
      'accent',
    ];

    it('returns semantic text classes for every status', (): void => {
      const expectedText: Record<TSDStatus, string> = {
        success: 'text-sd-status-success',
        warning: 'text-sd-status-warning',
        danger: 'text-sd-status-danger',
        info: 'text-sd-status-info',
        neutral: 'text-sd-status-neutral',
        primary: 'text-sd-primary',
        accent: 'text-sd-accent',
      };

      for (const status of statuses) {
        expect(getStatusClasses(status, 'text')).toBe(expectedText[status]);
      }
    });

    it('returns background classes for every status with hover and focus', (): void =>  {
      for (const status of statuses) {
        expect(getStatusClasses(status, 'bg', {hover: true, focus: false})).toBe(status !== 'primary' && status !== 'accent' ? `bg-sd-status-${status} hover:bg-sd-status-${status}-hover` : `bg-sd-${status} hover:bg-sd-${status}-hover`);
        expect(getStatusClasses(status, 'bg', {hover: false, focus: true})).toBe(status !== 'primary' && status !== 'accent' ? `bg-sd-status-${status} focus:bg-sd-status-${status}-focus` : `bg-sd-${status} focus:bg-sd-${status}-focus`);
        expect(getStatusClasses(status, 'bg', {hover: true, focus: true})).toBe(status !== 'primary' && status !== 'accent' ? `bg-sd-status-${status} hover:bg-sd-status-${status}-hover focus:bg-sd-status-${status}-focus` : `bg-sd-${status} hover:bg-sd-${status}-hover focus:bg-sd-${status}-focus`);
      }
    });

    it('returns prefixed border classes for every status with hover and focus', (): void => {
      for (const status of statuses) {
        const borderClasses: string = getStatusClasses(status, 'border');
        expect(borderClasses.startsWith('border ')).toBe(true);
        expect(borderClasses).toContain(
          status === 'primary' || status === 'accent'
            ? `border-sd-${status}`
            : `border-sd-status-${status}`,
        );

        const hoverClasses: string = getStatusClasses(status, 'border', {hover: true});
        expect(hoverClasses).toContain('hover:ring-[1.5px]');
        expect(hoverClasses).toContain(
          status === 'primary' || status === 'accent'
            ? `hover:border-sd-${status}-hover`
            : `hover:border-sd-status-${status}-hover`,
        );

        const focusClasses: string = getStatusClasses(status, 'border', {focus: true});
        expect(focusClasses).toContain('focus-within:outline-2 focus-within:-outline-offset-1');
      }

      // Neutral focus intentionally uses primary focus ring & border tokens
      expect(getStatusClasses('neutral', 'border', {focus: true})).toContain('focus-visible:outline-sd-primary-focus');
      expect(getStatusClasses('neutral', 'border', {focus: true})).toContain('focus-within:border-sd-primary-focus');
      expect(getStatusClasses('danger', 'border', {focus: true})).toContain('focus-within:outline-sd-status-danger-focus');
    });

    it('returns an empty string for an unsupported runtime variant', (): void => {
      const invalidVariant: 'bg' = 'unknown' as unknown as 'bg';
      expect(getStatusClasses('neutral', invalidVariant)).toBe('');
    });
  });

  describe('getWeightClasses', (): void => {
    it('maps all TSDWeight values to Tailwind font-weight utilities', (): void => {
      const expectedWeights: Record<TSDWeight, string> = {
        normal: 'font-normal',
        semibold: 'font-semibold',
        bold: 'font-bold',
        bolder: 'font-extrabold',
      };

      const weights: TSDWeight[] = Object.keys(expectedWeights) as TSDWeight[];
      for (const weight of weights) {
        expect(getWeightClasses(weight)).toBe(expectedWeights[weight]);
      }
    });

    it('falls back to an empty string for an unrecognized runtime weight', (): void => {
      const invalidWeight: TSDWeight = 'light' as unknown as TSDWeight;
      expect(getWeightClasses(invalidWeight)).toBe('');
    });
  });

  describe('getSizeClasses', (): void => {
    it('maps all TSDSize values for both text and padding variants', (): void => {
      const expectedText: Record<TSDSize, string> = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      };

      const expectedPadding: Record<TSDSize, string> = {
        xs: 'py-0.5 px-1.5',
        sm: 'py-1 px-2',
        md: 'py-1.5 px-3',
        lg: 'py-2 px-4',
        xl: 'py-3 px-6',
      };

      const sizes: TSDSize[] = Object.keys(expectedText) as TSDSize[];
      for (const size of sizes) {
        expect(getSizeClasses(size, 'text')).toBe(expectedText[size]);
        expect(getSizeClasses(size, 'p')).toBe(expectedPadding[size]);
      }
    });

    it('returns an empty string for an unsupported runtime size variant', (): void => {
      const invalidVariant: 'text' = 'margin' as unknown as 'text';
      expect(getSizeClasses('md', invalidVariant)).toBe('');
    });
  });
});

