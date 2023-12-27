import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import {
  Accept,
  AcceptWithNotes,
  Status,
  Assignee,
  Reviewer,
  ErrorLogs,
  EditTime,
} from "./components/ActionBarComponents";
import CustomActionBar from "@/components/common/actionBar/CustomActionBar";

import {
  Edit,
  Priority,
  Comments,
} from "@/components/common/actionBar/components/ActionBarComponents";

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

const ApprovalsActionBar = ({
  selectedRowsCount,
  selectedRowStatusId,
  selectedRowIds,
  selectedWorkItemIds,
  selectedRowClientId,
  selectedRowWorkTypeId,
  settingSelectedId,
  id,
  workitemId,
  onEdit,
  onComment,
  reviewList,
  getReviewList,
  getInitialPagePerRows,
  handleClearSelection,
  getOverLay,
}: any) => {
  const isReviewer = reviewList
    .filter(
      (i: any) =>
        selectedWorkItemIds.includes(i.WorkitemId) &&
        i.ReviewerId == localStorage.getItem("UserId")
    )
    .map((i: any) => i.WorkitemId);

  const isNotReviewer = reviewList
    .filter(
      (i: any) =>
        selectedWorkItemIds.includes(i.WorkitemId) &&
        i.ReviewerId != localStorage.getItem("UserId")
    )
    .map((i: any) => i.WorkitemId);

  const acceptWorkitem = async (note: string, id: number[]) => {
    getOverLay(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/acceptworkitem`,
        {
          workitemSubmissionIds: id,
          comment: note ? note : null,
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
          toast.success("Selected tasks have been successfully approved.");
          handleClearSelection();
          getReviewList();
          getInitialPagePerRows();
          getOverLay(false);
        } else if (response.data.ResponseStatus === "Warning" && !!data) {
          toast.warning(data);
          handleClearSelection();
          getReviewList();
          getOverLay(false);
        } else {
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
          handleClearSelection();
          getOverLay(false);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
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

  const propsForActionBar = {
    onEdit,
    workitemId,
    id,
    selectedRowIds,
    acceptWorkitem,
    selectedWorkItemIds,
    selectedRowStatusId,
    selectedRowsCount,
    handleClearSelection,
    getReviewList,
    reviewList,
    selectedRowClientId,
    selectedRowWorkTypeId,
    onComment,
    settingSelectedId,
  };

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
          propsForActionBar={{
            onEdit: onEdit,
            selectedRowId: workitemId,
            id: id,
          }}
        />
        <ConditionalComponent
          condition={
            hasPermissionWorklog("", "Approve", "Approvals") &&
            isNotReviewer.length === 0 &&
            isReviewer.length > 0
          }
          Component={Accept}
          propsForActionBar={propsForActionBar}
        />
        <ConditionalComponent
          condition={
            hasPermissionWorklog("", "Approve", "Approvals") &&
            selectedRowsCount === 1 &&
            isNotReviewer.length === 0 &&
            isReviewer.length > 0
          }
          Component={AcceptWithNotes}
          propsForActionBar={propsForActionBar}
        />

        <ConditionalComponentWithoutConditions
          Component={Priority}
          propsForActionBar={{
            selectedRowIds: selectedWorkItemIds,
            selectedRowStatusId: selectedRowStatusId,
            selectedRowsCount: selectedRowsCount,
            getData: getReviewList,
          }}
          getOverLay={getOverLay}
        />

        <ConditionalComponentWithoutConditions
          Component={Status}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />
        <ConditionalComponentWithoutConditions
          Component={Assignee}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />
        <ConditionalComponentWithoutConditions
          Component={Reviewer}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("Comment", "View", "WorkLogs") &&
            selectedRowsCount === 1 &&
            isNotReviewer.length === 0 &&
            isReviewer.length > 0
          }
          className="pt-1"
          Component={Comments}
          propsForActionBar={{
            onComment: onComment,
            selectedRowId: workitemId,
          }}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("ErrorLog", "View", "WorkLogs") &&
            selectedRowsCount === 1 &&
            isNotReviewer.length === 0 &&
            isReviewer.length > 0
          }
          className=""
          Component={ErrorLogs}
          propsForActionBar={propsForActionBar}
        />

        <ConditionalComponent
          condition={
            hasPermissionWorklog("", "Approve", "Approvals") &&
            selectedRowsCount === 1 &&
            isNotReviewer.length === 0 &&
            isReviewer.length > 0
          }
          className=""
          Component={EditTime}
          propsForActionBar={propsForActionBar}
          getOverLay={getOverLay}
        />
      </CustomActionBar>
    </div>
  );
};

export default ApprovalsActionBar;
