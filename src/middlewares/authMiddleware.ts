import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/apiMessages";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import UserRepository from "../repositories/user.repository";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequest.interface";

const userRepository = new UserRepository();

export const verifyToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_MISSING, HTTP_STATUS_CODES.UNAUTHORIZED));
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as JwtPayload;

        const { user_id, role } = decoded;

        const user = await userRepository.findUserById(user_id);
        if (!user) {
            return next(new AppError("User not found.", HTTP_STATUS_CODES.NOT_FOUND));
        }

        req.user = {
            user_id,
            role,
            user_name: user.user_name,
        };

        next();
    } catch (error) {
        const err = error as jwt.VerifyErrors;

        if (err.name === "TokenExpiredError") {
            return next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED, HTTP_STATUS_CODES.UNAUTHORIZED));
        }
        return next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_INVALID, HTTP_STATUS_CODES.UNAUTHORIZED));
    }
};

export const restrictToRoles = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        const role = req.user?.role ?? "admin";
        const defaultRoles = ["admin"];

        const rolesToCheck = allowedRoles?.length ? allowedRoles : defaultRoles;
        
        if (!rolesToCheck.includes(role)) {
            return next(new AppError(ERROR_MESSAGES.AUTH.FORBIDDEN_ROLE, HTTP_STATUS_CODES.FORBIDDEN));
        }
        next();
    };
};

export const defaultRole = (handler: any, allowedRoles?: string[]) => {
    return [verifyToken, restrictToRoles(allowedRoles!), handler];
};
