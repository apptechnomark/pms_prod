/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import TaskIcon from "@/assets/icons/TaskIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import BellIcon from "@/assets/icons/BellIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import CheckListIcon from "../../assets/icons/CheckListIcon";
import CommentsIcon from "../../assets/icons/CommentsIcon";
import SendIcon from "../../assets/icons/worklogs/SendIcon";
import AddIcon from "../../assets/icons/worklogs/AddIcon";
import RemoveIcon from "../../assets/icons/worklogs/RemoveIcon";
import { toast } from "react-toastify";
import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Download, Save } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  extractText,
  getTimeDifference,
  getYears,
  hasPermissionWorklog,
  isWeekend,
} from "@/utils/commonFunction";
import ImageUploader from "../common/ImageUploader";
import { Mention, MentionsInput } from "react-mentions";
import mentionsInputStyle from "../../utils/worklog/mentionsInputStyle";
import EditIcon from "@mui/icons-material/Edit";
import {
  days,
  getAssigneeDropdownData,
  getCCDropdownData,
  getClientDropdownData,
  getCommentUserDropdownData,
  getManagerDropdownData,
  getProcessDropdownData,
  getProjectDropdownData,
  getReviewerDropdownData,
  getStatusDropdownData,
  getSubProcessDropdownData,
  getTypeOfWorkDropdownData,
  hours,
  months,
} from "@/utils/commonDropdownApiCall";
import { getFileFromBlob } from "@/utils/downloadFile";
import { ColorToolTip, getMuiTheme } from "@/utils/datatable/CommonStyle";
import { callAPI } from "@/utils/API/callAPI";
import { generateCommonBodyRender } from "@/utils/datatable/CommonFunction";
import MUIDataTable from "mui-datatables";
import OverLay from "../common/OverLay";

