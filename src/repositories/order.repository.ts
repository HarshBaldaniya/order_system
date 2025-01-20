import pool from "../config/db";
import { IOrder } from "../interfaces/order.interface";

export default class OrderRepository {
    async listOrders(
        filters: Partial<IOrder>,
        page: number,
        limit: number
    ): Promise<{ data: IOrder[]; total: number }> {
        const { order_id, user_id, school_code } = filters;

        const offset = (page - 1) * limit;

        let query = `SELECT * FROM order_details WHERE 1=1`;
        const params: (string | number)[] = [];

        if (order_id) {
            query += ` AND order_id = $${params.length + 1}`;
            params.push(order_id);
        }

        if (user_id) {
            query += ` AND user_id = $${params.length + 1}`;
            params.push(user_id);
        }

        if (school_code) {
            query += ` AND school_code = $${params.length + 1}`;
            params.push(school_code);
        }

        const totalQuery = `SELECT COUNT(*) AS total FROM (${query}) AS filtered`;
        const totalResult = await pool.query(totalQuery, params);
        const total = parseInt(totalResult.rows[0].total, 10);

        // Add LIMIT and OFFSET for pagination
        query += ` ORDER BY school_code DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        // Execute the query with pagination
        const result = await pool.query(query, params);

        return { data: result.rows, total };
    }

    async createOrder(order: IOrder): Promise<void> {
        const {
            user_id, user_name, school_name, school_code, product_name, mode, year,
            start_date, end_date, payment_status, status, is_archive, archive_id,
            archive_date, order_key, created_by, updated_by
        } = order;

        const query = `
            INSERT INTO order_details (
                user_id, user_name, school_name, school_code, product_name, mode, year,
                start_date, end_date, payment_status, status, is_archive, archive_id,
                archive_date, order_key, created_by, updated_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `;

        await pool.query(query, [
            user_id, user_name, school_name, school_code, product_name, mode, year,
            start_date, end_date, payment_status ?? false, status ?? true,
            is_archive ?? false, archive_id ?? null, archive_date ?? null, order_key,
            created_by, updated_by ?? null
        ]);
    }

    async updateOrder(order: Partial<IOrder>): Promise<void> {
        const {
            order_id, school_name, school_code, product_name, mode, year,
            start_date, end_date, payment_status, is_archive, status,
            order_key, updated_by, archive_id
        } = order;

        const query = `
            UPDATE order_details
            SET
                school_name = COALESCE($1, school_name),
                school_code = COALESCE($2, school_code),
                product_name = COALESCE($3, product_name),
                mode = COALESCE($4, mode),
                year = COALESCE($5, year),
                start_date = COALESCE($6, start_date),
                end_date = COALESCE($7, end_date),
                payment_status = COALESCE($8, payment_status),
                is_archive = COALESCE($9, is_archive),
                status = COALESCE($10, status),
                order_key = COALESCE($11, order_key),
                archive_id = CASE 
                    WHEN COALESCE($9, is_archive) = true THEN COALESCE($12, archive_id)
                    ELSE NULL
                END,
                archive_date = CASE
                    WHEN COALESCE($9, is_archive) = true THEN NOW()
                    ELSE NULL
                END,
                updated_by = COALESCE($13, updated_by),
                updated_at = NOW()
            WHERE order_id = $14
        `;

        await pool.query(query, [
            school_name, school_code, product_name, mode, year,
            start_date, end_date, payment_status ?? false,
            is_archive ?? false, status ?? true, order_key,
            archive_id, updated_by, order_id
        ]);
    }

    async deleteOrder(order_id: number): Promise<void> {
        const query = `DELETE FROM order_details WHERE order_id = $1`;
        await pool.query(query, [order_id]);
    }

    async insertOrderArchive(archiveData: {
        user_id: number;
        order_id: number;
        school_code: string;
        order_key: string;
        created_by: string;
    }): Promise<string> {
        const query = `
            INSERT INTO order_archive (user_id, order_id, school_code, order_key, created_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING archive_id
        `;
        const result = await pool.query(query, [
            archiveData.user_id,
            archiveData.order_id,
            archiveData.school_code,
            archiveData.order_key,
            archiveData.created_by,
        ]);
        return result.rows[0].archive_id.toString();
    }

    async findOrderByOrderKey(order_key: string): Promise<IOrder | null> {
        const query = `SELECT * FROM order_details 
            WHERE order_key = $1`;
        const result = await pool.query(query, [order_key]);
        return result.rows.length ? result.rows[0] : null;
    }

    async findOrderById(order_id: number): Promise<IOrder | null> {
        const query = `SELECT * FROM order_details WHERE order_id = $1`;
        const result = await pool.query(query, [order_id]);
        return result.rows.length ? result.rows[0] : null;
    }
}
