export interface IUser {
    user_id?: number;                                           // user id
    user_name: string;                                          // Required and Unique
    full_name: string;                                          // Required
    first_name: string;                                         // Required
    last_name?: string;                                         // Optional
    email: string;                                              // Required and Unique
    password: string;                                           // Required (hashed for storage)
    role: "test" | "admin" | "school" | "student" | "teacher";  // Enum for roles
    phone_no: string;                                           // Required and Unique
    status?: boolean;                                           // Default to true (active)
    created_dt?: Date;                                          // Auto-timestamp
    updated_dt?: Date;                                          // Auto-timestamp
}
