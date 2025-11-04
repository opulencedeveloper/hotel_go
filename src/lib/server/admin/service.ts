import { Types } from "mongoose";

import { utils } from "../utils";
import { hashPassCode } from "../utils/auth";
import User from "./entity";
import { AdminRole } from "./enum";
import { ICreateAdmin } from "./interface";
import Admin from "./entity";
import Hotel from "../hotel/entity";

class AdminService {
  public async createSuperAdmin(input: ICreateAdmin) {
    const { password } = input;

    const otp = utils.generateOtp();

    const hashedPassword = (await hashPassCode(password)) as string;

    const user = new Admin({
      ...input,
      adminRole: AdminRole.SuperAdmin,
      password: hashedPassword,
    });

   await user.save();

    return;
  }

  public async findAdminByEmail(email: string) {
    const user = await Admin.findOne({
      email,
    });

    return user;
  }

   public async fetchHotels() {
    const hotels = await Hotel.find();

    return hotels;
  }

  public async fetchUsers() {
    const users = await User.find();

    return users;
  }
}

export const adminService = new AdminService();
