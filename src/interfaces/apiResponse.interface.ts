export interface ApiResponse {
    success: boolean;
    status_code: number;
    message: string;
    data?: ApiResponseData;
    error?: any;
}

export type ApiResponseData = Record<string, any> | Array<Record<string, any>> | null;