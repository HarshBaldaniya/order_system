import { Router } from "express";
import { AwilixContainer } from "awilix";
import UserController from "../controllers/user.controller";
import validateUser from "../validators/user.validator";

const userRoutes = (container: AwilixContainer): Router => {
  const router = Router();
  const userController = container.resolve("userController") as UserController;

  // http://localhost:3000/api/v1/users/register
  router.post("/register", validateUser, userController.registerUser);
  
  // http://localhost:3000/api/v1/users/login
  router.post("/login", userController.loginUser);

  return router;
};

export default userRoutes;
