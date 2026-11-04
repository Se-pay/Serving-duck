import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EMAIL_REGEX,
  type ISDVuelidateField,
  validateEmail,
} from '@/utils/validation';

describe('validation utility', (): void => {
  describe('DEFAULT_EMAIL_REGEX', (): void => {
    it('matches valid email formats', (): void => {
      expect(DEFAULT_EMAIL_REGEX.test('user@domain.com')).toBe(true);
      expect(DEFAULT_EMAIL_REGEX.test('user.name+tag@domain.co.uk')).toBe(true);
      expect(DEFAULT_EMAIL_REGEX.test('duck_01@sub.domain.org')).toBe(true);
    });

    it('rejects invalid email formats', (): void => {
      expect(DEFAULT_EMAIL_REGEX.test('user')).toBe(false);
      expect(DEFAULT_EMAIL_REGEX.test('user@')).toBe(false);
      expect(DEFAULT_EMAIL_REGEX.test('@domain.com')).toBe(false);
      expect(DEFAULT_EMAIL_REGEX.test('user@domain')).toBe(false);
      expect(DEFAULT_EMAIL_REGEX.test('user@domain.')).toBe(false);
      expect(DEFAULT_EMAIL_REGEX.test('user space@domain.com')).toBe(false);
    });
  });

  describe('validateEmail', (): void => {
    it('returns valid for optional empty string, null, or undefined', (): void => {
      expect(validateEmail('')).toEqual({ isValid: true, errorMessage: undefined });
      expect(validateEmail(null)).toEqual({ isValid: true, errorMessage: undefined });
      expect(validateEmail(undefined)).toEqual({ isValid: true, errorMessage: undefined });
      expect(validateEmail('   ')).toEqual({ isValid: true, errorMessage: undefined });
    });

    it('returns invalid with default message when required and empty', (): void => {
      expect(validateEmail('', { required: true })).toEqual({
        isValid: false,
        errorMessage: 'Email is required',
      });
      expect(validateEmail('   ', { required: true })).toEqual({
        isValid: false,
        errorMessage: 'Email is required',
      });
      expect(validateEmail(null, { required: true })).toEqual({
        isValid: false,
        errorMessage: 'Email is required',
      });
    });

    it('uses custom errorMessage when required and empty if provided', (): void => {
      expect(
        validateEmail('', {
          required: true,
          errorMessage: 'Custom required message',
        })
      ).toEqual({
        isValid: false,
        errorMessage: 'Custom required message',
      });
    });

    it('returns valid for valid email address', (): void => {
      expect(validateEmail('quack@royalduck.com')).toEqual({
        isValid: true,
        errorMessage: undefined,
      });
    });

    it('returns invalid with default message for malformed email address', (): void => {
      expect(validateEmail('not-an-email')).toEqual({
        isValid: false,
        errorMessage: 'Please enter a valid email address',
      });
    });

    it('uses custom errorMessage for malformed email if provided', (): void => {
      expect(
        validateEmail('not-an-email', {
          errorMessage: 'Custom invalid format message',
        })
      ).toEqual({
        isValid: false,
        errorMessage: 'Custom invalid format message',
      });
    });

    it('supports custom validator function returning boolean', (): void => {
      const validator = (val: string | undefined | null): boolean =>
        Boolean(val && val.endsWith('@royalduck.com'));

      expect(validateEmail('quack@royalduck.com', { validator })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      expect(validateEmail('quack@other.com', { validator })).toEqual({
        isValid: false,
        errorMessage: 'Please enter a valid email address',
      });

      expect(
        validateEmail('quack@other.com', {
          validator,
          errorMessage: 'Must be @royalduck.com email',
        })
      ).toEqual({
        isValid: false,
        errorMessage: 'Must be @royalduck.com email',
      });

      // Symmetric empty-value handling
      expect(validateEmail('', { validator, required: false })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      expect(validateEmail('', { validator, required: true })).toEqual({
        isValid: false,
        errorMessage: 'Email is required',
      });
    });

    it('supports custom validator function returning string error message', (): void => {
      const validator = (val: string | undefined | null): boolean | string => {
        if (!val || !val.includes('duck')) {
          return 'Value must contain "duck"';
        }
        return true;
      };

      expect(validateEmail('mallard@duck.com', { validator })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      expect(validateEmail('mallard@pond.com', { validator })).toEqual({
        isValid: false,
        errorMessage: 'Value must contain "duck"',
      });
    });

    it('falls through to default validation when validator returns undefined or null', (): void => {
      const passThroughValidator = (): undefined => undefined;

      expect(validateEmail('duck@pond.com', { validator: passThroughValidator })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      expect(validateEmail('invalid', { validator: passThroughValidator })).toEqual({
        isValid: false,
        errorMessage: 'Please enter a valid email address',
      });
    });

    it('supports custom RegExp validator', (): void => {
      const customRegex: RegExp = /^[a-z]+@royalduck\.com$/;

      expect(validateEmail('captain@royalduck.com', { validator: customRegex })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      expect(validateEmail('captain@other.com', { validator: customRegex })).toEqual({
        isValid: false,
        errorMessage: 'Please enter a valid email address',
      });

      expect(validateEmail('', { validator: customRegex, required: false })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      expect(validateEmail('', { validator: customRegex, required: true })).toEqual({
        isValid: false,
        errorMessage: 'Email is required',
      });
    });

    it('supports Vuelidate-like field object validator', (): void => {
      const vuelidateFieldInvalid: ISDVuelidateField = {
        $error: true,
        $errors: [{ $message: 'Vuelidate says invalid email' }],
      };

      expect(validateEmail('test@test.com', { validator: vuelidateFieldInvalid })).toEqual({
        isValid: false,
        errorMessage: 'Vuelidate says invalid email',
      });

      const vuelidateFieldValid: ISDVuelidateField = {
        $error: false,
        $errors: [],
      };

      expect(validateEmail('invalid-string', { validator: vuelidateFieldValid })).toEqual({
        isValid: true,
        errorMessage: undefined,
      });

      const vuelidateWithStringError: ISDVuelidateField = {
        $error: true,
        $errors: ['Plain string error'],
      };

      expect(validateEmail('abc', { validator: vuelidateWithStringError })).toEqual({
        isValid: false,
        errorMessage: 'Plain string error',
      });

      const vuelidateWithRefMessage: ISDVuelidateField = {
        $error: true,
        $errors: [{ $message: { value: 'Ref error message' } }],
      };

      expect(validateEmail('abc', { validator: vuelidateWithRefMessage })).toEqual({
        isValid: false,
        errorMessage: 'Ref error message',
      });
    });
  });
});
