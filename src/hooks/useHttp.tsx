import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Cookies from "js-cookie";

import axios from "@/lib/axios";
import { toast } from "sonner";
import { getAuthSessionInfo, removeAuthSessionInfo } from "@/utils/auth";
import { HttpRequestConfigProps } from "@/types/http";
import { MessageResponse } from "@/utils/enum";
import { useSubscribeModal } from "@/contexts/SubscribeModalContext";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { showSubscribeModal } = useSubscribeModal();

  const sendHttpRequest = useCallback(
    async ({ successRes, requestConfig }: HttpRequestConfigProps) => {
      setError(null);

      // const { token, isAuthenticated } = getAuthSessionInfo();

      // if (!isAuthenticated && requestConfig.isAuth) {
      //   removeAuthSessionInfo();
      //   router.replace("/login");
      //   setError("Session expired!");
      //   toast.error("Session expired!");
      //   return;
      // }

      setIsLoading(true);

      try {
        const config = {
          ...(requestConfig.baseURL && { baseURL: requestConfig.baseURL }),
          ...(requestConfig.url && { url: `/api/v1${requestConfig.url}` }),
          method: requestConfig.method,
          headers: {
            "Content-Type": requestConfig.contentType || "application/json",
            // Note: With httpOnly cookies, the Authorization header is not needed
            // The browser automatically sends the auth-token cookie
          },
          ...(requestConfig.params && { params: requestConfig.params }),
          ...(requestConfig.body && { data: requestConfig.body }),
        };

        console.log("requestData:", config);

        const res = await axios.request(config);

        console.log("responseData:", res.data.data);

        if (res.status >= 200 && res.status < 300) {
          if (requestConfig.successMessage) {
            toast.success(requestConfig.successMessage);
          }

          successRes(res);
        }
      } catch (error: any) {
        console.log("error:", error);
        let errorMessage = "Something went wrong!";

        if (error.code === "ERR_NETWORK") {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error?.response?.data?.description) {
          errorMessage = error.response.data?.description;
        }

        // Check for license errors (only for non-GET authenticated requests)
        const isAuthenticated = getAuthSessionInfo().isAuthenticated;
        const isNonGetRequest = requestConfig.method?.toUpperCase() !== 'GET';
        const responseMessage = error?.response?.data?.message;

        console.log("isAuthenticatedisAuthenticated", isAuthenticated)

        // Check if it's a license error (invalid or expired)
        if (
          (responseMessage === MessageResponse.InvaldLicenseId ||
            responseMessage === MessageResponse.ExpiredLicenseId)
        ) {
          // Show subscription modal instead of toast
          const description = error?.response?.data?.description || errorMessage;
          showSubscribeModal(responseMessage, description);
          setError(errorMessage);
          return; // Don't show toast for license errors, modal handles it
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          // Only redirect to login if it's not a license error
          if (
            responseMessage !== MessageResponse.InvaldLicenseId &&
            responseMessage !== MessageResponse.ExpiredLicenseId
          ) {
            errorMessage = "Session expired!";
            router.replace("/login");
            setError("Session expired!");
            toast.error("Session expired!");
          }
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [router, showSubscribeModal]
  );

  return {
    isLoading,
    sendHttpRequest,
    error,
  };
};
