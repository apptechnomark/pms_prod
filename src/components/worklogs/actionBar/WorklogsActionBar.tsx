import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Card } from "@mui/material";
import Minus from "@/assets/icons/worklogs/Minus";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import {
  getProjectDropdownData,
  getSubProcessDropdownData,
} from "@/utils/commonDropdownApiCall";
import {
  Edit,
  Delete,
  Priority,
  Assignee,
  Status,
  Duplicate,
  Recurring,
  Comments,
  Client,
  Project,
  Process,
  SubProcess,
  ReturnYear,
  Manager,
  DateReceived,
} from "./components/ActionBarComponents";

const WorklogsActionBar = ({
  selectedRowsCount,
  selectedRows,
  selectedRowStatusId,
  selectedRowId,
  selectedRowsdata,
  selectedRowClientId,
  selectedRowWorkTypeId,
  selectedRowStatusName,
  selectedRowIds,
  onEdit,
  handleClearSelection,
  onRecurring,
  onComment,
  workItemData,
  getWorkItemList,
  isUnassigneeClicked,
}: any) => {
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        handleClearSelection();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // API for process Data
  const getProcessData = async (ids: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/getclientcommonprocess`,
        { ClientIds: ids },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setProcessDropdownData(response.data.ResponseData);
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getProjectData = async (clientName: any) => {
      clientName > 0 &&
        setProjectDropdownData(await getProjectDropdownData(clientName));
    };

    if (
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProjectId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length > 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProjectId !== 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      Array.from(new Set(selectedRowClientId)).length === 1
    ) {
      getProjectData(Array.from(new Set(selectedRowClientId))[0]);
    }

    if (
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProcessId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length > 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProcessId !== 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0
    ) {
      getProcessData(selectedRowClientId);
    }

    const getSubProcessData = async (clientName: any, processId: any) => {
      clientName > 0 &&
        setSubProcessDropdownData(
          await getSubProcessDropdownData(clientName, processId)
        );
    };
    if (
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProcessId > 0 &&
          i.SubProcessId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length > 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId === 0 &&
          i.ProcessId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProcessId > 0 &&
          i.SubProcessId !== 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      Array.from(new Set(selectedRowClientId)).length === 1 &&
      Array.from(
        new Set(
          workItemData
            .map(
              (i: any) => selectedRowIds.includes(i.WorkitemId) && i.ProcessId
            )
            .filter((j: any) => j !== false)
        )
      ).length === 1
    ) {
      getSubProcessData(
        Array.from(new Set(selectedRowClientId))[0],
        Array.from(
          new Set(
            workItemData
              .map(
                (i: any) => selectedRowIds.includes(i.WorkitemId) && i.ProcessId
              )
              .filter((j: any) => j !== false)
          )
        )[0]
      );
    }
  }, [selectedRowClientId]);

  // Function for checking that All vlaues in the arrar are same or not
  function areAllValuesSame(arr: any[]) {
    return arr.every((value, index, array) => value === array[0]);
  }

  // function to fetch the only assignee which has logged in from the all data
  const handleAssigneeForSubmission = (arr: any[], userId: string | null) => {
    const workItemIds: number[] = [];
    const selctedWorkItemStatusIds: number[] = [];

    for (const item of arr) {
      if (item.AssignedToId === parseInt(userId || "", 10)) {
        workItemIds.push(item.WorkitemId);
        selctedWorkItemStatusIds.push(item.StatusId);
      }
    }
    return { workItemIds, selctedWorkItemStatusIds };
  };

  // Submit WorkItem API
  const submitWorkItem = async () => {
    const userId = localStorage.getItem("UserId");
    const { workItemIds, selctedWorkItemStatusIds } =
      handleAssigneeForSubmission(selectedRowsdata, userId);

    if (workItemIds.length === 0) {
      toast.warning("Only Assignee can submit the task.");
      return;
    }

    const hasInProgressOrStopStatus =
      selctedWorkItemStatusIds.includes(2) ||
      selctedWorkItemStatusIds.includes(4);

    if (!hasInProgressOrStopStatus) {
      toast.warning(
        "Tasks can only be submitted if they are currently in the 'In Progress' or 'Stop' status."
      );
      return;
    }

    if (workItemIds.length < selectedRowsCount) {
      toast.warning("Only Assignee can submit the task.");
    }

    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/saveworkitemsubmission`,
        {
          workitemIds: workItemIds,
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
          if (
            (selectedRowStatusName.length > 0 &&
              selectedRowStatusName.includes("In Progress")) ||
            selectedRowStatusId.includes(2)
          ) {
            toast.success("Task has been Partially Submitted.");
          } else {
            toast.success("The task has been successfully submitted.");
          }

          handleClearSelection();
          getWorkItemList();
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // All props to pass in action Bar components
  const propsForActionBar = {
    onEdit,
    onRecurring,
    onComment,
    workItemData,
    selectedRowId,
    selectedRowIds,
    selectedRowStatusId,
    handleClearSelection,
    getWorkItemList,
    selectedRowsCount,
    selectedRowClientId,
    selectedRowWorkTypeId,
    areAllValuesSame,
    projectDropdownData,
    processDropdownData,
    subProcessDropdownData,
  };

  return (
    <div>
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-start mx-8">
          <Card
            className={`rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg  ${
              selectedRowsCount === 1 ? "w-[80%]" : "w-[71%]"
            } bottom-12 -translate-y-1/2`}
          >
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[25%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div
                className={`flex flex-row z-10 h-8 justify-center ${
                  selectedRowsCount === 1 ? "w-[100%]" : "w-[80%]"
                }`}
              >
                {selectedRowsCount === 1 &&
                  !selectedRowStatusId.some((statusId: number) =>
                    [4, 7, 8, 9, 13].includes(statusId)
                  ) && (
                    <span className="pl-2 pr-2 pt-1 text-slatyGrey cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Edit {...propsForActionBar} />
                    </span>
                  )}

                {hasPermissionWorklog("Task/SubTask", "Delete", "WorkLogs") &&
                  !isUnassigneeClicked && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Delete {...propsForActionBar} />
                    </span>
                  )}

                <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                  <Priority {...propsForActionBar} />
                </span>

                {/* if the selected client Ids and worktype ids are same then only the Assignee icon will show */}
                {areAllValuesSame(selectedRowClientId) &&
                  areAllValuesSame(selectedRowWorkTypeId) && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Assignee {...propsForActionBar} />
                    </span>
                  )}

                <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                  <Status {...propsForActionBar} />
                </span>

                {!isUnassigneeClicked && (
                  <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                    <Duplicate {...propsForActionBar} />
                  </span>
                )}

                {hasPermissionWorklog("Reccuring", "View", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Recurring {...propsForActionBar} />
                    </span>
                  )}

                {hasPermissionWorklog("Comment", "View", "WorkLogs") &&
                  selectedRowsCount === 1 &&
                  !isUnassigneeClicked && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Comments {...propsForActionBar} />
                    </span>
                  )}

                {/* Change client */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ClientId === 0 || i.ClientId === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) && i.ClientId > 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Client {...propsForActionBar} />
                    </span>
                  )}

                {/* Change Project */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProjectId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProjectId !== 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  Array.from(new Set(selectedRowClientId)).length === 1 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Project {...propsForActionBar} />
                    </span>
                  )}

                {/* Change Process */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProcessId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProcessId !== 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Process {...propsForActionBar} />
                    </span>
                  )}

                {/* Change Sub-Process */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProcessId > 0 &&
                      i.SubProcessId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId === 0 &&
                      i.ProcessId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProcessId > 0 &&
                      i.SubProcessId !== 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  Array.from(
                    new Set(
                      workItemData
                        .map(
                          (i: any) =>
                            selectedRowIds.includes(i.WorkitemId) && i.ProcessId
                        )
                        .filter((j: any) => j !== false)
                    )
                  ).length === 1 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <SubProcess {...propsForActionBar} />
                    </span>
                  )}

                {/* Change Return Year */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReturnYear === 0 || i.ReturnYear === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReturnYear > 0 || i.ReturnYear !== null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <ReturnYear {...propsForActionBar} />
                    </span>
                  )}

                {/* Change manager */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ManagerId === 0 || i.ManagerId === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ManagerId > 0 || i.ManagerId !== null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <Manager {...propsForActionBar} />
                    </span>
                  )}

                {/* Change date received */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReceiverDate?.length === 0 || i.ReceiverDate === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReceiverDate?.length > 0 || i.ReceiverDate !== null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <span className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300">
                      <DateReceived {...propsForActionBar} />
                    </span>
                  )}

                {!isUnassigneeClicked && (
                  <span className="pl-2 pr-2 border-t-0 cursor-pointer border-b-0 border-l-[1.5px] border-r-[1.5px] border-gray-300">
                    <Button
                      variant="outlined"
                      className=" rounded-[4px] h-8 !text-[10px]"
                      onClick={submitWorkItem}
                    >
                      Submit Task
                    </Button>
                  </span>
                )}
              </div>

              <div className="flex right-0 justify-end pr-3 pt-1 w-[40%]">
                <span className="text-gray-400 italic text-[14px] pl-2">
                  shift+click to select, esc to deselect all
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorklogsActionBar;
