import { NextApiResponse } from 'next';
import { BaseError } from './baseError';
import { ERROR_CODES } from '@/constants/errorCodes';

export const handleError = (res: NextApiResponse, error: unknown) => {
    if (error instanceof BaseError) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }
  
    console.error('Unexpected Error:', error);
  
    return res.status(500).json({
      code: ERROR_CODES.GENERAL.SERVER_ERROR.code,
      message: ERROR_CODES.GENERAL.SERVER_ERROR.message,
    });
  };