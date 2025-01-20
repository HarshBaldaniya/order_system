import { Router } from "express";
import { AwilixContainer } from "awilix";
import OrderController from "../controllers/order.controller";
import { defaultRole, restrictToRoles, verifyToken } from "../middlewares/authMiddleware";
import { validateCreateOrder, validateUpdateOrder } from "../validators/order.validator";

const orderRoutes = (container: AwilixContainer): Router => {
    const router = Router();
    const orderController = container.resolve("orderController") as OrderController;


    router.post("/create", verifyToken, restrictToRoles(["test", "admin"]), validateCreateOrder, orderController.createOrder);
    router.patch("/update", verifyToken, restrictToRoles(["test", "admin"]), validateUpdateOrder, orderController.updateOrder);
    router.get("/list", ...defaultRole(orderController.listOrders, ["school", "test"]));
    router.patch("/archive-order", verifyToken, restrictToRoles(["test", "admin"]), orderController.archiveOrder);
    router.delete("/remove-order", verifyToken, restrictToRoles(["test", "admin"]), orderController.removeOrder);

  
    return router;
  };

export default orderRoutes;
