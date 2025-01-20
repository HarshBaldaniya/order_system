import UserRepository from "../repositories/user.repository";
import TokenRepository from "../repositories/token.repository";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenHelper";
import { IUser } from "../interfaces/user.interface";
import { IToken } from "../interfaces/token.interface";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/apiMessages";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";

export default class UserService {
    private userRepository: UserRepository;
    private tokenRepository: TokenRepository;

    constructor({ userRepository, tokenRepository }: { userRepository: UserRepository, tokenRepository: TokenRepository }) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    async registerUser(user: IUser): Promise<void> {
        const existingUser = await this.userRepository.findUserByEmailAndUserName(user.user_name, user.email);
        if (existingUser) {
            throw new AppError(ERROR_MESSAGES.USER.EXISTS, HTTP_STATUS_CODES.CONFLICT);
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        await this.userRepository.createUser({ ...user, password: hashedPassword, status: true });
    }

    async loginUser(email: string, password: string, deviceName: string, ipAddress: string) {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        if (!user.status) throw new AppError(ERROR_MESSAGES.USER.ACCOUNT_DISABLED, HTTP_STATUS_CODES.UNAUTHORIZED);

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new AppError(ERROR_MESSAGES.USER.INVALID_CREDENTIALS, HTTP_STATUS_CODES.UNAUTHORIZED);

        await this.tokenRepository.invalidatePreviousTokens(user.user_id as number);
        const { token, expiryTime } = generateToken(user.user_id as number, user.role);

        const tokenData: IToken = {
            user_id: user.user_id as number,
            jwt_token: token,
            expiry_time: expiryTime,
            device_name: deviceName,
            ip_address: ipAddress,
            status: true
        };

        await this.tokenRepository.createToken(tokenData);
        return { token, expiryTime };
    }
}
