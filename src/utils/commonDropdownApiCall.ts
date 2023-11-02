/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { toast } from "react-toastify";

export const getClientDropdownData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.get(
      `${process.env.pms_api_url}/client/getdropdownforgroup`,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getTypeOfWorkDropdownData = async (clientId: any) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.pms_api_url}/WorkType/GetDropdown`,
      {
        clientId: clientId,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getProjectDropdownData = async (clientId: any) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.pms_api_url}/project/getdropdown`,
      {
        clientId: clientId,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getProcessDropdownData = async (clientId: any) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.pms_api_url}/Process/GetDropdownByClient`,
      {
        clientId: clientId,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getStatusDropdownData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.get(
      `${process.env.pms_api_url}/status/GetDropdown`,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getSubProcessDropdownData = async (
  clientId: any,
  processId: any
) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.pms_api_url}/Process/GetDropdownByClient`,
      {
        clientId: clientId,
        processId: processId,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getAssigneeDropdownData = async (
  clientId: any,
  workTypeId: any
) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.api_url}/user/GetAssigneeUserDropdown`,
      {
        ClientId: clientId,
        WorktypeId: workTypeId,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getReviewerDropdownData = async (
  clientId: any,
  workTypeId: any
) => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.post(
      `${process.env.api_url}/user/GetReviewerDropdown`,
      {
        ClientId: clientId,
        WorktypeId: workTypeId,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getManagerDropdownData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.get(
      `${process.env.api_url}/user/getmanagerdropdown`,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getTypeOfReturnDropdownData = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.get(
      `${process.env.worklog_api_url}/workitem/getformtypelist`,
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};

export const getCCDropdownData = async () => {
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
        toast.error("Please try again later.");
      }
    } else {
      toast.error("Please try again.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
  }
};
