import { Types } from "mongoose";
import Hotel from "./entity";
import { IHotelRegistrationInput } from "./interface";
import { utils } from "../utils";

const visibleValues =
  "hotelName _id ownerId email phoneNo totalRooms totalRoomsOccupied address currency totalRoomsInMaintenance amenities";

class HotelService {
  public async registerHotel(input: IHotelRegistrationInput) {
    const newHotel = new Hotel({
      ...input,
    });

    const savedHotel = await newHotel.save();

    return savedHotel;
  }

  public async findHotelsByOwnerId(ownerId: Types.ObjectId) {
    const hotel = await Hotel.find({ ownerId }).select(visibleValues);

    return hotel;
  }

    public async findHotelByOwnerId(ownerId: Types.ObjectId) {
    const hotel = await Hotel.findOne({ ownerId }).select(visibleValues);

    return hotel;
  }

  public async findHotelById(id: Types.ObjectId) {
    const hotel = await Hotel.findById(id).select(visibleValues);

    return hotel;
  }


  public async findHotelIdAndUpdateAmenities(
  amenities: string[],
  hotelId: Types.ObjectId
) {
  // Normalize amenities before saving
  const formattedAmenities = Array.from(
    new Set(
      amenities.map(a => {
        const trimmed = a.trim();
        return utils.toSentenceCase(trimmed);;
      })
    )
  );

  // Update with validation enabled
  const hotel = await Hotel.findOneAndUpdate(
    { _id: hotelId },
    { amenities: formattedAmenities },
    { new: true, runValidators: true }
  );

  return hotel;
}



  //   public async validateOtp(email: string, otp: string) {
  //     const otpValidity = await User.findOne({
  //       email: email,
  //       emailVerificationOtp: otp,
  //     });

  //     return otpValidity;
  //   }

  //   public async verifyEmail(email: string) {
  //     let user = await User.findOne({ email });

  //     if (user) {
  //       user.emailVerified = true;
  //       user.emailVerificationOtp = undefined;
  //       user.emailVerificationOtpExpiration = undefined;
  //       user = await user.save();
  //     }

  //     return user;
  //   }

  //   public async saveOtp(input: IOTP) {
  //     const { otp, email } = input;

  //     const user = await User.findOne({
  //       email: email,
  //     });

  //     user!.emailVerificationOtp = otp;
  //     user!.emailVerificationOtpExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

  //     await user!.save();

  //     return user;
  //   }

  //   public async checkEmailVerificationStatus(email: string) {
  //     const user = await User.findOne({ email, emailVerified: true });
  //     return user;
  //   }
}

export const hotelService = new HotelService();
