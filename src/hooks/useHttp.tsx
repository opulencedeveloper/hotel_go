import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Cookies from "js-cookie";

import axios from "@/lib/axios";
import { toast } from "sonner";
import { getAuthSessionInfo, removeAuthSessionInfo } from "@/utils/auth";
import { HttpRequestConfigProps } from "@/types/http";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

        if (error.response?.status === 401) {
          errorMessage = "Session expired!";
          router.replace("/login");
          setError("Session expired!");
          toast.error("Session expired!");

        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return {
    isLoading,
    sendHttpRequest,
    error,
  };
};
