import UserLogin from "../../Model/userPanel/userLogin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genrarateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const handleLogin = async (req, res) => {
  console.log(req.body);
  const { phoneNumber } = req.body;
 

  // const otp = genrarateOTP().toString(); For Dynamic otp
  const otp = "2709";
  // const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration;

  const user = await UserLogin.findOne({ phoneNumber });

  console.log("otp for user", phoneNumber, "is", otp);
  if (user) {
    user.otp = otp;
    // user.otpExpiration = otpExpiration;
    await user.save();
  } else {
    await UserLogin.create({ phoneNumber, otp });
  }
  return res.status(200).json({
    success: true,
    message: "OTP Sent Successfully",
    phoneNumber,
    otp,
  });
};

export const handleVerifyOTP = async (req, res) => {
  try { 
    const { phoneNumber, otp } = req.body;
    const user = await UserLogin.findOne({ phoneNumber });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const payload = {
      id: user._id,
      phoneNumber,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    user.token = token;
    user.otp = null;
    // user.otpExpiration = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP Verified",
      token,
    });
  } catch (error) {
    return res.status(401).json({
      success:false,
      message:"Invalid OTP"
    });
  }
};
