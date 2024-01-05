/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Select, Text, Tooltip } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import ExportIcon from "@/assets/icons/ExportIcon";
import AddPlusIcon from "@/assets/icons/AddPlusIcon";
import User from "@/components/settings/tables/User";
import Group from "@/components/settings/tables/Group";
import Client from "@/components/settings/tables/Client";
import Project from "@/components/settings/tables/Project";
import Process from "@/components/settings/tables/Process";
import Status from "@/components/settings/tables/Status";
import Permissions from "@/components/settings/tables/Permissions";
import Drawer from "@/components/settings/drawer/Drawer";
import DrawerOverlay from "@/components/settings/drawer/DrawerOverlay";
import Wrapper from "@/components/common/Wrapper";
import Navbar from "@/components/common/Navbar";
import Organization from "@/components/settings/tables/Organization";
import { hasNoToken, hasPermissionWorklog } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import SearchIcon from "@/assets/icons/SearchIcon";
import Loading from "@/assets/icons/reports/Loading";
import {
  CLIENT,
  GROUP,
  ORGANIZATION,
  PROCESS,
  PROJECT,
  STATUS,
  USER,
} from "@/components/settings/tables/Constants/Tabname";
import { toast } from "react-toastify";
import ReportLoader from "@/components/common/ReportLoader";
import { callAPI } from "@/utils/API/callAPI";

type Tabs = { id: string; label: string; canView: boolean };

const initialTabs = [
  { id: "Client", label: "Client", canView: false },
  { id: "Project", label: "Project", canView: false },
  { id: "User", label: "User", canView: false },
  { id: "Process", label: "Process", canView: false },
  { id: "Group", label: "Group", canView: false },
  { id: "Status", label: "Status", canView: false },
  { id: "Permission", label: "Permissions", canView: false },
  { id: "Organization", label: "Organization", canView: true },
];

