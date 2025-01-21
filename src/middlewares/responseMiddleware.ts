import { Response } from "express";
import { ApiResponse } from "../interfaces/apiResponse.interface";

export const successResponse = (
    res: Response,
    message: string,
    data: any = null,
    status_code: number = 200
): Response<ApiResponse> => {
    return res.status(status_code).json({
        success: true,
        status_code,
        message,
        ...(data && { data }),
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    status_code: number,
    error: any = null
): Response<ApiResponse> => {
    const response: ApiResponse = {
        success: false,
        status_code,
        message,
    };

    // Include error only if it exists
    if (error) {
        response.error = error;
    }

    return res.status(status_code).json(response);
};
