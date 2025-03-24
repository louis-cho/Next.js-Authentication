export class BaseError extends Error {
    statusCode: number;
    code: string;
  
    constructor(message: string, code: string, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
      this.name = 'BaseError';
    }
  }
  

  
