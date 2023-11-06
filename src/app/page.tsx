"use client";

import { hasPermissionWorklog } from "@/utils/commonFunction";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  const getUserDetails = async () => {
    const token = await localStorage.getItem("token");
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
        const local: any = await localStorage.getItem("permission");
        if (local.length > 0) {
          if (response.data.ResponseData.IsClientUser === true) {
            hasPermissionWorklog("", "View", "Report") &&
              (hasPermissionWorklog("Task", "View", "Report") ||
                hasPermissionWorklog("Rating", "View", "Report")) &&
              router.push("/report");
            hasPermissionWorklog("", "View", "WorkLogs") &&
              (hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") ||
                hasPermissionWorklog("Rating", "View", "WorkLogs")) &&
              router.push("/worklog");
            hasPermissionWorklog("", "View", "Dashboard") &&
              router.push("/dashboard");
          }
          if (response.data.ResponseData.IsClientUser === false) {
            hasPermissionWorklog("", "View", "Report") &&
              router.push("/reports");
            hasPermissionWorklog("", "View", "Approvals") &&
              router.push("/approvals");
            hasPermissionWorklog("", "View", "WorkLogs") &&
              (hasPermissionWorklog("", "ClientManager", "WorkLogs") ||
                hasPermissionWorklog("", "ManageAssignee", "WorkLogs")) &&
              router.push("/worklogs");
            hasPermissionWorklog("", "View", "Settings") &&
              router.push("/settings");
            hasPermissionWorklog("", "View", "Dashboard") &&
              router.push("/admin-dashboard");
          }
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <CircularProgress />
    </div>
  );
};

export default Home;
