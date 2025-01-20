export const ERROR_MESSAGES = {
    USER: {
        EXISTS: "A user with this email and user name already exists.",
        NOT_FOUND: "User not found.",
        INVALID_CREDENTIALS: "Invalid credentials.",
        ACCOUNT_DISABLED: "Your account is disabled. Please contact support.",
        VALIDATION_FAILED: "Validation failed. Please provide all required fields.",
    },
    COMMON: {
        VALIDATION_FAILED: "Validation failed.",
        INVALID_INPUT: "Invalid input provided.",
        MISSING_FIELDS: "Some required fields are missing.",
        UNEXPECTED_ERROR: "An unexpected error occurred.",
    },
    AUTH: {
        TOKEN_MISSING: "Authorization token is missing.",
        TOKEN_INVALID: "Invalid authorization token.",
        TOKEN_EXPIRED: "Authorization token has expired.",
        FORBIDDEN_ROLE: "You do not have permission to perform this action.",
        USER_NOT_FOUND: "User not found."
    },
    PAGINATION: {
        INVALID_PARAMETERS: "Invalid pagination parameters.",
        NO_DATA_ON_PAGE: "Page has no data.",
        TOTAL_PAGES_AVAILABLE: "Total pages available:",
    },
    ORDER: {
        DUPLICATE_ORDER_KEY: "An order with this order key already exists.",
        DUPLICATE_SCHOOL_CODE: "An order with this school code already exists.",
        VALIDATION_FAILED: "Missing or invalid fields for order creation / updation.",
        INVALID_USER: "Invalid user_id or user_name. Please provide valid user details.",
        NOT_FOUND: "Order not found.",
        ID_REQUIRED: "Order ID is required.",
        NO_FIELDS_TO_UPDATE: "No fields provided to update.",
        INACTIVE: "The specified order is inactive and cannot be updated.",
        ARCHIVED: "The specified order is archived and cannot be updated.",
        ORDER_ID_REQUIRED: "Order ID is required.",
        ALREADY_ARCHIVED: "The order is already archived.",
        ALREADY_UNARCHIVED: "The order is already unarchived.",
    },
};

export const SUCCESS_MESSAGES = {
    USER: {
        REGISTERED: "User registered successfully.",
        LOGIN_SUCCESS: "Login successful.",
    },
    COMMON: {
        OPERATION_SUCCESS: "Operation completed successfully.",
    },
    ORDER: {
        CREATED: "Order created successfully.",
        UPDATED: "Order updated successfully.",
        LIST_RETRIEVED: "Order list retrieved successfully.",
        REMOVED: "Order removed successfully.",
        ARCHIVED: "Order archived successfully.",
        UNARCHIVED: "Order unarchived successfully.",
    },
};
