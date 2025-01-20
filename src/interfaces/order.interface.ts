export interface IOrder {
    order_id?: number;                                  // Auto-generated Primary Key
    user_id: number;                                    // User ID
    user_name: string;                                  // User Name
    school_name: string;                                // School Name (Required)
    school_code: string;                                // 6-digit School Code (Unique)
    product_name: "MSM" | "MSS" | "MSE" | "CARES";      // Product Name (Enum)
    mode: "online" | "offline" | "combine";             // Mode (Enum)
    year: number;                                       // Year (Required)
    start_date: string;                                 // Start Date (Required, Format: YYYY-MM-DD)
    end_date: string;                                   // End Date (Required, Format: YYYY-MM-DD)
    payment_status?: boolean;                           // Payment Status (Default: false)
    status?: boolean;                                   // Status (Default: true)
    is_archive?: boolean;                               // Archive Status (Default: false)
    archive_id?: string;                                // Archive ID
    archive_date?: Date;                                // Archive Date
    order_key: string;                                  // Unique Combination Key
    created_by?: string;                                // Creator's Username
    updated_by?: string;                                // Updater's Username
    created_at?: Date;                                  // Creation Timestamp
    updated_at?: Date;                                  // Update Timestamp
}
