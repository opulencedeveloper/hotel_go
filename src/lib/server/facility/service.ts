import { ICreateFacilityInput, IEditFacilityUserInput } from "./interface";

import Facility from "./entity";
import { Types } from "mongoose";

class FacilityService {
  public async createFacility(input: ICreateFacilityInput) {
    const facility = new Facility({ ...input });
    const createdFacility = await facility.save();

    return createdFacility;
  }

  public async findFacilityByNameAndHotelId(
    facilityName: string,
    hotelId: string
  ) {
    const facility = await Facility.findOne({ facilityName: { $regex: `^${facilityName}$`, $options: "" }, hotelId });

    return facility;
  }

  public async findFacilityByHotelId(hotelId: Types.ObjectId) {
    const facility = await Facility.find({ hotelId });

    return facility;
  }

   public async findFacilityById(id: Types.ObjectId) {
    const facility = await Facility.findById(id);

    return facility;
  }
  
    public async editFacilityByIdAndHotelId(input: IEditFacilityUserInput, hotelId: Types.ObjectId) {
    const { facilityId, ...updateData } = input;

    const updatedFacility = await Facility.findOneAndUpdate(
      { _id: facilityId, hotelId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedFacility;
  }
}

export const facilityService = new FacilityService();
