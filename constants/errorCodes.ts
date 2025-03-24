// /constants/errorCodes.ts

export const ERROR_CODES = {
    LOGIN: {
      INVALID_CREDENTIALS: { code: 'LOGINE01', message: 'Invalid credentials' },
      USER_NOT_FOUND: { code: 'LOGINE02', message: 'User not found' },
    },
    SIGNUP: {
      USER_EXISTS: { code: 'SIGNUPE01', message: 'User already exists' },
    },
    PASSWORD: {
      MISMATCH: { code: 'PWDE01', message: 'Password mismatch' },
      TOO_WEAK: { code: 'PWDE02', message: 'Password too weak' },
    },
    GENERAL: {
      UNAUTHORIZED: { code: 'GENE01', message: 'Unauthorized' },
      VALIDATION: { code: 'GENE02', message: 'Validation failed' },
      SERVER_ERROR: { code: 'GENE03', message: 'Internal server error' },
    },
  } as const;
  
  type ExtractErrorCodes<T> = T extends { [key: string]: infer V }
  ? V
  : never;

export type ErrorCode = ExtractErrorCodes<typeof ERROR_CODES[keyof typeof ERROR_CODES]>;