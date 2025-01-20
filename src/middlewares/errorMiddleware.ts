import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import { errorResponse } from "./responseMiddleware";
import { logger } from "../utils/logger";

export const errorMiddleware = (
    error: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof AppError) {
        const errorDetails = error.exposeError ? error.message : null;

        // Handle known application errors
        errorResponse(res, error.message, error.statusCode, errorDetails);
    } else {
        // Log unexpected errors for debugging purposes
        logger.error("Unexpected Error:", error);

        // Handle unexpected errors with a generic message
        errorResponse(
            res,
            "An unexpected error occurred.",
            HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            process.env.NODE_ENV === "development" ? error.message : null // Include error details only in development
        );
    }

    return; 
};
