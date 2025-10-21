import Crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import { MessageResponse } from "./enum";
import { NextResponse } from "next/server";
import { CustomHttpResponse, DecodedToken, Handler } from "./interface";

class Utils {
  public toSentenceCase = (text: string) => {
    const trimmed = text.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };
  public customResponse({
    status,
    message,
    description,
    data,
  }: CustomHttpResponse) {
    return NextResponse.json(
      {
        message,
        description,
        data,
      },
      { status }
    );
  }

  public withErrorHandling(handler: Handler) {
    return async (request: Request) => {
      try {
        return await handler(request);
      } catch (err) {
        console.error("Route handler error:", err);

        return utils.customResponse({
          status: 500,
          message: MessageResponse.Error,
          description: "Internal server error",
          data: null,
        });
      }
    };
  }

  public runMiddleware(req: any, fn: any): Promise<any> {
    return new Promise((resolve, reject) => {
      fn(req, {} as any, (result: any) => {
        if (result instanceof Error) return reject(result);
        return resolve(result);
      });
    });
  }

  public generateOtp = (): string => {
    return Array.from({ length: 6 }, () => Crypto.randomInt(0, 10)).join("");
  };

  public generateTransactionId = (prefix: string): string => {
    const timestamp = Date.now().toString(36);
    const randomPart = Crypto.randomBytes(4).toString("hex");

    return `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
  };

  public verifyAuth() {
    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 401,
          message: MessageResponse.Error,
          description: "No token provided",
          data: null,
        }),
      };
    }
    ``;

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;

      if (!decodedToken?.userId || !decodedToken?.userRole) {
        return {
          valid: false,
          response: utils.customResponse({
            status: 401,
            message: MessageResponse.Error,
            description: "Not authenticated",
            data: null,
          }),
        };
      }

      return {
        valid: true,
        userId: mongoose.Types.ObjectId.createFromHexString(
          decodedToken.userId
        ),
        hotelId: decodedToken.hotelId,
        userRole: decodedToken.userRole,
      };
    } catch (err) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 403,
          message: MessageResponse.Error,
          description: "Invalid token",
          data: null,
        }),
      };
    }
  }
}

export const utils = new Utils();
