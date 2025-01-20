import dotenv from "dotenv";
dotenv.config();
import { container } from "./config/container";
import { startServer } from "./config/server";
import { logger } from "./utils/logger";

(async () => {
    try {
        // Validate environment variables
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        if (!process.env.PORT) {
            logger.warn("PORT is not defined. Defaulting to 5000.");
        }

        // Start server with DI container
        await startServer(container);
    } catch (error) {
        logger.error("❌ Failed to initialize application:", error);

        // Exit process with a failure code
        process.exit(1);
    }
})();