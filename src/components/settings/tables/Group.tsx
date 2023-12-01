"use client";

import React, { useEffect, useRef, useState } from "react";
import { Toast, DataTable, AvatarGroup, Avatar, Loader } from "next-ts-lib";
import axios from "axios";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import DeleteModal from "@/components/common/DeleteModal";
import "next-ts-lib/dist/index.css";
import { GROUP } from "./Constants/Tabname";

function Group({
  onOpen,
  onEdit,
  onDataFetch,
  onHandleGroupData,
  getOrgDetailsFunction,
  canView,
  canEdit,
  canDelete,
  onSearchGroupData,
  onSearchClear,
  onHandleExport,
}: any) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");

  const headers = [
    { header: "Group Name", accessor: "Name", sortable: true },
    { header: "User", accessor: "user", sortable: false },
    { header: "Action", accessor: "action", sortable: false },
  ];

  // setting getData function for sending in parent component
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAll();
      onDataFetch(() => fetchData());
    };

    fetchData();

    getAll();
  }, []);

  // for showing value according to search
  useEffect(() => {
    if (onSearchGroupData) {
      setData(onSearchGroupData);
    } else {
      getAll();
    }
  }, [onSearchGroupData]);

  // For show all data in Data Table
  const getAll = async () => {
    try {
      const prams = {
        UserId: 0,
        GlobalSearch: "",
        SortColumn: null,
        IsDesc: true,
        PageNo: 1,
        PageSize: 50000,
        Status: true,
      };
      const token = await localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.pms_api_url}/group/getall`,
        prams,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: org_token,
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
          onSearchClear(GROUP);
        } else {
          const data = response.data.Message;
          setLoader(false);
          if (data === null) {
            Toast.error("Error", "Please try again later.");
          } else {
            Toast.error("Error", data);
          }
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // For Closing Modal
  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  // For Delete a data in Data table
  const handleDeleteRow = async () => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/group/delete`,
        {
          GroupId: selectedRowId,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: org_token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          Toast.success("Group has been deleted successfully!");
          getAll();
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error("Error", data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error("Error", data);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsDeleteOpen(false);
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

    // Match a action and open a drawer
    const handleActions = (actionType: string, actionId: any) => {
      setSelectedRowId(actionId);
      if (actionType.toLowerCase() === "edit") {
        onEdit(actionId);
      }
      if (actionType.toLowerCase() === "delete") {
        setIsDeleteOpen(true);
      }
    };

    const actionPermissions = actions.filter(
      (action: any) =>
        (action.toLowerCase() === "edit" && canEdit) ||
        (action.toLowerCase() === "delete" && canDelete)
    );

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
                  {actionPermissions.map((action: any, index: any) => (
                    <li
                      key={index}
                      onClick={() => {
                        handleActions(action, id);
                      }}
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
    ) : (
      <div className="w-5 h-5 relative opacity-50 pointer-events-none">
        <TableActionIcon />
      </div>
    );
  };

  // For Data_table map the all api data
  const groupData = data?.map(
    (e: any) =>
      new Object({
        Name: <div className="text-sm">{e.Name}</div>,
        user: (
          <div className="flex">
            <AvatarGroup show={3}>
              {e.GroupListUsers?.map((a: any) => (
                <Avatar key={a.Id} name={a.Name}></Avatar>
              ))}
            </AvatarGroup>
          </div>
        ),
        action: <Actions id={e.Id} actions={["Edit", "Delete"]} />,
      })
  );

  return (
    <>
      {canView ? (
        loader ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div
            className={`${data.length === 0 ? "!h-full" : "!h-[81vh] !w-full"}`}
          >
            <Toast position="top_center" />

            {data.length > 0 && (
              <DataTable columns={headers} data={groupData} sticky />
            )}

            {groupData.length === 0 && (
              <p className="flex justify-center items-center py-[17px] text-[14px]">
                Currently there is no record, you may
                <a
                  onClick={onOpen}
                  className=" text-primary underline cursor-pointer ml-1 mr-1"
                >
                  create Group
                </a>
                to continue
              </p>
            )}

            {/* Delete Modal  */}
            {isDeleteOpen && (
              <DeleteModal
                isOpen={isDeleteOpen}
                onClose={closeModal}
                title="Delete Group"
                actionText="Yes"
                onActionClick={handleDeleteRow}
              >
                Are you sure you want to delete group? <br /> If you delete
                group, you will permanently lose group and group related data.
              </DeleteModal>
            )}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center py-[17px] text-[14px] text-red-500">
          You don&apos;t have the privilege to view data.
        </div>
      )}
    </>
  );
}

export default Group;
