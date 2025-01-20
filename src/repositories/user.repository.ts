import pool from "../config/db";
import { IUser } from "../interfaces/user.interface";

export default class UserRepository {
    async createUser(user: IUser): Promise<void> {
        const { user_name, full_name, first_name, last_name, email, password, role, phone_no, status } = user;
        const query = `
            INSERT INTO users (user_name, full_name, first_name, last_name, email, password, role, phone_no, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        await pool.query(query, [user_name, full_name, first_name, last_name, email, password, role, phone_no, status ?? true]);
    }

    private async findUserByCondition(condition: string, params: any[]): Promise<IUser | null> {
        const query = `SELECT * FROM users WHERE ${condition}`;
        const result = await pool.query(query, params);
        return result.rows.length ? result.rows[0] : null;
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await this.findUserByCondition("email = $1", [email]);
    }

    async findUserByEmailAndUserName(user_name: string, email: string): Promise<IUser | null> {
        return await this.findUserByCondition("user_name = $1 AND email = $2", [user_name, email]);
    }

    async findUserById(user_id: number): Promise<IUser | null> {
        return await this.findUserByCondition("user_id = $1", [user_id]);
    }

    async findUserByIdAndName(user_id: number, user_name: string): Promise<IUser | null> {
        return await this.findUserByCondition("user_id = $1 AND user_name = $2", [user_id, user_name]);
    }
}
