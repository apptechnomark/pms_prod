import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import {
  getProjectDropdownData,
  getSubProcessDropdownData,
} from "@/utils/commonDropdownApiCall";
import {
  Delete,
  Assignee,
  Status,
  Duplicate,
  Recurring,
  Client,
  Project,
  Process,
  SubProcess,
  ReturnYear,
  Manager,
  DateReceived,
} from "./components/ActionBarComponents";
import {
  Edit,
  Priority,
  Comments,
} from "@/components/common/actionBar/components/ActionBarComponents";
import CustomActionBar from "@/components/common/actionBar/CustomActionBar";

const WorklogsActionBar = ({
  selectedRowsCount,
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
  getOverLay,
}: any) => {
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);

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

  function areAllValuesSame(arr: any[]) {
    return arr.every((value, index, array) => value === array[0]);
  }

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

  const submitWorkItem = async () => {
    const userId = localStorage.getItem("UserId");
    const { workItemIds, selctedWorkItemStatusIds } =
      handleAssigneeForSubmission(selectedRowsdata, userId);

    if (workItemIds.length === 0) {
      toast.warning("Only Assignee can submit the task.");
      return;
    }

    if (workItemIds.length < selectedRowsCount) {
      toast.warning("Only Assignee can submit the task.");
    }
    getOverLay(true);
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
        const data = response.data.Message;
        if (response.data.ResponseStatus === "Success") {
          toast.success("The task has been successfully submitted.");
          handleClearSelection();
          getWorkItemList();
          getOverLay(false);
        } else if (response.data.ResponseStatus === "Warning" && data) {
          toast.warning(data);
          handleClearSelection();
          getWorkItemList();
          getOverLay(false);
        } else {
          if (data) {
            toast.error(data);
          } else {
            toast.error("Please try again later.");
          }
          getOverLay(false);
          handleClearSelection();
        }
      } else {
        const data = response.data.Message;
        if (data) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
        getOverLay(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const SubmitButton = () => (
    <span className="pl-2 pr-2 border-t-0 cursor-pointer border-b-0 border-x-[1.5px] border-gray-300">
      <Button
        variant="outlined"
        className=" rounded-[4px] h-8 !text-[10px]"
        onClick={submitWorkItem}
      >
        Submit Task
      </Button>
    </span>
  );

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

  const ConditionalComponentWithoutConditions = ({
    Component,
    propsForActionBar,
    className,
    getOverLay,
  }: any) => (
    <span
      className={`pl-2 pr-2 cursor-pointer border-l-[1.5px] border-gray-300 ${className}`}
    >
      <Component {...propsForActionBar} getOverLay={getOverLay} />
    </span>
  );

  const ConditionalComponent = ({
    condition,
    className,
    Component,
    propsForActionBar,
    additionalBorderClass = "",
    getOverLay,
  }: any) =>
    condition ? (
      <span
        className={`pl-2 pr-2 cursor-pointer border-l-[1.5px] border-gray-300 ${additionalBorderClass} ${className}`}
      >
        <Component {...propsForActionBar} getOverLay={getOverLay} />
      </span>
    ) : null;

  return (
    <div>
      <CustomActionBar {...propsForActionBar}>
        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
            selectedRowsCount === 1
          }
          className="text-slatyGrey"
          Component={Edit}
          propsForActionBar={{ onEdit: onEdit, selectedRowId: selectedRowId }}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Delete", "WorkLogs") &&
            !isUnassigneeClicked
          }
          Component={Delete}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponentWithoutConditions
          Component={Priority}
          propsForActionBar={{
            selectedRowIds: selectedRowIds,
            selectedRowStatusId: selectedRowStatusId,
            selectedRowsCount: selectedRowsCount,
            getData: getWorkItemList,
          }}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            areAllValuesSame(selectedRowClientId) &&
            areAllValuesSame(selectedRowWorkTypeId)
          }
          Component={Assignee}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponentWithoutConditions
          Component={Status}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={!isUnassigneeClicked}
          Component={Duplicate}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Reccuring", "View", "WorkLogs") &&
            selectedRowsCount === 1
          }
          Component={Recurring}
          propsForActionBar={propsForActionBar}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Comment", "View", "WorkLogs") &&
            selectedRowsCount === 1 &&
            !isUnassigneeClicked
          }
          Component={Comments}
          propsForActionBar={{
            onComment: onComment,
            selectedRowId: selectedRowId,
          }}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
              .filter((j: any) => j !== undefined).length <= 0
          }
          Component={Client}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
          }
          Component={Project}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
          }
          Component={Process}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
            ).length === 1
          }
          Component={SubProcess}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
              .filter((j: any) => j !== undefined).length <= 0
          }
          Component={ReturnYear}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
              .filter((j: any) => j !== undefined).length <= 0
          }
          Component={Manager}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
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
              .filter((j: any) => j !== undefined).length <= 0
          }
          Component={DateReceived}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <SubmitButton />
      </CustomActionBar>
    </div>
  );
};

export default WorklogsActionBar;
