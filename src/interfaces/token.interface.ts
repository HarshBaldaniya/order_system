export interface IToken {
  token_id?: number;
  user_id: number;
  jwt_token: string;
  expiry_time: Date;
  device_name?: string;
  ip_address?: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
