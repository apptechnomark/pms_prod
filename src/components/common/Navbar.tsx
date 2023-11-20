"use client";

import React, { useEffect, useRef, useState } from "react";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import Btn_Help from "@/assets/icons/dashboard_Client/Btn_Help";
import LogoutIcon from "@/assets/icons/LogoutIcon";
import { Avatar } from "@mui/material";
import axios from "axios";
import Dropdown from "./Dropdown";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleLogoutUtil } from "@/utils/commonFunction";

const Navbar = ({ onUserDetailsFetch, onHandleModuleNames }: any) => {
  const router = useRouter();
  const [orgData, setOrgData] = useState([]);
  const [openLogout, setOpenLogout] = useState(false);
  const [userData, setUserData] = useState<any>([]);
  const [roleDropdownData, setRoleDropdownData] = useState([]);
  const selectRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("");

  let token: any;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  let options: any[] = [];

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/Role/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setRoleDropdownData(response.data.ResponseData);
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

  const getUserDetails = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(
        `${process.env.api_url}/auth/getuserdetails`,
        { headers: headers }
      );
      if (response.status === 200) {
        const username =
          response.data.ResponseData?.FirstName +
          " " +
          response.data.ResponseData?.LastName;
        setUserName(username);
        setUserData(response.data.ResponseData);
        setOrgData(response.data.ResponseData.Organizations);

        localStorage.setItem(
          "IsHaveManageAssignee",
          response.data.ResponseData.IsHaveManageAssignee
        );

        localStorage.setItem(
          "permission",
          JSON.stringify(response.data.ResponseData.Menu)
        );
        localStorage.setItem("roleId", response.data.ResponseData.RoleId);
        localStorage.setItem(
          "isClient",
          response.data.ResponseData.IsClientUser
        );
        localStorage.setItem("clientId", response.data.ResponseData.ClientId);
        if (localStorage.getItem("Org_Token") === null) {
          localStorage.setItem(
            "Org_Token",
            response.data.ResponseData.Organizations[0].Token
          );
        }
        if (localStorage.getItem("Org_Id") === null) {
          localStorage.setItem(
            "Org_Id",
            response.data.ResponseData.Organizations[0].OrganizationId
          );
        }
        if (localStorage.getItem("Org_Name") === null) {
          localStorage.setItem(
            "Org_Name",
            response.data.ResponseData.Organizations[0].OrganizationName
          );
        }
        getData();
        const filteredOrganization =
          response.data.ResponseData.Organizations.filter(
            (org: any) =>
              org.OrganizationName === localStorage.getItem("Org_Name")
          );
        const {
          ClientModuleName,
          ProjectModuleName,
          ProcessModuleName,
          SubProcessModuleName,
        } = filteredOrganization[0];
        onHandleModuleNames(
          ClientModuleName,
          ProjectModuleName,
          ProcessModuleName,
          SubProcessModuleName,
          response.data.ResponseData.RoleId
        );
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const fetchData = async () => {
    const fetchedData = await getUserDetails();
    onUserDetailsFetch(() => fetchData());
  };

  useEffect(() => {
    fetchData();
    getUserDetails();
  }, [token]);

  orgData.map(({ Token, OrganizationName, OrganizationId }) => {
    return options.push({
      id: OrganizationId,
      label: OrganizationName,
      token: Token,
    });
  });

  const handleLogout = () => {
    setOpenLogout(false);
    if (typeof window !== "undefined") {
      handleLogoutUtil();
    }
    router.push("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpenLogout(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-[20px] py-[9px] border-b border-lightSilver z-5">
      {userData.RoleId === 1 ? (
        orgData.length > 0 ? (
          <Dropdown
            options={orgData.map(
              ({ Token, OrganizationName, OrganizationId, IsFavourite }) => {
                return {
                  id: OrganizationId,
                  label: OrganizationName,
                  token: Token,
                  isFavourite: IsFavourite,
                };
              }
            )}
            getUserDetails={getUserDetails}
          />
        ) : null
      ) : (
        <div></div>
      )}

      <span className="flex items-center gap-[15px]">
        {/* <span className="flex items-center gap-[20px] mr-[20px]">
          <span className="cursor-pointer">
            <NotificationIcon />
          </span>
          {userData.RoleId !== 1 ? (
            <span className="cursor-pointer">
              <Btn_Help />
            </span>
          ) : null}
        </span> */}
        <div className="flex flex-col">
          <span className="inline-block text-base font-semibold text-darkCharcoal">
            {userData?.FirstName} {userData?.LastName}
          </span>
          <span className="inline-block text-base font-semibold text-darkCharcoal">
            {roleDropdownData.map((i: any) => {
              return i.value === userData.RoleId && i.label;
            })}
          </span>
        </div>
        <div
          ref={selectRef}
          className="flex items-center justify-center flex-col relative"
        >
          <span
            onClick={() => setOpenLogout(!openLogout)}
            className="cursor-pointer"
          >
            <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
              {userName
                .split(" ")
                .map((word: any) => word.charAt(0).toUpperCase())
                .join("")}
            </Avatar>
          </span>
          {openLogout && (
            <div className="absolute top-[55px] rounded-md -right-2 w-50 h-12 px-5 flex items-center justify-center bg-pureWhite shadow-xl z-50">
              <span
                onClick={handleLogout}
                className="flex items-center justify-center cursor-pointer hover:text-defaultRed"
              >
                <span className="!rotate-0">
                  <LogoutIcon />
                </span>
                &nbsp;Logout
              </span>
            </div>
          )}
        </div>
      </span>
    </div>
  );
};

export default Navbar;
