import RedisClient from "./redisClient";
async function saveOTP(key: string, otp: string, expiredAt: Date) {
    await RedisClient.connect();
    // Lưu mã OTP, hết hạn sau 300 giây (5 phút)
    await RedisClient.setEx(`otp:${key}`, expiredAt.getTime(), otp);
    await RedisClient.disconnect();
}


const generateOTP = async (key: string) : Promise<string> => {
    let isOtpValid = false;
    let otp = '';
    let expiredAt = new Date();
    while (!isOtpValid) {
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        expiredAt = new Date(Date.now() + 300000);
        await saveOTP(key, otp, expiredAt);
    }
    await saveOTP(key, otp, expiredAt);
    return otp;
}

const IsOtpValid = async (key: string, otp: string) : Promise<boolean> => {
    let otpExists = await RedisClient.get(`otp:${key}`);
    if (!otpExists) {
        return false;
    }
    return true;
}
const OTPGenerator = {
    generateOTP,
    IsOtpValid
}
export default OTPGenerator;