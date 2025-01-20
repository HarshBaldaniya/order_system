import jwt from "jsonwebtoken";

export const generateToken = (
    user_id: number,
    role: string
): { token: string; expiryTime: Date } => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined in the .env file.");

    // Expiry settings simplified with role-based mapping
    const expirySettings: Record<string, [number, "s" | "m" | "h" | "d" | "M" | "y"]> = {
        admin: [7, "d"],        // 7 days
        teacher: [3, "h"],      // 3 hours
        student: [2, "h"],      // 2 hours
        school: [5, "d"],       // 5 days
        test: [12, "h"]         // 12 hours
    };

    const [time, unit] = expirySettings[role] || [1, "h"]; // Default to 1 hour if role not matched

    // Generate JWT token with the calculated expiry
    const token = jwt.sign({ user_id, role }, process.env.JWT_SECRET, {
        expiresIn: `${time}${unit}`,
    });

    // Calculate exact expiry time using JavaScript's Date object
    const expiryTime = new Date();
    const timeUnits: Record<string, () => void> = {
        s: () => expiryTime.setSeconds(expiryTime.getSeconds() + time),
        m: () => expiryTime.setMinutes(expiryTime.getMinutes() + time),
        h: () => expiryTime.setHours(expiryTime.getHours() + time),
        d: () => expiryTime.setDate(expiryTime.getDate() + time),
        M: () => expiryTime.setMonth(expiryTime.getMonth() + time),
        y: () => expiryTime.setFullYear(expiryTime.getFullYear() + time)
    };

    // Apply the corresponding time modification
    timeUnits[unit]();

    return { token, expiryTime };
};
