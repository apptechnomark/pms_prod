import axios from "axios";
import { toast } from "react-toastify";

export const getWorkTypeData = async (clientName: string | number) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");

  try {
    const response = await axios.post(
      `${process.env.pms_api_url}/WorkType/GetDropdown`,
      {
        clientId: clientName ? clientName : 0,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: `${Org_Token}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        return response.data.ResponseData;
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } else {
      const data = response.data.Message;
      if (data === null) {
        toast.error("Please try again.");
      } else {
        toast.error(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getBillingTypeData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");

  try {
    const response = await axios.get(
      `${process.env.pms_api_url}/BillingType/GetDropdown`,
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: `${Org_Token}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        return response.data.ResponseData;
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } else {
      const data = response.data.Message;
      if (data === null) {
        toast.error("Please try again.");
      } else {
        toast.error(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getDeptData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");

  try {
    const response = await axios.get(
      `${process.env.pms_api_url}/department/getdropdown`,
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: `${Org_Token}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        return response.data.ResponseData;
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } else {
      const data = response.data.Message;
      if (data === null) {
        toast.error("Please try again.");
      } else {
        toast.error(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getProjectData = async (clientName: string | number) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.pms_api_url}/project/getdropdown`,
      {
        clientId: clientName ? clientName : 0,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: `${Org_Token}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        return response.data.ResponseData.List;
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } else {
      const data = response.data.Message;
      if (data === null) {
        toast.error("Please try again.");
      } else {
        toast.error(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getClientData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.get(
      `${process.env.pms_api_url}/client/getdropdown`,
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: `${Org_Token}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        return response.data.ResponseData;
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } else {
      const data = response.data.Message;
      if (data === null) {
        toast.error("Please try again.");
      } else {
        toast.error(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");

  try {
    const response = await axios.get(
      `${process.env.api_url}/user/getdropdown`,
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: `${Org_Token}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        return response.data.ResponseData;
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } else {
      const data = response.data.Message;
      if (data === null) {
        toast.error("Please try again.");
      } else {
        toast.error(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
