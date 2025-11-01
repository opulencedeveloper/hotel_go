import { StaffRole } from "@/utils/enum";
import { RoomStatus } from "../room/enum";
import { roomService } from "../room/service";
import { staffService } from "../staff/service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import {
  ICreateHouseKeepingUserInput,
  IMarkHouseKeepingUserInputAsCancelled,
  IMarkHouseKeepingUserInputAsComplete,
} from "./interface";
import { houseKeepingService } from "./service";
import { HouseKeepingStatus } from "./enum";
import "../facility/entity";

class HouseKeepingController {
  public async createHouseKeeping(
    body: ICreateHouseKeepingUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    // const hasRoomBeenMarkedForCleaning =
    //   await roomService.findRoomsByIdAndRoomStatus(
    //     body.roomIds,
    //     RoomStatus.MarkForCleaning
    //   );

    // if (!hasRoomBeenMarkedForCleaning) {
    //   return utils.customResponse({
    //     status: 400,
    //     message: MessageResponse.Error,
    //     description: "This room has not been marked for cleaning!",
    //     data: null,
    //   });
    // }

    // const isStaffAHouseKeeper = await staffService.findStaffByIdsAndRole(
    //   body.staffIds,
    //   StaffRole.HouseKeeping
    // );

    // if (!isStaffAHouseKeeper) {
    //   return utils.customResponse({
    //     status: 400,
    //     message: MessageResponse.Error,
    //     description: "This staff is not a house keeeper!",
    //     data: null,
    //   });
    // }

    console.log("+++++++===++++++++======+++++_--++++++++++++++")
    const houseKeeping = await houseKeepingService.createHouseKeeping({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "House keeping created successfully!",
      data: { houseKeeping },
    });
  }

  public async fetchAllHouseKeeping(req: CustomRequest) {
    const { hotelId } = req;

    const houseKeeping = await houseKeepingService.findHouseKeepingByHotelId(
      hotelId!
    );

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "HouseKeeping fetched successfully!",
      data: {
        houseKeeping,
      },
    });
  }

  public async markRoomsAsCleaned(body: IMarkHouseKeepingUserInputAsComplete) {
    await roomService.markRoomsAsAvailable(body.roomIds);

  const houseKeeping =  await houseKeepingService.updateHouseKeepingStatus(
      body.houseKeepingId,
      HouseKeepingStatus.COMPLETED
    );

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "House keeping marked as completed!",
      data: {houseKeeping},
    });
  }

  public async markRoomsAsCancelled(
    body: IMarkHouseKeepingUserInputAsCancelled
  ) {
   const houseKeeping = await houseKeepingService.updateHouseKeepingStatus(
      body.houseKeepingId,
      HouseKeepingStatus.CANCELLED
    );

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "House keeping cancelled!",
      data: {houseKeeping},
    });
  }
}

export const houseKeepingController = new HouseKeepingController();
