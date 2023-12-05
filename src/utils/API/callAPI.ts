import axios from "axios";
import { toast } from "react-toastify";

export const callAPI = async (
  url: any,
  params: any,
  successCallback: any,
  method: string
) => {
  try {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
        org_token: `${Org_Token}`,
      },
    };

    let response;

    if (method.toLowerCase() === "get") {
      response = await axios.get(url, config);
    } else if (method.toLowerCase() === "post") {
      response = await axios.post(url, params, config);
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { ResponseStatus, ResponseData, Message } = response.data;
    if (response.status === 200) {
      if (ResponseStatus === "Success") {
        successCallback(ResponseData, false);
      } else {
        if (Message === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(Message);
        }
        successCallback(null, true);
      }
    } else {
      if (Message === null) {
        toast.error("Please try again later.");
      } else {
        toast.error(Message);
      }
      successCallback(null, true);
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
    console.error(error);
  }
};
