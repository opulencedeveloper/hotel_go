import Axios from "axios";

const axios = Axios.create({
 // baseURL: process.env.NEXT_PUBLIC_API_URL,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
  },
});

export default axios;
