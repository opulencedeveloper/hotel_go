import { NextRequest } from "next/server";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";

// Placeholder guest API - GuestService not implemented yet
async function GET(request: NextRequest) {
  return utils.customResponse({
    status: 501,
    message: MessageResponse.Error,
    description: "Guest service not implemented yet",
    data: null
  });
}

async function POST(request: NextRequest) {
  return utils.customResponse({
    status: 501,
    message: MessageResponse.Error,
    description: "Guest service not implemented yet",
    data: null
  });
}

export { GET, POST };