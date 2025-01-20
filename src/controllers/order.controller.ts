import { Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { successResponse } from "../middlewares/responseMiddleware";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/apiMessages";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import { AppError } from "../utils/appError";
import { generateOrderKey } from "../utils/generateOrderKey";
import { IOrder } from "../interfaces/order.interface";
import { Pagination } from "../interfaces/pagination,interface";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequest.interface";

export default class OrderController {
    private orderService: OrderService;

    constructor({ orderService }: { orderService: OrderService }) {
        this.orderService = orderService;
    }

    listOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { order_id, user_id, school_code, page = 1, limit = 10 } = req.query;

            const page_number = parseInt(page as string, 10);
            const page_size = parseInt(limit as string, 10);

            if (isNaN(page_number) || isNaN(page_size) || page_number < 1 || page_size < 1) {
                throw new AppError(ERROR_MESSAGES.PAGINATION.INVALID_PARAMETERS, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const filters = {
                order_id: order_id ? parseInt(order_id as string, 10) : undefined,
                user_id: user_id ? parseInt(user_id as string, 10) : undefined,
                school_code: school_code as string | undefined,
            };

            const { data, total } = await this.orderService.listOrders(filters, page_number, page_size);

            const total_pages = Math.ceil(total / page_size);

            if (page_number > total_pages && total > 0) {
                throw new AppError(
                    `${ERROR_MESSAGES.PAGINATION.NO_DATA_ON_PAGE} ${page_number}. ${ERROR_MESSAGES.PAGINATION.TOTAL_PAGES_AVAILABLE} ${total_pages}.`,
                    HTTP_STATUS_CODES.NOT_FOUND
                );
            }

            const pagination: Pagination = {
                current_page: page_number,
                current_page_records: data.length,
                page_size: page_size,
                total_pages: total_pages,
                total_records: total,
            };

            successResponse(res, SUCCESS_MESSAGES.ORDER.LIST_RETRIEVED, { orders: data, pagination });
        } catch (error) {
            next(error);
        }
    };

    createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {
                user_id, user_name, school_name, school_code, product_name, mode,
                year, start_date, end_date, payment_status, is_archive
            } = req.body;

            const created_by = req.user?.user_name;

            // Validate required fields
            if (!user_id || !user_name || !school_name || !school_code || !product_name || !mode ||
                !year || !start_date || !end_date) {
                throw new AppError(ERROR_MESSAGES.ORDER.VALIDATION_FAILED, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            // Generate the unique order_key
            const order_key = generateOrderKey(school_code, year, product_name, mode);

            const order = {
                user_id,
                user_name,
                school_name,
                school_code,
                product_name,
                mode,
                year,
                start_date,
                end_date,
                payment_status,
                is_archive,
                created_by,
                updated_by: created_by,
                order_key,
            };

            await this.orderService.createOrder(order);
            successResponse(res, SUCCESS_MESSAGES.ORDER.CREATED, null, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            next(error);
        }
    };

    updateOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {
                order_id, school_name, school_code, product_name, mode, year,
                start_date, end_date, payment_status, is_archive
            } = req.body;

            const updated_by = req.user?.user_name;

            // Validate required fields
            if (!order_id) {
                throw new AppError(ERROR_MESSAGES.ORDER.VALIDATION_FAILED, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const updatedOrder: Partial<IOrder> = {
                order_id,
                school_name,
                school_code,
                product_name,
                mode,
                year,
                start_date,
                end_date,
                payment_status,
                is_archive,
                updated_by,
            };

            await this.orderService.updateOrder(updatedOrder);
            successResponse(res, SUCCESS_MESSAGES.ORDER.UPDATED, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            next(error);
        }
    };

    archiveOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { order_id, is_archive } = req.query;

            if (!order_id) {
                throw new AppError(ERROR_MESSAGES.ORDER.ORDER_ID_REQUIRED, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const archivedBy = req.user?.user_name;
            if (!archivedBy) {
                throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            const archiveFlag = is_archive === "0" ? false : true;

            await this.orderService.archiveOrder(Number(order_id), archivedBy, archiveFlag);
            const responseMessage = archiveFlag
                ? SUCCESS_MESSAGES.ORDER.ARCHIVED
                : SUCCESS_MESSAGES.ORDER.UNARCHIVED;

            successResponse(res, responseMessage, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            next(error);
        }
    };

    removeOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { order_id } = req.query;

            if (!order_id) {
                throw new AppError(ERROR_MESSAGES.ORDER.ORDER_ID_REQUIRED, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            await this.orderService.removeOrder(Number(order_id));
            successResponse(res, SUCCESS_MESSAGES.ORDER.REMOVED, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            next(error);
        }
    };
}
