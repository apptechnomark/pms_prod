/* eslint-disable react-hooks/rules-of-hooks */
// import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";

const hasToken = (router: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/settings");
  }
};

const hasNoToken = (router: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  }
};

const handleLogoutUtil = async () => {
  const token = await localStorage.getItem("token");
  const Org_Token = await localStorage.getItem("Org_Token");
  try {
    const response = await axios.get(`${process.env.api_url}/auth/logout`, {
      headers: {
        Authorization: `bearer ${token}`,
        org_token: `${Org_Token}`,
      },
    });

    if (response.status === 200) {
      if (response.data.ResponseStatus === "Success") {
        localStorage.clear();
      } else {
        toast.error("Something went wrong.");
      }
    } else {
      toast.error("Something went wrong.");
    }
  } catch (error) {
    console.error(error);
  }
};

const hasPermissionWorklog = (
  tabName: string,
  field: string,
  module: string
) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const role = localStorage.getItem("roleId");
    const roleId = role === null ? 0 : parseInt(role);
    const setting = localStorage.getItem("permission");

    if (setting !== null) {
      const settingArray = JSON.parse(setting);
      const settingPermission = settingArray.filter((set: any) => {
        return set.Name.toLowerCase() === module.toLowerCase();
      });

      if (tabName.trim().length <= 0 && settingPermission.length > 0) {
        const value = settingPermission[0].ActionList.filter(
          (i: any) => i.ActionName.toLowerCase() === field.toLowerCase()
        );
        return value.length > 0 ? value[0].IsChecked : false;
      }

      if (settingPermission.length > 0) {
        const settingTabsPermission = settingPermission[0].Childrens;
        const settingTabsName = settingTabsPermission.map((tab: any) =>
          tab.Name.toLowerCase()
        );

        if (settingTabsName.includes(tabName.toLowerCase())) {
          const value = settingTabsPermission
            .filter(
              (tab: any) => tab.Name.toLowerCase() === tabName.toLowerCase()
            )[0]
            .ActionList.filter(
              (arg1: any) =>
                arg1.ActionName.toLowerCase() === field.toLowerCase()
            );
          return value.length > 0 ? value[0].IsChecked : false;
        }
      }
    }

    if (tabName.toLowerCase() === "organization" && roleId === 1) {
      return true;
    } else {
      return false;
    }
  }
};

const getYears = () => {
  const currentYear = new Date().getFullYear() + 1;
  const Years = [];

  for (let year = 2010; year <= currentYear; year++) {
    Years.push({ label: String(year), value: year });
  }

  return Years;
};

const extractText = (inputString: any) => {
  const regex = /@\[([^\]]+)\]\([^)]+\)|\[([^\]]+)\]|[^@\[\]]+/g;
  const matches = [];
  let match;
  while ((match = regex.exec(inputString)) !== null) {
    matches.push(match[1] || match[2] || match[0]);
  }
  return matches;
};

const isWeekend = (date: any) => {
  const day = date.day();
  return day === 6 || day === 0;
};

const getTimeDifference = (startTime: any, endTime: any) => {
  const [s_hours, s_minutes, s_seconds] = startTime.split(":").map(Number);
  const [e_hours, e_minutes, e_seconds] = endTime.split(":").map(Number);
  let hours = e_hours - s_hours;
  let minutes = e_minutes - s_minutes;
  let seconds = e_seconds - s_seconds;
  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export {
  hasToken,
  hasNoToken,
  handleLogoutUtil,
  hasPermissionWorklog,
  getYears,
  extractText,
  isWeekend,
  getTimeDifference,
};
