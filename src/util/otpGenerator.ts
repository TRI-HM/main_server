import RedisClient from "./redisClient";
import fs from "fs";
import path from "path";

const publicDir = path.join(__dirname, '../../public');

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

async function saveOTPZaloWithJsonText(phone: string, otp: string, ttlSeconds: number) {
    try {
        let otpDir = path.join(publicDir, `otp`);
        if (!fs.existsSync(otpDir)) {
            fs.mkdirSync(otpDir, { recursive: true });
        }
        let jsonText = {
            phone: phone,
            otp: otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + ttlSeconds * 1000),
        }
        // save to json file
        fs.writeFileSync(path.join(otpDir, `${phone}.json`), JSON.stringify(jsonText, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving OTP to Redis:', error);
        throw error;
    }
}

async function loadOTPZaloWithJsonText(phone: string): Promise<string | null> {
    try {
        let otpFile = path.join(publicDir, `otp/${phone}.json`);
        if (!fs.existsSync(otpFile)) {
            return null;
        }
        let jsonText = JSON.parse(fs.readFileSync(otpFile, 'utf8'));
        if (jsonText.expiresAt < new Date()) {
            fs.unlinkSync(otpFile);
            return null;
        }
        return jsonText.otp;
    }
    catch (error) {
        console.error('Error loading OTP from Redis:', error);
        return null;
    }
}

async function deleteOTPZaloWithJsonText(phone: string): Promise<boolean> {
    try {
        let otpFile = path.join(publicDir, `otp/${phone}.json`);
        if (fs.existsSync(otpFile)) {
            fs.unlinkSync(otpFile);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting OTP from Redis:', error);
        return false;
    }
}

async function saveOTP(key: string, otp: string, ttlSeconds: number) {
    try {
        // await ensureRedisConnected();
        // Lưu mã OTP, hết hạn sau ttlSeconds giây (5 phút = 300 giây)
        // await RedisClient.setEx(`otp:${key}`, ttlSeconds, otp);
        await saveOTPZaloWithJsonText(key, otp, ttlSeconds);
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
        // await ensureRedisConnected();
        // const storedOtp = await RedisClient.get(`otp:${key}`);
        const storedOtp = await loadOTPZaloWithJsonText(key);
        if (!storedOtp) {
            return false;
        }
        // So sánh OTP
        if (storedOtp === otp) {
            // Xóa OTP sau khi verify thành công
            // await RedisClient.del(`otp:${key}`);
            let deleted = await deleteOTPZaloWithJsonText(key);
            if (!deleted) {
                return false;
            }
            return true;
        } else {
            return false;
        }
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