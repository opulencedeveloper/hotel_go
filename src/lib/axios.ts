import Axios from "axios";

const axios = Axios.create({
 // baseURL: process.env.NEXT_PUBLIC_API_URL,
  maxBodyLength: Infinity,
  timeout: 30000, // 30 second timeout for all requests (longer than Flutterwave API timeout)
  headers: {
    Accept: "application/json",
  },
});

export default axios;
