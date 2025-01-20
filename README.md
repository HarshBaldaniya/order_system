
# Order System

A robust order management system built with **Node.js** and **TypeScript**, designed to handle order creation, tracking, and management efficiently.

---

## 🚀 Features

- **Order Management**: Create, update, archive, and delete orders.
- **User Authentication**: Secure login with JWT-based authentication.
- **Role-Based Access Control (RBAC)**: Protect endpoints based on user roles.
- **Dependency Injection (DI)**: Modular and testable design using Awilix.
- **Centralized Logging**: Logging for errors and activities.
- **Validation**: Request validation using middleware.
- **Environment Configuration**: Flexible `.env` management.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Dependency Injection**: Awilix
- **Logging**: Winston

---

## 📂 Folder Structure

```
order_system/
├── src/
│   ├── config/          # Configuration files for DI container and server
│   ├── controllers/     # Handles request logic
│   ├── middlewares/     # Middleware for authentication and validation
│   ├── repositories/    # Data access layer for interacting with the database
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic and processing
│   ├── utils/           # Utility functions (e.g., logger, token helper)
│   ├── validators/      # Input validation for API requests
│   ├── app.ts           # Application entry point
│   └── index.ts         # Server startup
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation (this file)
```

---

## ✅ Best Practices

- **Code Quality**: TypeScript ensures type safety and reduces runtime errors.
- **Error Handling**: Centralized error handling for easier debugging.
- **Role Management**: RBAC ensures secure and organized access to features.
- **Scalability**: Modular structure supports future growth.

---

# Thank You