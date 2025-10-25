import { Types } from "mongoose";
import HotelService from "./entity";
import { ICreateHotelServiceInput, IEditHotelServiceUserInput } from "./interface";

class HoteServiceService {
  public async createHotelService(input: ICreateHotelServiceInput) {
    const hotelService = new HotelService({ ...input });

    await hotelService.save();

    return hotelService;
  }

  public async findHotelServiceByNameAndHotelId(
    name: string,
    hotelId: Types.ObjectId | string
  ) {
    const hotelObjectId = new Types.ObjectId(hotelId);

    const hotelService = await HotelService.findOne({
      name: { $regex: `^${name}$`, $options: "" },
      hotelId: hotelObjectId,
    }).collation({ locale: "en", strength: 4 }); // case-sensitive

    return hotelService;
  }

  public async findHotelServicesByHotelId(hotelId: Types.ObjectId) {
    const hotelServices = await HotelService.find({hotelId});
  
    return hotelServices;
  }

  public async findHotelServiceById(id: string) {
    const hotelServices = await HotelService.findById(id);
  
    return hotelServices;
  }

   public async findHotelServiceByIdAndName(id: string, name: string) {
    const hotelServices = await HotelService.findOne({_id: id, name});
  
    return hotelServices;
  }

    public async findHotelServiceByHotelServiceIdAndHotellId(hotelServiceId: string, hotelId: Types.ObjectId) {
      const hotelService = await HotelService.findOne({ _id: hotelServiceId, hotelId });
  
      return hotelService;
    }

     public async editHotelServiceByIdAndHotelId(input: IEditHotelServiceUserInput, hotelId: Types.ObjectId) {
        const { hotelServiceId, ...updateData } = input;
    
        const updatedRoom = await HotelService.findOneAndUpdate(
          { _id: hotelServiceId, hotelId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
    
        return updatedRoom;
      }
}

export const hoteServiceService = new HoteServiceService();
