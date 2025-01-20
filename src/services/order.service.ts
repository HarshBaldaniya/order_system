import OrderRepository from "../repositories/order.repository";
import { IOrder } from "../interfaces/order.interface";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/apiMessages";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";
import UserRepository from "../repositories/user.repository";
import { generateOrderKey } from "../utils/generateOrderKey";

export default class OrderService {
    private orderRepository: OrderRepository;
    private userRepository: UserRepository;

    constructor({ orderRepository, userRepository }: { orderRepository: OrderRepository, userRepository: UserRepository }) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    async listOrders(filters: Partial<IOrder>, page: number, limit: number): Promise<{ data: IOrder[]; total: number }> {
        const { data, total } = await this.orderRepository.listOrders(filters, page, limit);
        return { data, total };
    }

    async createOrder(order: IOrder): Promise<void> {

        const userExists = await this.userRepository.findUserByIdAndName(order.user_id, order.user_name);
        if (!userExists) {
            throw new AppError(ERROR_MESSAGES.ORDER.INVALID_USER, HTTP_STATUS_CODES.BAD_REQUEST);
        }

        // Check if order_key already exists
        const existingOrder = await this.orderRepository.findOrderByOrderKey(order.order_key);
        if (existingOrder) {
            if (existingOrder.order_key === order.order_key) {
                throw new AppError(ERROR_MESSAGES.ORDER.DUPLICATE_ORDER_KEY, HTTP_STATUS_CODES.CONFLICT);
            }
        }

        // Proceed to create the order
        await this.orderRepository.createOrder(order);
    }

    async updateOrder(order: Partial<IOrder>): Promise<void> {
        if (!order.order_id) {
            throw new AppError(ERROR_MESSAGES.ORDER.VALIDATION_FAILED, HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const existingOrder = await this.orderRepository.findOrderById(order.order_id);

        if (!existingOrder || existingOrder.status == false || existingOrder?.is_archive == true) {
            const errorMessage = !existingOrder
                ? ERROR_MESSAGES.ORDER.NOT_FOUND
                : existingOrder.status === false
                    ? ERROR_MESSAGES.ORDER.INACTIVE
                    : ERROR_MESSAGES.ORDER.ARCHIVED;
            throw new AppError(errorMessage, HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const updatedOrderKey = generateOrderKey(
            order.school_code || existingOrder.school_code,
            order.year || existingOrder.year,
            order.product_name || existingOrder.product_name,
            order.mode || existingOrder.mode
        );


        // Check if the new order_key already exists in another order
        const existingOrderKey = await this.orderRepository.findOrderByOrderKey(updatedOrderKey);
        if (existingOrderKey && existingOrderKey.order_id !== order.order_id) {
            throw new AppError(ERROR_MESSAGES.ORDER.DUPLICATE_ORDER_KEY, HTTP_STATUS_CODES.CONFLICT);
        }

        order.order_key = updatedOrderKey;

        await this.orderRepository.updateOrder(order);
    }

    async archiveOrder(order_id: number, archivedBy: string, isArchive: boolean): Promise<void> {
        const existingOrder = await this.orderRepository.findOrderById(order_id);

        if (!existingOrder) {
            throw new AppError(ERROR_MESSAGES.ORDER.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }

        if (isArchive) {
            if (existingOrder.is_archive || existingOrder.archive_date) {
                throw new AppError(
                    ERROR_MESSAGES.ORDER.ALREADY_ARCHIVED,
                    HTTP_STATUS_CODES.CONFLICT
                );
            }
            // Insert into order_archive table only when archiving
            const archiveData = {
                user_id: existingOrder.user_id,
                order_id: existingOrder.order_id!,
                school_code: existingOrder.school_code,
                order_key: existingOrder.order_key,
                created_by: archivedBy,
            };
            const archiveId = await this.orderRepository.insertOrderArchive(archiveData);

            // Update the order_details table
            await this.orderRepository.updateOrder({
                order_id,
                is_archive: true,
                status: false, // Inactive after archiving
                archive_id: archiveId,
                updated_by: archivedBy,
            });
        } else {
            if (!existingOrder.is_archive || !existingOrder.archive_date) {
                throw new AppError(
                    ERROR_MESSAGES.ORDER.ALREADY_UNARCHIVED,
                    HTTP_STATUS_CODES.CONFLICT
                );
            }
            // Unarchive the order
            await this.orderRepository.updateOrder({
                order_id,
                is_archive: false,
                updated_by: archivedBy,
            });
        }
    }

    async removeOrder(order_id: number): Promise<void> {
        const existingOrder = await this.orderRepository.findOrderById(order_id);

        if (!existingOrder) {
            throw new AppError(ERROR_MESSAGES.ORDER.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }

        await this.orderRepository.deleteOrder(order_id);
    }
}
