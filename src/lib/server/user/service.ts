import { Types } from "mongoose";
import {
  IHotelRegistrationUserInput,
  ISuperAdminRegistraionInput,
} from "../hotel/interface";
import { utils } from "../utils";
import { hashPassCode } from "../utils/auth";
import User from "./entity";
import { UserRole } from "./enum";

class UserService {
  public async createSuperAdmin(input: ISuperAdminRegistraionInput) {
    const { password } = input;

    const otp = utils.generateOtp();

    const hashedPassword = (await hashPassCode(password)) as string;

    const user = new User({
      ...input,
      userRole: UserRole.SuperAdmin,
      password: hashedPassword,
      emailVerificationOtp: otp,
      emailVerificationOtpExpiration: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
    });

    const savedUser = await user.save();

    return { otp, expiryTime: "2 minutes", savedUser };
  }

  public async findUserByIdAndUpdateHotelId(
    userId: Types.ObjectId,
    hotelId: Types.ObjectId
  ) {
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      { hotelId },
      { new: true }
    );

    return user;
  }

  public async findUserByEmail(email: string) {
    const user = await User.findOne({
      email,
    });

    return user;
  }

  //   public async findUserByUserName(userName: string) {
  //     const user = await User.findOne({
  //       userName,
  //     });

  //     return user;
  //   }

  //   public async findUserByReferralIdAndUpdateReferrals(
  //     userName: string,
  //     newReferralId: Types.ObjectId
  //   ) {
  //     const user = await User.findOne({
  //       userName,
  //     });

  //     if (user) {
  //       user.referrals.push(newReferralId);
  //       await user.save();
  //     }

  //     return user;
  //   }

  //   public async findUserByPhoneNumber(phoneNo: string) {
  //     const user = await User.findOne({
  //       phoneNo,
  //     });

  //     return user;
  //   }

  public async findUserById(id: Types.ObjectId) {
    const user = await User.findById(id);

    return user;
  }

  //   public async findUserByIdAndUserType(id: Types.ObjectId, userType: UserType) {
  //     const user = await User.findById({ _id: id, userType });

  //     return user;
  //   }

  //   public async findBuyersByUserNameWithoutPassword(userName: string) {
  //     const users = await User.find({
  //       userName: { $regex: `^${userName}`, $options: "i" }, // case-insensitive "starts with"
  //       userType: UserType.BUYER,
  //     }).select("firstName lastName email phoneNo profileImageUrl userName");

  //     return users;
  //   }

  public async findUserByIdWithoutPassword(id: Types.ObjectId) {
    const user = await User.findById(id).select(
      "-password -emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return user;
  }

  public async findUserByIdAndUpdateLicenseKeyId(
    userId: Types.ObjectId,
    licenseKeyId: Types.ObjectId
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      { licenseKeyId },
      { new: true }
    );

    return user;
  }

  // public async findUserByPassword(password: string) {
  //   const user = await User.findOne({ password });

  //   return user;
  // }

  // public async getTotalUserCount(): Promise<number> {
  //   const totalUsers = await User.countDocuments();
  //   return totalUsers;
  // }
}

export const userService = new UserService();
