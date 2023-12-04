/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Switch, DataTable, Toast, Loader } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import axios from "axios";
import DeleteModal from "@/components/common/DeleteModal";
import SwitchModal from "@/components/common/SwitchModal";
import { ORGANIZATION } from "./Constants/Tabname";

function Organization({
  onOpen,
  onEdit,
  onHandleOrgData,
  onDataFetch,
  getOrgDetailsFunction,
  onSearchOrgData,
  onSearchClear,
  onHandleExport,
}: any) {
  const [userList, setUserList] = useState([]);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("org_token");
  const [loader, setLoader] = useState(true);

  const columns = [
    {
      header: "Organization Name",
      accessor: "OrganizationName",
      sortable: true,
    },
    { header: "Active", accessor: "IsActive", sortable: false },
    {
      header: "Actions",
      accessor: "actions",
      sortable: false,
    },
  ];

  const handleActionValue = async (actionId: string, id: any) => {
    if (actionId.toLowerCase() === "edit") {
      getUserById(id);
      onEdit(id);
    }
  };

  const handleToggleUser = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/organization/activeinactive`,
        {
          organizationId: switchId,
          isActive: !switchActive,
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
          getOrgDetailsFunction();
          getOrganizationList();
          onSearchClear(ORGANIZATION);
          Toast.success("Organization Updated Successfully.");
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
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

  const Actions = ({ actions, id }: any) => {
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
    return (
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
                  {actions.map((action: any, index: any) => (
                    <li
                      key={index}
                      onClick={() => handleActionValue(action, id)}
                      className="flex w-full h-9 px-3 hover:bg-lightGray !cursor-pointer"
                    >
                      <div className="flex justify-center items-center ml-2 cursor-pointer">
                        <label className="inline-block text-xs cursor-pointer">
                          {action}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  };

  let tableData: any[] = userList.map(
    (i: any) =>
      new Object({
        ...i,
        OrganizationName: <div className="text-sm">{i.OrganizationName}</div>,
        IsActive: <SwitchData id={i.OrganizationId} IsActive={i.IsActive} />,
        actions: <Actions actions={["Edit"]} id={i.OrganizationId} />,
      })
  );

  const fetchData = async () => {
    await getOrganizationList();
    onDataFetch(() => fetchData());
  };

  useEffect(() => {
    fetchData();
    getOrganizationList();
  }, [token]);

  // for showing value according to search
  useEffect(() => {
    if (onSearchOrgData) {
      setUserList(onSearchOrgData);
    } else {
      getOrganizationList();
    }
  }, [onSearchOrgData]);

  const getUserById = async (data: any) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
        org_token: org_token,
      };
      const param = {
        OrganizationId: data,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/organization/getbyid`,
        param,
        { headers: headers }
      );
      if (response.data.ResponseStatus === "Success") {
        if (response.data.ResponseStatus === "Success") {
          onHandleOrgData(response.data.ResponseData);
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again later.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      setUserList([]);
    }
  };

  const getOrganizationList = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
        org_token: org_token,
      };
      const param = {
        GlobalSearch: null,
        SortColumn: null,
        IsDesc: true,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/organization/getall`,
        param,
        { headers: headers }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          onHandleExport(response.data.ResponseData.length > 0 ? true : false);
          setLoader(false);
          setUserList(response.data.ResponseData);
        } else {
          setLoader(false);
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      }
    } catch {
      setLoader(false);
      setUserList([]);
    }
  };

  return (
    <>
      {loader ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      ) : (
        <div
          className={`${userList.length === 0 ? "h-full" : "h-[81vh] !w-full"}`}
        >
          <Toast position="top_center" />
          {tableData.length > 0 ? (
            <DataTable columns={columns} data={tableData} sticky />
          ) : (
            <p className="flex justify-center items-center py-[17px] text-[14px]">
              Currently there is no record, you may
              <a
                onClick={onOpen}
                className=" text-primary underline cursor-pointer ml-1 mr-1"
              >
                Create Organization
              </a>
              to continue
            </p>
          )}
          {isOpenSwitchModal && (
            <SwitchModal
              isOpen={isOpenSwitchModal}
              onClose={closeSwitchModal}
              title={`${
                switchActive === false ? "Active" : "InActive"
              } Organization`}
              actionText="Yes"
              onActionClick={handleToggleUser}
            >
              Are you sure you want to&nbsp;
              {switchActive === false ? "Active" : "InActive"} Organization?
            </SwitchModal>
          )}
        </div>
      )}
    </>
  );
}

export default Organization;
