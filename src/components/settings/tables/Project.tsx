"use client";

import React, { useState, useEffect, useRef } from "react";
import { Table, Switch, Toast, DataTable, Loader } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
// Import Common Components
import TableActionIcon from "@/assets/icons/TableActionIcon";
import DeleteModal from "@/components/common/DeleteModal";
import SwitchModal from "@/components/common/SwitchModal";
import { PROJECT } from "./Constants/Tabname";

const Project = ({
  onOpen,
  onEdit,
  onDataFetch,
  getOrgDetailsFunction,
  canView,
  canEdit,
  canDelete,
  onSearchProjectData,
  onSearchClear,
  onHandleExport,
}: any) => {
  const headers = [
    { header: "Client Name", accessor: "ClientName", sortable: true },
    { header: "Project Name", accessor: "ProjectName", sortable: true },
    { header: "Sub-Project Name", accessor: "SubProjectName", sortable: true },
    { header: "Status", accessor: "IsActive", sortable: false },
  ];

  // const defaultVisibleHeaders = headers.slice(0, 5);
  // const [visibleHeaders, setVisibleHeaders] = useState(defaultVisibleHeaders);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleHeaderToggle = (header: any) => {
    const headerObj = headers.find((h) => h.header === header);
    if (!headerObj) return;

    // if (visibleHeaders.some((h) => h.header === header)) {
    //   setVisibleHeaders(visibleHeaders.filter((h) => h.header !== header));
    // } else {
    //   setVisibleHeaders([...visibleHeaders, headerObj]);
    // }
  };

  const columns = [
    ...headers,
    {
      header:
        // <ColumnFilterDropdown
        //   headers={headers.map((h) => h.header)}
        //   visibleHeaders={visibleHeaders.map((h) => h.header)}
        //   handleHeaderToggle={handleHeaderToggle}
        // />
        "Actions",
      accessor: "actions",
      sortable: false,
    },
  ];

  const handleActionValue = async (actionId: string, id: any) => {
    setSelectedRowId(id);
    if (actionId.toLowerCase() === "edit") {
      onEdit(id);
    }
    if (actionId.toLowerCase() === "delete") {
      setIsDeleteOpen(true);
    }
  };

  const handleOutsideClick = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/activeinactive`,
        {
          ProjectId: switchId,
          IsActive: !switchActive,
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
          Toast.success("Status Updated Successfully.");
          getData();
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

    const actionPermissions = actions.filter(
      (action: any) =>
        (action.toLowerCase() === "edit" && canEdit) ||
        (action.toLowerCase() === "delete" && canDelete)
    );

    return actionPermissions.length > 0 ? (
      <div
        ref={actionsRef}
        className={`w-5 h-5 cursor-pointer relative`}
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
                        handleActionValue(action, id);
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

  let tableData: any[] = data.map(
    (i: any) =>
      new Object({
        ...i,
        ClientName: <div className="text-sm">{i.ClientName}</div>,
        ProjectName: <div className="text-sm">{i.ProjectName}</div>,
        SubProjectName: <div className="text-sm">{i.SubProjectName}</div>,
        IsActive: <SwitchData id={i.ProjectId} IsActive={i.IsActive} />,
        actions: <Actions actions={["Edit", "Delete"]} id={i.ProjectId} />,
        details:
          i.SubProject.length > 0 ? (
            <div className="ml-6">
              <DataTable
                columns={columns}
                data={i.SubProject.map((child: any, index: number) => {
                  return {
                    ...child,
                    ClientName: (
                      <span className="w-[155px] text-sm">
                        {child.ClientName}
                      </span>
                    ),
                    ProjectName: (
                      <span className="w-[220px] text-sm">
                        {child.ProjectName}
                      </span>
                    ),
                    SubProjectName: (
                      <span className="w-[180px] -ml-20 text-sm">
                        {child.SubProjectName}
                      </span>
                    ),
                    IsActive: (
                      <span className="mr-[120px] -ml-1">
                        <SwitchData
                          id={child.SubProjectId}
                          IsActive={child.IsActive}
                        />
                      </span>
                    ),
                    // IsActive: <Switch checked={i.IsActive} />,
                    actions: (
                      <span className="mr-[137px]">
                        <Actions
                          actions={["Edit", "Delete"]}
                          id={child.SubProjectId}
                        />
                      </span>
                    ),
                  };
                })}
                noHeader
              />
            </div>
          ) : (
            ""
          ),
      })
  );

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getall`,
        {
          GlobalSearch: null,
          PageNo: 1,
          PageSize: 50000,
          ClientId: null,
          ProjectId: null,
          IsActive: null,
          SortColumn: null,
          IsDesc: true,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_Token,
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
          onSearchClear(PROJECT);
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        setLoader(false);
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchProjectData) {
      setData(onSearchProjectData);
    } else {
      getData();
    }
  }, [onSearchProjectData]);

  useEffect(() => {
    getData();

    const fetchData = async () => {
      const fetchedData = await getData();
      onDataFetch(() => fetchData());
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  // For deleting row
  const handleDeleteRow = async () => {
    if (selectedRowId) {
      const token = await localStorage.getItem("token");
      const org_Token = await localStorage.getItem("Org_Token");

      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/Project/Delete`,
          {
            ProjectId: selectedRowId,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_Token,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            Toast.success("Project has been deleted successfully!");
            getData();
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
      setIsDeleteOpen(false);
    }
  };

  return (
    <>
      {canView ? (
        loader ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div
            className={`${
              tableData.length === 0 ? "!h-full" : "!h-[440px] !w-full"
            }`}
          >
            {data.length > 0 && (
              <DataTable columns={columns} data={tableData} sticky expandable />
            )}

            {tableData.length === 0 && (
              <p className="flex justify-center items-center py-[17px] text-[14px]">
                Currently there is no record, you may
                <a
                  onClick={onOpen}
                  className=" text-primary underline cursor-pointer ml-1 mr-1"
                >
                  Create Project
                </a>
                to continue
              </p>
            )}

            {/* Delete Modal */}
            {isDeleteOpen && (
              <DeleteModal
                isOpen={isDeleteOpen}
                onClose={closeModal}
                title="Delete Project"
                actionText="Yes"
                onActionClick={handleDeleteRow}
              >
                <p>
                  Are you sure you want to delete Project?
                  <br /> If you delete the project, you will permanently lose
                  project and project related data.
                </p>
              </DeleteModal>
            )}

            {isOpenSwitchModal && (
              <SwitchModal
                isOpen={isOpenSwitchModal}
                onClose={closeSwitchModal}
                title={`${
                  switchActive === false ? "Active" : "InActive"
                } Project`}
                actionText="Yes"
                onActionClick={handleOutsideClick}
              >
                Are you sure you want to&nbsp;
                {switchActive === false ? "Active" : "InActive"} Project?
              </SwitchModal>
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
};

export default Project;
