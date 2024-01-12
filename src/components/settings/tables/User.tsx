/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarGroup, DataTable, Switch, Tooltip } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import ColumnFilterDropdown from "@/components/common/ColumnFilterDropdown";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import DeleteModal from "@/components/common/DeleteModal";
import axios from "axios";
import SwitchModal from "@/components/common/SwitchModal";
import DrawerOverlay from "../drawer/DrawerOverlay";
import UserPermissionDrawer from "../drawer/UserPermissionDrawer";
import { USER } from "./Constants/Tabname";
import ReportLoader from "@/components/common/ReportLoader";
import { toast } from "react-toastify";

const User = ({
  onOpen,
  onEdit,
  onUserDataFetch,
  getOrgDetailsFunction,
  canView,
  canEdit,
  canDelete,
  canPermission,
  onSearchUserData,
  onSearchClear,
  onHandleExport,
}: any) => {
  const headers = [
    { header: "User Name", accessor: "FullName", sortable: true },
    {
      header: "User Type",
      accessor: "UserType",
      sortable: true,
      colStyle: "w-[10%]",
    },
    { header: "Email", accessor: "Email", sortable: true, colStyle: "w-[22%]" },
    { header: "Mobile No", accessor: "ContactNo", sortable: true },
    { header: "Department", accessor: "DepartmentName", sortable: false },
    { header: "Reporting Manager", accessor: "RMUserName", sortable: false },
    { header: "Group", accessor: "GroupNames", sortable: false },
    { header: "Status", accessor: "IsActive", sortable: false },
  ];

  const headersDropdown = [
    { header: "User Type", accessor: "UserType", sortable: true },
    { header: "Email", accessor: "Email", sortable: true },
    { header: "Mobile No", accessor: "ContactNo", sortable: true },
    { header: "Department", accessor: "DepartmentName", sortable: false },
    { header: "Reporting Manager", accessor: "RMUserName", sortable: false },
    { header: "Group", accessor: "GroupNames", sortable: false },
    { header: "Status", accessor: "IsActive", sortable: false },
  ];

  const defaultVisibleHeaders = headers.slice(0, 5);
  const [visibleHeaders, setVisibleHeaders] = useState(defaultVisibleHeaders);
  const [open, setOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState(true);

  const handleHeaderToggle = (header: any) => {
    const headerObj = headers.find((h) => h.header === header);
    if (!headerObj) return;

    if (visibleHeaders.some((h) => h.header === header)) {
      setVisibleHeaders(visibleHeaders.filter((h) => h.header !== header));
    } else {
      setVisibleHeaders([...visibleHeaders, headerObj]);
    }
  };

  const handleOpen = (arg1: boolean) => {
    setOpen(arg1);
  };

  const columns = [
    ...visibleHeaders,
    {
      header: (
        <Tooltip position="left" content="Select columns">
          <span className="pl-5">
            <ColumnFilterDropdown
              headers={headersDropdown.map((h) => h.header)}
              visibleHeaders={visibleHeaders.map((h) => h.header)}
              isOpen={open}
              setOpen={handleOpen}
              handleHeaderToggle={handleHeaderToggle}
            />
          </span>
        </Tooltip>
      ),
      accessor: "actions",
      sortable: false,
    },
  ];
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [data, setData] = useState<any>([]);
  const [openProcessDrawer, setOpenProcessDrawer] = useState(false);
  const [roleId, setRoleId] = useState(0);
  const [userId, setUserId] = useState(0);

  const handleOpenProcessDrawer = () => {
    setOpenProcessDrawer(true);
  };

  const handleCloseProcessDrawer = () => {
    setOpenProcessDrawer(false);
    setRoleId(0);
    setUserId(0);
  };

  const handleActionValue = async (
    actionId: string,
    id: any,
    roleId: any,
    firstName: string,
    lastName: string,
    email: any
  ) => {
    setSelectedRowId(id);
    if (actionId.toLowerCase() === "edit") {
      onEdit(id);
    }
    if (actionId.toLowerCase() === "permissions") {
      setOpenProcessDrawer(true);
      setRoleId(roleId);
      setUserId(id);
    }
    if (actionId.toLowerCase() === "delete") {
      setIsDeleteOpen(true);
    }
    if (actionId.toLowerCase() === "resend invite") {
      handleResendInvite(id, email, firstName, lastName);
    }
  };

  const handleToggleUser = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/activeinactive`,
        {
          UserId: switchId,
          ActiveStatus: !switchActive,
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
          setIsOpenSwitchModal(false);
          toast.success("Status Updated Successfully.");
          getData();
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

  const handleResendInvite = async (
    id: number,
    email: any,
    firstName: string,
    lastName: string
  ) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const Org_Name = await localStorage.getItem("Org_Name");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/ResendLink`,
        {
          UserId: id,
          Email: email,
          FirstName: firstName,
          LastName: lastName,
          OrganizationName: Org_Name,
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
          toast.success("Resend Link sent Successfully.");
          getData();
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

  const closeSwitchModal = async () => {
    await setIsOpenSwitchModal(false);
  };

  const SwitchData = ({ id, IsActive }: any) => {
    const activeUser = async () => {
      await setIsOpenSwitchModal(true);
      await setSwitchId(id);
      await setSwitchActive(IsActive);
    };
    return (
      <div onClick={activeUser}>
        <Switch checked={IsActive} />
      </div>
    );
  };

  const Actions = ({
    actions,
    id,
    roleId,
    firstName,
    lastName,
    email,
  }: any) => {
    const actionsRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    useEffect(() => {
      window.addEventListener("click", handleOutsideClick);
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }, []);

    const actionPermissions = actions.filter((action: any) => {
      const lowerCaseAction = action ? action.toLowerCase() : "";
      return (
        (lowerCaseAction === "edit" && canEdit) ||
        (lowerCaseAction === "permissions" && canPermission) ||
        (lowerCaseAction === "delete" && canDelete) ||
        lowerCaseAction === "resend invite"
      );
    });

    return actionPermissions.length > 0 ? (
      <div
        ref={actionsRef}
        className="w-5 h-5 cursor-pointer relative"
        onClick={() => setOpen(!open)}
      >
        <TableActionIcon />
        {open && (
          <React.Fragment>
            <div className="relative z-10 flex justify-center items-center">
              <div className="absolute top-1 right-0 py-2 border border-lightSilver rounded-md bg-pureWhite shadow-lg ">
                <ul className="w-40">
                  {actionPermissions.map(
                    (action: any, index: any) =>
                      ((action.toLowerCase() === "edit" && canEdit) ||
                        (action.toLowerCase() === "permissions" &&
                          canPermission) ||
                        (action.toLowerCase() === "delete" && canDelete) ||
                        action.toLowerCase() === "resend invite") && (
                        <li
                          key={index}
                          onClick={() =>
                            handleActionValue(
                              action,
                              id,
                              roleId,
                              firstName,
                              lastName,
                              email
                            )
                          }
                          className={`flex w-full h-9 px-3 ${
                            action.toLowerCase() === "resend invite"
                              ? "hover:bg-red-100"
                              : "hover:bg-lightGray"
                          } !cursor-pointer`}
                        >
                          <div className="flex justify-center items-center ml-2 cursor-pointer">
                            <label
                              className={`inline-block text-xs cursor-pointer ${
                                action.toLowerCase() === "resend invite"
                                  ? "text-defaultRed font-semibold"
                                  : ""
                              }`}
                            >
                              {action}
                            </label>
                          </div>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    ) : (
      <div className="w-5 h-5 relative opacity-50 pointer-events-none">
        <TableActionIcon />
      </div>
    );
  };

  let tableData: any[] = data.map(
    (i: any) =>
      new Object({
        ...i,
        FullName: (
          <div className="text-[#0592C6] font-semibold text-sm">
            {i.FullName}
          </div>
        ),
        UserType: <div className="text-sm">{i.UserType}</div>,
        Email: <div className="text-sm">{i.Email}</div>,
        ContactNo: <div className="text-sm">{i.ContactNo}</div>,
        DepartmentName: <div className="text-sm">{i.DepartmentName}</div>,
        RMUserName: <div className="text-sm">{i.RMUserName}</div>,
        GroupNames: (
          <div className="flex">
            <AvatarGroup show={3}>
              {i.GroupNames?.map((i: any, index: any) => (
                <Avatar key={index} name={i}></Avatar>
              ))}
            </AvatarGroup>
          </div>
        ),
        IsActive: <SwitchData id={i.UserId} IsActive={i.IsActive} />,
        actions: (
          <Actions
            actions={[
              "Edit",
              "Permissions",
              "Delete",
              i.IsConfirmed ? null : "Resend Invite",
            ]}
            id={i.UserId}
            roleId={i.RoleId}
            firstName={i.FirstName}
            lastName={i.LastName}
            email={i.Email}
          />
        ),
      })
  );

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/getall`,
        {
          GlobalSearch: "",
          PageNo: 1,
          PageSize: 50000,
          RoleId: null,
          DepartmentId: null,
          Status: null,
          IsClientUser: null,
          SortColumn: null,
          IsDesc: true,
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
          onHandleExport(
            response.data.ResponseData.List.length > 0 ? true : false
          );
          setLoader(false);
          setData(response.data.ResponseData.List);
          getOrgDetailsFunction();
          onSearchClear(USER);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        setLoader(false);
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  useEffect(() => {
    if (onSearchUserData) {
      setData(onSearchUserData);
    } else {
      const timer = setTimeout(() => {
        getData();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onSearchUserData]);

  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteRow = async () => {
    if (selectedRowId) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.api_url}/user/delete`,
          {
            UserId: selectedRowId,
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
            toast.success("User has been deleted successfully!");
            getData();
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
      setSelectedRowId(null);
      setIsDeleteOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getData();
      onUserDataFetch(() => fetchData());
    };
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {canView ? (
        loader ? (
          <ReportLoader />
        ) : (
          <div
            className={`${
              tableData.length === 0 ? "!h-full" : "!h-[81vh] !w-full"
            }`}
          >
            {data.length > 0 && (
              <DataTable columns={columns} data={tableData} sticky />
            )}
            {tableData.length === 0 && (
              <>
                <p className="flex justify-center items-center py-[17px] md:text-xs text-[14px] border-b border-b-[#E6E6E6]">
                  Currently there is no record, you may
                  <a
                    onClick={onOpen}
                    className=" text-[#0592C6] underline cursor-pointer ml-1 mr-1"
                  >
                    Create User
                  </a>
                  to continue
                </p>
              </>
            )}

            {/* Delete Modal */}
            {isDeleteOpen && (
              <DeleteModal
                isOpen={isDeleteOpen}
                onClose={closeModal}
                title="Delete User"
                actionText="Yes"
                onActionClick={handleDeleteRow}
              >
                Are you sure you want to delete User? <br /> If you delete User,
                you will permanently lose user and user related data.
              </DeleteModal>
            )}

            {isOpenSwitchModal && (
              <SwitchModal
                isOpen={isOpenSwitchModal}
                onClose={closeSwitchModal}
                title={`${switchActive === false ? "Active" : "InActive"} User`}
                actionText="Yes"
                onActionClick={handleToggleUser}
              >
                Are you sure you want to&nbsp;
                {switchActive === false ? "Active" : "InActive"} User?
              </SwitchModal>
            )}

            <UserPermissionDrawer
              onOpen={openProcessDrawer}
              onClose={handleCloseProcessDrawer}
              userId={userId}
              roleId={roleId}
              onDataFetch={getData}
            />
            <DrawerOverlay
              isOpen={openProcessDrawer}
              onClose={handleCloseProcessDrawer}
            />
          </div>
        )
      ) : (
        <div className="flex justify-center items-center py-[17px] text-[14px] text-red-500">
          You don&apos;t have the privilege to view data.
        </div>
      )}
    </>
  );
};

export default User;
