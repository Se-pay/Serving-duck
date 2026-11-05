/**
 * Standard email validation regex according to HTML5 specification with required domain extension.
 */
export const DEFAULT_EMAIL_REGEX: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export type TSDEmailValidatorFn = (
  value: string | undefined | null
) => boolean | string | undefined | null;

export interface ISDVuelidateField {
  $error?: boolean;
  $invalid?: boolean;
  $errors?: Array<{ $message: string | { value: string } } | string>;
  $touch?: () => void;
}

export type TSDEmailValidator =
  | TSDEmailValidatorFn
  | RegExp
  | ISDVuelidateField;

export interface ISDEmailValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface ISDEmailValidationOptions {
  required?: boolean;
  errorMessage?: string;
  validator?: TSDEmailValidator;
}

/**
 * Validates an email value against standard email pattern, required check, or custom validator.
 */
export function validateEmail(
  value: string | undefined | null,
  options: ISDEmailValidationOptions = {}
): ISDEmailValidationResult {
  const required: boolean = options.required ?? false;
  const errorMessage: string | undefined = options.errorMessage;
  const validator: TSDEmailValidator | undefined = options.validator;
  const strValue: string = value === undefined || value === null ? '' : String(value);
  const trimmed: string = strValue.trim();

  // 1. If custom validator is provided
  if (validator) {
    if (typeof validator === 'function') {
      if (!trimmed) {
        if (required) {
          return {
            isValid: false,
            errorMessage: errorMessage ?? 'Email is required',
          };
        }
        return { isValid: true, errorMessage: undefined };
      }

      const result: boolean | string | undefined | null = validator(value);
      if (typeof result === 'string' && result !== '') {
        return { isValid: false, errorMessage: result };
      }
      if (result === false) {
        return {
          isValid: false,
          errorMessage: errorMessage ?? 'Please enter a valid email address',
        };
      }
      if (result === true) {
        return { isValid: true, errorMessage: undefined };
      }
      // If returns null or undefined, fall through to default validation
    } else if (validator instanceof RegExp) {
      if (!trimmed) {
        if (required) {
          return {
            isValid: false,
            errorMessage: errorMessage ?? 'Email is required',
          };
        }
        return { isValid: true, errorMessage: undefined };
      }
      const matches: boolean = validator.test(trimmed);
      return {
        isValid: matches,
        errorMessage: matches
          ? undefined
          : (errorMessage ?? 'Please enter a valid email address'),
      };
    } else if (typeof validator === 'object' && validator !== null) {
      // Vuelidate field object or similar
      const isInvalid: boolean = Boolean(
        validator.$error !== undefined ? validator.$error : validator.$invalid
      );
      let errorMsg: string | undefined = errorMessage;
      if (!errorMsg && validator.$errors && validator.$errors.length > 0) {
        const firstError: { $message: string | { value: string } } | string | undefined =
          validator.$errors[0];
        if (typeof firstError === 'string') {
          errorMsg = firstError;
        } else if (firstError && typeof firstError === 'object' && '$message' in firstError) {
          const msgVal: string | { value: string } = firstError.$message;
          errorMsg = msgVal !== null && typeof msgVal === 'object' && 'value' in msgVal ? msgVal.value : String(msgVal);
        }
      }
      return {
        isValid: !isInvalid,
        errorMessage: isInvalid
          ? (errorMsg ?? 'Please enter a valid email address')
          : undefined,
      };
    }
  }

  // 2. Default validation
  if (!trimmed) {
    if (required) {
      return {
        isValid: false,
        errorMessage: errorMessage ?? 'Email is required',
      };
    }
    return { isValid: true, errorMessage: undefined };
  }

  const isValidFormat: boolean = DEFAULT_EMAIL_REGEX.test(trimmed);
  return {
    isValid: isValidFormat,
    errorMessage: isValidFormat
      ? undefined
      : (errorMessage ?? 'Please enter a valid email address'),
  };
}
