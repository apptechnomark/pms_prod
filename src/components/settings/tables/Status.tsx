import React, { useEffect, useRef, useState } from "react";
import { Toast, DataTable, Loader } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import DeleteModal from "@/components/common/DeleteModal";
import { STATUS } from "./Constants/Tabname";

function Status({
  onOpen,
  onEdit,
  onHandleOrgData,
  onDataFetch,
  getOrgDetailsFunction,
  canView,
  canEdit,
  canDelete,
  onSearchStatusData,
  onSearchClear,
  onHandleExport,
}: any) {
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getStatusList();
      onDataFetch(() => fetchData());
    };

    fetchData();

    getStatusList();
  }, []);
  // For Closing Modal
  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchStatusData) {
      setStatusList(onSearchStatusData);
    } else {
      getStatusList();
    }
  }, [onSearchStatusData]);

  const getStatusList = async () => {
    try {
      const headers = {
        Authorization: `${token}`,
        org_token: org_token,
      };
      const param = {
        pageNo: 1,
        pageSize: 50000,
        SortColumn: "",
        IsDec: true,
        globalFilter: null,
        IsDefault: null,
        Type: "",
        Export: false,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/status/GetAll`,
        param,
        { headers: headers }
      );
      if (response.status === 200) {
        onHandleExport(
          response.data.ResponseData.List.length > 0 ? true : false
        );
        setLoader(false);
        setStatusList(response.data.ResponseData.List);
        getOrgDetailsFunction();
        onSearchClear(STATUS);
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Error", "Please try again later.");
        } else {
          Toast.error("Error", data);
        }
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      setLoading(false);
      setStatusList([]);
    }
  };

  const headers = [
    { header: "Status Name", accessor: "Name", sortable: true },
    { header: "Color", accessor: "Color", sortable: false },
    { header: "Action", accessor: "action", sortable: false },
  ];

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
      // if (actionType.toLowerCase() === "delete") {
      //   setIsDeleteOpen(true);
      // }
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
                  {actionPermissions.map(
                    (action: any, index: any) =>
                      ((action.toLowerCase() === "edit" && canEdit) ||
                        (action.toLowerCase() === "delete" && canDelete)) && (
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

  const StatusData = statusList?.map(
    (e: any) =>
      new Object({
        Name: <div className="text-sm">{e.Name}</div>,
        Color: (
          <div className="flex">
            <div
              style={{
                backgroundColor: e.ColorCode,
                width: "30px",
                height: "30px",
                border: `2px solid ${e.ColorCode}`,
                borderRadius: "5px",
                margin: "10px 10px 10px 10px",
              }}
            ></div>
          </div>
        ),
        action: <Actions id={e.StatusId} actions={["Edit"]} />,
      })
  );

  // For Delete a data in Data table
  const handleDeleteRow = async () => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/status/delete`,
        {
          statusId: selectedRowId,
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
          Toast.success("Status has been deleted successfully!");
          getStatusList();
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
              statusList.length === 0 ? "!h-full" : "!h-[81vh] !w-full"
            }`}
          >
            {statusList.length > 0 ? (
              <>
                <DataTable columns={headers} data={StatusData} sticky />
              </>
            ) : (
              ""
            )}
            {statusList.length === 0 && (
              <>
                <p className="flex justify-center items-center py-[17px] text-[14px]">
                  Currently there is no record, you may
                  <a
                    onClick={onOpen}
                    className=" text-primary underline cursor-pointer ml-1 mr-1"
                  >
                    Create Status
                  </a>
                  to continue
                </p>
              </>
            )}
            {/* Delete Modal  */}
            {isDeleteOpen && (
              <DeleteModal
                isOpen={isDeleteOpen}
                onClose={closeModal}
                title="Delete Status"
                actionText="Yes"
                onActionClick={handleDeleteRow}
              >
                Are you sure you want to delete status? <br /> If you delete
                status, you will permanently lose status and status related
                data.
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
export default Status;
