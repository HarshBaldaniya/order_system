import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/apiMessages";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import { successResponse } from "../middlewares/responseMiddleware";

export default class UserController {
    private userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {user_name, full_name, first_name, email, password, role, phone_no } = req.body;

            if (!user_name || !full_name || !first_name || !email || !password || !role || !phone_no) {
                throw new AppError(ERROR_MESSAGES.USER.VALIDATION_FAILED, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            await this.userService.registerUser(req.body);
            successResponse(res, SUCCESS_MESSAGES.USER.REGISTERED, null, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            next(error);
        }
    }

    loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const deviceName = req.headers["user-agent"] || "Unknown Device";
            const ipAddress = req.ip || "Unknown IP";

            if (!email || !password) {
                throw new AppError(ERROR_MESSAGES.USER.VALIDATION_FAILED, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { token, expiryTime } = await this.userService.loginUser(email, password, deviceName, ipAddress);
            successResponse(res, SUCCESS_MESSAGES.USER.LOGIN_SUCCESS, { token, expiryTime });
        } catch (error) {
            next(error);
        }
    }
}
