import { Router } from "express";
import { AwilixContainer } from "awilix";
import OrderController from "../controllers/order.controller";
import { defaultRole } from "../middlewares/authMiddleware";
import { validateCreateOrder, validateUpdateOrder } from "../validators/order.validator";

const orderRoutes = (container: AwilixContainer): Router => {
    const router = Router();
    const orderController = container.resolve("orderController") as OrderController;
    
    // http://localhost:3000/api/v1/orders
    router.post("", validateCreateOrder, ...defaultRole(orderController.createOrder, ["school", "test"]));

    // http://localhost:3000/api/v1/orders
    router.patch("", validateUpdateOrder, ...defaultRole(orderController.updateOrder, ["test"]));

    // http://localhost:3000/api/v1/orders
    router.get("", ...defaultRole(orderController.listOrders, ["school", "test"]));

    // http://localhost:3000/api/v1/orders/archive
    router.patch("/archive", ...defaultRole(orderController.archiveOrder, ["test"]));

    // http://localhost:3000/api/v1/orders
    router.delete("", ...defaultRole(orderController.removeOrder, ["test"]));

    return router;
  };

export default orderRoutes;
