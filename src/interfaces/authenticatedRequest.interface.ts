import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: { user_id: number; role: string; user_name: string };
}