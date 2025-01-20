import { Router } from "express";
import { AwilixContainer } from "awilix";
import userRoutes from "./user.routes";
import orderRoutes from "./order.routes";

const router = Router();

// Main entry for all microservices, no versioning as requested
export default (container: AwilixContainer): Router => {
  router.use("/v1/users", userRoutes(container));
  router.use("/v1/orders", orderRoutes(container));
  return router;
};
