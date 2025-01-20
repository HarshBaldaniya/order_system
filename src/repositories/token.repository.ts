import pool from "../config/db";
import { IToken } from "../interfaces/token.interface";

export default class TokenRepository {
    async createToken(tokenData: IToken): Promise<void> {
        const { user_id, jwt_token, expiry_time, device_name, ip_address } = tokenData;
        const query = `
            INSERT INTO user_tokens (user_id, jwt_token, expiry_time, device_name, ip_address, status)
            VALUES ($1, $2, $3, $4, $5, TRUE)
        `;
        await pool.query(query, [user_id, jwt_token, expiry_time, device_name, ip_address]);
    }

    async invalidatePreviousTokens(user_id: number): Promise<void> {
        const query = `UPDATE user_tokens SET status = FALSE WHERE user_id = $1`;
        await pool.query(query, [user_id]);
    }
}
