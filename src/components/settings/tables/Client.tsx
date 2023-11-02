"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Toast, DataTable, Switch, Loader } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
// Import Common Components
import DeleteModal from "@/components/common/DeleteModal";
// Import Icons
import TableActionIcon from "@/assets/icons/TableActionIcon";
import SwitchModal from "@/components/common/SwitchModal";
import ClientProcessDrawer from "../drawer/ClientProcessDrawer";
import DrawerOverlay from "../drawer/DrawerOverlay";
import ClientFieldsDrawer from "../drawer/ClientFieldDrawer";

function Client({
  onOpen,
  onEdit,
  onDataFetch,
  getOrgDetailsFunction,
  canView,
  canEdit,
  canDelete,
  canProcess,
  onSearchClientData,
}: any) {
  const headers = [
    {
      header: "Client Name",
      accessor: "Name",
      sortable: true,
      colStyle: "w-[15%]",
    },
    {
      header: "Email ID",
      accessor: "Email",
      sortable: true,
      colStyle: "w-[22%]",
    },
    { header: "Address", accessor: "Address", sortable: true },
    {
      header: "Mobile",
      accessor: "ContactNo",
      sortable: true,
      colStyle: "w-[15%]",
    },
    {
      header: "Status",
      accessor: "IsActive",
      sortable: false,
      colStyle: "w-[10%]",
    },
    {
      header: "Actions",
      accessor: "actions",
      sortable: false,
      colStyle: "w-[8%]",
    },
  ];

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [data, setData] = useState([]);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [openProcessDrawer, setOpenProcessDrawer] = useState(false);
  const [openFieldsDrawer, setOpenFieldsDrawer] = useState(false);
  const [loader, setLoader] = useState(true);

  const handleOpenProcessDrawer = () => {
    setOpenProcessDrawer(true);
  };

  const handleCloseProcessDrawer = () => {
    setOpenProcessDrawer(false);
  };

  const handleCloseFieldsDrawer = () => {
    setOpenFieldsDrawer(false);
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchClientData) {
      setData(onSearchClientData);
    } else {
      getData();
    }
  }, [onSearchClientData]);

  // for getting all data
  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/GetAll`,
        {
          GlobalSearch: "",
          SortColumn: null,
          IsDesc: false,
          PageNo: 1,
          PageSize: 50000,
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
          setLoader(false);
          setData(response.data.ResponseData.List);
          getOrgDetailsFunction();
        } else {
          setLoader(false);
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
          Toast.error("Login failed. Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // for deleting row
  const handleDeleteRow = async () => {
    if (selectedRowId) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/client/delete`,
          {
            clientId: selectedRowId,
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
            Toast.success("Client has been deleted successfully!");
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
      setSelectedRowId(null);
      setIsDeleteOpen(false);
    }
  };

  // for toggle (Active/InActive) Client
  const handleToggleClient = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/activeinactive`,
        {
          clientId: switchId,
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

  const closeSwitchModal = () => {
    setIsOpenSwitchModal(false);
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

    // Table Action Modal
    useEffect(() => {
      window.addEventListener("click", handleOutsideClick);
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }, []);

    const actionPermissions = actions.filter(
      (action: any) =>
        (action.toLowerCase() === "edit" && canEdit) ||
        (action.toLowerCase() === "delete" && canDelete) ||
        (action.toLowerCase() === "process" && canProcess) ||
        action.toLowerCase() === "fields"
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
    ) : (
      <div className="w-5 h-5 relative opacity-50 pointer-events-none">
        <TableActionIcon />
      </div>
    );
  };

  // Setting Table Data
  const table_Data = data.map(
    (d: any) =>
      new Object({
        ...d,
        Name: <div className="text-sm">{d.Name}</div>,
        Email: <div className="text-sm">{d.Email}</div>,
        Address: <div className="text-sm">{d.Address}</div>,
        ContactNo: <div className="text-sm">{d.ContactNo}</div>,
        IsActive: <SwitchData id={d.Id} IsActive={d.IsActive} />,
        actions: (
          <Actions
            actions={["Edit", "Process", "Fields", "Delete"]}
            id={d.Id}
          />
        ),
      })
  );

  // For Closing Delete Modal
  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  // Getting Clicked Action Value
  const handleActionValue = async (actionId: string, id: any) => {
    setSelectedRowId(id);
    if (actionId.toLowerCase() === "edit") {
      onEdit(id);
    }
    if (actionId.toLowerCase() === "delete") {
      setIsDeleteOpen(true);
    }
    if (actionId.toLowerCase() === "process") {
      setOpenProcessDrawer(true);
    }
    if (actionId.toLowerCase() === "fields") {
      setOpenFieldsDrawer(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const Org_Token = await localStorage.getItem("Org_Token");
      if (Org_Token !== null) {
        getData();
        onDataFetch(fetchData);
      } else {
        setTimeout(fetchData, 1000);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {canView ? (
        loader ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div>
            <Toast position="top_center" />
            {data.length > 0 && (
              <div className="h-[81vh]">
                <DataTable columns={headers} data={table_Data} sticky />
              </div>
            )}
            {data.length <= 0 && (
              <p className="flex justify-center items-center py-[17px] text-[14px]">
                Currently there is no record, you may
                <a
                  onClick={onOpen}
                  className="text-primary underline cursor-pointer ml-1 mr-1"
                >
                  Create Client
                </a>
                to continue
              </p>
            )}

            {/* Delete Modal */}
            {isDeleteOpen && (
              <DeleteModal
                isOpen={isDeleteOpen}
                onClose={closeModal}
                title="Delete Client"
                actionText="Yes"
                onActionClick={handleDeleteRow}
              >
                Are you sure you want to delete client? <br /> If you delete
                client, you will permanently lose client and client related
                data.
              </DeleteModal>
            )}

            {isOpenSwitchModal && (
              <SwitchModal
                isOpen={isOpenSwitchModal}
                onClose={closeSwitchModal}
                title={`${
                  switchActive === false ? "Active" : "InActive"
                } Client`}
                actionText="Yes"
                onActionClick={handleToggleClient}
              >
                Are you sure you want to&nbsp;
                {switchActive === false ? "Active" : "InActive"} Client?
              </SwitchModal>
            )}

            <ClientProcessDrawer
              onOpen={openProcessDrawer}
              onClose={handleCloseProcessDrawer}
              selectedRowId={selectedRowId}
              onDataFetch={getData}
            />

            <ClientFieldsDrawer
              onOpen={openFieldsDrawer}
              onClose={handleCloseFieldsDrawer}
              selectedRowId={selectedRowId}
              onDataFetch={getData}
            />

            <DrawerOverlay
              isOpen={openProcessDrawer || openFieldsDrawer}
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
}

export default Client;