const EditDrawer = ({
  onOpen,
  onClose,
  onEdit,
  onDataFetch,
  onHasId,
  hasIconIndex,
  onComment,
  onErrorLog,
  onManualTime,
}: any) => {
  const router = useRouter();
  const yearDropdown = getYears();
  const [userId, setUserId] = useState(0);
  const [isLoadingWorklog, setIsLoadingWorklog] = useState(false);
  const [inputTypeReview, setInputTypeReview] = useState("text");
  const [inputTypePreperation, setInputTypePreperation] = useState("text");
  const [editData, setEditData] = useState<any>([]);
  const [isCreatedByClient, setIsCreatedByClient] = useState(false);
  const [isManual, setIsManual] = useState(null);
  const [isPartiallySubmitted, setIsPartiallySubmitted] =
    useState<boolean>(false);

  const toggleColor = (index: any) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(
        selectedDays.filter((dayIndex: any) => dayIndex !== index)
      );
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  let Task = [
    hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "Task",
    hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "Sub-Task",
    hasPermissionWorklog("CheckList", "View", "WorkLogs") && "Checklist",
    hasPermissionWorklog("Comment", "View", "WorkLogs") && "Comments",
    hasPermissionWorklog("Reccuring", "View", "WorkLogs") && "Recurring",
    (isManual === true || isManual === null) && "Manual Time",
    isPartiallySubmitted && "Reviewer Manual Time",
    hasPermissionWorklog("Reminder", "View", "WorkLogs") && "Reminder",
    hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && "Error Logs",
    "Reviewer's Note",
    "Logs",
  ];

  useEffect(() => {
    scrollToPanel(
      (isManual === null || isManual === true) && isPartiallySubmitted
        ? 8
        : isManual === null || isManual === true
        ? 7
        : isPartiallySubmitted
        ? 7
        : 0
    );
    if (hasIconIndex > 0) {
      setIsPartiallySubmitted(true);
      scrollToPanel(isManual === null || isManual === true ? 6 : 5);
    }
    onComment === true ? scrollToPanel(3) : scrollToPanel(0);
    onErrorLog === true
      ? scrollToPanel(
          isManual === null || isManual === true
            ? 8
            : isPartiallySubmitted
            ? 8
            : 7
        )
      : scrollToPanel(0);
    onManualTime === true
      ? scrollToPanel(isManual === null || isManual === true ? 6 : 5)
      : scrollToPanel(0);
  }, [onEdit, onComment, onErrorLog, onManualTime]);

  const handleTabClick = (index: number) => {
    scrollToPanel(index);
  };

  const scrollToPanel = (index: number) => {
    const panel = document.getElementById(`tabpanel-${index}`);
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMultiSelect = (e: React.SyntheticEvent, value: any) => {
    if (value !== undefined) {
      setReminderNotification(value);
    } else {
      setReminderNotification([]);
    }
  };

  const handleMultiSelectMonth = (e: React.SyntheticEvent, value: any) => {
    if (value !== undefined) {
      setRecurringMonth(value);
    } else {
      setRecurringMonth([]);
    }
  };

  const validateField = (value: any) => {
    if (
      value === 0 ||
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return true;
    }
    return false;
  };

  // Task
  const [taskApprovalsDrawer, setTaskApprovalsDrawer] = useState(true);
  const [clientApprovalsDropdownData, setClientApprovalsDropdownData] =
    useState([]);
  const [clientNameApprovals, setClientNameApprovals] = useState<any>(0);
  const [clientNameApprovalsErr, setClientNameApprovalsErr] = useState(false);
  const [workTypeApprovalsDropdownData, setWorkTypeApprovalsDropdownData] =
    useState([]);
  const [typeOfWorkApprovals, setTypeOfWorkApprovals] = useState<
    string | number
  >(0);
  const [typeOfWorkApprovalsErr, setTypeOfWorkApprovalsErr] = useState(false);
  const [projectApprovalsDropdownData, setProjectApprovalsDropdownData] =
    useState([]);
  const [projectNameApprovals, setProjectNameApprovals] = useState<any>(0);
  const [projectNameApprovalsErr, setProjectNameApprovalsErr] = useState(false);
  const [processApprovalsDropdownData, setProcessApprovalsDropdownData] =
    useState([]);
  const [processNameApprovals, setProcessNameApprovals] = useState<any>(0);
  const [processNameApprovalsErr, setProcessNameApprovalsErr] = useState(false);
  const [subProcessApprovalsDropdownData, setSubProcessApprovalsDropdownData] =
    useState([]);
  const [subProcessApprovals, setSubProcessApprovals] = useState<any>(0);
  const [subProcessApprovalsErr, setSubProcessApprovalsErr] = useState(false);
  const [statusApprovalsDropdownData, setStatusApprovalsDropdownData] =
    useState<any>([]);
  const [statusApprovalsDropdownDataUse, setStatusApprovalsDropdownDataUse] =
    useState<any>([]);
  const [statusApprovals, setStatusApprovals] = useState<any>(0);
  const [statusApprovalsErr, setStatusApprovalsErr] = useState(false);
  const [assigneeApprovalsDropdownData, setAssigneeApprovalsDropdownData] =
    useState<any>([]);
  const [assigneeApprovals, setAssigneeApprovals] = useState<any>([]);
  const [assigneeApprovalsErr, setAssigneeApprovalsErr] = useState(false);
  const [reviewerApprovalsDropdownData, setReviewerApprovalsDropdownData] =
    useState([]);
  const [reviewerApprovals, setReviewerApprovals] = useState<any>([]);
  const [reviewerApprovalsErr, setReviewerApprovalsErr] = useState(false);
  const [managerApprovalsDropdownData, setManagerApprovalsDropdownData] =
    useState<any>([]);
  const [managerApprovals, setManagerApprovals] = useState<any>(0);
  const [managerApprovalsErr, setManagerApprovalsErr] = useState(false);
  const [clientTaskNameApprovals, setClientTaskNameApprovals] =
    useState<string>("");
  const [clientTaskNameApprovalsErr, setClientTaskNameApprovalsErr] =
    useState(false);
  const [descriptionApprovals, setDescriptionApprovals] = useState<string>("");
  const [priorityApprovals, setPriorityApprovals] = useState<string | number>(
    0
  );
  const [quantityApprovals, setQuantityApprovals] = useState<any>(1);
  const [quantityApprovalsErr, setQuantityApprovalsErr] = useState(false);
  const [receiverDateApprovals, setReceiverDateApprovals] = useState<any>("");
  const [receiverDateApprovalsErr, setReceiverDateApprovalsErr] =
    useState(false);
  const [dueDateApprovals, setDueDateApprovals] = useState<any>("");
  const [allInfoDateApprovals, setAllInfoDateApprovals] = useState<any>("");
  const [dateOfReviewApprovals, setDateOfReviewApprovals] =
    useState<string>("");
  const [dateOfPreperationApprovals, setDateOfPreperationApprovals] =
    useState<string>("");
  const [assigneeDisableApprovals, setAssigneeDisableApprovals] =
    useState<any>(true);
  const [estTimeDataApprovals, setEstTimeDataApprovals] = useState([]);
  const [returnYearApprovals, setReturnYearApprovals] = useState<
    string | number
  >(0);
  const [returnYearApprovalsErr, setReturnYearApprovalsErr] = useState(false);
  const [noOfPagesApprovals, setNoOfPagesApprovals] = useState<any>(0);
  const [checklistWorkpaperApprovals, setChecklistWorkpaperApprovals] =
    useState<any>(0);
  const [checklistWorkpaperApprovalsErr, setChecklistWorkpaperApprovalsErr] =
    useState(false);

  // Sub-Task
  const [subTaskDrawer, setSubTaskDrawer] = useState(true);

  // Recurring
  const [recurringDrawer, setRecurringDrawer] = useState(true);

  // ManualTime
  const [manualTimeDrawer, setManualTimeDrawer] = useState(true);

  // Reminder
  const [reminderDrawer, setReminderDrawer] = useState(true);

  // Checklist
  const [checkListDrawer, setCheckListDrawer] = useState(true);

  // Comments
  const [commentsDrawer, setCommentsDrawer] = useState(true);
  const [cCDropdownData, setCCDropdownData] = useState<any>([]);

  // Reviewer's Note
  const [reasonDrawer, setReasonDrawer] = useState(true);

  // ErrorLogs
  const [reviewerErrDrawer, setReviewerErrDrawer] = useState(true);

  const [selectedDays, setSelectedDays] = useState<any>([]);
  const [manualSwitch, setManualSwitch] = useState(false);
  const [manualSubmitDisable, setManualSubmitDisable] = useState(true);
  const [inputDateErrors, setInputDateErrors] = useState([false]);
  const [startTimeErrors, setStartTimeErrors] = useState([false]);
  const [endTimeErrors, setEndTimeErrors] = useState([false]);
  const [manualDescErrors, setManualDescErrors] = useState([false]);
  const [inputTypeDate, setInputTypeDate] = useState(["text"]);
  const [inputTypeStartTime, setInputTypeStartTime] = useState(["text"]);
  const [inputTypeEndTime, setInputTypeEndTime] = useState(["text"]);

  // Comments
  const [commentSelect, setCommentSelect] = useState<number | string>(1);

  // Reviewer note
  const [reviewerNote, setReviewerNoteData] = useState([]);

  // Manuals
  const [manualFields, setManualFields] = useState([
    {
      AssigneeId: 0,
      Id: 0,
      inputDate: "",
      startTime: "",
      endTime: "",
      totalTime: "",
      manualDesc: "",
    },
  ]);
  const [deletedManualTime, setDeletedManualTime] = useState<any>([]);
  const [reviewermanualFields, setReviewerManualFields] = useState([
    {
      AssigneeId: 0,
      Id: 0,
      inputDate: "",
      startTime: "",
      endTime: "",
      totalTime: "",
      manualDesc: "",
      IsApproved: false,
    },
  ]);

  const saveReviewerManualTimelog = async () => {
    const local: any = await localStorage.getItem("UserId");
    if (reviewerApprovals === parseInt(local)) {
      let hasManualErrors = false;
      const newInputDateErrors = reviewermanualFields.map(
        (field) => manualSwitch && field.inputDate === ""
      );
      manualSwitch && setInputDateErrors(newInputDateErrors);
      const newStartTimeErrors = reviewermanualFields.map(
        (field) =>
          (manualSwitch && field.startTime.trim().length === 0) ||
          (manualSwitch && field.startTime.trim().length < 8)
      );
      manualSwitch && setStartTimeErrors(newStartTimeErrors);
      const newEndTimeErrors = reviewermanualFields.map(
        (field) =>
          (manualSwitch && field.endTime.trim().length === 0) ||
          (manualSwitch && field.endTime.trim().length < 8) ||
          (manualSwitch && field.endTime <= field.startTime) ||
          field.startTime
            .split(":")
            .reduce(
              (acc, timePart, index) =>
                acc + parseInt(timePart) * [3600, 60, 1][index],
              0
            ) +
            "07:59:59"
              .split(":")
              .reduce(
                (acc, timePart, index) =>
                  acc + parseInt(timePart) * [3600, 60, 1][index],
                0
              ) <
            field.endTime
              .split(":")
              .reduce(
                (acc, timePart, index) =>
                  acc + parseInt(timePart) * [3600, 60, 1][index],
                0
              )
      );
      manualSwitch && setEndTimeErrors(newEndTimeErrors);
      const newManualDescErrors = reviewermanualFields.map(
        (field) =>
          (manualSwitch && field.manualDesc.trim().length < 5) ||
          (manualSwitch && field.manualDesc.trim().length > 500)
      );
      manualSwitch && setManualDescErrors(newManualDescErrors);
      hasManualErrors =
        newInputDateErrors.some((error) => error) ||
        newStartTimeErrors.some((error) => error) ||
        newEndTimeErrors.some((error) => error) ||
        newManualDescErrors.some((error) => error);

      if (!hasManualErrors) {
        setIsLoadingWorklog(true);
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/approval/savereviewermanualtimelog`,
            {
              submissionId: onHasId,
              timelogs: reviewermanualFields.map(
                (i: any) =>
                  new Object({
                    id: i.Id,
                    startTime:
                      dayjs(i.inputDate).format("YYYY/MM/DD") +
                      " " +
                      i.startTime,
                    endTime:
                      dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.endTime,
                    assigneeId:
                      i.AssigneeId === 0 ? assigneeApprovals : i.AssigneeId,
                    comment: i.manualDesc,
                  })
              ),
              deletedTimelogIds: deletedManualTime,
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
              toast.success(`Manual Time Updated successfully.`);
              setDeletedManualTime([]);
              getManualTimeLogForReviewer(onEdit);
              getEditData();
              setIsLoadingWorklog(false);
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
              setIsLoadingWorklog(false);
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            router.push("/login");
            localStorage.clear();
          }
        }
      }
    } else {
      toast.warning("Only Reviewer can Edit Manual time.");
      getManualData();
    }
  };

  const getManualTimeLogForReviewer = async (workItemId: any) => {
    const token = localStorage.getItem("token");
    const Org_Token = localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/getmanuallogbyworkitem`,
        { workItemId: workItemId },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          const data = await response.data.ResponseData;
          setManualSwitch(data.length <= 0 ? false : true);
          setManualSubmitDisable(
            data
              .map((i: any) => i.IsApproved === false && i.assignee !== userId)
              .includes(true)
              ? false
              : true
          );
          setReviewerManualFields(
            data.length <= 0
              ? [
                  {
                    AssigneeId: 0,
                    Id: 0,
                    inputDate: "",
                    startTime: "",
                    endTime: "",
                    totalTime: "",
                    manualDesc: "",
                    IsApproved: false,
                  },
                ]
              : data.map(
                  (i: any) =>
                    new Object({
                      AssigneeId: i.AssigneeId,
                      Id: i.TimeId,
                      inputDate: i.Date,
                      startTime: i.StartTime,
                      endTime: i.EndTime,
                      totalTime: getTimeDifference(i.StartTime, i.EndTime),
                      manualDesc: i.Comment,
                      IsApproved: i.IsApproved,
                    })
                )
          );
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
    if (onEdit > 0) {
      getManualTimeLogForReviewer(onEdit);
    }
  }, [onEdit]);

  const removePhoneField = (index: number) => {
    setDeletedManualTime([
      ...deletedManualTime,
      reviewermanualFields[index].Id,
    ]);

    const newManualFields = [...reviewermanualFields];
    newManualFields.splice(index, 1);
    setReviewerManualFields(newManualFields);

    const newInputDateErrors = [...inputDateErrors];
    newInputDateErrors.splice(index, 1);
    setInputDateErrors(newInputDateErrors);

    const newStartTimeErrors = [...startTimeErrors];
    newStartTimeErrors.splice(index, 1);
    setStartTimeErrors(newStartTimeErrors);

    const newEndTimeErrors = [...endTimeErrors];
    newEndTimeErrors.splice(index, 1);
    setEndTimeErrors(newEndTimeErrors);

    const newManualDescErrors = [...manualDescErrors];
    newManualDescErrors.splice(index, 1);
    setManualDescErrors(newManualDescErrors);

    const newManualDate = [...inputTypeDate];
    newManualDate.splice(index, 1);
    setInputTypeDate(newManualDate);

    setManualDisableData(newManualFields);
  };

  const addManualField = async () => {
    await setReviewerManualFields([
      ...reviewermanualFields,
      {
        AssigneeId: 0,
        Id: 0,
        inputDate: "",
        startTime: "",
        endTime: "",
        totalTime: "",
        manualDesc: "",
        IsApproved: false,
      },
    ]);
    setInputDateErrors([...inputDateErrors, false]);
    setStartTimeErrors([...startTimeErrors, false]);
    setEndTimeErrors([...endTimeErrors, false]);
    setManualDescErrors([...manualDescErrors, false]);
    setInputTypeDate([...inputTypeDate, "text"]);
    setInputTypeStartTime([...inputTypeStartTime, "text"]);
    setInputTypeEndTime([...inputTypeEndTime, "text"]);
    setManualDisableData([
      ...reviewermanualFields,
      {
        AssigneeId: 0,
        Id: 0,
        inputDate: "",
        startTime: "",
        endTime: "",
        totalTime: "",
        manualDesc: "",
        IsApproved: false,
      },
    ]);
  };

  const handleEstTimeChange = (e: any) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/\D/g, "");
    if (newValue.length > 8) {
      return;
    }

    let formattedValue = "";
    if (newValue.length >= 1) {
      const hours = parseInt(newValue.slice(0, 2));
      if (hours >= 0 && hours <= 23) {
        formattedValue = newValue.slice(0, 2);
      } else {
        formattedValue = "23";
      }
    }

    if (newValue.length >= 3) {
      const minutes = parseInt(newValue.slice(2, 4));
      if (minutes >= 0 && minutes <= 59) {
        formattedValue += ":" + newValue.slice(2, 4);
      } else {
        formattedValue += ":59";
      }
    }

    if (newValue.length >= 5) {
      const seconds = parseInt(newValue.slice(4, 6));
      if (seconds >= 0 && seconds <= 59) {
        formattedValue += ":" + newValue.slice(4, 6);
      } else {
        formattedValue += ":59";
      }
    }
    return formattedValue;
  };

  const handleStartTimeChange = (e: any, index: number) => {
    const newManualFields: any = [...reviewermanualFields];
    newManualFields[index].startTime = handleEstTimeChange(e);
    setReviewerManualFields(newManualFields);

    const startDate = newManualFields[index].startTime;
    const endDate = newManualFields[index].endTime;
    if (startDate && endDate) {
      const startTime = newManualFields[index].startTime;
      const endTime = newManualFields[index].endTime;
      if (startTime && endTime) {
        const startTimeArray = startTime.split(":");
        const endTimeArray = endTime.split(":");

        const startSeconds =
          parseInt(startTimeArray[0]) * 3600 +
          parseInt(startTimeArray[1]) * 60 +
          parseInt(startTimeArray[2]);
        const endSeconds =
          parseInt(endTimeArray[0]) * 3600 +
          parseInt(endTimeArray[1]) * 60 +
          parseInt(endTimeArray[2]);
        const totalSeconds = endSeconds - startSeconds;

        if (totalSeconds >= 0) {
          const totalHours = Math.floor(totalSeconds / 3600);
          const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
          const totalSecondsRemaining = totalSeconds % 60;
          const formattedTotalTime = `${totalHours
            .toString()
            .padStart(2, "0")}:${totalMinutes
            .toString()
            .padStart(2, "0")}:${totalSecondsRemaining
            .toString()
            .padStart(2, "0")}`;

          newManualFields[index].totalTime = formattedTotalTime;
          setReviewerManualFields(newManualFields);
        }
      }
    }
  };

  const handleEndTimeChange = (e: any, index: number) => {
    const newManualFields: any = [...reviewermanualFields];
    newManualFields[index].endTime = handleEstTimeChange(e);
    setReviewerManualFields(newManualFields);

    const startDate = newManualFields[index].startTime;
    const endDate = newManualFields[index].endTime;
    if (startDate && endDate) {
      const startTime = newManualFields[index].startTime;
      const endTime = newManualFields[index].endTime;
      if (startTime && endTime) {
        const startTimeArray = startTime.split(":");
        const endTimeArray = endTime.split(":");

        const startSeconds =
          parseInt(startTimeArray[0]) * 3600 +
          parseInt(startTimeArray[1]) * 60 +
          parseInt(startTimeArray[2]);
        const endSeconds =
          parseInt(endTimeArray[0]) * 3600 +
          parseInt(endTimeArray[1]) * 60 +
          parseInt(endTimeArray[2]);
        const totalSeconds = endSeconds - startSeconds;

        if (totalSeconds >= 0) {
          const totalHours = Math.floor(totalSeconds / 3600);
          const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
          const totalSecondsRemaining = totalSeconds % 60;
          const formattedTotalTime = `${totalHours
            .toString()
            .padStart(2, "0")}:${totalMinutes
            .toString()
            .padStart(2, "0")}:${totalSecondsRemaining
            .toString()
            .padStart(2, "0")}`;

          newManualFields[index].totalTime = formattedTotalTime;
          setReviewerManualFields(newManualFields);
        }
      }
    }
  };

  const handleManualDescChange = (e: any, index: number) => {
    const newManualFields = [...reviewermanualFields];
    newManualFields[index].manualDesc = e.target.value;
    setReviewerManualFields(newManualFields);

    const newManualDescErrors = [...manualDescErrors];
    newManualDescErrors[index] = e.target.value.trim().length === 0;
    setManualDescErrors(newManualDescErrors);
  };

  const handleInputDateChange = (e: any, index: number) => {
    const newManualFields = [...reviewermanualFields];
    newManualFields[index].inputDate = e;
    setReviewerManualFields(newManualFields);

    const newInputDateErrors = [...inputDateErrors];
    newInputDateErrors[index] = e.length === 0;
    setInputDateErrors(newInputDateErrors);
  };

  const setManualDisableData = (manualField: any) => {
    setManualSubmitDisable(
      manualField
        .map((i: any) => (i.IsApproved === false ? false : true))
        .includes(false)
        ? false
        : true
    );
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const fieldValidations = {
      clientName: validateField(clientNameApprovals),
      typeOfWork: validateField(typeOfWorkApprovals),
      projectName: validateField(projectNameApprovals),
      processName: validateField(processNameApprovals),
      subProcess: validateField(subProcessApprovals),
      clientTaskName: validateField(clientTaskNameApprovals),
      quantity: validateField(quantityApprovals),
      receiverDate: validateField(receiverDateApprovals),
      dueDate: validateField(dueDateApprovals),
      assignee: assigneeDisableApprovals && validateField(assigneeApprovals),
      reviewer: validateField(reviewerApprovals),
      manager: validateField(managerApprovals),
      returnYear:
        typeOfWorkApprovals === 3 && validateField(returnYearApprovals),
      checklistWorkpaper:
        typeOfWorkApprovals === 3 && validateField(checklistWorkpaperApprovals),
      reminderTime: reminderSwitch && validateField(reminderTime),
      reminderNotification:
        reminderSwitch && validateField(reminderNotification),
      reminderDate:
        reminderSwitch &&
        reminderCheckboxValue === 2 &&
        validateField(reminderDate),
    };

    setClientNameApprovalsErr(fieldValidations.clientName);
    setTypeOfWorkApprovalsErr(fieldValidations.typeOfWork);
    setProjectNameApprovalsErr(fieldValidations.projectName);
    setProcessNameApprovalsErr(fieldValidations.processName);
    setSubProcessApprovalsErr(fieldValidations.subProcess);
    setClientTaskNameApprovalsErr(fieldValidations.clientTaskName);
    setQuantityApprovalsErr(fieldValidations.quantity);
    setReceiverDateApprovalsErr(fieldValidations.receiverDate);
    assigneeDisableApprovals &&
      setAssigneeApprovalsErr(fieldValidations.assignee);
    setReviewerApprovalsErr(fieldValidations.reviewer);
    setManagerApprovalsErr(fieldValidations.manager);
    typeOfWorkApprovals === 3 &&
      setReturnYearApprovalsErr(fieldValidations.returnYear);
    typeOfWorkApprovals === 3 &&
      setChecklistWorkpaperApprovalsErr(fieldValidations.checklistWorkpaper);
    onEdit === 0 &&
      reminderSwitch &&
      setReminderTimeErr(fieldValidations.reminderTime);
    onEdit === 0 &&
      reminderSwitch &&
      setReminderNotificationErr(fieldValidations.reminderNotification);
    onEdit === 0 &&
      reminderSwitch &&
      reminderCheckboxValue === 2 &&
      setReminderDateErr(fieldValidations.reminderDate);

    onEdit === 0 &&
      receiverDateApprovals.length > 0 &&
      setClientTaskNameApprovalsErr(
        clientTaskNameApprovals.trim().length < 4 ||
          clientTaskNameApprovals.trim().length > 50
      );
    setQuantityApprovalsErr(
      quantityApprovals.length <= 0 ||
        quantityApprovals.length > 4 ||
        quantityApprovals <= 0 ||
        quantityApprovals.toString().includes(".")
    );

    const fieldValidationsEdit = {
      clientName: validateField(clientNameApprovals),
      typeOfWork: validateField(typeOfWorkApprovals),
      projectName: validateField(projectNameApprovals),
      processName: validateField(processNameApprovals),
      subProcess: validateField(subProcessApprovals),
      clientTaskName: validateField(clientTaskNameApprovals),
      status: validateField(statusApprovals),
      quantity: validateField(quantityApprovals),
      receiverDate: validateField(receiverDateApprovals),
      assignee: validateField(assigneeApprovals),
      reviewer: validateField(reviewerApprovals),
      manager: validateField(managerApprovals),
      returnYear:
        typeOfWorkApprovals === 3 && validateField(returnYearApprovals),
      checklistWorkpaper:
        typeOfWorkApprovals === 3 && validateField(checklistWorkpaperApprovals),
    };

    const hasEditErrors = Object.values(fieldValidationsEdit).some(
      (error) => error
    );

    const data = {
      WorkItemId: onEdit > 0 ? onEdit : 0,
      ClientId: clientNameApprovals,
      WorkTypeId: typeOfWorkApprovals,
      taskName: clientTaskNameApprovals,
      ProjectId: projectNameApprovals === 0 ? null : projectNameApprovals,
      ProcessId: processNameApprovals === 0 ? null : processNameApprovals,
      SubProcessId: subProcessApprovals === 0 ? null : subProcessApprovals,
      StatusId: statusApprovals,
      Priority: priorityApprovals === 0 ? 0 : priorityApprovals,
      Quantity: quantityApprovals,
      Description:
        descriptionApprovals.toString().length <= 0
          ? null
          : descriptionApprovals.toString().trim(),
      ReceiverDate: dayjs(receiverDateApprovals).format("YYYY/MM/DD"),
      DueDate: dayjs(dueDateApprovals).format("YYYY/MM/DD"),
      allInfoDate: allInfoDateApprovals === "" ? null : allInfoDateApprovals,
      AssignedId: assigneeApprovals,
      ReviewerId: reviewerApprovals,
      managerId: managerApprovals,
      TaxReturnType: null,
      TaxCustomFields:
        typeOfWorkApprovals !== 3
          ? null
          : {
              ReturnYear: returnYearApprovals,
              Complexity: null,
              CountYear: null,
              NoOfPages: noOfPagesApprovals,
            },
      checklistWorkpaper:
        checklistWorkpaperApprovals === 1
          ? true
          : checklistWorkpaperApprovals === 2
          ? false
          : null,
      ManualTimeList: null,
      SubTaskList: null,
      RecurringObj: null,
      ReminderObj: null,
    };

    const saveWorklog = async () => {
      setIsLoadingWorklog(true);
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/saveworkitem`,
          data,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            toast.success(
              `Worklog ${onEdit > 0 ? "Updated" : "created"} successfully.`
            );
            onEdit > 0 && getEditData();
            onEdit > 0 && typeOfWorkApprovals === 3 && getCheckListData();
            onEdit === 0 && onClose();
            onEdit === 0 && handleClose();
            setIsLoadingWorklog(false);
          } else {
            const data = response.data.Message;
            onEdit > 0 && getEditData();
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
          setIsLoadingWorklog(false);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };

    if (
      onEdit > 0 &&
      !hasEditErrors &&
      clientTaskNameApprovals.trim().length > 3 &&
      clientTaskNameApprovals.trim().length < 50 &&
      quantityApprovals > 0 &&
      quantityApprovals < 10000 &&
      !quantityApprovalsErr &&
      !quantityApprovals.toString().includes(".")
    ) {
      if (hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")) {
        saveWorklog();
      } else {
        toast.error("User don't have permission to Update Task.");
        getEditData();
      }
    }
  };

  // Sub Task
  const [subTaskSwitch, setSubTaskSwitch] = useState(false);
  const [subTaskFields, setSubTaskFields] = useState([
    {
      SubtaskId: 0,
      Title: "",
      Description: "",
    },
  ]);
  const [taskNameErr, setTaskNameErr] = useState([false]);
  const [subTaskDescriptionErr, setSubTaskDescriptionErr] = useState([false]);
  const [deletedSubTask, setDeletedSubTask] = useState<any>([]);

  const addTaskField = () => {
    setSubTaskFields([
      ...subTaskFields,
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameErr([...taskNameErr, false]);
    setSubTaskDescriptionErr([...subTaskDescriptionErr, false]);
  };

  const removeTaskField = (index: number) => {
    setDeletedSubTask([...deletedSubTask, subTaskFields[index].SubtaskId]);

    const newTaskFields = [...subTaskFields];
    newTaskFields.splice(index, 1);
    setSubTaskFields(newTaskFields);

    const newTaskErrors = [...taskNameErr];
    newTaskErrors.splice(index, 1);
    setTaskNameErr(newTaskErrors);

    const newSubTaskDescriptionErrors = [...subTaskDescriptionErr];
    newSubTaskDescriptionErrors.splice(index, 1);
    setSubTaskDescriptionErr(newSubTaskDescriptionErrors);
  };

  const handleSubTaskChange = (e: any, index: number) => {
    const newTaskFields = [...subTaskFields];
    newTaskFields[index].Title = e.target.value;
    setSubTaskFields(newTaskFields);

    const newTaskErrors = [...taskNameErr];
    newTaskErrors[index] = e.target.value.trim().length === 0;
    setTaskNameErr(newTaskErrors);
  };

  const handleSubTaskDescriptionChange = (e: any, index: number) => {
    const newTaskFields = [...subTaskFields];
    newTaskFields[index].Description = e.target.value;
    setSubTaskFields(newTaskFields);

    const newSubTaskDescErrors = [...subTaskDescriptionErr];
    newSubTaskDescErrors[index] = e.target.value.trim().length === 0;
    setSubTaskDescriptionErr(newSubTaskDescErrors);
  };

  const handleSubmitSubTask = async () => {
    let hasSubErrors = false;
    const newTaskErrors = subTaskFields.map(
      (field) =>
        (subTaskSwitch && field.Title.trim().length < 5) ||
        (subTaskSwitch && field.Title.trim().length > 500)
    );
    subTaskSwitch && setTaskNameErr(newTaskErrors);
    const newSubTaskDescErrors = subTaskFields.map(
      (field) =>
        (subTaskSwitch && field.Description.trim().length < 5) ||
        (subTaskSwitch && field.Description.trim().length > 500)
    );
    subTaskSwitch && setSubTaskDescriptionErr(newSubTaskDescErrors);
    hasSubErrors =
      newTaskErrors.some((error) => error) ||
      newSubTaskDescErrors.some((error) => error);

    if (!hasSubErrors) {
      setIsLoadingWorklog(true);
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/subtask/savebyworkitem`,
          {
            workitemId: onEdit,
            subtasks: subTaskSwitch
              ? subTaskFields.map(
                  (i: any) =>
                    new Object({
                      SubtaskId: i.SubtaskId,
                      Title: i.Title.trim(),
                      Description: i.Description.trim(),
                    })
                )
              : null,
            deletedWorkitemSubtaskIds: deletedSubTask,
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
            toast.success(`Sub Task Updated successfully.`);
            setDeletedSubTask([]);
            setSubTaskFields([
              {
                SubtaskId: 0,
                Title: "",
                Description: "",
              },
            ]);
            getWorklogData();
            setIsLoadingWorklog(false);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
          setIsLoadingWorklog(false);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    }
  };

  // Checklist
  const [checkListName, setCheckListName] = useState("");
  const [checkListNameError, setCheckListNameError] = useState(false);
  const [checkListData, setCheckListData] = useState([]);
  const [itemStates, setItemStates] = useState<any>({});
  const toggleGeneralOpen = (index: any) => {
    setItemStates((prevStates: any) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const toggleAddChecklistField = (index: any) => {
    setItemStates((prevStates: any) => ({
      ...prevStates,
      [`addChecklistField_${index}`]: !prevStates[`addChecklistField_${index}`],
    }));
  };

  const handleSaveCheckListName = async (Category: any, index: number) => {
    setCheckListNameError(
      checkListName.trim().length < 5 || checkListName.trim().length > 500
    );

    if (
      !checkListNameError &&
      checkListName.trim().length > 4 &&
      checkListName.trim().length < 500
    ) {
      setIsLoadingWorklog(true);
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/checklist/createbyworkitem`,
          {
            workItemId: onEdit,
            category: Category,
            title: checkListName,
            isCheck: true,
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
            toast.success(`Checklist created successfully.`);
            setCheckListName("");
            getCheckListData();
            toggleAddChecklistField(index);
            setIsLoadingWorklog(false);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
          setIsLoadingWorklog(false);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    }
  };

  const handleChangeChecklist = async (
    Category: any,
    IsCheck: any,
    Title: any
  ) => {
    setIsLoadingWorklog(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/checklist/savebyworkitem`,
        {
          workItemId: onEdit,
          category: Category,
          title: Title,
          isCheck: IsCheck,
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
          toast.success(`CheckList Updated successfully.`);
          getCheckListData();
          setIsLoadingWorklog(false);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
          setIsLoadingWorklog(false);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Failed Please try again.");
        } else {
          toast.error(data);
        }
        setIsLoadingWorklog(false);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  // Comments
  const [commentData, setCommentData] = useState([]);
  const [value, setValue] = useState("");
  const [valueError, setValueError] = useState(false);
  const [valueEdit, setValueEdit] = useState("");
  const [valueEditError, setValueEditError] = useState(false);
  const [mention, setMention] = useState<any>([]);
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1);
  const [commentAttachment, setCommentAttachment] = useState([
    {
      AttachmentId: 0,
      UserFileName: "",
      SystemFileName: "",
      AttachmentPath: process.env.attachment,
    },
  ]);
  const [commentUserData, setCommentUserData] = useState([]);

  const users: any =
    commentUserData?.length > 0 &&
    commentUserData.map(
      (i: any) =>
        new Object({
          id: i.value,
          display: i.label,
        })
    );

  const handleEditClick = (index: any, message: any) => {
    setEditingCommentIndex(index);
    setValueEdit(message);
  };

  const handleSaveClick = async (e: any, i: any, type: any) => {
    e.preventDefault();
    setValueEditError(
      valueEdit.trim().length < 5 || valueEdit.trim().length > 500
    );

    if (
      valueEdit.trim().length > 5 &&
      valueEdit.trim().length < 501 &&
      !valueEditError
    ) {
      if (hasPermissionWorklog("Comment", "Save", "WorkLogs")) {
        setIsLoadingWorklog(true);
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/comment/saveByworkitem`,
            {
              workitemId: onEdit,
              CommentId: i.CommentId,
              Message: valueEdit,
              TaggedUsers: mention,
              Attachment:
                commentAttachment[0].SystemFileName.length > 0
                  ? commentAttachment
                  : null,
              type: type,
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
              toast.success(`Comment updated successfully.`);
              setMention([]);
              setCommentAttachment([
                {
                  AttachmentId: 0,
                  UserFileName: "",
                  SystemFileName: "",
                  AttachmentPath: process.env.attachment,
                },
              ]);
              setValueEditError(false);
              setValueEdit("");
              getCommentData(1);
              setEditingCommentIndex(-1);
              setIsLoadingWorklog(false);
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
              setIsLoadingWorklog(false);
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            router.push("/login");
            localStorage.clear();
          }
        }
      } else {
        toast.error("User don't have permission to Update Task.");
        getCommentData(1);
      }
    }
  };

  const handleCommentChange = (e: any) => {
    setMention(
      e
        .split("(")
        .map((i: any, index: number) => {
          if (i.includes(")")) {
            return parseInt(i.split(")")[0]);
          }
        })
        .filter((i: any) => i !== undefined)
    );
    setValueError(false);
  };

  const handleCommentAttachmentsChange = (
    data1: any,
    data2: any,
    commentAttachment: any
  ) => {
    const Attachment = [
      {
        AttachmentId: commentAttachment[0].AttachmentId,
        UserFileName: data1,
        SystemFileName: data2,
        AttachmentPath: process.env.attachment,
      },
    ];
    setCommentAttachment(Attachment);
  };

  const handleSubmitComment = async (
    e: { preventDefault: () => void },
    type: any
  ) => {
    e.preventDefault();
    setValueError(value.trim().length < 5 || value.trim().length > 500);

    if (value.trim().length >= 5 && value.trim().length < 501 && !valueError) {
      if (hasPermissionWorklog("Comment", "Save", "WorkLogs")) {
        setIsLoadingWorklog(true);
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/comment/saveByworkitem`,
            {
              workitemId: onEdit,
              CommentId: 0,
              Message: value,
              TaggedUsers: mention,
              Attachment:
                commentAttachment[0].SystemFileName.length > 0
                  ? commentAttachment
                  : null,
              type: type,
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
              toast.success(`Comment sent successfully.`);
              setMention([]);
              setCommentAttachment([
                {
                  AttachmentId: 0,
                  UserFileName: "",
                  SystemFileName: "",
                  AttachmentPath: process.env.attachment,
                },
              ]);
              setValueEditError(false);
              setValueEdit("");
              setValue("");
              getCommentData(commentSelect);
              setIsLoadingWorklog(false);
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
              setIsLoadingWorklog(false);
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            router.push("/login");
            localStorage.clear();
          }
        }
      } else {
        toast.error("User don't have permission to Update Task.");
        getCommentData(1);
      }
    }
  };

  // Recurring
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [recurringTime, setRecurringTime] = useState<any>(1);
  const [recurringMonth, setRecurringMonth] = useState<any>(0);

  // Reminder
  const [reminderSwitch, setReminderSwitch] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderDateErr, setReminderDateErr] = useState(false);
  const [reminderTime, setReminderTime] = useState<any>(0);
  const [reminderTimeErr, setReminderTimeErr] = useState(false);
  const [reminderNotification, setReminderNotification] = useState<any>([]);
  const [reminderNotificationErr, setReminderNotificationErr] = useState(false);
  const [reminderCheckboxValue, setReminderCheckboxValue] = useState<any>(1);
  const [reminderId, setReminderId] = useState(0);
  const handleSubmitReminder = async () => {
    const fieldValidations = {
      reminderTime: reminderSwitch && validateField(reminderTime),
      reminderNotification:
        reminderSwitch && validateField(reminderNotification),
      reminderDate:
        reminderSwitch &&
        reminderCheckboxValue === 2 &&
        validateField(reminderDate),
    };

    reminderSwitch && setReminderTimeErr(fieldValidations.reminderTime);
    reminderSwitch &&
      setReminderNotificationErr(fieldValidations.reminderNotification);
    reminderSwitch &&
      reminderCheckboxValue === 2 &&
      setReminderDateErr(fieldValidations.reminderDate);

    const hasErrors = Object.values(fieldValidations).some((error) => error);

    if (!hasErrors) {
      setIsLoadingWorklog(true);
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/reminder/savebyworkitem`,
          {
            ReminderId: reminderId,
            ReminderType: reminderCheckboxValue,
            WorkitemId: onEdit,
            ReminderDate:
              reminderCheckboxValue === 2
                ? dayjs(reminderDate).format("YYYY/MM/DD")
                : null,
            ReminderTime: reminderTime,
            ReminderUserIds: reminderNotification.map((i: any) => i.value),
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
            toast.success(`Reminder Updated successfully.`);
            getReminderData();
            setReminderId(0);
            setIsLoadingWorklog(false);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
          setIsLoadingWorklog(false);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    }
  };

  // OnEdit get data
  const getWorklogData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/subtask/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setSubTaskSwitch(
            data.length <= 0 &&
              !hasPermissionWorklog("Task/SubTask", "save", "WorkLogs")
              ? false
              : true
          );
          setSubTaskFields(
            data.length <= 0
              ? [
                  {
                    SubTaskId: 0,
                    Title: "",
                    Description: "",
                  },
                ]
              : data
          );
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getRecurringData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/recurring/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setRecurringStartDate(data.length <= 0 ? "" : data.StartDate);
          setRecurringEndDate(data.length <= 0 ? "" : data.EndDate);
          setRecurringTime(data.length <= 0 ? 0 : data.Type);
          data.Type === 2
            ? setSelectedDays(data.Triggers)
            : data.Type === 3
            ? setRecurringMonth(
                data.Triggers.map((trigger: any) =>
                  months.find((month) => month.value === trigger)
                ).filter(Boolean)
              )
            : [];
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getManualData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/timelog/getManuallogByWorkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setManualFields(
            data.length <= 0
              ? [
                  {
                    AssigneeId: 0,
                    Id: 0,
                    inputDate: "",
                    startTime: "",
                    endTime: "",
                    totalTime: "",
                    manualDesc: "",
                  },
                ]
              : data.map(
                  (i: any) =>
                    new Object({
                      AssigneeId: i.AssigneeId,
                      Id: i.Id,
                      inputDate: i.Date,
                      startTime: i.StartTime,
                      endTime: i.EndTime,
                      totalTime: getTimeDifference(i.StartTime, i.EndTime),
                      manualDesc: i.Comment,
                    })
                )
          );
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getReminderData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/reminder/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setReminderId(data.ReminderId);
          setReminderSwitch(
            data === null &&
              !hasPermissionWorklog("Reminder", "save", "WorkLogs")
              ? false
              : true
          );
          setReminderCheckboxValue(data.ReminderType);
          setReminderDate(data.ReminderDate);
          setReminderTime(data.ReminderTime);
          setReminderNotification(
            data.ReminderUserIds.map((reminderUserId: any) =>
              assigneeApprovalsDropdownData.find(
                (assignee: { value: any }) => assignee.value === reminderUserId
              )
            ).filter(Boolean)
          );
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
    } catch (error: any) {
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getCommentData = async (type: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/comment/getByWorkitem`,
        {
          WorkitemId: onEdit,
          type: type,
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
          setCommentData(response.data.ResponseData);
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
    } catch (error: any) {
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getErrorLogData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/errorlog/getByWorkitem`,
        {
          WorkitemId: onEdit,
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
          response.data.ResponseData.length <= 0
            ? setErrorLogFields([
                {
                  SubmitedBy: "",
                  SubmitedOn: "",
                  ErrorLogId: 0,
                  ErrorType: 0,
                  RootCause: 0,
                  Priority: 0,
                  ErrorCount: 0,
                  NatureOfError: 0,
                  CC: [],
                  Remark: "",
                  Attachments: [
                    {
                      AttachmentId: 0,
                      UserFileName: "",
                      SystemFileName: "",
                      AttachmentPath: process.env.attachment,
                    },
                  ],
                  isSolved: false,
                },
              ])
            : setErrorLogFields(
                response.data.ResponseData.map(
                  (i: any) =>
                    new Object({
                      SubmitedBy: i.SubmitedBy,
                      SubmitedOn: i.SubmitedOn,
                      ErrorLogId: i.ErrorLogId,
                      ErrorType: i.ErrorType,
                      RootCause: i.RootCause,
                      Priority: i.Priority,
                      ErrorCount: i.ErrorCount,
                      NatureOfError: i.NatureOfError,
                      CC: i.CC.map((i: any) =>
                        cCDropdownData.find(
                          (j: { value: any }) => j.value === i
                        )
                      ).filter(Boolean),
                      Remark: i.Remark,
                      Attachments:
                        i.Attachment.length > 0 &&
                        i.Attachment[0].SystemFileName.length > 0
                          ? i.Attachment
                          : [
                              {
                                AttachmentId: 0,
                                UserFileName: "",
                                SystemFileName: "",
                                AttachmentPath: process.env.attachment,
                              },
                            ],
                      isSolved: i.IsSolved,
                    })
                )
              );
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getReviewerNoteData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/getreviewernotelist`,
        {
          WorkitemId: onEdit,
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
          setReviewerNoteData(response.data.ResponseData);
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getCheckListData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/checklist/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          setCheckListData(
            response.data.ResponseData === (null || [])
              ? []
              : response.data.ResponseData
          );
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
    } catch (error: any) {
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getEditData = async () => {
    const params = {
      WorkitemId: onEdit,
    };
    const url = `${process.env.worklog_api_url}/workitem/getbyid`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setEditData(ResponseData);
        setIsCreatedByClient(ResponseData.IsCreatedByClient);
        setIsManual(ResponseData.IsManual);
        setClientNameApprovals(ResponseData.ClientId);
        setTypeOfWorkApprovals(ResponseData.WorkTypeId);
        setProjectNameApprovals(ResponseData.ProjectId);
        setProcessNameApprovals(ResponseData.ProcessId);
        setSubProcessApprovals(ResponseData.SubProcessId);
        setClientTaskNameApprovals(
          ResponseData.TaskName === null ? "" : ResponseData.TaskName
        );
        setStatusApprovals(ResponseData.StatusId);
        setAllInfoDateApprovals(
          ResponseData.AllInfoDate === null ? "" : ResponseData.AllInfoDate
        );
        !ResponseData.ErrorlogSignedOffPending
          ? setStatusApprovalsDropdownDataUse(
              statusApprovalsDropdownData.filter(
                (item: any) =>
                  item.Type === "Rework" ||
                  item.Type === "InReview" ||
                  item.Type === "Submitted" ||
                  item.Type === "Accept" ||
                  item.Type === "AcceptWithNotes" ||
                  item.Type === "OnHoldFromClient" ||
                  item.Type === "WithDraw" ||
                  item.Type === "WithdrawnbyClient" ||
                  item.value == ResponseData.StatusId
              )
            )
          : setStatusApprovalsDropdownDataUse(
              statusApprovalsDropdownData.filter(
                (item: any) =>
                  item.Type === "Rework In Review" ||
                  item.Type === "ReworkSubmitted" ||
                  item.Type === "ReworkAccept" ||
                  item.Type === "ReworkAcceptWithNotes" ||
                  item.Type === "OnHoldFromClient" ||
                  item.Type === "WithDraw" ||
                  item.Type === "WithdrawnbyClient" ||
                  item.value == ResponseData.StatusId
              )
            );
        setPriorityApprovals(ResponseData.Priority);
        setQuantityApprovals(ResponseData.Quantity);
        setDescriptionApprovals(
          ResponseData.Description === null ? "" : ResponseData.Description
        );
        setReceiverDateApprovals(ResponseData.ReceiverDate);
        setDueDateApprovals(ResponseData.DueDate);
        setDateOfReviewApprovals(ResponseData.ReviewerDate);
        setDateOfPreperationApprovals(ResponseData.PreparationDate);
        setAssigneeApprovals(ResponseData.AssignedId);
        setReviewerApprovals(ResponseData.ReviewerId);
        setManagerApprovals(
          ResponseData.ManagerId === null ? 0 : ResponseData.ManagerId
        );
        setReturnYearApprovals(
          ResponseData.TypeOfReturnId === 0
            ? null
            : ResponseData.TaxCustomFields.ReturnYear
        );
        setNoOfPagesApprovals(
          ResponseData.TypeOfReturnId === 0
            ? null
            : ResponseData.TaxCustomFields.NoOfPages
        );
        setChecklistWorkpaperApprovals(
          ResponseData.ChecklistWorkpaper === true
            ? 1
            : ResponseData.ChecklistWorkpaper === false
            ? 2
            : 0
        );
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    const getData = async () => {
      const statusData = await getStatusDropdownData();

      await setStatusApprovalsDropdownData(statusData);
      await setCCDropdownData(await getCCDropdownData());
    };

    onOpen && statusApprovalsDropdownData.length === 0 && getData();
    if (onEdit > 0 && statusApprovalsDropdownData.length > 0) {
      getEditData();
      getWorklogData();
      getRecurringData();
      getManualData();
      getReminderData();
      getCheckListData();
      getCommentData(1);
      getReviewerNoteData();
      getLogsDataWorklogs();
    }
  }, [onEdit, statusApprovalsDropdownData]);

  useEffect(() => {
    onEdit > 0 && assigneeApprovalsDropdownData.length > 0 && getErrorLogData();
  }, [assigneeApprovalsDropdownData]);

  // Error Logs
  const [errorLogFields, setErrorLogFields] = useState([
    {
      SubmitedBy: "",
      SubmitedOn: "",
      ErrorLogId: 0,
      ErrorType: 0,
      RootCause: 0,
      Priority: 0,
      ErrorCount: 0,
      NatureOfError: 0,
      CC: [],
      Remark: "",
      Attachments: [
        {
          AttachmentId: 0,
          UserFileName: "",
          SystemFileName: "",
          AttachmentPath: process.env.attachment,
        },
      ],
      isSolved: false,
    },
  ]);
  const [errorTypeErr, setErrorTypeErr] = useState([false]);
  const [rootCauseErr, setRootCauseErr] = useState([false]);
  const [errorLogPriorityErr, setErrorLogPriorityErr] = useState([false]);
  const [errorCountErr, setErrorCountErr] = useState([false]);
  const [natureOfErr, setNatureOfErr] = useState([false]);
  const [remarkErr, setRemarkErr] = useState([false]);
  const [deletedErrorLog, setDeletedErrorLog] = useState<any>([]);

  const addErrorLogField = () => {
    setErrorLogFields([
      ...errorLogFields,
      {
        SubmitedBy: "",
        SubmitedOn: "",
        ErrorLogId: 0,
        ErrorType: 0,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
        CC: [],
        Remark: "",
        Attachments: [
          {
            AttachmentId: 0,
            UserFileName: "",
            SystemFileName: "",
            AttachmentPath: process.env.attachment,
          },
        ],
        isSolved: false,
      },
    ]);
    setErrorTypeErr([...errorTypeErr, false]);
    setRootCauseErr([...rootCauseErr, false]);
    setErrorLogPriorityErr([...errorLogPriorityErr, false]);
    setErrorCountErr([...errorCountErr, false]);
    setNatureOfErr([...natureOfErr, false]);
    setRemarkErr([...remarkErr, false]);
  };

  const removeErrorLogField = (index: number) => {
    setDeletedErrorLog([...deletedErrorLog, errorLogFields[index].ErrorLogId]);

    const newErrorLogFields = [...errorLogFields];
    newErrorLogFields.splice(index, 1);
    setErrorLogFields(newErrorLogFields);

    const newErrorTypeErrors = [...errorTypeErr];
    newErrorTypeErrors.splice(index, 1);
    setErrorTypeErr(newErrorTypeErrors);

    const newRootCauseErrors = [...rootCauseErr];
    newRootCauseErrors.splice(index, 1);
    setRootCauseErr(newRootCauseErrors);

    const newPriorityErrors = [...errorLogPriorityErr];
    newPriorityErrors.splice(index, 1);
    setErrorLogPriorityErr(newPriorityErrors);

    const newErrorCountErrors = [...errorCountErr];
    newErrorCountErrors.splice(index, 1);
    setErrorCountErr(newErrorCountErrors);

    const newNatureOfErrErrors = [...natureOfErr];
    newNatureOfErrErrors.splice(index, 1);
    setNatureOfErr(newNatureOfErrErrors);

    const newRemarkErrors = [...remarkErr];
    newRemarkErrors.splice(index, 1);
    setRemarkErr(newRemarkErrors);
  };

  const handleErrorTypeChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].ErrorType = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...errorTypeErr];
    newErrors[index] = e.target.value === 0;
    setErrorTypeErr(newErrors);
  };

  const handleRootCauseChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].RootCause = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...rootCauseErr];
    newErrors[index] = e.target.value === 0;
    setRootCauseErr(newErrors);
  };

  const handleNatureOfErrorChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].NatureOfError = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...natureOfErr];
    newErrors[index] = e.target.value === 0;
    setNatureOfErr(newErrors);
  };

  const handlePriorityChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Priority = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...errorLogPriorityErr];
    newErrors[index] = e.target.value === 0;
    setErrorLogPriorityErr(newErrors);
  };

  const handleErrorCountChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].ErrorCount = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...errorCountErr];
    newErrors[index] =
      e.target.value < 0 || e.target.value.toString().length > 4;
    setErrorCountErr(newErrors);
  };

  const handleCCChange = (newValue: any, index: any) => {
    const newFields = [...errorLogFields];
    newFields[index].CC = newValue;
    setErrorLogFields(newFields);
  };

  const handleRemarksChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Remark = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...remarkErr];
    newErrors[index] = e.target.value.trim().length <= 0;
    setRemarkErr(newErrors);
  };

  const handleAttachmentsChange = (
    data1: any,
    data2: any,
    Attachments: any,
    index: number
  ) => {
    const newFields = [...errorLogFields];
    newFields[index].Attachments = [
      {
        AttachmentId: Attachments[0].AttachmentId,
        UserFileName: data1,
        SystemFileName: data2,
        AttachmentPath: process.env.attachment,
      },
    ];
    setErrorLogFields(newFields);
  };

  const handleSubmitErrorLog = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let hasErrorLogErrors = false;
    const newErrorTypeErrors = errorLogFields.map(
      (field) => field.ErrorType === 0
    );
    setErrorTypeErr(newErrorTypeErrors);
    const newRootCauseErrors = errorLogFields.map(
      (field) => field.RootCause === 0
    );
    setRootCauseErr(newRootCauseErrors);
    const newNatureOfErrors = errorLogFields.map(
      (field) => field.NatureOfError === 0
    );
    setNatureOfErr(newNatureOfErrors);
    const newPriorityErrors = errorLogFields.map(
      (field) => field.Priority === 0
    );
    setErrorLogPriorityErr(newPriorityErrors);
    const newErrorCountErrors = errorLogFields.map(
      (field) => field.ErrorCount <= 0 || field.ErrorCount > 9999
    );
    setErrorCountErr(newErrorCountErrors);
    const newRemarkErrors = errorLogFields.map(
      (field) =>
        field.Remark.trim().length < 5 || field.Remark.trim().length > 500
    );
    setRemarkErr(newRemarkErrors);

    hasErrorLogErrors =
      newErrorTypeErrors.some((error) => error) ||
      newRootCauseErrors.some((error) => error) ||
      newNatureOfErrors.some((error) => error) ||
      newPriorityErrors.some((error) => error) ||
      newErrorCountErrors.some((error) => error) ||
      newRemarkErrors.some((error) => error);

    if (!hasErrorLogErrors) {
      if (hasPermissionWorklog("ErrorLog", "Save", "WorkLogs")) {
        setIsLoadingWorklog(true);
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/errorlog/saveByworkitem`,
            {
              WorkItemId: onEdit,
              Errors: errorLogFields.map(
                (i: any) =>
                  new Object({
                    ErrorLogId: i.ErrorLogId,
                    ErrorType: i.ErrorType,
                    RootCause: i.RootCause,
                    Priority: i.Priority,
                    ErrorCount: i.ErrorCount,
                    NatureOfError: i.NatureOfError,
                    CC: i.CC.map((j: any) => j.value),
                    Remark: i.Remark,
                    Attachments:
                      i.Attachments[0].SystemFileName.length > 0
                        ? i.Attachments
                        : null,
                  })
              ),
              IsClientWorklog: false,
              SubmissionId: onHasId,
              DeletedErrorlogIds: deletedErrorLog,
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
              toast.success(`Error logged successfully.`);
              setDeletedErrorLog([]);
              getEditData();
              getErrorLogData();
              onDataFetch();
              setIsLoadingWorklog(false);
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
              setIsLoadingWorklog(false);
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
            setIsLoadingWorklog(false);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            router.push("/login");
            localStorage.clear();
          }
        }
      } else {
        toast.error("User don't have permission to Update Task.");
        getErrorLogData();
      }
    }
  };

  // Logs
  const [logsWorklogsDrawer, setLogsWorklogsDrawer] = useState(true);
  const [logsDataWorklogs, setLogsDateWorklogs] = useState<any>([]);

  const logsDatatableTaskCols = [
    {
      name: "Filed",
      label: "Filed Name",
      options: {
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "OldValue",
      label: "Old Value",
      options: {
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "NewValue",
      label: "New Value",
      options: {
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
  ];

  const getLogsDataWorklogs = async () => {
    const params = {
      WorkitemId: onEdit,
    };
    const url = `${process.env.report_api_url}/auditlog/getbyworkitem`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (
        ResponseStatus === "Success" &&
        ResponseData !== null &&
        ResponseData.List.length >= 0 &&
        error === false
      ) {
        setLogsDateWorklogs(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  // API CALLS dropdown data
  const getUserDetails = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      };
      const response = await axios.get(
        `${process.env.api_url}/auth/getuserdetails`,
        { headers: headers }
      );
      if (response.status === 200) {
        setAssigneeDisableApprovals(
          response.data.ResponseData.IsHaveManageAssignee
        );
        setUserId(response.data.ResponseData.UserId);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      getUserDetails();
      setClientApprovalsDropdownData(await getClientDropdownData());
      setManagerApprovalsDropdownData(await getManagerDropdownData());
      clientNameApprovals > 0 &&
        setWorkTypeApprovalsDropdownData(
          await getTypeOfWorkDropdownData(clientNameApprovals)
        );
      clientNameApprovals > 0 &&
        setProjectApprovalsDropdownData(
          await getProjectDropdownData(clientNameApprovals)
        );
      const processData: any =
        clientNameApprovals > 0 &&
        (await getProcessDropdownData(clientNameApprovals));
      setProcessApprovalsDropdownData(
        processData.map((i: any) => new Object({ label: i.Name, value: i.Id }))
      );
    };

    onOpen && getData();
  }, [clientNameApprovals, onOpen]);

  useEffect(() => {
    const getData = async () => {
      onEdit > 0 &&
        setCommentUserData(
          await getCommentUserDropdownData({
            ClientId: clientNameApprovals,
            GetClientUser: commentSelect === 2 ? true : false,
          })
        );
    };

    onOpen && getData();
  }, [clientNameApprovals, commentSelect]);

  useEffect(() => {
    const getData = async () => {
      const data: any =
        processNameApprovals !== 0 &&
        (await getSubProcessDropdownData(
          clientNameApprovals,
          processNameApprovals
        ));
      data.length > 0 && setEstTimeDataApprovals(data);
      data.length > 0 &&
        setSubProcessApprovalsDropdownData(
          data.map((i: any) => new Object({ label: i.Name, value: i.Id }))
        );
    };

    getData();
  }, [processNameApprovals]);

  useEffect(() => {
    const getData = async () => {
      const assigneeData = await getAssigneeDropdownData(
        clientNameApprovals,
        typeOfWorkApprovals
      );
      assigneeData.length > 0 && setAssigneeApprovalsDropdownData(assigneeData);
      setReviewerApprovalsDropdownData(
        await getReviewerDropdownData(clientNameApprovals, typeOfWorkApprovals)
      );
    };

    typeOfWorkApprovals !== 0 && getData();
  }, [typeOfWorkApprovals, clientNameApprovals]);

  const handleClose = () => {
    // Common
    setIsLoadingWorklog(false);
    setEditData([]);
    setIsCreatedByClient(false);
    setUserId(0);
    scrollToPanel(0);
    onDataFetch();

    // Task
    setClientApprovalsDropdownData([]);
    setClientNameApprovals(0);
    setClientNameApprovalsErr(false);
    setWorkTypeApprovalsDropdownData([]);
    setTypeOfWorkApprovals(0);
    setTypeOfWorkApprovalsErr(false);
    setProjectApprovalsDropdownData([]);
    setProjectNameApprovals(0);
    setProjectNameApprovalsErr(false);
    setClientTaskNameApprovals("");
    setClientTaskNameApprovalsErr(false);
    setProcessApprovalsDropdownData([]);
    setProcessNameApprovals(0);
    setProcessNameApprovalsErr(false);
    setSubProcessApprovalsDropdownData([]);
    setSubProcessApprovals(0);
    setSubProcessApprovalsErr(false);
    setManagerApprovals(0);
    setManagerApprovalsErr(false);
    setStatusApprovalsDropdownDataUse([]);
    setStatusApprovals(0);
    setStatusApprovalsErr(false);
    setDescriptionApprovals("");
    setPriorityApprovals(0);
    setQuantityApprovals(1);
    setQuantityApprovalsErr(false);
    setReceiverDateApprovals("");
    setReceiverDateApprovalsErr(false);
    setDueDateApprovals("");
    setAllInfoDateApprovals("");
    setAssigneeApprovalsDropdownData([]);
    setAssigneeApprovals(0);
    setAssigneeApprovalsErr(false);
    setAssigneeDisableApprovals(true);
    setReviewerApprovalsDropdownData([]);
    setReviewerApprovals(0);
    setReviewerApprovalsErr(false);
    setDateOfReviewApprovals("");
    setDateOfPreperationApprovals("");
    setEstTimeDataApprovals([]);
    setReturnYearApprovals(0);
    setReturnYearApprovalsErr(false);
    setNoOfPagesApprovals(0);
    setChecklistWorkpaperApprovals(0);
    setChecklistWorkpaperApprovalsErr(false);

    // Sub-Task
    setSubTaskSwitch(false);
    setSubTaskFields([
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameErr([false]);
    setSubTaskDescriptionErr([false]);

    // Sub-Task
    setSubTaskSwitch(false);
    setSubTaskFields([
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameErr([false]);
    setSubTaskDescriptionErr([false]);

    // Checklist
    setCheckListName("");
    setCheckListNameError(false);
    setCheckListData([]);
    setItemStates({});

    // Recurring
    setRecurringStartDate("");
    setRecurringEndDate("");
    setRecurringTime(1);
    setRecurringMonth(0);

    // Manual
    setManualFields([
      {
        AssigneeId: 0,
        Id: 0,
        inputDate: "",
        startTime: "",
        endTime: "",
        totalTime: "",
        manualDesc: "",
      },
    ]);

    //Reviewer Manual Time
    setReviewerManualFields([
      {
        AssigneeId: 0,
        Id: 0,
        inputDate: "",
        startTime: "",
        endTime: "",
        totalTime: "",
        manualDesc: "",
        IsApproved: false,
      },
    ]);
    setInputDateErrors([false]);
    setStartTimeErrors([false]);
    setEndTimeErrors([false]);
    setManualDescErrors([false]);
    setDeletedManualTime([]);

    // Reminder
    setReminderSwitch(false);
    setReminderCheckboxValue(1);
    setReminderDate("");
    setReminderDateErr(false);
    setReminderTime(0);
    setReminderTimeErr(false);
    setReminderNotification(0);
    setReminderNotificationErr(false);
    setReminderId(0);

    // Comments
    setCommentData([]);
    setValue("");
    setValueError(false);
    setValueEdit("");
    setValueEditError(false);
    setMention([]);
    setEditingCommentIndex(-1);
    setCommentSelect(1);
    setCommentAttachment([
      {
        AttachmentId: 0,
        UserFileName: "",
        SystemFileName: "",
        AttachmentPath: process.env.attachment,
      },
    ]);
    setEditingCommentIndex(-1);
    setCommentUserData([]);

    // Reviewer note
    setReviewerNoteData([]);

    // Error Logs
    setErrorLogFields([
      {
        SubmitedBy: "",
        SubmitedOn: "",
        ErrorLogId: 0,
        ErrorType: 0,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
        CC: [],
        Remark: "",
        Attachments: [
          {
            AttachmentId: 0,
            UserFileName: "",
            SystemFileName: "",
            AttachmentPath: process.env.attachment,
          },
        ],
        isSolved: false,
      },
    ]);
    setErrorTypeErr([false]);
    setRootCauseErr([false]);
    setErrorLogPriorityErr([false]);
    setErrorCountErr([false]);
    setNatureOfErr([false]);
    setRemarkErr([false]);
    setDeletedErrorLog([]);

    // Logs
    setLogsDateWorklogs([]);

    if (typeof window !== "undefined") {
      const pathname = window.location.href.includes("id=");
      if (pathname) {
        onClose();
        router.push("/worklogs");
      } else {
        onClose();
      }
    }
    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-30 h-screen w-[1300px] border border-lightSilver bg-pureWhite transform  ${
          onOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="sticky top-0 !h-[9%] bg-whiteSmoke border-b z-30 border-lightSilver">
          <div className="flex p-[6px] justify-between items-center">
            <div className="flex items-center py-[6.5px] pl-[5px]">
              {Task.map((task) => task)
                .filter((i: any) => i !== false)
                .map((task: any, index: number) => (
                  <div
                    key={index}
                    className={`my-2 px-3 text-[14px] ${
                      index !== Task.length - 1 &&
                      "border-r border-r-lightSilver"
                    } cursor-pointer font-semibold hover:text-[#0592C6] text-slatyGrey`}
                    onClick={() => handleTabClick(index)}
                  >
                    {task}
                  </div>
                ))}
            </div>
            <Tooltip title="Close" placement="left" arrow>
              <IconButton className="mr-[10px]" onClick={handleClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="overflow-y-scroll !h-[91%]">
          <form onSubmit={handleSubmit}>
            {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
              <div className="pt-1" id="tabpanel-0">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Task</span>
                  </span>
                  <div className="flex gap-4">
                    {onEdit > 0 && (
                      <span>Created By : {editData.CreatedByName}</span>
                    )}
                    <span
                      className={`cursor-pointer ${
                        taskApprovalsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setTaskApprovalsDrawer(!taskApprovalsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                {taskApprovalsDrawer && (
                  <Grid container className="px-8">
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={clientApprovalsDropdownData}
                        value={
                          clientApprovalsDropdownData.find(
                            (i: any) => i.value === clientNameApprovals
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setClientNameApprovals(value.value);
                          setTypeOfWorkApprovals(0);
                          setTypeOfWorkApprovalsErr(false);
                          setProjectNameApprovals(0);
                          setProjectNameApprovalsErr(false);
                          setProcessNameApprovals(0);
                          setProcessNameApprovalsErr(false);
                          setSubProcessApprovals(0);
                          setSubProcessApprovalsErr(false);
                          setDescriptionApprovals("");
                          setManagerApprovals(0);
                          setManagerApprovalsErr(false);
                          setPriorityApprovals(0);
                          setQuantityApprovals(1);
                          setQuantityApprovalsErr(false);
                          setReceiverDateApprovals("");
                          setReceiverDateApprovalsErr(false);
                          setDueDateApprovals("");
                          assigneeDisableApprovals && setAssigneeApprovals(0);
                          assigneeDisableApprovals &&
                            setAssigneeApprovalsErr(false);
                          setReviewerApprovals(0);
                          setReviewerApprovalsErr(false);
                          setReturnYearApprovals(0);
                          setNoOfPagesApprovals(0);
                          setChecklistWorkpaperApprovals(0);
                        }}
                        disabled={isCreatedByClient && editData.ClientId > 0}
                        sx={{ mx: 0.75, width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Client Name
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={clientNameApprovalsErr}
                            onBlur={(e) => {
                              if (clientNameApprovals > 0) {
                                setClientNameApprovalsErr(false);
                              }
                            }}
                            helperText={
                              clientNameApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, width: 300, mt: -0.3 }}
                        error={typeOfWorkApprovalsErr}
                        disabled={isCreatedByClient && editData.WorkTypeId > 0}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Type of Work
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            typeOfWorkApprovals === 0 ? "" : typeOfWorkApprovals
                          }
                          onChange={(e) => {
                            assigneeDisableApprovals && setAssigneeApprovals(0);
                            assigneeDisableApprovals &&
                              setAssigneeApprovalsErr(false);
                            setReviewerApprovals(0);
                            setReviewerApprovalsErr(false);
                            setTypeOfWorkApprovals(e.target.value);
                            setReturnYearApprovals(0);
                            setNoOfPagesApprovals(0);
                            setChecklistWorkpaperApprovals(0);
                          }}
                          onBlur={(e: any) => {
                            if (e.target.value > 0) {
                              setTypeOfWorkApprovalsErr(false);
                            }
                          }}
                        >
                          {workTypeApprovalsDropdownData.map(
                            (i: any, index: number) => (
                              <MenuItem value={i.value} key={index}>
                                {i.label}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        {typeOfWorkApprovalsErr && (
                          <FormHelperText>
                            This is a required field.
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={projectApprovalsDropdownData}
                        value={
                          projectApprovalsDropdownData.find(
                            (i: any) => i.value === projectNameApprovals
                          ) || null
                        }
                        disabled={isCreatedByClient && editData.ProjectId > 0}
                        onChange={(e, value: any) => {
                          value && setProjectNameApprovals(value.value);
                        }}
                        sx={{ mx: 0.75, width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Project Name
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={projectNameApprovalsErr}
                            onBlur={(e) => {
                              if (projectNameApprovals > 0) {
                                setProjectNameApprovalsErr(false);
                              }
                            }}
                            helperText={
                              projectNameApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        id="combo-box-demo"
                        options={
                          onEdit === 0
                            ? statusApprovalsDropdownData
                            : statusApprovalsDropdownDataUse
                        }
                        value={
                          onEdit === 0
                            ? statusApprovalsDropdownData.find(
                                (i: any) => i.value === statusApprovals
                              ) || null
                            : statusApprovalsDropdownDataUse.find(
                                (i: any) => i.value === statusApprovals
                              ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setStatusApprovals(value.value);
                        }}
                        sx={{ mx: 0.75, width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Status
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={statusApprovalsErr}
                            onBlur={(e) => {
                              if (subProcessApprovals > 0) {
                                setStatusApprovalsErr(false);
                              }
                            }}
                            helperText={
                              statusApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={processApprovalsDropdownData}
                        value={
                          processApprovalsDropdownData.find(
                            (i: any) => i.value === processNameApprovals
                          ) || null
                        }
                        disabled={isCreatedByClient && editData.ProcessId > 0}
                        onChange={(e, value: any) => {
                          value && setProcessNameApprovals(value.value);
                          value && setSubProcessApprovals(0);
                        }}
                        sx={{ mx: 0.75, width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Process Name
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={processNameApprovalsErr}
                            onBlur={(e) => {
                              if (processNameApprovals > 0) {
                                setProcessNameApprovalsErr(false);
                              }
                            }}
                            helperText={
                              processNameApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={subProcessApprovalsDropdownData}
                        value={
                          subProcessApprovalsDropdownData.find(
                            (i: any) => i.value === subProcessApprovals
                          ) || null
                        }
                        disabled={
                          isCreatedByClient && editData.SubProcessId > 0
                        }
                        onChange={(e, value: any) => {
                          value && setSubProcessApprovals(value.value);
                        }}
                        sx={{ mx: 0.75, width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Sub-Process
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={subProcessApprovalsErr}
                            onBlur={(e) => {
                              if (subProcessApprovals > 0) {
                                setSubProcessApprovalsErr(false);
                              }
                            }}
                            helperText={
                              subProcessApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label={
                          <span>
                            Task Name
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        className="pt-1"
                        value={
                          clientTaskNameApprovals?.trim().length <= 0
                            ? ""
                            : clientTaskNameApprovals
                        }
                        onChange={(e) => {
                          setClientTaskNameApprovals(e.target.value);
                          setClientTaskNameApprovalsErr(false);
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value.trim().length > 4) {
                            setClientTaskNameApprovalsErr(false);
                          }
                          if (
                            e.target.value.trim().length > 4 &&
                            e.target.value.trim().length < 50
                          ) {
                            setClientTaskNameApprovalsErr(false);
                          }
                        }}
                        error={clientTaskNameApprovalsErr}
                        helperText={
                          clientTaskNameApprovalsErr &&
                          clientTaskNameApprovals?.trim().length > 0 &&
                          clientTaskNameApprovals?.trim().length < 4
                            ? "Minimum 4 characters required."
                            : clientTaskNameApprovalsErr &&
                              clientTaskNameApprovals?.trim().length > 50
                            ? "Maximum 50 characters allowed."
                            : clientTaskNameApprovalsErr
                            ? "This is a required field."
                            : ""
                        }
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, width: 300, mt: -0.5 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label="Description"
                        fullWidth
                        className="pt-1"
                        value={
                          descriptionApprovals?.trim().length <= 0
                            ? ""
                            : descriptionApprovals
                        }
                        onChange={(e) =>
                          setDescriptionApprovals(e.target.value)
                        }
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, width: 300, mt: -0.5 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, width: 300, mt: -1.2 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Priority
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            priorityApprovals === 0 ? "" : priorityApprovals
                          }
                          onChange={(e) => setPriorityApprovals(e.target.value)}
                        >
                          <MenuItem value={1}>High</MenuItem>
                          <MenuItem value={2}>Medium</MenuItem>
                          <MenuItem value={3}>Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label="Estimated Time"
                        disabled
                        fullWidth
                        value={
                          subProcessApprovals > 0
                            ? (estTimeDataApprovals as any[])
                                .map((i) => {
                                  const hours = Math.floor(
                                    i.EstimatedHour / 3600
                                  );
                                  const minutes = Math.floor(
                                    (i.EstimatedHour % 3600) / 60
                                  );
                                  const remainingSeconds = i.EstimatedHour % 60;
                                  const formattedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedSeconds = remainingSeconds
                                    .toString()
                                    .padStart(2, "0");
                                  return subProcessApprovals === i.Id
                                    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
                                    : null;
                                })
                                .filter((i) => i !== null)
                            : ""
                        }
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, width: 300, mt: -0.8 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label={
                          <span>
                            Quantity
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        onFocus={(e) =>
                          e.target.addEventListener(
                            "wheel",
                            function (e) {
                              e.preventDefault();
                            },
                            { passive: false }
                          )
                        }
                        type="number"
                        fullWidth
                        value={quantityApprovals}
                        onChange={(e) => {
                          setQuantityApprovals(e.target.value);
                          setQuantityApprovalsErr(false);
                        }}
                        onBlur={(e: any) => {
                          if (
                            e.target.value.trim().length > 0 &&
                            e.target.value.trim().length < 5 &&
                            !e.target.value.trim().includes(".")
                          ) {
                            setQuantityApprovalsErr(false);
                          }
                        }}
                        error={quantityApprovalsErr}
                        helperText={
                          quantityApprovalsErr &&
                          quantityApprovals.toString().includes(".")
                            ? "Only intiger value allowed."
                            : quantityApprovalsErr && quantityApprovals === ""
                            ? "This is a required field."
                            : quantityApprovalsErr && quantityApprovals <= 0
                            ? "Enter valid number."
                            : quantityApprovalsErr &&
                              quantityApprovals.length > 4
                            ? "Maximum 4 numbers allowed."
                            : ""
                        }
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, width: 300, mt: -0.8 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label="Standard Time"
                        fullWidth
                        value={
                          subProcessApprovals > 0
                            ? (estTimeDataApprovals as any[])
                                .map((i) => {
                                  const hours = Math.floor(
                                    (i.EstimatedHour * quantityApprovals) / 3600
                                  );
                                  const minutes = Math.floor(
                                    ((i.EstimatedHour * quantityApprovals) %
                                      3600) /
                                      60
                                  );
                                  const remainingSeconds =
                                    (i.EstimatedHour * quantityApprovals) % 60;
                                  const formattedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedSeconds = remainingSeconds
                                    .toString()
                                    .padStart(2, "0");
                                  return subProcessApprovals === i.Id
                                    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
                                    : null;
                                })
                                .filter((i) => i !== null)
                            : ""
                        }
                        disabled
                        margin="normal"
                        variant="standard"
                        sx={{
                          mx: 0.75,
                          maxWidth: 300,
                          mt: typeOfWorkApprovals === 3 ? -0.9 : -0.8,
                        }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <div
                        className={`inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          receiverDateApprovalsErr ? "datepickerError" : ""
                        }`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Received Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            onError={() => setReceiverDateApprovalsErr(false)}
                            value={
                              receiverDateApprovals === ""
                                ? null
                                : dayjs(receiverDateApprovals)
                            }
                            shouldDisableDate={isWeekend}
                            maxDate={dayjs(Date.now())}
                            onChange={(newDate: any) => {
                              setReceiverDateApprovals(newDate.$d);
                              setReceiverDateApprovalsErr(false);
                              const selectedDate = dayjs(newDate.$d);
                              let nextDate: any = selectedDate;
                              if (
                                selectedDate.day() === 4 ||
                                selectedDate.day() === 5
                              ) {
                                nextDate = nextDate.add(4, "day");
                              } else {
                                nextDate = dayjs(newDate.$d)
                                  .add(2, "day")
                                  .toDate();
                              }
                              setDueDateApprovals(nextDate);
                            }}
                            slotProps={{
                              textField: {
                                helperText: receiverDateApprovalsErr
                                  ? "This is a required field."
                                  : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <div className="inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Due Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            value={
                              dueDateApprovals === ""
                                ? null
                                : dayjs(dueDateApprovals)
                            }
                            disabled
                            onChange={(newDate: any) => {
                              setDueDateApprovals(newDate.$d);
                            }}
                            slotProps={{
                              textField: {
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <div
                        className={`inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          receiverDateApprovalsErr ? "datepickerError" : ""
                        }`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="All Info Date"
                            value={
                              allInfoDateApprovals === ""
                                ? null
                                : dayjs(allInfoDateApprovals)
                            }
                            onChange={(newDate: any) =>
                              setAllInfoDateApprovals(newDate.$d)
                            }
                          />
                        </LocalizationProvider>
                      </div>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assigneeApprovalsDropdownData}
                        disabled={!assigneeDisableApprovals}
                        value={
                          assigneeApprovalsDropdownData.find(
                            (i: any) => i.value === assigneeApprovals
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setAssigneeApprovals(value.value);
                        }}
                        sx={{ width: 300, mt: -1, mx: 0.75 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Assignee
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={assigneeApprovalsErr}
                            onBlur={(e) => {
                              if (assigneeApprovals > 0) {
                                setAssigneeApprovalsErr(false);
                              }
                            }}
                            helperText={
                              assigneeApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      className={`${
                        typeOfWorkApprovals === 3 ? "pt-4" : "pt-5"
                      }`}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={reviewerApprovalsDropdownData}
                        value={
                          reviewerApprovalsDropdownData.find(
                            (i: any) => i.value === reviewerApprovals
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setReviewerApprovals(value.value);
                        }}
                        sx={{
                          width: 300,
                          mt: typeOfWorkApprovals === 3 ? 0.2 : -1,
                          mx: 0.75,
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Reviewer
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={reviewerApprovalsErr}
                            onBlur={(e) => {
                              if (reviewerApprovals > 0) {
                                setReviewerApprovalsErr(false);
                              }
                            }}
                            helperText={
                              reviewerApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      className={`${
                        typeOfWorkApprovals === 3 ? "pt-4" : "pt-5"
                      }`}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={managerApprovalsDropdownData}
                        value={
                          managerApprovalsDropdownData.find(
                            (i: any) => i.value === managerApprovals
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setManagerApprovals(value.value);
                        }}
                        sx={{
                          width: 300,
                          mt: typeOfWorkApprovals === 3 ? 0.2 : -1,
                          mx: 0.75,
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Manager
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={managerApprovalsErr}
                            onBlur={(e) => {
                              if (managerApprovals > 0) {
                                setManagerApprovalsErr(false);
                              }
                            }}
                            helperText={
                              managerApprovalsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    {typeOfWorkApprovals === 3 && (
                      <>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ width: 300, mt: -0.3, mx: 0.75 }}
                            error={returnYearApprovalsErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Return Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={
                                returnYearApprovals === 0
                                  ? ""
                                  : returnYearApprovals
                              }
                              onChange={(e) =>
                                setReturnYearApprovals(e.target.value)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setReturnYearApprovalsErr(false);
                                }
                              }}
                            >
                              {yearDropdown.map((i: any, index: number) => (
                                <MenuItem value={i.value} key={index}>
                                  {i.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {returnYearApprovalsErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <TextField
                            label="No of Pages"
                            type="number"
                            fullWidth
                            value={
                              noOfPagesApprovals === 0 ? "" : noOfPagesApprovals
                            }
                            onChange={(e) =>
                              setNoOfPagesApprovals(e.target.value)
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ width: 300, mt: 0, mx: 0.75 }}
                          />
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ width: 300, mt: -0.8, mx: 0.75 }}
                            error={checklistWorkpaperApprovalsErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Checklist/Workpaper
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={
                                checklistWorkpaperApprovals === 0
                                  ? ""
                                  : checklistWorkpaperApprovals
                              }
                              onChange={(e) =>
                                setChecklistWorkpaperApprovals(e.target.value)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setChecklistWorkpaperApprovalsErr(false);
                                }
                              }}
                            >
                              <MenuItem value={1}>Yes</MenuItem>
                              <MenuItem value={2}>No</MenuItem>
                            </Select>
                            {checklistWorkpaperApprovalsErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    {onEdit > 0 && (
                      <>
                        <Grid
                          item
                          xs={3}
                          className={`${
                            typeOfWorkApprovals === 3 ? "pt-4" : "pt-5"
                          }`}
                        >
                          <TextField
                            label="Date of Preperation"
                            type={inputTypePreperation}
                            disabled
                            fullWidth
                            value={dateOfPreperationApprovals}
                            onChange={(e) =>
                              setDateOfPreperationApprovals(e.target.value)
                            }
                            onFocus={() => setInputTypePreperation("date")}
                            onBlur={(e: any) => {
                              setInputTypePreperation("text");
                            }}
                            margin="normal"
                            variant="standard"
                            sx={{
                              width: 300,
                              mt: typeOfWorkApprovals === 3 ? -0.4 : -1,
                              mx: 0.75,
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          className={`${
                            typeOfWorkApprovals === 3 ? "pt-4" : "pt-5"
                          }`}
                        >
                          <TextField
                            label="Date of Review"
                            disabled
                            type={inputTypeReview}
                            fullWidth
                            value={dateOfReviewApprovals}
                            onChange={(e) =>
                              setDateOfReviewApprovals(e.target.value)
                            }
                            onFocus={() => setInputTypeReview("date")}
                            onBlur={(e: any) => {
                              setInputTypeReview("text");
                            }}
                            margin="normal"
                            variant="standard"
                            sx={{
                              width: 300,
                              mt: typeOfWorkApprovals === 3 ? -0.4 : -1,
                              mx: 0.75,
                            }}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              </div>
            )}

            {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-1">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Sub-Task</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && subTaskSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitSubTask}
                      >
                        Update
                      </Button>
                    )}
                    {hasPermissionWorklog(
                      "Task/SubTask",
                      "Save",
                      "WorkLogs"
                    ) ? (
                      <Switch
                        checked={subTaskSwitch}
                        onChange={(e) => {
                          setSubTaskSwitch(e.target.checked);
                          onEdit === 0 &&
                            setSubTaskFields([
                              {
                                SubtaskId: 0,
                                Title: "",
                                Description: "",
                              },
                            ]);
                          onEdit === 0 && setTaskNameErr([false]);
                          onEdit === 0 && setSubTaskDescriptionErr([false]);
                          onEdit === 0 && setDeletedSubTask([]);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        subTaskDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setSubTaskDrawer(!subTaskDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {subTaskDrawer && (
                  <div className="mt-3 pl-6">
                    {subTaskFields.map((field, index) => (
                      <div className="w-[100%] flex" key={field.SubtaskId}>
                        <TextField
                          label={
                            <span>
                              Task Name
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          disabled={!subTaskSwitch}
                          value={field.Title}
                          onChange={(e) => handleSubTaskChange(e, index)}
                          onBlur={(e: any) => {
                            if (e.target.value.trim().length > 0) {
                              const newTaskNameErrors = [...taskNameErr];
                              newTaskNameErrors[index] = false;
                              setTaskNameErr(newTaskNameErrors);
                            }
                          }}
                          error={taskNameErr[index]}
                          helperText={
                            taskNameErr[index] &&
                            field.Title.length > 0 &&
                            field.Title.length < 5
                              ? "Minumum 5 characters required."
                              : taskNameErr[index] && field.Title.length > 500
                              ? "Maximum 500 characters allowed."
                              : taskNameErr[index]
                              ? "This is a required field."
                              : ""
                          }
                          margin="normal"
                          variant="standard"
                          sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                        />
                        <TextField
                          label={
                            <span>
                              Description
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          disabled={!subTaskSwitch}
                          value={field.Description}
                          onChange={(e) =>
                            handleSubTaskDescriptionChange(e, index)
                          }
                          onBlur={(e: any) => {
                            if (e.target.value.trim().length > 0) {
                              const newSubTaskDescErrors = [
                                ...subTaskDescriptionErr,
                              ];
                              newSubTaskDescErrors[index] = false;
                              setSubTaskDescriptionErr(newSubTaskDescErrors);
                            }
                          }}
                          error={subTaskDescriptionErr[index]}
                          helperText={
                            subTaskDescriptionErr[index] &&
                            field.Description.length > 0 &&
                            field.Description.length < 5
                              ? "Minumum 5 characters required."
                              : subTaskDescriptionErr[index] &&
                                field.Description.length > 500
                              ? "Maximum 500 characters allowed."
                              : subTaskDescriptionErr[index]
                              ? "This is a required field."
                              : ""
                          }
                          margin="normal"
                          variant="standard"
                          sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                        />
                        {index === 0 ? (
                          <span
                            className="cursor-pointer"
                            onClick={addTaskField}
                          >
                            <svg
                              className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              data-testid="AddIcon"
                            >
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                            </svg>
                          </span>
                        ) : (
                          <span
                            className="cursor-pointer"
                            onClick={() => removeTaskField(index)}
                          >
                            <svg
                              className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              data-testid="RemoveIcon"
                            >
                              <path d="M19 13H5v-2h14v2z"></path>
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {hasPermissionWorklog("CheckList", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-2">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <CheckListIcon />
                    <span className="ml-[21px]">Checklist</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      checkListDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setCheckListDrawer(!checkListDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                <div className="pl-12 mt-5">
                  {checkListDrawer &&
                    checkListData?.length > 0 &&
                    checkListData.map((i: any, index: number) => (
                      <div className="mt-3">
                        <span className="flex items-center">
                          <span onClick={() => toggleGeneralOpen(index)}>
                            {itemStates[index] ? <RemoveIcon /> : <AddIcon />}
                          </span>
                          <span className="text-large font-semibold mr-6">
                            {i.Category}
                          </span>
                          {/* <ThreeDotIcon /> */}
                        </span>
                        {itemStates[index] && (
                          <FormGroup className="ml-8 mt-2">
                            {i.Activities.map((j: any, index: number) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={j.IsCheck}
                                    onChange={(e) =>
                                      hasPermissionWorklog(
                                        "CheckList",
                                        "save",
                                        "WorkLogs"
                                      ) &&
                                      handleChangeChecklist(
                                        i.Category,
                                        e.target.checked,
                                        j.Title
                                      )
                                    }
                                  />
                                }
                                label={j.Title}
                              />
                            ))}
                          </FormGroup>
                        )}
                        {hasPermissionWorklog(
                          "CheckList",
                          "save",
                          "WorkLogs"
                        ) &&
                          itemStates[index] &&
                          !itemStates[`addChecklistField_${index}`] && (
                            <span
                              className="flex items-center gap-3 ml-8 cursor-pointer text-[#6E6D7A]"
                              onClick={() => toggleAddChecklistField(index)}
                            >
                              <AddIcon /> Add new checklist item
                            </span>
                          )}
                        {itemStates[index] &&
                          itemStates[`addChecklistField_${index}`] && (
                            <>
                              <TextField
                                label={
                                  <span>
                                    Add Name
                                    <span className="text-defaultRed">
                                      &nbsp;*
                                    </span>
                                  </span>
                                }
                                fullWidth
                                className="ml-8"
                                value={
                                  checkListName?.trim().length <= 0
                                    ? ""
                                    : checkListName
                                }
                                onChange={(e) => {
                                  setCheckListName(e.target.value);
                                  setCheckListNameError(false);
                                }}
                                onBlur={(e: any) => {
                                  if (e.target.value.trim().length > 5) {
                                    setCheckListNameError(false);
                                  }
                                  if (
                                    e.target.value.trim().length > 5 &&
                                    e.target.value.trim().length < 500
                                  ) {
                                    setCheckListNameError(false);
                                  }
                                }}
                                error={checkListNameError}
                                helperText={
                                  checkListNameError &&
                                  checkListName.trim().length > 0 &&
                                  checkListName.trim().length < 5
                                    ? "Minimum 5 characters required."
                                    : checkListNameError &&
                                      checkListName.trim().length > 500
                                    ? "Maximum 500 characters allowed."
                                    : checkListNameError
                                    ? "This is a required field."
                                    : ""
                                }
                                margin="normal"
                                variant="standard"
                                sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                              />
                              <Button
                                type="button"
                                variant="contained"
                                className="rounded-[4px] !h-[36px] mr-6 !bg-secondary mt-2"
                                onClick={() =>
                                  handleSaveCheckListName(i.Category, index)
                                }
                              >
                                <span className="flex items-center justify-center gap-[10px] px-[5px]">
                                  Save
                                </span>
                              </Button>
                            </>
                          )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {hasPermissionWorklog("Comment", "View", "WorkLogs") && (
              <div className="mt-14" id={`${onEdit > 0 && "tabpanel-3"}`}>
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <CommentsIcon />
                    <span className="ml-[21px]">Comments</span>
                    <FormControl
                      variant="standard"
                      sx={{ mx: 0.75, minWidth: 100, ml: 5 }}
                    >
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={commentSelect}
                        onChange={(e) => {
                          setCommentSelect(e.target.value);
                          getCommentData(e.target.value);
                        }}
                      >
                        <MenuItem value={1}>Internal</MenuItem>
                        <MenuItem value={2}>External</MenuItem>
                      </Select>
                    </FormControl>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      commentsDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setCommentsDrawer(!commentsDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                <div className="my-5 px-16">
                  <div className="flex flex-col gap-4">
                    {commentsDrawer &&
                      commentData.length > 0 &&
                      commentData.map((i: any, index: number) => (
                        <div className="flex gap-4">
                          {i.UserName.length > 0 ? (
                            <Avatar>
                              {i.UserName.split(" ")
                                .map((word: any) =>
                                  word.charAt(0).toUpperCase()
                                )
                                .join("")}
                            </Avatar>
                          ) : (
                            <Avatar sx={{ width: 32, height: 32 }} />
                          )}
                          <div>
                            <Typography>{i.UserName}</Typography>
                            <Typography>
                              {i.SubmitedDate},&nbsp;
                              {new Date(
                                `1970-01-01T${i.SubmitedTime}:00Z`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                            <div className="flex items-center gap-2">
                              {editingCommentIndex === index ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col">
                                    <div className="flex items-start justify-center">
                                      <MentionsInput
                                        style={mentionsInputStyle}
                                        className="!w-[100%] textareaOutlineNoneEdit"
                                        value={valueEdit}
                                        onChange={(e) => {
                                          setValueEdit(e.target.value);
                                          setValueEditError(false);
                                          handleCommentChange(e.target.value);
                                        }}
                                        placeholder="Type a next message OR type @ if you want to mention anyone in the message."
                                      >
                                        <Mention
                                          data={users}
                                          style={{
                                            backgroundColor: "#cee4e5",
                                          }}
                                          trigger="@"
                                        />
                                      </MentionsInput>
                                      <div className="flex flex-col">
                                        <div className="flex">
                                          <ImageUploader
                                            className="!mt-0"
                                            getData={(data1: any, data2: any) =>
                                              handleCommentAttachmentsChange(
                                                data1,
                                                data2,
                                                commentAttachment
                                              )
                                            }
                                            isDisable={false}
                                          />
                                        </div>
                                      </div>
                                      {commentAttachment[0]?.SystemFileName
                                        .length > 0 && (
                                        <div className="flex items-center justify-center gap-2">
                                          <span className="cursor-pointer">
                                            {commentAttachment[0]?.UserFileName}
                                          </span>
                                          <span
                                            onClick={() =>
                                              getFileFromBlob(
                                                commentAttachment[0]
                                                  ?.SystemFileName,
                                                commentAttachment[0]
                                                  ?.UserFileName
                                              )
                                            }
                                          >
                                            <ColorToolTip
                                              title="Download"
                                              placement="top"
                                              arrow
                                            >
                                              <Download />
                                            </ColorToolTip>
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      {valueEditError &&
                                      valueEdit.trim().length > 1 &&
                                      valueEdit.trim().length < 5 ? (
                                        <span className="text-defaultRed text-[14px]">
                                          Minimum 5 characters required.
                                        </span>
                                      ) : valueEditError &&
                                        valueEdit.trim().length > 500 ? (
                                        <span className="text-defaultRed text-[14px]">
                                          Maximum 500 characters allowed.
                                        </span>
                                      ) : (
                                        valueEditError && (
                                          <span className="text-defaultRed text-[14px]">
                                            This is a required field.
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="!bg-secondary text-white border rounded-md px-[4px]"
                                    onClick={(e) =>
                                      handleSaveClick(e, i, commentSelect)
                                    }
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="hidden"></span>
                                  <div className="flex items-start">
                                    {extractText(i.Message).map((i: any) => {
                                      const assignee =
                                        assigneeApprovalsDropdownData.map(
                                          (j: any) => j.label
                                        );
                                      return assignee.includes(i) ? (
                                        <span
                                          className="text-secondary"
                                          key={index}
                                        >
                                          &nbsp; {i} &nbsp;
                                        </span>
                                      ) : (
                                        i
                                      );
                                    })}
                                  </div>
                                  {i.Attachment[0]?.SystemFileName.length >
                                    0 && (
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="cursor-pointer">
                                        {i.Attachment[0]?.UserFileName}
                                      </span>
                                      <span
                                        onClick={() =>
                                          getFileFromBlob(
                                            i.Attachment[0]?.SystemFileName,
                                            i.Attachment[0]?.UserFileName
                                          )
                                        }
                                      >
                                        <ColorToolTip
                                          title="Download"
                                          placement="top"
                                          arrow
                                        >
                                          <Download />
                                        </ColorToolTip>
                                      </span>
                                    </div>
                                  )}
                                  {userId === i.UserId &&
                                    hasPermissionWorklog(
                                      "Comment",
                                      "save",
                                      "WorkLogs"
                                    ) && (
                                      <button
                                        type="button"
                                        className="flex items-start !bg-secondary text-white border rounded-md p-[4px]"
                                        onClick={() => {
                                          handleEditClick(index, i.Message);
                                          setCommentAttachment([
                                            {
                                              AttachmentId:
                                                i.Attachment[0].AttachmentId,
                                              UserFileName:
                                                i.Attachment[0].UserFileName,
                                              SystemFileName:
                                                i.Attachment[0].SystemFileName,
                                              AttachmentPath:
                                                process.env.attachment,
                                            },
                                          ]);
                                        }}
                                      >
                                        <EditIcon className="h-4 w-4" />
                                      </button>
                                    )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {commentsDrawer &&
                  hasPermissionWorklog("Comment", "save", "WorkLogs") && (
                    <>
                      <div className="border border-slatyGrey gap-2 py-2 rounded-lg my-2 ml-16 mr-8 flex items-center justify-center">
                        <MentionsInput
                          style={mentionsInputStyle}
                          className="!w-[92%] textareaOutlineNone"
                          value={value}
                          onChange={(e) => {
                            setValue(e.target.value);
                            setValueError(false);
                            handleCommentChange(e.target.value);
                          }}
                          placeholder="Type a next message OR type @ if you want to mention anyone in the message."
                        >
                          <Mention
                            data={users}
                            style={{ backgroundColor: "#cee4e5" }}
                            trigger="@"
                          />
                        </MentionsInput>
                        <div className="flex flex-col">
                          <div className="flex">
                            <ImageUploader
                              className="!mt-0"
                              getData={(data1: any, data2: any) =>
                                handleCommentAttachmentsChange(
                                  data1,
                                  data2,
                                  commentAttachment
                                )
                              }
                              isDisable={false}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="!bg-secondary text-white p-[6px] rounded-md cursor-pointer mr-2"
                          onClick={(e) => handleSubmitComment(e, commentSelect)}
                        >
                          <SendIcon />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {valueError &&
                          value.trim().length > 1 &&
                          value.trim().length < 5 ? (
                            <span className="text-defaultRed text-[14px] ml-20">
                              Minimum 5 characters required.
                            </span>
                          ) : valueError && value.trim().length > 500 ? (
                            <span className="text-defaultRed text-[14px] ml-20">
                              Maximum 500 characters allowed.
                            </span>
                          ) : (
                            valueError && (
                              <span className="text-defaultRed text-[14px] ml-20">
                                This is a required field.
                              </span>
                            )
                          )}
                        </div>
                        {commentAttachment[0].AttachmentId === 0 &&
                          commentAttachment[0]?.SystemFileName.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mr-6">
                              <span className="ml-2 cursor-pointer">
                                {commentAttachment[0]?.UserFileName}
                              </span>
                              <span
                                onClick={() =>
                                  getFileFromBlob(
                                    commentAttachment[0]?.SystemFileName,
                                    commentAttachment[0]?.UserFileName
                                  )
                                }
                              >
                                <ColorToolTip
                                  title="Download"
                                  placement="top"
                                  arrow
                                >
                                  <Download />
                                </ColorToolTip>
                              </span>
                            </div>
                          )}
                      </div>
                    </>
                  )}
              </div>
            )}

            {hasPermissionWorklog("Reccuring", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-4">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Recurring</span>
                  </span>

                  <span
                    className={`cursor-pointer ${
                      recurringDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setRecurringDrawer(!recurringDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {recurringDrawer && (
                  <>
                    <div className="mt-0 pl-6">
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Start Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            maxDate={dayjs(recurringEndDate)}
                            value={
                              recurringStartDate === ""
                                ? null
                                : dayjs(recurringStartDate)
                            }
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                End Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            minDate={dayjs(recurringStartDate)}
                            value={
                              recurringEndDate === ""
                                ? null
                                : dayjs(recurringEndDate)
                            }
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="mt-0 pl-6">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 145 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {recurringTime === 1 ? (
                            <span>
                              Day
                              <span className="text-defaultRed">&nbsp;*</span>
                            </span>
                          ) : recurringTime === 2 ? (
                            <span>
                              Week
                              <span className="text-defaultRed">&nbsp;*</span>
                            </span>
                          ) : (
                            <span>
                              Month
                              <span className="text-defaultRed">&nbsp;*</span>
                            </span>
                          )}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={recurringTime === 0 ? "" : recurringTime}
                          readOnly
                        >
                          <MenuItem value={1}>Day</MenuItem>
                          <MenuItem value={2}>Week</MenuItem>
                          <MenuItem value={3}>Month</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {recurringTime === 2 && (
                      <div className="pl-4 m-2 flex">
                        {days.map((day, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-[50%] m-[5px] ${
                              selectedDays.includes(index)
                                ? "text-pureWhite bg-secondary"
                                : "text-slatyGrey"
                            }`}
                            onClick={() => toggleColor(index)}
                          >
                            {day[0]}
                          </div>
                        ))}
                      </div>
                    )}
                    {recurringTime === 3 && (
                      <div className="mt-[10px] pl-6">
                        <Autocomplete
                          multiple
                          limitTags={2}
                          id="checkboxes-tags-demo"
                          options={Array.isArray(months) ? months : []}
                          value={
                            Array.isArray(recurringMonth) ? recurringMonth : []
                          }
                          getOptionLabel={(option) => option.label}
                          disableCloseOnSelect
                          onChange={handleMultiSelectMonth}
                          style={{ width: 500 }}
                          readOnly
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <span>
                                  Month
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              placeholder="Please Select..."
                              variant="standard"
                            />
                          )}
                          sx={{ mx: 0.75, maxWidth: 350, mt: 2 }}
                        />
                      </div>
                    )}
                    <span
                      className={`flex flex-col items-start ${
                        recurringTime === 3 && "mt-2"
                      }`}
                    >
                      <span className="text-darkCharcoal ml-8 text-[14px]">
                        {recurringTime === 1
                          ? "Occurs every day"
                          : recurringTime === 2
                          ? `Occurs every ${selectedDays
                              .sort()
                              .map((day: any) => " " + days[day])} ${
                              selectedDays.length <= 0 && "day"
                            } starting from today`
                          : recurringTime === 3 &&
                            "Occurs every month starting from today"}
                      </span>
                    </span>
                  </>
                )}
              </div>
            )}

            {(isManual === true || isManual === null) && (
              <div
                className="mt-14"
                id={`${
                  isManual === true || isManual === null ? "tabpanel-5" : ""
                }`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <ClockIcon />
                    <span className="ml-[21px]">Manual Time</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      manualTimeDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setManualTimeDrawer(!manualTimeDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {manualTimeDrawer && (
                  <>
                    <div className="-mt-2 pl-6">
                      {manualFields.map((field) => (
                        <div key={field.Id}>
                          <div
                            className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[230px]`}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={
                                  <span>
                                    Date
                                    <span className="!text-defaultRed">
                                      &nbsp;*
                                    </span>
                                  </span>
                                }
                                value={
                                  field.inputDate === ""
                                    ? null
                                    : dayjs(field.inputDate)
                                }
                                readOnly
                              />
                            </LocalizationProvider>
                          </div>
                          <TextField
                            label={
                              <span>
                                Start Time(24h)
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            placeholder="00:00:00"
                            fullWidth
                            value={field.startTime}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230 }}
                          />
                          <TextField
                            label={
                              <span>
                                End Time(24h)
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            placeholder="00:00:00"
                            fullWidth
                            value={field.endTime}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230 }}
                          />
                          {/* <TextField
                            label="Total Time"
                            disabled
                            fullWidth
                            type={
                              field.startTime && field.endTime !== ""
                                ? "time"
                                : "text"
                            }
                            value={field.totalTime}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                          /> */}
                          <TextField
                            label="Total Time"
                            disabled
                            fullWidth
                            value={field.totalTime}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                          />
                          <TextField
                            label={
                              <span>
                                Description
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            className="mt-4"
                            fullWidth
                            value={field.manualDesc}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230, mt: 2 }}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {isPartiallySubmitted && (
              <div
                className="mt-14"
                id={`${
                  isManual === true || isManual === null
                    ? "tabpanel-6"
                    : isPartiallySubmitted && "tabpanel-5"
                }`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <ClockIcon />
                    <span className="ml-[21px]">Reviewer Manual Time</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && manualSwitch && (
                      <Button
                        variant="contained"
                        className={`rounded-[4px] !h-[36px] mr-6 ${
                          manualSubmitDisable ? "" : "!bg-secondary"
                        }`}
                        disabled={manualSubmitDisable}
                        onClick={
                          manualSubmitDisable
                            ? undefined
                            : saveReviewerManualTimelog
                        }
                      >
                        Update
                      </Button>
                    )}
                    <Switch
                      checked={manualSwitch}
                      onChange={(e) => {
                        setManualSwitch(e.target.checked);
                        setReviewerManualFields([
                          {
                            AssigneeId: 0,
                            Id: 0,
                            inputDate: "",
                            startTime: "",
                            endTime: "",
                            totalTime: "",
                            manualDesc: "",
                            IsApproved: false,
                          },
                        ]);
                        setInputDateErrors([false]);
                        setStartTimeErrors([false]);
                        setEndTimeErrors([false]);
                        setManualDescErrors([false]);
                        setInputTypeDate(["text"]);
                        setManualDisableData([
                          {
                            AssigneeId: 0,
                            Id: 0,
                            inputDate: "",
                            startTime: "",
                            endTime: "",
                            totalTime: "",
                            manualDesc: "",
                            IsApproved: false,
                          },
                        ]);
                      }}
                    />
                    <span
                      className={`cursor-pointer ${
                        manualTimeDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setManualTimeDrawer(!manualTimeDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {manualTimeDrawer && (
                  <>
                    <div className="-mt-2 pl-6">
                      {reviewermanualFields.map((field, index) => (
                        <div key={field.Id} className="flex items-center">
                          <div
                            className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[230px] ${
                              inputDateErrors[index] ? "datepickerError" : ""
                            }`}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={
                                  <span>
                                    Date
                                    <span className="!text-defaultRed">
                                      &nbsp;*
                                    </span>
                                  </span>
                                }
                                minDate={dayjs(recurringStartDate)}
                                maxDate={dayjs(new Date())}
                                disabled={
                                  !manualSwitch ||
                                  field.IsApproved ||
                                  (field.AssigneeId !== 0 &&
                                    field.AssigneeId !== userId)
                                }
                                onError={() => {
                                  if (
                                    field.inputDate[index]?.trim().length > 0
                                  ) {
                                    const newInputDateErrors = [
                                      ...inputDateErrors,
                                    ];
                                    newInputDateErrors[index] = false;
                                    setInputDateErrors(newInputDateErrors);
                                  }
                                }}
                                value={
                                  field.inputDate === ""
                                    ? null
                                    : dayjs(field.inputDate)
                                }
                                onChange={(newDate: any) => {
                                  handleInputDateChange(newDate.$d, index);
                                }}
                                slotProps={{
                                  textField: {
                                    helperText: inputDateErrors[index]
                                      ? "This is a required field."
                                      : "",
                                    readOnly: true,
                                  } as Record<string, any>,
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                          <TextField
                            label={
                              <span>
                                Start Time(24h)
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            placeholder="00:00:00"
                            disabled={
                              !manualSwitch ||
                              field.IsApproved ||
                              (field.AssigneeId !== 0 &&
                                field.AssigneeId !== userId)
                            }
                            fullWidth
                            value={field.startTime}
                            onChange={(e) => handleStartTimeChange(e, index)}
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 7) {
                                const newStartTimeErrors = [...startTimeErrors];
                                newStartTimeErrors[index] = false;
                                setStartTimeErrors(newStartTimeErrors);
                              }
                            }}
                            error={startTimeErrors[index]}
                            helperText={
                              field.startTime.trim().length > 0 &&
                              field.startTime.trim().length < 8 &&
                              startTimeErrors[index]
                                ? "Start time must be in HH:MM:SS"
                                : field.startTime.trim().length <= 0 &&
                                  startTimeErrors[index]
                                ? "This is a required field"
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
                          />
                          <TextField
                            label={
                              <span>
                                End Time(24h)
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            placeholder="00:00:00"
                            disabled={
                              !manualSwitch ||
                              field.IsApproved ||
                              (field.AssigneeId !== 0 &&
                                field.AssigneeId !== userId)
                            }
                            fullWidth
                            value={field.endTime}
                            onChange={(e) => handleEndTimeChange(e, index)}
                            onBlur={(e: any) => {
                              if (
                                e.target.value.trim().length > 7 &&
                                field.endTime > field.startTime &&
                                field.startTime
                                  .split(":")
                                  .reduce(
                                    (acc, timePart, index) =>
                                      acc +
                                      parseInt(timePart) * [3600, 60, 1][index],
                                    0
                                  ) +
                                  "07:59:59"
                                    .split(":")
                                    .reduce(
                                      (acc, timePart, index) =>
                                        acc +
                                        parseInt(timePart) *
                                          [3600, 60, 1][index],
                                      0
                                    ) <
                                  field.endTime
                                    .split(":")
                                    .reduce(
                                      (acc, timePart, index) =>
                                        acc +
                                        parseInt(timePart) *
                                          [3600, 60, 1][index],
                                      0
                                    )
                              ) {
                                const newEndTimeErrors = [...endTimeErrors];
                                newEndTimeErrors[index] = false;
                                setEndTimeErrors(newEndTimeErrors);
                              }
                            }}
                            error={endTimeErrors[index]}
                            helperText={
                              field.startTime
                                .split(":")
                                .reduce(
                                  (acc, timePart, index) =>
                                    acc +
                                    parseInt(timePart) * [3600, 60, 1][index],
                                  0
                                ) +
                                "07:59:59"
                                  .split(":")
                                  .reduce(
                                    (acc, timePart, index) =>
                                      acc +
                                      parseInt(timePart) * [3600, 60, 1][index],
                                    0
                                  ) <
                              field.endTime
                                .split(":")
                                .reduce(
                                  (acc, timePart, index) =>
                                    acc +
                                    parseInt(timePart) * [3600, 60, 1][index],
                                  0
                                )
                                ? "Time must be less than 07:59:59"
                                : field.endTime.trim().length > 0 &&
                                  field.endTime.trim().length < 8 &&
                                  endTimeErrors[index]
                                ? "Start time must be in HH:MM:SS"
                                : field.endTime.trim().length <= 0 &&
                                  endTimeErrors[index]
                                ? "This is a required field"
                                : endTimeErrors[index] &&
                                  field.endTime <= field.startTime
                                ? "End time must be grater than start time"
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
                          />
                          <TextField
                            label="Total Time"
                            disabled
                            fullWidth
                            value={field.totalTime}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
                          />
                          <TextField
                            label={
                              <span>
                                Description
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            className="mt-4"
                            disabled={
                              !manualSwitch ||
                              field.IsApproved ||
                              (field.AssigneeId !== 0 &&
                                field.AssigneeId !== userId)
                            }
                            fullWidth
                            value={field.manualDesc}
                            onChange={(e) => handleManualDescChange(e, index)}
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 0) {
                                const newManualDescErrors = [
                                  ...manualDescErrors,
                                ];
                                newManualDescErrors[index] = false;
                                setManualDescErrors(newManualDescErrors);
                              }
                            }}
                            error={manualDescErrors[index]}
                            helperText={
                              manualDescErrors[index] &&
                              field.manualDesc.length > 0 &&
                              field.manualDesc.length < 5
                                ? "Minumum 5 characters required."
                                : manualDescErrors[index] &&
                                  field.manualDesc.length > 500
                                ? "Maximum 500 characters allowed."
                                : manualDescErrors[index]
                                ? "This is a required field."
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230, mt: 2 }}
                          />
                          {index === 0
                            ? manualSwitch && (
                                <span
                                  className="cursor-pointer"
                                  onClick={addManualField}
                                >
                                  <svg
                                    className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                    focusable="false"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    data-testid="AddIcon"
                                  >
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                                  </svg>
                                </span>
                              )
                            : manualSwitch &&
                              !field.IsApproved && (
                                <span
                                  className="cursor-pointer"
                                  onClick={() => removePhoneField(index)}
                                >
                                  <svg
                                    className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px] mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                    focusable="false"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    data-testid="RemoveIcon"
                                  >
                                    <path d="M19 13H5v-2h14v2z"></path>
                                  </svg>
                                </span>
                              )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("Reminder", "View", "WorkLogs") && (
              <div
                className="my-14"
                id={`${
                  (isManual === true || isManual === null) &&
                  isPartiallySubmitted
                    ? "tabpanel-7"
                    : (isManual === true || isManual === null) &&
                      !isPartiallySubmitted
                    ? "tabpanel-6"
                    : isManual === false && isPartiallySubmitted
                    ? "tabpanel-6"
                    : "tabpanel-5"
                }`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <BellIcon />
                    <span className="ml-[21px]">Reminder</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && reminderSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitReminder}
                      >
                        Update
                      </Button>
                    )}
                    {hasPermissionWorklog("Reminder", "Save", "WorkLogs") ? (
                      <Switch
                        checked={reminderSwitch}
                        onChange={(e) => {
                          setReminderSwitch(e.target.checked);
                          setReminderDate("");
                          setReminderDateErr(false);
                          setReminderTime(0);
                          setReminderTimeErr(false);
                          setReminderNotification(0);
                          setReminderNotificationErr(false);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        reminderDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setReminderDrawer(!reminderDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {reminderDrawer && (
                  <>
                    <div className="mt-2 pl-6">
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={reminderCheckboxValue}
                        name="radio-buttons-group"
                        row={true}
                        className="ml-2 gap-10"
                        onChange={(e) => {
                          setReminderCheckboxValue(parseInt(e.target.value));
                          onEdit === 0 && setReminderDate("");
                          setReminderDateErr(false);
                          onEdit === 0 && setReminderTime(0);
                          setReminderTimeErr(false);
                          onEdit === 0 && setReminderNotification(0);
                          setReminderNotificationErr(false);
                        }}
                      >
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={1}
                          control={<Radio />}
                          label="Due Date"
                        />
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={2}
                          control={<Radio />}
                          label="Specific Date"
                        />
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={3}
                          control={<Radio />}
                          label="Daily"
                        />
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={4}
                          control={<Radio />}
                          label="Days Before Due Date"
                        />
                      </RadioGroup>
                    </div>
                    <div className="pl-6 flex">
                      {reminderCheckboxValue === 2 && onEdit === 0 && (
                        <div
                          className={`inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                            reminderDateErr ? "datepickerError" : ""
                          }`}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={
                                <span>
                                  Date
                                  <span className="!text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              disabled={!reminderSwitch}
                              onError={() => setReminderDateErr(false)}
                              value={
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              onChange={(newDate: any) => {
                                setReminderDate(newDate.$d);
                                setReminderDateErr(false);
                              }}
                              slotProps={{
                                textField: {
                                  helperText: reminderDateErr
                                    ? "This is a required field."
                                    : "",
                                  readOnly: true,
                                } as Record<string, any>,
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      {reminderCheckboxValue === 2 && onEdit > 0 && (
                        <div
                          className={`inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                            reminderDateErr ? "datepickerError" : ""
                          }`}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={
                                <span>
                                  Date
                                  <span className="!text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              disabled={!reminderSwitch}
                              onError={() => setReminderDateErr(false)}
                              value={
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              onChange={(newDate: any) => {
                                setReminderDate(newDate.$d);
                                setReminderDateErr(false);
                              }}
                              slotProps={{
                                textField: {
                                  helperText: reminderDateErr
                                    ? "This is a required field."
                                    : "",
                                  readOnly: true,
                                } as Record<string, any>,
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 100 }}
                        error={reminderTimeErr}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Hour
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          disabled={!reminderSwitch}
                          value={reminderTime === 0 ? "" : reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          onBlur={(e: any) => {
                            if (e.target.value > 0) {
                              setReminderTimeErr(false);
                            }
                          }}
                        >
                          {hours.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {reminderTimeErr && (
                          <FormHelperText>
                            This is a required field.
                          </FormHelperText>
                        )}
                      </FormControl>
                      <Autocomplete
                        multiple
                        limitTags={2}
                        id="checkboxes-tags-demo"
                        disabled={!reminderSwitch}
                        options={
                          Array.isArray(assigneeApprovalsDropdownData)
                            ? assigneeApprovalsDropdownData
                            : []
                        }
                        value={
                          Array.isArray(reminderNotification)
                            ? reminderNotification
                            : []
                        }
                        getOptionLabel={(option) => option.label}
                        disableCloseOnSelect
                        onChange={handleMultiSelect}
                        style={{ width: 500 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <span>
                                Notify user Associated with the task
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            variant="standard"
                            error={reminderNotificationErr}
                            onBlur={(e) => {
                              if (reminderNotification.length > 0) {
                                setReminderNotificationErr(false);
                              }
                            }}
                            helperText={
                              reminderNotificationErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                        sx={{ mx: 0.75, maxWidth: 380, mt: 0.3 }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && (
              <div
                className="mt-14"
                id={`${
                  (isManual === true || isManual === null) &&
                  isPartiallySubmitted
                    ? "tabpanel-8"
                    : (isManual === true || isManual === null) &&
                      !isPartiallySubmitted
                    ? "tabpanel-7"
                    : isManual === false && isPartiallySubmitted
                    ? "tabpanel-7"
                    : "tabpanel-6"
                }`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Error Logs</span>
                  </span>
                  <span className="flex items-center">
                    {hasPermissionWorklog("ErrorLog", "Save", "WorkLogs") &&
                      onEdit > 0 && (
                        <Button
                          variant="contained"
                          className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                          onClick={handleSubmitErrorLog}
                        >
                          Update
                        </Button>
                      )}
                    <span
                      className={`cursor-pointer ${
                        reviewerErrDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setReviewerErrDrawer(!reviewerErrDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {reviewerErrDrawer && (
                  <>
                    <div className="mt-3 pl-6">
                      {errorLogFields.map((field, index) => (
                        <div className="w-[100%] mt-4" key={index}>
                          {field.SubmitedBy.length > 0 && (
                            <div className="ml-1 mt-8 mb-3">
                              <span className="font-bold">Correction By</span>
                              <span className="ml-3 mr-10 text-[14px]">
                                {field.SubmitedBy}
                              </span>
                              <span className="font-bold">Reviewer Date</span>
                              <span className="ml-3">
                                {field.SubmitedOn.split("/")[1]}-
                                {field.SubmitedOn.split("/")[0]}-
                                {field.SubmitedOn.split("/")[2]}
                              </span>
                            </div>
                          )}
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 230 }}
                            error={errorTypeErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Error Type
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.ErrorType === 0 ? "" : field.ErrorType
                              }
                              onChange={(e) => handleErrorTypeChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newErrorTypeErrors = [...errorTypeErr];
                                  newErrorTypeErrors[index] = false;
                                  setErrorTypeErr(newErrorTypeErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>Internal</MenuItem>
                              <MenuItem value={2}>External</MenuItem>
                            </Select>
                            {errorTypeErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 230 }}
                            error={rootCauseErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Root Cause
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.RootCause === 0 ? "" : field.RootCause
                              }
                              onChange={(e) => handleRootCauseChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newRootCauseErrors = [...rootCauseErr];
                                  newRootCauseErrors[index] = false;
                                  setRootCauseErr(newRootCauseErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>Procedural</MenuItem>
                              <MenuItem value={2}>DataEntry</MenuItem>
                            </Select>
                            {rootCauseErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 250 }}
                            error={natureOfErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Nature of Error
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.NatureOfError === 0
                                  ? ""
                                  : field.NatureOfError
                              }
                              onChange={(e) =>
                                handleNatureOfErrorChange(e, index)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newNatureOfErrorErrors = [
                                    ...natureOfErr,
                                  ];
                                  newNatureOfErrorErrors[index] = false;
                                  setNatureOfErr(newNatureOfErrorErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>
                                Memo/Decriprion Not Updated
                              </MenuItem>
                              <MenuItem value={2}>
                                Forget To Enter Vendor/PayeeName
                              </MenuItem>
                              <MenuItem value={3}>
                                Wrong Categorization Incorrect GST/Sales Tex
                              </MenuItem>
                              <MenuItem value={4}>
                                Deleted Reconciled Transaction
                              </MenuItem>
                              <MenuItem value={5}>
                                File/Report Not Updated Correctly
                              </MenuItem>
                              <MenuItem value={6}>TAT Missed</MenuItem>
                              <MenuItem value={7}>
                                ABC Not Prepared Correctly
                              </MenuItem>
                              <MenuItem value={8}>
                                OSI Not Prepared Correctly
                              </MenuItem>
                              <MenuItem value={9}>
                                Review Check List Not Prepared
                              </MenuItem>
                            </Select>
                            {natureOfErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 230 }}
                            error={errorLogPriorityErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Priority
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={field.Priority === 0 ? "" : field.Priority}
                              onChange={(e) => handlePriorityChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newPriorityErrors = [
                                    ...errorLogPriorityErr,
                                  ];
                                  newPriorityErrors[index] = false;
                                  setErrorLogPriorityErr(newPriorityErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>High</MenuItem>
                              <MenuItem value={2}>Medium</MenuItem>
                              <MenuItem value={3}>Low</MenuItem>
                            </Select>
                            {errorLogPriorityErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <TextField
                            label={
                              <span>
                                Error Count
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            type="number"
                            fullWidth
                            disabled={
                              (!hasPermissionWorklog(
                                "ErrorLog",
                                "Save",
                                "WorkLogs"
                              ) &&
                                hasPermissionWorklog(
                                  "ErrorLog",
                                  "Delete",
                                  "WorkLogs"
                                )) ||
                              field.isSolved
                            }
                            value={
                              field.ErrorCount === 0 ? "" : field.ErrorCount
                            }
                            onChange={(e) => handleErrorCountChange(e, index)}
                            onBlur={(e: any) => {
                              if (e.target.value.length > 0) {
                                const newErrorCountErrors = [...errorCountErr];
                                newErrorCountErrors[index] = false;
                                setErrorCountErr(newErrorCountErrors);
                              }
                            }}
                            error={errorCountErr[index]}
                            helperText={
                              errorCountErr[index] && field.ErrorCount <= 0
                                ? "Add valid number."
                                : errorCountErr[index] &&
                                  field.ErrorCount.toString().length > 4
                                ? "Maximum 4 numbers allowed."
                                : errorCountErr[index]
                                ? "This is a required field."
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 180, mt: 0 }}
                          />
                          <div className="flex !ml-0">
                            <Autocomplete
                              multiple
                              limitTags={2}
                              id="checkboxes-tags-demo"
                              options={
                                Array.isArray(cCDropdownData)
                                  ? cCDropdownData
                                  : []
                              }
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={field.CC}
                              onChange={(e, newValue) =>
                                handleCCChange(newValue, index)
                              }
                              style={{ width: 500 }}
                              renderInput={(params) => (
                                <TextField
                                  label="cc"
                                  {...params}
                                  variant="standard"
                                />
                              )}
                              sx={{ mx: 0.75, maxWidth: 230, mt: 1 }}
                            />
                            <TextField
                              label={
                                <span>
                                  Remarks
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              fullWidth
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.Remark.trim().length === 0
                                  ? ""
                                  : field.Remark
                              }
                              onChange={(e) => handleRemarksChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value.length > 0) {
                                  const newRemarkErrors = [...remarkErr];
                                  newRemarkErrors[index] = false;
                                  setRemarkErr(newRemarkErrors);
                                }
                              }}
                              error={remarkErr[index]}
                              helperText={
                                remarkErr[index] &&
                                field.Remark.length > 0 &&
                                field.Remark.length < 5
                                  ? "Minumum 5 characters required."
                                  : remarkErr[index] &&
                                    field.Remark.length > 500
                                  ? "Maximum 500 characters allowed."
                                  : remarkErr[index]
                                  ? "This is a required field."
                                  : ""
                              }
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 492, mt: 1, mr: 2 }}
                            />
                            <div className="flex flex-col">
                              <div className="flex">
                                <ImageUploader
                                  getData={(data1: any, data2: any) =>
                                    handleAttachmentsChange(
                                      data1,
                                      data2,
                                      field.Attachments,
                                      index
                                    )
                                  }
                                  isDisable={field.isSolved}
                                />
                                {field.Attachments[0]?.SystemFileName.length >
                                  0 && (
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="mt-6 ml-2 cursor-pointer">
                                      {field.Attachments[0]?.UserFileName}
                                    </span>
                                    <span
                                      className="mt-6"
                                      onClick={() =>
                                        getFileFromBlob(
                                          field.Attachments[0]?.SystemFileName,
                                          field.Attachments[0]?.UserFileName
                                        )
                                      }
                                    >
                                      <ColorToolTip
                                        title="Download"
                                        placement="top"
                                        arrow
                                      >
                                        <Download />
                                      </ColorToolTip>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {field.isSolved && (
                              <FormGroup>
                                <FormControlLabel
                                  className="mt-5 ml-2"
                                  control={
                                    <Checkbox checked={field.isSolved} />
                                  }
                                  label="Is Resolved"
                                />
                              </FormGroup>
                            )}
                            {index === 0 ? (
                              <span
                                className="cursor-pointer"
                                onClick={
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Save",
                                    "WorkLogs"
                                  )
                                    ? addErrorLogField
                                    : undefined
                                }
                              >
                                <svg
                                  className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px] mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                  focusable="false"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  data-testid="AddIcon"
                                >
                                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                                </svg>
                              </span>
                            ) : (
                              <span
                                className="cursor-pointer"
                                onClick={
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  ) ||
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Save",
                                    "WorkLogs"
                                  )
                                    ? () => removeErrorLogField(index)
                                    : undefined
                                }
                              >
                                <svg
                                  className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px] mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                  focusable="false"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  data-testid="RemoveIcon"
                                >
                                  <path d="M19 13H5v-2h14v2z"></path>
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div
              className="my-14"
              id={`${
                (isManual === true || isManual === null) && isPartiallySubmitted
                  ? "tabpanel-9"
                  : (isManual === true || isManual === null) &&
                    !isPartiallySubmitted
                  ? "tabpanel-8"
                  : isManual === false && isPartiallySubmitted
                  ? "tabpanel-8"
                  : "tabpanel-7"
              }`}
            >
              <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                <span className="flex items-center">
                  <HistoryIcon />
                  <span className="ml-[21px]">Reviewer&apos;s Note</span>
                </span>
                <span
                  className={`cursor-pointer ${
                    reasonDrawer ? "rotate-180" : ""
                  }`}
                  onClick={() => setReasonDrawer(!reasonDrawer)}
                >
                  <ChevronDownIcon />
                </span>
              </div>
              {reasonDrawer &&
                reviewerNote.length > 0 &&
                reviewerNote.map((i: any, index: number) => (
                  <div className="mt-5 pl-[70px] text-sm">
                    <span className="font-semibold">
                      {i.ReviewedDate.split("-")
                        .slice(1)
                        .concat(i.ReviewedDate.split("-")[0])
                        .join("-")}
                    </span>
                    {i.Details.map((j: any, index: number) => (
                      <div className="flex gap-3 mt-4">
                        <span className="mt-2">{index + 1}</span>
                        {j.ReviewerName.length > 0 ? (
                          <Tooltip title={j.ReviewerName} placement="top" arrow>
                            <Avatar>
                              {j.ReviewerName.split(" ")
                                .map((word: any) =>
                                  word.charAt(0).toUpperCase()
                                )
                                .join("")}
                            </Avatar>
                          </Tooltip>
                        ) : (
                          <Tooltip title={j.ReviewerName} placement="top" arrow>
                            <Avatar sx={{ width: 32, height: 32 }} />
                          </Tooltip>
                        )}
                        <div className="flex flex-col items-start">
                          <span>{j.Comment}</span>
                          <span>{j.Status}</span>
                          <span>
                            at&nbsp;
                            {new Date(
                              j.ReviewedDateTime + "Z"
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            {/* Logs */}
            {onEdit > 0 && (
              <div
                className="mt-14"
                id={`${
                  (isManual === true || isManual === null) &&
                  isPartiallySubmitted
                    ? "tabpanel-10"
                    : (isManual === true || isManual === null) &&
                      !isPartiallySubmitted
                    ? "tabpanel-9"
                    : isManual === false && isPartiallySubmitted
                    ? "tabpanel-9"
                    : "tabpanel-8"
                }`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Logs</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      logsWorklogsDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setLogsWorklogsDrawer(!logsWorklogsDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {logsWorklogsDrawer &&
                  logsDataWorklogs.length > 0 &&
                  logsDataWorklogs.map((i: any, index: number) => (
                    <div
                      className="mt-5 pl-[70px] text-sm"
                      key={i.UpdatedBy + Math.random()}
                    >
                      <div className="flex gap-3 mt-4">
                        <b className="mt-2">{index + 1}</b>
                        <div className="flex flex-col items-start">
                          <b>Modify By: {i.UpdatedBy}</b>
                          <b>
                            Date & Time:&nbsp;
                            {i.UpdatedOn.split("T")[0]
                              .split("-")
                              .slice(1)
                              .concat(i.UpdatedOn.split("T")[0].split("-")[0])
                              .join("-")}
                            &nbsp;&&nbsp;
                            {i.UpdatedOn.split("T")[1]}
                          </b>
                          <br />
                          <ThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                              data={i.UpdatedFieldsList}
                              columns={logsDatatableTaskCols}
                              title={undefined}
                              options={{
                                responsive: "standard",
                                viewColumns: false,
                                filter: false,
                                print: false,
                                download: false,
                                search: false,
                                selectToolbarPlacement: "none",
                                selectableRows: "none",
                                elevation: 0,
                                pagination: false,
                              }}
                              data-tableid="task_Report_Datatable"
                            />
                          </ThemeProvider>
                          <br />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="sticky bottom-0 !h-[9%] bg-whiteSmoke border-b z-30 border-lightSilver flex p-2 justify-end items-center">
              <div>
                <Button
                  variant="outlined"
                  className="rounded-[4px] !h-[36px] !text-secondary"
                  onClick={handleClose}
                >
                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                    Close
                  </span>
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="rounded-[4px] !h-[36px] !mx-6 !bg-secondary"
                >
                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                    {onEdit > 0 ? "Save Task" : "Create Task"}
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isLoadingWorklog ? <OverLay /> : ""}
    </>
  );
};

export default EditDrawer;
