import crypto from "crypto";

export const generateOrderKey = (
    schoolCode: string,
    year: number,
    productName: string,
    mode: string
): string => {
    const reversedYear = year.toString().split("").reverse().join("");
    const fullOrderKey = `${productName}${reversedYear}${schoolCode}${mode.toUpperCase()}`;

    return fullOrderKey.substring(0, 18);
};