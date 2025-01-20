import { Router } from "express";
import { AwilixContainer } from "awilix";
import OrderController from "../controllers/order.controller";
import { defaultRole } from "../middlewares/authMiddleware";
import { validateCreateOrder, validateUpdateOrder } from "../validators/order.validator";

const orderRoutes = (container: AwilixContainer): Router => {
    const router = Router();
    const orderController = container.resolve("orderController") as OrderController;
    
    router.post("/create", validateCreateOrder, ...defaultRole(orderController.createOrder, ["school", "test"]));
    router.patch("/update", validateUpdateOrder, ...defaultRole(orderController.updateOrder, ["test"]));
    router.get("/list", ...defaultRole(orderController.listOrders, ["school", "test"]));
    router.patch("/archive-order", ...defaultRole(orderController.archiveOrder, ["test"]));
    router.delete("/remove-order", ...defaultRole(orderController.removeOrder, ["test"]));

    return router;
  };

export default orderRoutes;
