import { NextRequest } from "next/server";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";

// Placeholder guest API - GuestService not implemented yet
async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return utils.customResponse({
    status: 501,
    message: MessageResponse.Error,
    description: "Guest service not implemented yet",
    data: null
  });
}

async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return utils.customResponse({
    status: 501,
    message: MessageResponse.Error,
    description: "Guest service not implemented yet",
    data: null
  });
}

async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return utils.customResponse({
    status: 501,
    message: MessageResponse.Error,
    description: "Guest service not implemented yet",
    data: null
  });
}

export { GET, PUT, DELETE };