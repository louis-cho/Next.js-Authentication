import { BaseError } from './baseError';
import { ERROR_CODES } from '@/constants/errorCodes';

export class ValidationError extends BaseError {
  constructor(
    codeObj = ERROR_CODES.GENERAL.VALIDATION
  ) {
    super(codeObj.message, codeObj.code, 422);
    this.name = 'ValidationError';
  }
}
