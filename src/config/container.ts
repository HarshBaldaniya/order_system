import { createContainer, asClass } from "awilix";
import UserService from "../services/user.service";
import UserRepository from "../repositories/user.repository";
import TokenRepository from "../repositories/token.repository";
import UserController from "../controllers/user.controller";
import OrderService from "../services/order.service";
import OrderRepository from "../repositories/order.repository";
import OrderController from "../controllers/order.controller";

export const container = createContainer();

container.register({
    userService: asClass(UserService).scoped(),
    orderService: asClass(OrderService).scoped(),

    userRepository: asClass(UserRepository).scoped(),
    tokenRepository: asClass(TokenRepository).scoped(),
    orderRepository: asClass(OrderRepository).scoped(),

    userController: asClass(UserController).scoped(),
    orderController: asClass(OrderController).scoped(),
});
