import User from "../user/entity";
import { userService } from "../user/service";
import { utils } from "../utils";
import { hashPassCode } from "../utils/auth";
import { IOTP } from "../utils/interface";
import { IForgotPassword } from "./interface";

class AuthService {
  public async validateOtp(email: string, otp: string) {
    console.log(email, otp);
    const otpValidity = await User.findOne({
      email: email,
      emailVerificationOtp: otp,
    });

    return otpValidity;
  }

  public async verifyEmail(email: string) {
    let user = await User.findOne({ email });

    if (user) {
      user.emailVerified = true;
      user.emailVerificationOtp = undefined;
      user.emailVerificationOtpExpiration = undefined;
      user = await user.save();
    }

    return user;
  }

  public async changePasswordWithForgotpasswordRequest(input: IForgotPassword) {
    const { email, password } = input;

    const hashedPassword = (await hashPassCode(password)) as string;

    const user = await User.findOneAndUpdate(
      {
        email,
      },
      { password: hashedPassword },
      { new: true }
    );

    return user;
  }

  public async saveOtp(input: IOTP) {
    const { otp, email } = input;

    const user = await User.findOne({
      email: email,
    });

    user!.emailVerificationOtp = otp;
    user!.emailVerificationOtpExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    await user!.save();

    return user;
  }

  public async checkEmailVerificationStatus(email: string) {
    const user = await User.findOne({ email, emailVerified: true });
    return user;
  }

  // public async changePassword(email: string, password: string) {
  //   const user = await User.findOne({ email });

  //   if (user) {
  //     user.password = password;
  //     await user.save();
  //   }
  //   return user;
  // }
}

export const authService = new AuthService();
