export class AppError extends Error {
    public status_code: number;
    public exposeError: boolean;
  
    constructor(message: string, status_code: number, exposeError: boolean = false) {
      super(message);
      this.status_code = status_code;
      this.exposeError = exposeError; 
      Error.captureStackTrace(this, this.constructor);
    }
  }
  