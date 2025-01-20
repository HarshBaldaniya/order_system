import { Response } from "express";
import { ApiResponse } from "../interfaces/apiResponse.interface";

export const successResponse = (
    res: Response,
    message: string,
    data: any = null,
    statusCode: number = 200
): Response<ApiResponse> => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        ...(data && { data }),
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number,
    error: any = null
): Response<ApiResponse> => {
    const response: ApiResponse = {
        success: false,
        statusCode,
        message,
    };

    // Include error only if it exists
    if (error) {
        response.error = error;
    }

    return res.status(statusCode).json(response);
};