const Page = () => {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [tabs, setTabs] = useState<Tabs[]>(initialTabs);
  const [tab, setTab] = useState<string>("Client");
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(-1);
  const [visibleTabs, setVisibleTabs] = useState(tabs.slice(0, 6));
  const [dropdownTabs, setDropdownTabs] = useState(tabs.slice(6));
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEditId, setHasEditId] = useState("");
  const [userData, setUserData] = useState([]);
  const [getUserDataFunction, setUserGetDataFunction] = useState<
    (() => void) | null
  >(null);
  const [groupData, setGroupData] = useState("");
  const [projectData, setProjectData] = useState([]);

  const [statusData, setStatusData] = useState("");
  const [processData, setProcessData] = useState("");

  const handleGroupData = (data: any) => {
    setGroupData(data);
  };

  const handleProjectData = (data: any) => {
    setProjectData(data);
  };
  const handleStatusData = (data: any) => {
    setStatusData(data);
  };

  const handleUserDataFetch = (getData: () => void) => {
    setUserGetDataFunction(() => getData);
  };

  const handleProcessData = (data: any) => {
    setProcessData(data);
  };

  const handleUserData = (data: any) => {
    setUserData(data);
  };
  const [orgData, setOrgData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [getDataFunction, setGetDataFunction] = useState<(() => void) | null>(
    null
  );
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [permissionValue, setPermissionValue] = useState(0);
  const [permissionDropdownData, setPermissionDropdownData] = useState([]);
  const [isPermissionExpanded, setPermissionExpanded] =
    useState<boolean>(false);
  const [updatedPermissionsData, setUpdatedPermissionsData] = useState([]);
  const [textName, setTextName] = useState("");
  const [textValue, setTextValue] = useState(null);

  const [clientSearchValue, setClientSearchValue] = useState("");
  const [clientSearchData, setClientSearchData] = useState("");
  const [projectSearchValue, setProjectSearchValue] = useState("");
  const [projectSearchData, setProjectSearchData] = useState("");
  const [userSearchValue, setUserSearchValue] = useState("");
  const [userSearchData, setUserSearchData] = useState("");
  const [processSearchValue, setProcessSearchValue] = useState("");
  const [processSearchData, setProcessSearchData] = useState("");
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [statusSearchData, setStatusSearchData] = useState("");
  const [groupSearchValue, setGroupSearchValue] = useState("");
  const [groupSearchData, setGroupSearchData] = useState("");
  const [orgSearchValue, setOrgSearchValue] = useState("");
  const [orgSearchData, setOrgSearchData] = useState("");
  const [canExport, setCanExport] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("isClient") === "false") {
      if (
        !hasPermissionWorklog("", "View", "Settings") &&
        (!hasPermissionWorklog("Client", "View", "Settings") ||
          !hasPermissionWorklog("Project", "View", "Settings") ||
          !hasPermissionWorklog("User", "View", "Settings") ||
          !hasPermissionWorklog("Process", "View", "Settings") ||
          !hasPermissionWorklog("Group", "View", "Settings") ||
          !hasPermissionWorklog("Permission", "View", "Settings") ||
          !hasPermissionWorklog("Status", "View", "Settings"))
      ) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDataFetch = (getData: () => void) => {
    setGetDataFunction(() => getData);
  };

  const handleOrgData = (data: any) => {
    setOrgData(data);
  };

  const handleClientData = (data: any) => {
    setClientData(data);
  };

  useEffect(() => {
    hasNoToken(router);
  }, [router]);

  const handleCanExport = (arg1: boolean) => {
    setCanExport(arg1);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setHasEditId("");
  };

  const handleEdit = (rowId: string) => {
    setHasEditId(rowId);
    setOpenDrawer(true);
  };

  const handleTabClick = (tabId: string, index: number) => {
    if (hasPermissionWorklog(tabId.toLowerCase(), "view", "settings")) {
      const clickedTab = dropdownTabs[index];
      const lastVisibleTab = visibleTabs[visibleTabs.length - 1];

      if (visibleTabs.some((tab) => tab.id === tabId)) {
        setTab(tabId);
        setSelectedTabIndex(index);
        return;
      }

      const clickedTabIndexInDropdown = dropdownTabs.findIndex(
        (tab) => tab.id === tabId
      );

      const updatedVisibleTabs = [...visibleTabs];
      const updatedDropdownTabs = [...dropdownTabs];

      updatedVisibleTabs[visibleTabs.length - 1] = clickedTab;

      if (clickedTabIndexInDropdown !== -1) {
        updatedDropdownTabs[clickedTabIndexInDropdown] = lastVisibleTab;

        const newSelectedTabIndex = updatedVisibleTabs.findIndex(
          (tab) => tab.id === tabId
        );
        setSelectedTabIndex(newSelectedTabIndex);
      } else {
        updatedDropdownTabs.unshift(lastVisibleTab);
        setSelectedTabIndex(visibleTabs.length + clickedTabIndexInDropdown);
      }

      setTab(tabId);
      setVisibleTabs(updatedVisibleTabs);
      setDropdownTabs(updatedDropdownTabs);
    }
  };

  const getPermissionDropdown = async () => {
    const params = {};
    const url = `${process.env.pms_api_url}/Role/GetList`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setPermissionDropdownData(ResponseData);
      } else {
        setPermissionDropdownData([]);
      }
    };
    callAPI(url, params, successCallback, "GET");
  };

  useEffect(() => {
    tab === "Permission" && getPermissionDropdown();
  }, [tab]);

  const handleSavePermissionData = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (updatedPermissionsData.length > 0) {
      saveData();
      setPermissionExpanded(false);
    } else {
      toast.error("Please try again after sometime.");
    }
  };

  const saveData = async () => {
    const params = {
      RoleId: permissionValue !== 0 && permissionValue,
      Permissions: updatedPermissionsData,
    };
    const url = `${process.env.pms_api_url}/Role/SavePermission`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        toast.success("Data saved successfully.");
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleFormButtonClick = (editing: boolean) => {
    const saveRole = async () => {
      const params = {
        RoleId: textValue,
        Name: textName,
        Type: permissionDropdownData
          .map((i: any) => (i.value === textValue ? i.Type : undefined))
          .filter((i: any) => i !== undefined)[0],
      };
      const url = `${process.env.pms_api_url}/Role/Save`;
      const successCallback = (
        ResponseData: any,
        error: any,
        ResponseStatus: any
      ) => {
        if (ResponseStatus === "Success" && error === false) {
          getPermissionDropdown();
          toast.success(`Role saved successfully.`);
        }
      };
      callAPI(url, params, successCallback, "POST");
    };

    if (editing && textName.trim().length > 0 && textValue !== null) {
      saveRole();
    }
  };

  const deleteRole = async (e: any) => {
    const params = {
      RoleId: e,
    };
    const url = `${process.env.pms_api_url}/Role/Delete`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        getPermissionDropdown();
        toast.success(`Role has been deleted successfully!`);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleProjectDelete = (e: any) => {
    if (e > 0) {
      deleteRole(e);
    }
  };

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
    setLoaded(true);
  };

  const handleModuleNames = (
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: string,
    arg5: any
  ) => {
    const updatedTabs = tabs.map((tab) => {
      switch (tab.id.toLowerCase()) {
        case "client":
          return {
            ...tab,
            label: arg1,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "project":
          return {
            ...tab,
            label: arg2,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "user":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "process":
          return {
            ...tab,
            label: arg3,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "group":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "status":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "permission":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "organization":
          return {
            ...tab,
            canView: parseInt(arg5) === 1 ? true : false,
          };
          break;
        default:
          return { ...tab };
          break;
      }
    });

    setTabs(updatedTabs);
    setVisibleTabs(updatedTabs.slice(0, 8));
    setDropdownTabs(updatedTabs.slice(8));
  };

  useEffect(() => {
    hasPermissionWorklog(tab, "save", "settings");
    for (let i = 0; i < initialTabs.length; i++) {
      if (hasPermissionWorklog(initialTabs[i].id, "view", "settings")) {
        setTab(initialTabs[i].id);
        setIsLoading(false);
        setSelectedTabIndex(i);
        break;
      }
    }
  }, []);

  const handleClientSearch = async (searchValue: any) => {
    const params = {
      GlobalSearch: searchValue,
      SortColumn: null,
      IsDesc: false,
      PageNo: 1,
      PageSize: 50000,
    };
    const url = `${process.env.pms_api_url}/client/GetAll`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setClientSearchData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleProjectSearch = async (searchValue: any) => {
    const params = {
      GlobalSearch: searchValue,
      PageNo: 1,
      PageSize: 50000,
      ClientId: null,
      ProjectId: null,
      IsActive: null,
      SortColumn: null,
      IsDesc: true,
    };
    const url = `${process.env.pms_api_url}/project/getall`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setProjectSearchData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleUserSearch = async (searchValue: any) => {
    const params = {
      GlobalSearch: searchValue,
      PageNo: 1,
      PageSize: 50000,
      RoleId: null,
      DepartmentId: null,
      Status: null,
      IsClientUser: null,
      SortColumn: null,
      IsDesc: true,
    };
    const url = `${process.env.api_url}/user/getall`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setUserSearchData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleProcessSearch = async (searchValue: any) => {
    const params = {
      GlobalSearch: searchValue,
      PageNo: 1,
      PageSize: 50000,
      SortColumn: "",
      IsDesc: 0,
      IsBillable: null,
      IsProductive: null,
    };
    const url = `${process.env.pms_api_url}/process/GetAll`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setProcessSearchData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleGroupSearch = async (searchValue: any) => {
    const params = {
      UserId: 0,
      GlobalSearch: searchValue,
      SortColumn: null,
      IsDesc: true,
      PageNo: 1,
      PageSize: 50000,
      Status: true,
    };
    const url = `${process.env.pms_api_url}/group/getall`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setGroupSearchData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleStatusSearch = async (searchValue: any) => {
    const params = {
      pageNo: 1,
      pageSize: 50000,
      SortColumn: "",
      IsDec: true,
      GlobalSearch: searchValue,
      IsDefault: null,
      Type: "",
      Export: false,
    };
    const url = `${process.env.pms_api_url}/status/GetAll`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setStatusSearchData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleOrganizationSearch = async (searchValue: any) => {
    const params = {
      GlobalSearch: searchValue,
      SortColumn: null,
      IsDesc: true,
    };
    const url = `${process.env.pms_api_url}/organization/getall`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setOrgSearchData(ResponseData);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    const handleSearch = (
      value: string,
      searchFunction: {
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (arg0: string): void;
      }
    ) => {
      if (value.length >= 3) {
        searchFunction(value);
      } else {
        searchFunction("");
      }
    };

    switch (tab) {
      case CLIENT:
        handleSearch(clientSearchValue, handleClientSearch);
        break;
      case PROJECT:
        handleSearch(projectSearchValue, handleProjectSearch);
        break;
      case USER:
        handleSearch(userSearchValue, handleUserSearch);
        break;
      case PROCESS:
        handleSearch(processSearchValue, handleProcessSearch);
        break;
      case GROUP:
        handleSearch(groupSearchValue, handleGroupSearch);
        break;
      case STATUS:
        handleSearch(statusSearchValue, handleStatusSearch);
        break;
      case ORGANIZATION:
        handleSearch(orgSearchValue, handleOrganizationSearch);
        break;
    }
  }, [
    clientSearchValue,
    projectSearchValue,
    userSearchValue,
    processSearchValue,
    groupSearchValue,
    statusSearchValue,
    orgSearchValue,
  ]);

  const exportData = async (
    endpoint: string,
    filename: string,
    searchValue: any
  ) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      setIsExporting(true);
      const response = await axios.post(
        `${
          endpoint === "user" ? process.env.api_url : process.env.pms_api_url
        }/${endpoint}/export`,
        {
          GlobalSearch: searchValue,
          SortColumn: null,
          IsDesc: false,
          IsDownload: true,
          PageNo: 1,
          PageSize: 50000,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Data exported successfully.");
        setIsExporting(false);
      } else {
        setIsExporting(false);
        toast.error("Please try again later.");
      }
    } catch (error) {
      setIsExporting(false);
      toast.error("Error exporting data.");
    }
  };

  const clearSearchValue = (tab: string) => {
    switch (tab) {
      case CLIENT:
        setClientSearchValue("");
        break;
      case PROJECT:
        setProjectSearchValue("");
        break;
      case USER:
        setUserSearchValue("");
        break;
      case PROCESS:
        setProcessSearchValue("");
        break;
      case GROUP:
        setGroupSearchValue("");
        break;
      case STATUS:
        setStatusSearchValue("");
        break;
      case ORGANIZATION:
        setOrgSearchValue("");
        break;
    }
  };

  return (
    <Wrapper className="min-h-screen overflow-y-auto">
      <Navbar
        onUserDetailsFetch={handleUserDetailsFetch}
        onHandleModuleNames={handleModuleNames}
      />

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <ReportLoader />
          </div>
        ) : (
          <div className="bg-white flex justify-between items-center">
            <div className="flex items-center py-[16px]">
              {visibleTabs
                .filter((i: any) => i.canView !== false)
                .map((tab, index, array) => (
                  <label
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id, index)}
                    className={`text-[16px] ${
                      array.length === 8 ? "px-2" : "px-4"
                    } cursor-pointer select-none flex items-center justify-center ${
                      selectedTabIndex === index
                        ? "text-[#0592C6] font-semibold"
                        : "text-slatyGrey"
                    } ${
                      index < array.length - 1
                        ? "border-r border-r-lightSilver h-3"
                        : "pl-4"
                    }`}
                  >
                    {tab.label}
                  </label>
                ))}
            </div>

            <div
              className={`flex items-center px-[10px] ${
                tab === "Permissions" ? "gap-[5px]" : "gap-[10px]"
              }`}
            >
              {tab !== "Permission" ? (
                <>
                  {tab === "Client" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={clientSearchValue}
                        getValue={(e) => setClientSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {tab === "Project" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={projectSearchValue}
                        getValue={(e) => setProjectSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {tab === "User" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={userSearchValue}
                        getValue={(e) => setUserSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {tab === "Process" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={processSearchValue}
                        getValue={(e) => setProcessSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {tab === "Group" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={groupSearchValue}
                        getValue={(e) => setGroupSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {tab === "Status" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={statusSearchValue}
                        getValue={(e) => setStatusSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {tab === "Organization" && (
                    <div className="flex items-center relative">
                      <Text
                        placeholder="Search"
                        className="!bg-transparent p-1 pr-5"
                        value={orgSearchValue}
                        getValue={(e) => setOrgSearchValue(e)}
                        getError={() => {}}
                      />
                      <span className="absolute right-1 py-1 pl-1">
                        <SearchIcon />
                      </span>
                    </div>
                  )}

                  {/* <div
                    className={`${
                      hasPermissionWorklog(tab, "import", "settings")
                        ? ""
                        : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <Tooltip position={"top"} content="Import">
                      <ImportIcon />
                    </Tooltip>
                  </div> */}
                  <div
                    className={`${
                      hasPermissionWorklog(tab, "export", "settings")
                        ? ""
                        : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <Tooltip position={"top"} content="Export">
                      <span
                        className={`${
                          canExport ? "" : "pointer-events-none opacity-50"
                        } ${isExporting ? "cursor-default" : "cursor-pointer"}`}
                        onClick={
                          canExport
                            ? () => {
                                const tabMappings: any = {
                                  Client: "client",
                                  Group: "group",
                                  Process: "process",
                                  Project: "project",
                                  Status: "status",
                                  User: "user",
                                  Organization: "organization",
                                };

                                const searchData: any = {
                                  Client: clientSearchValue,
                                  Group: groupSearchValue,
                                  Process: processSearchValue,
                                  Project: projectSearchValue,
                                  Status: statusSearchValue,
                                  User: userSearchValue,
                                };

                                const selectedTab = tabMappings[tab];

                                if (selectedTab) {
                                  exportData(
                                    selectedTab,
                                    `${tab}_data`,
                                    searchData[tab]
                                  );
                                }
                              }
                            : undefined
                        }
                      >
                        {isExporting ? <Loading /> : <ExportIcon />}
                      </span>
                    </Tooltip>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-3 mr-4">
                  <Select
                    id="permissionName"
                    placeholder="Select Permission"
                    className="!w-[200px]"
                    defaultValue={permissionValue === 0 ? "" : permissionValue}
                    getValue={(value) => {
                      setPermissionValue(value);
                    }}
                    getError={(e) => {
                      console.error(e);
                    }}
                    options={permissionDropdownData}
                    addDynamicForm_Icons_Edit={
                      hasPermissionWorklog("permission", "save", "settings")
                        ? true
                        : false
                    }
                    addDynamicForm_Icons_Delete={
                      hasPermissionWorklog("permission", "delete", "settings")
                        ? true
                        : false
                    }
                    addDynamicForm_Label="Role"
                    addDynamicForm_Placeholder="Select Role"
                    onChangeText={(value, label) => {
                      setTextValue(value);
                      setTextName(label);
                    }}
                    onClickButton={handleFormButtonClick}
                    onDeleteButton={(e) => handleProjectDelete(e)}
                  />
                  <div className="w-[60px]">
                    <Button
                      variant="btn-secondary"
                      className={`rounded-md ${
                        permissionValue === 0 ||
                        !hasPermissionWorklog(tab, "save", "settings")
                          ? "opacity-50 pointer-events-none uppercase"
                          : ""
                      }`}
                      disabled={
                        permissionValue === 0 ||
                        !hasPermissionWorklog(tab, "save", "settings")
                          ? true
                          : false
                      }
                      onClick={handleSavePermissionData}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
              <Button
                type="submit"
                variant="btn-secondary"
                className={`${
                  tab === "Permissions"
                    ? "rounded-[4px] !h-[45px] "
                    : "rounded-[4px] !h-[36px] text-sm"
                } ${
                  isLoaded &&
                  (hasPermissionWorklog(tab, "save", "settings") ||
                    tabs.filter(
                      (i: any) => i.label.toLowerCase() === "organization"
                    )[0].canView)
                    ? ""
                    : "cursor-not-allowed"
                }`}
                onClick={
                  hasPermissionWorklog(tab, "save", "settings") ||
                  tabs.filter(
                    (i: any) => i.label.toLowerCase() === "organization"
                  )[0].canView
                    ? handleDrawerOpen
                    : undefined
                }
              >
                <span
                  className={`flex items-center justify-center ${
                    tab === "Permissions" ? "text-sm" : ""
                  }`}
                >
                  <span className="mr-2">
                    <AddPlusIcon />
                  </span>
                  <span className="uppercase">
                    Create {tab === "Permission" ? "Role" : tab}
                  </span>
                </span>
              </Button>
            </div>
          </div>
        )}

        {/*  Drawer */}
        <Drawer
          userData={userData}
          orgData={orgData}
          clientData={clientData}
          projectData={projectData}
          processData={processData}
          onEdit={hasEditId}
          groupData={groupData}
          statusData={statusData}
          onOpen={openDrawer}
          tab={tab}
          onClose={handleDrawerClose}
          onDataFetch={getDataFunction}
          onUserDataFetch={getUserDataFunction}
          onRefresh={handleRefresh}
          getPermissionDropdown={getPermissionDropdown}
          getOrgDetailsFunction={getOrgDetailsFunction}
        />

        {/* Drawer Overlay */}
        <DrawerOverlay isOpen={openDrawer} onClose={handleDrawerClose} />

        {tab === "Client" && (
          <Client
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onHandleClientData={handleClientData}
            onDataFetch={handleDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("client", "view", "settings")}
            canEdit={hasPermissionWorklog("client", "save", "settings")}
            canDelete={hasPermissionWorklog("client", "delete", "settings")}
            canProcess={hasPermissionWorklog("client", "save", "settings")}
            onSearchClientData={clientSearchData}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "Project" && (
          <Project
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleProjectData={handleProjectData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("project", "view", "settings")}
            canEdit={hasPermissionWorklog("project", "save", "settings")}
            canDelete={hasPermissionWorklog("project", "delete", "settings")}
            onSearchProjectData={projectSearchData}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "User" && (
          <User
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onHandleUserData={handleUserData}
            onUserDataFetch={handleUserDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("user", "view", "settings")}
            canEdit={hasPermissionWorklog("user", "save", "settings")}
            canDelete={hasPermissionWorklog("user", "delete", "settings")}
            onSearchUserData={userSearchData}
            canPermission={
              hasPermissionWorklog("permission", "view", "settings") &&
              hasPermissionWorklog("permission", "save", "settings")
            }
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "Group" && (
          <Group
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleGroupData={handleGroupData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("group", "view", "settings")}
            canEdit={hasPermissionWorklog("group", "save", "settings")}
            canDelete={hasPermissionWorklog("group", "delete", "settings")}
            onSearchGroupData={groupSearchData}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "Process" && (
          <Process
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleProcessData={handleProcessData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("process", "view", "settings")}
            canEdit={hasPermissionWorklog("process", "save", "settings")}
            canDelete={hasPermissionWorklog("process", "delete", "settings")}
            onSearchProcessData={processSearchData}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "Status" && (
          <Status
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleStatusData={handleStatusData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("status", "view", "settings")}
            canEdit={hasPermissionWorklog("status", "save", "settings")}
            canDelete={hasPermissionWorklog("status", "delete", "settings")}
            onSearchStatusData={statusSearchData}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "Permission" && (
          <Permissions
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            expanded={isPermissionExpanded}
            permissionValue={permissionValue}
            sendDataToParent={(data: any) => setUpdatedPermissionsData(data)}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("permission", "view", "settings")}
            canEdit={hasPermissionWorklog("permission", "save", "settings")}
            canDelete={hasPermissionWorklog("permission", "delete", "settings")}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
        {tab === "Organization" && (
          <Organization
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onHandleOrgData={handleOrgData}
            onDataFetch={handleDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
            onSearchOrgData={orgSearchData}
            onSearchClear={clearSearchValue}
            onHandleExport={handleCanExport}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
