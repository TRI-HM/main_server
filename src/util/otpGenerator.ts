import RedisClient from "./redisClient";

// Đảm bảo Redis client được connect
const ensureRedisConnected = async () => {
    try {
        if (!RedisClient.isOpen && !RedisClient.isReady) {
            await RedisClient.connect();
        }
    } catch (error: any) {
        // Nếu đã connect rồi thì bỏ qua lỗi
        if (error && error.message && !error.message.includes('already connected') && !error.message.includes('Socket already opened')) {
            throw error;
        }
    }
};

async function saveOTP(key: string, otp: string, ttlSeconds: number) {
    try {
        await ensureRedisConnected();
        // Lưu mã OTP, hết hạn sau ttlSeconds giây (5 phút = 300 giây)
        await RedisClient.setEx(`otp:${key}`, ttlSeconds, otp);
    } catch (error) {
        console.error('Error saving OTP to Redis:', error);
        throw error;
    }
}

const generateOTP = async (key: string): Promise<string> => {
    try {
        // Tạo mã OTP 6 chữ số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // TTL = 300 giây (5 phút)
        const ttlSeconds = 300;
        await saveOTP(key, otp, ttlSeconds);
        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
}

const IsOtpValid = async (key: string, otp: string): Promise<boolean> => {
    try {
        await ensureRedisConnected();
        const storedOtp = await RedisClient.get(`otp:${key}`);
        if (!storedOtp) {
            return false;
        }
        // So sánh OTP
        if (storedOtp === otp) {
            // Xóa OTP sau khi verify thành công
            await RedisClient.del(`otp:${key}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error validating OTP:', error);
        return false;
    }
}
const OTPGenerator = {
    generateOTP,
    IsOtpValid
}
export default OTPGenerator;