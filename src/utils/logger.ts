class Logger {
    private isProduction: boolean;

    constructor() {
        this.isProduction = process.env.NODE_ENV === "production";
    }

    log(message: string): void {
        if (!this.isProduction) {
            console.log(message); 
        }
    }

    error(message: string, error?: any): void {
        console.error(message);
        if (error) {
            console.error(error); 
        }
    }

    warn(message: string): void {
        if (!this.isProduction) {
            console.warn(message); 
        }
    }
}

export const logger = new Logger();
