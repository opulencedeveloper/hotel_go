import { Types } from "mongoose";
import { ICreateStaffInput, ICreateStaffPasswordUserInput, IEditStaffUserInput } from "./interface";
import Staff from "./entity";
import { hashPassCode } from "../utils/auth";
import { StaffRole } from "./enum";

class StaffService {
  public async createStaff(input: ICreateStaffInput) {
    console.log("-------------->>>>>>", input);


    const staff = new Staff({ ...input });
    await staff.save();

    return staff;
  }

  public async findStaffsByHotelId(hotelId: Types.ObjectId) {
    const staffs = await Staff.find({ hotelId });

    return staffs;
  }

   public async findStaffEmailAndHotelId(email: string, hotelId: Types.ObjectId) {
    const staff = await Staff.findOne({ email, hotelId });

    return staff;
  }

 public async findStaffByIdsAndRole(staffIds: Types.ObjectId[], userRole: StaffRole) {
  // Query all staff that match the given IDs AND have the given role
  const staffs = await Staff.find({
    _id: { $in: staffIds },
    userRole,
  });

  return staffs;
}


  public async findStaffById(id: string) {
    const staff = await Staff.findById(id);

    return staff;
  }

  public async editStaffById(input: IEditStaffUserInput) {
    const { staffId, ...updateData } = input;

    const updatedMenu = await Staff.findOneAndUpdate(
      { _id: staffId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedMenu;
  }

   public async createStaffPassword(input: ICreateStaffPasswordUserInput) {
    const { staffId, password } = input;

     const hashedPassword = (await hashPassCode(password)) as string;

    const updatedMenu = await Staff.findOneAndUpdate(
      { _id: staffId },
      { $set: {dashboardAccessPassword: hashedPassword, hasPassword: true} },
      { new: true, runValidators: true }
    );

    return updatedMenu;
  }
}

export const staffService = new StaffService();
