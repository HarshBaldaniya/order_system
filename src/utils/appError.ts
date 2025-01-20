export class AppError extends Error {
    public statusCode: number;
    public exposeError: boolean;
  
    constructor(message: string, statusCode: number, exposeError: boolean = false) {
      super(message);
      this.statusCode = statusCode;
      this.exposeError = exposeError; 
      Error.captureStackTrace(this, this.constructor);
    }
  }
  