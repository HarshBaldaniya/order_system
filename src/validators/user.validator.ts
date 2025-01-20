import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ERROR_MESSAGES } from "../constants/apiMessages";
import { AppError } from "../utils/appError";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";

// Defining allowed roles as an enum array
const allowedRoles = ["test", "admin", "school", "student", "teacher"];

const userSchema = Joi.object({
  user_name: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/) // Only letters and digits
    .min(3)
    .max(50)
    .required()
    .label("Username"),
  full_name: Joi.string().min(3).max(100).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().max(50).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...allowedRoles)
    .required(),
  phone_no: Joi.string()
    .pattern(/^[6-9]\d{9}$/)  // Indian phone number validation
    .required(),
  status: Joi.boolean().optional()
});

const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Validating user data");
  const { error } = userSchema.validate(req.body, { abortEarly: false }); // Validate all fields

  if (error) {
    console.log("Validation failed");
    // Map Joi errors to a structured error response
    const validationErrors = error.details.map((err, index) => (index === 0 ? `⚠️ ${err.message}` : err.message)).join(", ⚠️ ");
    next(
      new AppError(
        `${ERROR_MESSAGES.COMMON.VALIDATION_FAILED}: ${validationErrors}`,
        HTTP_STATUS_CODES.BAD_REQUEST
      )
    );
  } else {
    console.log("Validation passed");
    next();
  }
};

export default validateUser;
