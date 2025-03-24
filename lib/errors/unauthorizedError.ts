// UnauthorizedError.ts
import { BaseError } from './baseError';
import { ERROR_CODES } from '@/constants/errorCodes';

export class UnauthorizedError extends BaseError {
  constructor(
    codeObj = ERROR_CODES.GENERAL.UNAUTHORIZED // 기본값
  ) {
    super(codeObj.message, codeObj.code, 401);
    this.name = 'UnauthorizedError';
  }
}
