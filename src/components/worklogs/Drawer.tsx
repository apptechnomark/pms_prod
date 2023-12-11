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
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Download, Save } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MentionsInput, Mention } from "react-mentions";
import mentionsInputStyle from "../../utils/worklog/mentionsInputStyle";
import {
  extractText,
  getTimeDifference,
  getYears,
  hasPermissionWorklog,
  isWeekend,
} from "@/utils/commonFunction";
import {
  days,
  getAssigneeDropdownData,
  getCCDropdownData,
  getClientDropdownData,
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
import ImageUploader from "../common/ImageUploader";
import { getFileFromBlob } from "@/utils/downloadFile";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { callAPI } from "@/utils/API/callAPI";

const EditDrawer = ({
  onOpen,
  onClose,
  onEdit,
  onDataFetch,
  onRecurring,
  onComment,
}: any) => {
  const router = useRouter();
  const yearWorklogsDrawerDropdown = getYears();
  const [inputTypeReviewWorklogsDrawer, setInputTypeReviewWorklogsDrawer] =
    useState("text");
  const [
    inputTypePreperationWorklogsDrawer,
    setInputTypePreperationWorklogsDrawer,
  ] = useState("text");
  const [isCreatedByClientWorklogsDrawer, setIsCreatedByClientWorklogsDrawer] =
    useState(false);
  const [editDataWorklogs, setEditDataWorklogs] = useState<any>([]);
  const [isManual, setIsManual] = useState<any>(null);

  useEffect(() => {
    onRecurring && scrollToPanel(4);
    onComment && scrollToPanel(3);
  }, [onOpen, onComment, onRecurring]);

  let Task;
  {
    onEdit > 0
      ? (Task = [
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "Task",
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") &&
            "Sub-Task",
          hasPermissionWorklog("CheckList", "View", "WorkLogs") && "Checklist",
          hasPermissionWorklog("Comment", "View", "WorkLogs") && "Comments",
          hasPermissionWorklog("Reccuring", "View", "WorkLogs") && "Recurring",
          (isManual === true || isManual === null) && "Manual Time",
          hasPermissionWorklog("Reminder", "View", "WorkLogs") && "Reminder",
          hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && "Error Logs",
          "Reviewer's Note",
          // "Logs",
        ])
      : (Task = [
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "Task",
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") &&
            "Sub-Task",
          hasPermissionWorklog("Reccuring", "View", "WorkLogs") && "Recurring",
          "Manual Time",
          hasPermissionWorklog("Reminder", "View", "WorkLogs") && "Reminder",
        ]);
  }

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

  // Task
  const [taskWorklogsDrawer, setTaskWorklogsDrawer] = useState(true);
  const [clientWorklogsDropdownData, setClientWorklogsDropdownData] =
    useState<any>([]);
  const [clientNameWorklogs, setClientNameWorklogs] = useState<any>(0);
  const [clientNameWorklogsErr, setClientNameWorklogsErr] = useState(false);
  const [typeOfWorkWorklogsDropdownData, setTypeOfWorkWorklogsDropdownData] =
    useState<any>([]);
  const [typeOfWorkWorklogs, setTypeOfWorkWorklogs] = useState<string | number>(
    0
  );
  const [typeOfWorkWorklogsErr, setTypeOfWorkWorklogsErr] = useState(false);
  const [projectWorklogsDropdownData, setProjectWorklogsDropdownData] =
    useState<any>([]);
  const [projectNameWorklogs, setProjectNameWorklogs] = useState<any>(0);
  const [projectNameWorklogsErr, setProjectNameWorklogsErr] = useState(false);
  const [processWorklogsDropdownData, setProcessWorklogsDropdownData] =
    useState<any>([]);
  const [processNameWorklogs, setProcessNameWorklogs] = useState<any>(0);
  const [processNameWorklogsErr, setProcessNameWorklogsErr] = useState(false);
  const [subProcessWorklogsDropdownData, setSubProcessWorklogsDropdownData] =
    useState([]);
  const [subProcessWorklogs, setSubProcessWorklogs] = useState<any>(0);
  const [subProcessWorklogsErr, setSubProcessWorklogsErr] = useState(false);
  const [clientTaskNameWorklogs, setClientTaskNameWorklogs] =
    useState<string>("");
  const [clientTaskNameWorklogsErr, setClientTaskNameWorklogsErr] =
    useState(false);
  const [managerWorklogsDropdownData, setManagerWorklogsDropdownData] =
    useState<any>([]);
  const [managerWorklogs, setManagerWorklogs] = useState<any>(0);
  const [managerWorklogsErr, setManagerWorklogsErr] = useState(false);
  const [statusWorklogsDropdownData, setStatusWorklogsDropdownData] =
    useState<any>([]);
  const [statusWorklogsDropdownDataUse, setStatusWorklogsDropdownDataUse] =
    useState([]);
  const [statusWorklogs, setStatusWorklogs] = useState<any>(0);
  const [editStatusWorklogs, setEditStatusWorklogs] = useState<any>(0);
  const [statusWorklogsErr, setStatusWorklogsErr] = useState(false);
  const [descriptionWorklogs, setDescriptionWorklogs] = useState<string>("");
  const [priorityWorklogs, setPriorityWorklogs] = useState<string | number>(0);
  const [quantityWorklogs, setQuantityWorklogs] = useState<any>(1);
  const [quantityWorklogsErr, setQuantityWorklogsErr] = useState(false);
  const [receiverDateWorklogs, setReceiverDateWorklogs] = useState<any>("");
  const [receiverDateWorklogsErr, setReceiverDateWorklogsErr] = useState(false);
  const [dueDateWorklogs, setDueDateWorklogs] = useState<any>("");
  const [allInfoDateWorklogs, setAllInfoDateWorklogs] = useState<any>("");
  const [assigneeWorklogsDropdownData, setAssigneeWorklogsDropdownData] =
    useState<any>([]);
  const [assigneeWorklogs, setAssigneeWorklogs] = useState<any>([]);
  const [assigneeWorklogsErr, setAssigneeWorklogsErr] = useState(false);
  const [assigneeWorklogsDisable, setAssigneeWorklogsDisable] =
    useState<any>(true);
  const [reviewerWorklogsDropdownData, setReviewerWorklogsDropdownData] =
    useState([]);
  const [reviewerWorklogs, setReviewerWorklogs] = useState<any>([]);
  const [reviewerWorklogsErr, setReviewerWorklogsErr] = useState(false);
  const [dateOfReviewWorklogs, setDateOfReviewWorklogs] = useState<string>("");
  const [dateOfPreperationWorklogs, setDateOfPreperationWorklogs] =
    useState<string>("");
  const [estTimeDataWorklogs, setEstTimeDataWorklogs] = useState([]);
  const [userId, setUserId] = useState(0);
  const [returnYearWorklogs, setReturnYearWorklogs] = useState<string | number>(
    0
  );
  const [returnYearWorklogsErr, setReturnYearWorklogsErr] = useState(false);
  const [noOfPagesWorklogs, setNoOfPagesWorklogs] = useState<any>(0);
  const [checklistWorkpaperWorklogs, setChecklistWorkpaperWorklogs] =
    useState<any>(0);
  const [checklistWorkpaperWorklogsErr, setChecklistWorkpaperWorklogsErr] =
    useState(false);

  // Sub-Task
  const [subTaskWorklogsDrawer, setSubTaskWorklogsDrawer] = useState(true);
  const [subTaskSwitchWorklogs, setSubTaskSwitchWorklogs] = useState(false);
  const [subTaskFieldsWorklogs, setSubTaskFieldsWorklogs] = useState([
    {
      SubtaskId: 0,
      Title: "",
      Description: "",
    },
  ]);
  const [taskNameWorklogsErr, setTaskNameWorklogsErr] = useState([false]);
  const [subTaskDescriptionWorklogsErr, setSubTaskDescriptionWorklogsErr] =
    useState([false]);
  const [deletedSubTaskWorklogs, setDeletedSubTaskWorklogs] = useState<any>([]);

  const addTaskFieldWorklogs = () => {
    setSubTaskFieldsWorklogs([
      ...subTaskFieldsWorklogs,
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameWorklogsErr([...taskNameWorklogsErr, false]);
    setSubTaskDescriptionWorklogsErr([...subTaskDescriptionWorklogsErr, false]);
  };

  const removeTaskFieldWorklogs = (index: number) => {
    setDeletedSubTaskWorklogs([
      ...deletedSubTaskWorklogs,
      subTaskFieldsWorklogs[index].SubtaskId,
    ]);

    const newTaskWorklogsFields = [...subTaskFieldsWorklogs];
    newTaskWorklogsFields.splice(index, 1);
    setSubTaskFieldsWorklogs(newTaskWorklogsFields);

    const newTaskWorklogsErrors = [...taskNameWorklogsErr];
    newTaskWorklogsErrors.splice(index, 1);
    setTaskNameWorklogsErr(newTaskWorklogsErrors);

    const newSubTaskDescriptionWorklogsErrors = [
      ...subTaskDescriptionWorklogsErr,
    ];
    newSubTaskDescriptionWorklogsErrors.splice(index, 1);
    setSubTaskDescriptionWorklogsErr(newSubTaskDescriptionWorklogsErrors);
  };

  const handleSubTaskChangeWorklogs = (e: any, index: number) => {
    const newTaskWorklogsFields = [...subTaskFieldsWorklogs];
    newTaskWorklogsFields[index].Title = e.target.value;
    setSubTaskFieldsWorklogs(newTaskWorklogsFields);

    const newTaskWorklogsErrors = [...taskNameWorklogsErr];
    newTaskWorklogsErrors[index] = e.target.value.trim().length === 0;
    setTaskNameWorklogsErr(newTaskWorklogsErrors);
  };

  const handleSubTaskDescriptionChangeWorklogs = (e: any, index: number) => {
    const newTaskWorklogsFields = [...subTaskFieldsWorklogs];
    newTaskWorklogsFields[index].Description = e.target.value;
    setSubTaskFieldsWorklogs(newTaskWorklogsFields);

    const newSubTaskDescWorklogsErrors = [...subTaskDescriptionWorklogsErr];
    newSubTaskDescWorklogsErrors[index] = e.target.value.trim().length === 0;
    setSubTaskDescriptionWorklogsErr(newSubTaskDescWorklogsErrors);
  };

  const getSubTaskDataWorklogs = async () => {
    const params = {
      WorkitemId: onEdit,
    };
    const url = `${process.env.worklog_api_url}/workitem/subtask/getbyworkitem`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (
        ResponseStatus === "Success" &&
        ResponseData.length > 0 &&
        error === false
      ) {
        setSubTaskSwitchWorklogs(
          hasPermissionWorklog("Task/SubTask", "save", "WorkLogs")
        );
        setSubTaskFieldsWorklogs(ResponseData);
      } else {
        setSubTaskSwitchWorklogs(false);
        setSubTaskFieldsWorklogs([
          {
            SubtaskId: 0,
            Title: "",
            Description: "",
          },
        ]);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleSubmitSubTaskWorklogs = async () => {
    let hasSubErrors = false;
    const newTaskErrors = subTaskFieldsWorklogs.map(
      (field) =>
        (subTaskSwitchWorklogs && field.Title.trim().length < 5) ||
        (subTaskSwitchWorklogs && field.Title.trim().length > 500)
    );
    subTaskSwitchWorklogs && setTaskNameWorklogsErr(newTaskErrors);
    const newSubTaskDescErrors = subTaskFieldsWorklogs.map(
      (field) =>
        (subTaskSwitchWorklogs && field.Description.trim().length < 5) ||
        (subTaskSwitchWorklogs && field.Description.trim().length > 500)
    );
    subTaskSwitchWorklogs &&
      setSubTaskDescriptionWorklogsErr(newSubTaskDescErrors);
    hasSubErrors =
      newTaskErrors.some((error) => error) ||
      newSubTaskDescErrors.some((error) => error);

    if (hasPermissionWorklog("Task/SubTask", "save", "WorkLogs")) {
      if (
        editStatusWorklogs === 4 ||
        editStatusWorklogs === 5 ||
        statusWorklogs === 7 ||
        statusWorklogs === 8 ||
        statusWorklogs === 9 ||
        statusWorklogs === 13
      ) {
        toast.warning(
          "Cannot change task for status 'Stop', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
        );
        onEdit > 0 && getSubTaskDataWorklogs();
      } else {
        if (!hasSubErrors) {
          const params = {
            workitemId: onEdit,
            subtasks: subTaskSwitchWorklogs
              ? subTaskFieldsWorklogs.map(
                  (i: any) =>
                    new Object({
                      SubtaskId: i.SubtaskId,
                      Title: i.Title.trim(),
                      Description: i.Description.trim(),
                    })
                )
              : null,
            deletedWorkitemSubtaskIds: deletedSubTaskWorklogs,
          };
          const url = `${process.env.worklog_api_url}/workitem/subtask/savebyworkitem`;
          const successCallback = (
            ResponseData: any,
            error: any,
            ResponseStatus: any
          ) => {
            if (ResponseStatus === "Success" && error === false) {
              toast.success(`Sub Task Updated successfully.`);
              setDeletedSubTaskWorklogs([]);
              setSubTaskFieldsWorklogs([
                {
                  SubtaskId: 0,
                  Title: "",
                  Description: "",
                },
              ]);
              getSubTaskDataWorklogs();
            }
          };
          callAPI(url, params, successCallback, "POST");
        }
      }
    } else {
      toast.error("User don't have permission to Update Sub-Task.");
      getSubTaskDataWorklogs();
    }
  };

  // Recurring
  const [recurringWorklogsDrawer, setRecurringWorklogsDrawer] = useState(true);
  const [recurringSwitch, setRecurringSwitch] = useState(false);
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringStartDateErr, setRecurringStartDateErr] = useState(false);
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [recurringEndDateErr, setRecurringEndDateErr] = useState(false);
  const [recurringTime, setRecurringTime] = useState<any>(1);
  const [selectedDays, setSelectedDays] = useState<any>([]);
  const [recurringMonth, setRecurringMonth] = useState<any>(0);
  const [recurringMonthErr, setRecurringMonthErr] = useState(false);
  const [recurringWeekErr, setRecurringWeekErr] = useState(false);

  const toggleColor = (index: any) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(
        selectedDays.filter((dayIndex: any) => dayIndex !== index)
      );
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const getRecurringDataWorklogs = async () => {
    const params = {
      WorkitemId: onEdit,
    };
    const url = `${process.env.worklog_api_url}/workitem/recurring/getbyworkitem`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (
        ResponseStatus === "Success" &&
        ResponseData !== null &&
        error === false
      ) {
        setRecurringSwitch(
          hasPermissionWorklog("Reccuring", "save", "WorkLogs")
        );
        setRecurringStartDate(ResponseData.StartDate);
        setRecurringEndDate(ResponseData.EndDate);
        setRecurringTime(ResponseData.Type);
        ResponseData.Type === 2
          ? setSelectedDays(ResponseData.Triggers)
          : ResponseData.Type === 3
          ? setRecurringMonth(
              ResponseData.Triggers.map((trigger: any) =>
                months.find((month) => month.value === trigger)
              ).filter(Boolean)
            )
          : [];
      } else {
        setRecurringSwitch(false);
        setRecurringStartDate("");
        setRecurringEndDate("");
        setRecurringTime(0);
        setSelectedDays([]);
        setRecurringMonth(0);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleSubmitRecurringWorklogs = async () => {
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

    const fieldValidations = {
      recurringStartDate: recurringSwitch && validateField(recurringStartDate),
      recurringEndDate: recurringSwitch && validateField(recurringEndDate),
      recurringMonth:
        recurringSwitch && recurringTime === 3 && validateField(recurringMonth),
      selectedDays:
        recurringSwitch && recurringTime === 2 && validateField(selectedDays),
    };

    recurringSwitch &&
      setRecurringStartDateErr(fieldValidations.recurringStartDate);
    recurringSwitch &&
      setRecurringEndDateErr(fieldValidations.recurringEndDate);
    recurringSwitch &&
      recurringTime === 3 &&
      setRecurringMonthErr(fieldValidations.recurringMonth);
    recurringSwitch &&
      recurringTime === 2 &&
      setRecurringWeekErr(fieldValidations.selectedDays);

    const hasErrors = Object.values(fieldValidations).some((error) => error);

    if (hasPermissionWorklog("Reccuring", "save", "WorkLogs")) {
      if (!hasErrors) {
        const params = {
          WorkitemId: onEdit,
          Type: recurringTime,
          StartDate: dayjs(recurringStartDate).format("YYYY/MM/DD"),
          EndDate: dayjs(recurringEndDate).format("YYYY/MM/DD"),
          Triggers:
            recurringTime === 1
              ? []
              : recurringTime === 2
              ? selectedDays
              : recurringMonth.map((i: any) => i.value),
        };
        const url = `${process.env.worklog_api_url}/workitem/recurring/savebyworkitem`;
        const successCallback = (
          ResponseData: any,
          error: any,
          ResponseStatus: any
        ) => {
          if (ResponseStatus === "Success" && error === false) {
            toast.success(`Recurring Updated successfully.`);
            setDeletedSubTaskWorklogs([]);
            getRecurringDataWorklogs();
          }
        };
        callAPI(url, params, successCallback, "POST");
      }
    } else {
      toast.error("User don't have permission to Update Recurring.");
      setDeletedSubTaskWorklogs([]);
      getRecurringDataWorklogs();
    }
  };

  // Manula
  const [manualTimeWorklogsDrawer, setManualTimeWorklogsDrawer] =
    useState(true);
  const [manualSwitchWorklogs, setManualSwitchWorklogs] = useState(false);
  const [deletedManualTimeWorklogs, setDeletedManualTimeWorklogs] =
    useState<any>([]);
  const [manualFieldsWorklogs, setManualFieldsWorklogs] = useState([
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
  const [inputDateWorklogsErrors, setInputDateWorklogsErrors] = useState([
    false,
  ]);
  const [startTimeWorklogsErrors, setStartTimeWorklogsErrors] = useState([
    false,
  ]);
  const [endTimeWorklogsErrors, setEndTimeWorklogsErrors] = useState([false]);
  const [manualDescWorklogsErrors, setManualDescWorklogsErrors] = useState([
    false,
  ]);
  const [inputTypeWorklogsDate, setInputTypeWorklogsDate] = useState(["text"]);
  const [inputTypeStartWorklogsTime, setInputTypeStartWorklogsTime] = useState([
    "text",
  ]);
  const [inputTypeEndWorklogsTime, setInputTypeEndWorklogsTime] = useState([
    "text",
  ]);
  const [manualSubmitWorklogsDisable, setManualSubmitWorklogsDisable] =
    useState(true);

  const setManualDisableData = (manualField: any) => {
    setManualSubmitWorklogsDisable(
      manualField
        .map((i: any) => (i.IsApproved === false ? false : true))
        .includes(false)
        ? false
        : true
    );
  };

  const addManulaFieldWorklogs = async () => {
    await setManualFieldsWorklogs([
      ...manualFieldsWorklogs,
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
    setInputDateWorklogsErrors([...inputDateWorklogsErrors, false]);
    setStartTimeWorklogsErrors([...startTimeWorklogsErrors, false]);
    setEndTimeWorklogsErrors([...endTimeWorklogsErrors, false]);
    setManualDescWorklogsErrors([...manualDescWorklogsErrors, false]);
    setInputTypeWorklogsDate([...inputTypeWorklogsDate, "text"]);
    setInputTypeStartWorklogsTime([...inputTypeStartWorklogsTime, "text"]);
    setInputTypeEndWorklogsTime([...inputTypeEndWorklogsTime, "text"]);
    setManualDisableData([
      ...manualFieldsWorklogs,
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

  const removePhoneFieldWorklogs = (index: number) => {
    setDeletedManualTimeWorklogs([
      ...deletedManualTimeWorklogs,
      manualFieldsWorklogs[index].Id,
    ]);

    const newManualWorklogsFields = [...manualFieldsWorklogs];
    newManualWorklogsFields.splice(index, 1);
    setManualFieldsWorklogs(newManualWorklogsFields);

    const newInputDateWorklogsErrors = [...inputDateWorklogsErrors];
    newInputDateWorklogsErrors.splice(index, 1);
    setInputDateWorklogsErrors(newInputDateWorklogsErrors);

    const newStartTimeWorklogsErrors = [...startTimeWorklogsErrors];
    newStartTimeWorklogsErrors.splice(index, 1);
    setStartTimeWorklogsErrors(newStartTimeWorklogsErrors);

    const newEndTimeWorklogsErrors = [...endTimeWorklogsErrors];
    newEndTimeWorklogsErrors.splice(index, 1);
    setEndTimeWorklogsErrors(newEndTimeWorklogsErrors);

    const newManualDescWorklogsErrors = [...manualDescWorklogsErrors];
    newManualDescWorklogsErrors.splice(index, 1);
    setManualDescWorklogsErrors(newManualDescWorklogsErrors);

    const newManualWorklogsDate = [...inputTypeWorklogsDate];
    newManualWorklogsDate.splice(index, 1);
    setInputTypeWorklogsDate(newManualWorklogsDate);

    setManualDisableData(newManualWorklogsFields);
  };

  const handleInputDateChangeWorklogs = (e: any, index: number) => {
    const newManualWorklogsFields = [...manualFieldsWorklogs];
    newManualWorklogsFields[index].inputDate = e;
    setManualFieldsWorklogs(newManualWorklogsFields);

    const newInputDateWorklogsErrors = [...inputDateWorklogsErrors];
    newInputDateWorklogsErrors[index] = e.length === 0;
    setInputDateWorklogsErrors(newInputDateWorklogsErrors);
  };

  const handleEstTimeChangeWorklogs = (e: any) => {
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

  const handleStartTimeChangeWorklogs = (e: any, index: number) => {
    const newManualWorklogsFields: any = [...manualFieldsWorklogs];
    newManualWorklogsFields[index].startTime = handleEstTimeChangeWorklogs(e);
    setManualFieldsWorklogs(newManualWorklogsFields);

    const startDate = newManualWorklogsFields[index].startTime;
    const endDate = newManualWorklogsFields[index].endTime;
    if (startDate && endDate) {
      const startTime = newManualWorklogsFields[index].startTime;
      const endTime = newManualWorklogsFields[index].endTime;
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

          newManualWorklogsFields[index].totalTime = formattedTotalTime;
          setManualFieldsWorklogs(newManualWorklogsFields);
        }
      }
    }
  };

  const handleEndTimeChangeWorklogs = (e: any, index: number) => {
    const newManualWorklogsFields: any = [...manualFieldsWorklogs];
    newManualWorklogsFields[index].endTime = handleEstTimeChangeWorklogs(e);
    setManualFieldsWorklogs(newManualWorklogsFields);

    const startDate = newManualWorklogsFields[index].startTime;
    const endDate = newManualWorklogsFields[index].endTime;
    if (startDate && endDate) {
      const startTime = newManualWorklogsFields[index].startTime;
      const endTime = newManualWorklogsFields[index].endTime;
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

          newManualWorklogsFields[index].totalTime = formattedTotalTime;
          setManualFieldsWorklogs(newManualWorklogsFields);
        }
      }
    }
  };

  const handleManualDescChangeWorklogs = (e: any, index: number) => {
    const newManualWorklogsFields = [...manualFieldsWorklogs];
    newManualWorklogsFields[index].manualDesc = e.target.value;
    setManualFieldsWorklogs(newManualWorklogsFields);

    const newManualDescWorklogsErrors = [...manualDescWorklogsErrors];
    newManualDescWorklogsErrors[index] = e.target.value.trim().length === 0;
    setManualDescWorklogsErrors(newManualDescWorklogsErrors);
  };

  const getManualDataWorklogs = async () => {
    const params = {
      WorkitemId: onEdit,
    };
    const url = `${process.env.worklog_api_url}/workitem/timelog/getManuallogByWorkitem`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (
        ResponseStatus === "Success" &&
        ResponseData.length > 0 &&
        error === false
      ) {
        setManualSwitchWorklogs(true);
        setManualSubmitWorklogsDisable(
          ResponseData.map(
            (i: any) => i.IsApproved === false && i.assignee !== userId
          ).includes(true)
            ? false
            : true
        );
        setManualFieldsWorklogs(
          ResponseData.map(
            (i: any) =>
              new Object({
                AssigneeId: i.AssigneeId,
                Id: i.Id,
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
        setManualSwitchWorklogs(false);
        setManualSubmitWorklogsDisable(true);
        setManualFieldsWorklogs([
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
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleSubmitManualWorklogs = async () => {
    const local: any = await localStorage.getItem("UserId");
    if (assigneeWorklogs === parseInt(local)) {
      let hasManualErrors = false;
      const newInputDateWorklogsErrors = manualFieldsWorklogs.map(
        (field) => manualSwitchWorklogs && field.inputDate === ""
      );
      manualSwitchWorklogs &&
        setInputDateWorklogsErrors(newInputDateWorklogsErrors);
      const newStartTimeWorklogsErrors = manualFieldsWorklogs.map(
        (field) =>
          (manualSwitchWorklogs && field.startTime.trim().length === 0) ||
          (manualSwitchWorklogs && field.startTime.trim().length < 8)
      );
      manualSwitchWorklogs &&
        setStartTimeWorklogsErrors(newStartTimeWorklogsErrors);
      const newEndTimeWorklogsErrors = manualFieldsWorklogs.map(
        (field) =>
          (manualSwitchWorklogs && field.endTime.trim().length === 0) ||
          (manualSwitchWorklogs && field.endTime.trim().length < 8) ||
          (manualSwitchWorklogs && field.endTime <= field.startTime) ||
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
      manualSwitchWorklogs &&
        setEndTimeWorklogsErrors(newEndTimeWorklogsErrors);
      const newManualDescWorklogsErrors = manualFieldsWorklogs.map(
        (field) =>
          (manualSwitchWorklogs && field.manualDesc.trim().length < 5) ||
          (manualSwitchWorklogs && field.manualDesc.trim().length > 500)
      );
      manualSwitchWorklogs &&
        setManualDescWorklogsErrors(newManualDescWorklogsErrors);
      hasManualErrors =
        newInputDateWorklogsErrors.some((error) => error) ||
        newStartTimeWorklogsErrors.some((error) => error) ||
        newEndTimeWorklogsErrors.some((error) => error) ||
        newManualDescWorklogsErrors.some((error) => error);

      if (!hasManualErrors) {
        const params = {
          workItemId: onEdit,
          timelogs: manualFieldsWorklogs.map(
            (i: any) =>
              new Object({
                id: i.Id,
                startTime:
                  dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.startTime,
                endTime:
                  dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.endTime,
                assigneeId:
                  i.AssigneeId === 0 ? assigneeWorklogs : i.AssigneeId,
                comment: i.manualDesc,
              })
          ),
          deletedTimelogIds: deletedManualTimeWorklogs,
        };
        const url = `${process.env.worklog_api_url}/workitem/timelog/saveManuallogByworkitem`;
        const successCallback = (
          ResponseData: any,
          error: any,
          ResponseStatus: any
        ) => {
          if (ResponseStatus === "Success" && error === false) {
            toast.success(`Manual Time Updated successfully.`);
            setDeletedManualTimeWorklogs([]);
            getEditDataWorklogs();
            getManualDataWorklogs();
          } else {
            getManualDataWorklogs();
            getEditDataWorklogs();
          }
        };
        callAPI(url, params, successCallback, "POST");
      }
    } else {
      toast.warning("Only Assingnee can Edit Manual time.");
      getManualDataWorklogs();
    }
  };

  // Reminder
  const [reminderWorklogsDrawer, setReminderWorklogsDrawer] = useState(true);
  const [reminderSwitch, setReminderSwitch] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderDateErr, setReminderDateErr] = useState(false);
  const [reminderTime, setReminderTime] = useState<any>(0);
  const [reminderTimeErr, setReminderTimeErr] = useState(false);
  const [reminderNotification, setReminderNotification] = useState<any>([]);
  const [reminderNotificationErr, setReminderNotificationErr] = useState(false);
  const [reminderCheckboxValue, setReminderCheckboxValue] = useState<any>(1);
  const [reminderId, setReminderId] = useState(0);

  const getReminderDataWorklogs = async () => {
    const params = {
      WorkitemId: onEdit,
    };
    const url = `${process.env.worklog_api_url}/workitem/reminder/getbyworkitem`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (
        ResponseStatus === "Success" &&
        ResponseData !== null &&
        error === false
      ) {
        setReminderId(ResponseData.ReminderId);
        setReminderSwitch(hasPermissionWorklog("Reminder", "save", "WorkLogs"));
        setReminderCheckboxValue(ResponseData.ReminderType);
        setReminderDate(ResponseData.ReminderDate);
        setReminderTime(ResponseData.ReminderTime);
        setReminderNotification(
          ResponseData.ReminderUserIds.map((reminderUserId: any) =>
            assigneeWorklogsDropdownData.find(
              (assignee: { value: any }) => assignee.value === reminderUserId
            )
          ).filter(Boolean)
        );
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const handleSubmitReminderWorklogs = async () => {
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

    if (hasPermissionWorklog("Reminder", "save", "WorkLogs")) {
      if (
        editStatusWorklogs === 4 ||
        statusWorklogs === 7 ||
        statusWorklogs === 8 ||
        statusWorklogs === 9 ||
        statusWorklogs === 13
      ) {
        toast.warning(
          "Cannot change task for status 'Stop', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
        );
        getReminderDataWorklogs();
      } else {
        if (!hasErrors) {
          const params = {
            ReminderId: reminderId,
            ReminderType: reminderCheckboxValue,
            WorkitemId: onEdit,
            ReminderDate:
              reminderCheckboxValue === 2
                ? dayjs(reminderDate).format("YYYY/MM/DD")
                : null,
            ReminderTime: reminderTime,
            ReminderUserIds: reminderNotification.map((i: any) => i.value),
          };
          const url = `${process.env.worklog_api_url}/workitem/reminder/savebyworkitem`;
          const successCallback = (
            ResponseData: any,
            error: any,
            ResponseStatus: any
          ) => {
            if (ResponseStatus === "Success" && error === false) {
              toast.success(`Reminder Updated successfully.`);
              getReminderDataWorklogs();
              setReminderId(0);
            }
          };
          callAPI(url, params, successCallback, "POST");
        }
      }
    } else {
      toast.error("User don't have permission to Update Recurring.");
      setDeletedSubTaskWorklogs([]);
      getRecurringDataWorklogs();
    }
  };

  // CheclkList
  const [checkListWorklogsDrawer, setCheckListWorklogsDrawer] = useState(true);
  const [checkListName, setCheckListName] = useState("");
  const [checkListNameError, setCheckListNameError] = useState(false);
  const [checkListData, setCheckListData] = useState([]);
  const [itemStates, setItemStates] = useState<any>({});

  // Comments
  const [commentsWorklogsDrawer, setCommentsWorklogsDrawer] = useState(true);
  const [commentSelect, setCommentSelect] = useState<number | string>(1);

  // Dropdowns
  const [cCDropdownData, setCCDropdownData] = useState<any>([]);

  // Reviewer note
  const [reasonWorklogsDrawer, setReasonWorklogsDrawer] = useState(true);
  const [reviewerNote, setReviewerNoteData] = useState([]);

  // Error Logs
  const [reviewerErrWorklogsDrawer, setReviewerErrWorklogsDrawer] =
    useState(true);
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
          AttachmentPath: "",
        },
      ],
      isSolved: false,
      DisableErrorLog: false,
    },
  ]);
  const [errorTypeErr, setErrorTypeErr] = useState([false]);
  const [rootCauseErr, setRootCauseErr] = useState([false]);
  const [errorLogPriorityErr, setErrorLogPriorityErr] = useState([false]);
  const [errorCountErr, setErrorCountErr] = useState([false]);
  const [natureOfErr, setNatureOfErr] = useState([false]);

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

  const handleCheckboxChange = async (
    onEdit: any,
    errorLogId: any,
    checked: any,
    index: any
  ) => {
    let hasErrorLogErrors = false;
    const newErrorTypeErrors = errorLogFields.map(
      (field, i) => field.ErrorType === 0 && i === index
    );
    setErrorTypeErr(newErrorTypeErrors);
    const newRootCauseErrors = errorLogFields.map(
      (field, i) => field.RootCause === 0 && i === index
    );
    setRootCauseErr(newRootCauseErrors);
    const newNatureOfErrors = errorLogFields.map(
      (field, i) => field.NatureOfError === 0 && i === index
    );
    setNatureOfErr(newNatureOfErrors);
    const newPriorityErrors = errorLogFields.map(
      (field, i) => field.Priority === 0 && i === index
    );
    setErrorLogPriorityErr(newPriorityErrors);
    const newErrorCountErrors = errorLogFields.map(
      (field, i) =>
        (field.ErrorCount <= 0 || field.ErrorCount > 9999) && i === index
    );
    setErrorCountErr(newErrorCountErrors);

    hasErrorLogErrors =
      newErrorTypeErrors.some((error) => error) ||
      newRootCauseErrors.some((error) => error) ||
      newNatureOfErrors.some((error) => error) ||
      newPriorityErrors.some((error) => error) ||
      newErrorCountErrors.some((error) => error);

    if (hasErrorLogErrors === false) {
      if (hasPermissionWorklog("ErrorLog", "Save", "WorkLogs")) {
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
                      i.Attachments[0].UserFileName.length > 0
                        ? i.Attachments
                        : null,
                  })
              ),
              IsClientWorklog: false,
              SubmissionId: null,
              DeletedErrorlogIds: [],
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
              try {
                const response = await axios.post(
                  `${process.env.worklog_api_url}/workitem/errorlog/SolveByworkitem`,
                  {
                    WorkItemId: onEdit,
                    ErrorLogId: errorLogId,
                    IsSolved: checked,
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
                    toast.success(
                      `${
                        checked ? "Error log Resolved." : "Error log changed."
                      }`
                    );
                    getErrorLogData();
                    onDataFetch();
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
                    toast.error("Failed Please try again.");
                  } else {
                    toast.error(data);
                  }
                }
              } catch (error) {
                console.error(error);
              }
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
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
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

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

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

    const fieldValidations = {
      clientName: validateField(clientNameWorklogs),
      typeOfWork: validateField(typeOfWorkWorklogs),
      projectName: validateField(projectNameWorklogs),
      processName: validateField(processNameWorklogs),
      subProcess: validateField(subProcessWorklogs),
      clientTaskName: validateField(clientTaskNameWorklogs),
      quantity: validateField(quantityWorklogs),
      receiverDate: validateField(receiverDateWorklogs),
      assignee: assigneeWorklogsDisable && validateField(assigneeWorklogs),
      reviewer: validateField(reviewerWorklogs),
      manager: validateField(managerWorklogs),
      returnYear: typeOfWorkWorklogs === 3 && validateField(returnYearWorklogs),
      checklistWorkpaper:
        typeOfWorkWorklogs === 3 && validateField(checklistWorkpaperWorklogs),
      recurringStartDate: recurringSwitch && validateField(recurringStartDate),
      recurringEndDate: recurringSwitch && validateField(recurringEndDate),
      recurringMonth:
        recurringSwitch && recurringTime === 3 && validateField(recurringMonth),
      selectedDays:
        recurringSwitch && recurringTime === 2 && validateField(selectedDays),
      reminderTime: reminderSwitch && validateField(reminderTime),
      reminderNotification:
        reminderSwitch && validateField(reminderNotification),
      reminderDate:
        reminderSwitch &&
        reminderCheckboxValue === 2 &&
        validateField(reminderDate),
    };

    setClientNameWorklogsErr(fieldValidations.clientName);
    setTypeOfWorkWorklogsErr(fieldValidations.typeOfWork);
    setProjectNameWorklogsErr(fieldValidations.projectName);
    setProcessNameWorklogsErr(fieldValidations.processName);
    setSubProcessWorklogsErr(fieldValidations.subProcess);
    setClientTaskNameWorklogsErr(fieldValidations.clientTaskName);
    setQuantityWorklogsErr(fieldValidations.quantity);
    setReceiverDateWorklogsErr(fieldValidations.receiverDate);
    assigneeWorklogsDisable &&
      setAssigneeWorklogsErr(fieldValidations.assignee);
    setReviewerWorklogsErr(fieldValidations.reviewer);
    setManagerWorklogsErr(fieldValidations.manager);
    typeOfWorkWorklogs === 3 &&
      setReturnYearWorklogsErr(fieldValidations.returnYear);
    typeOfWorkWorklogs === 3 &&
      setChecklistWorkpaperWorklogsErr(fieldValidations.checklistWorkpaper);
    onEdit === 0 &&
      recurringSwitch &&
      setRecurringStartDateErr(fieldValidations.recurringStartDate);
    onEdit === 0 &&
      recurringSwitch &&
      setRecurringEndDateErr(fieldValidations.recurringEndDate);
    onEdit === 0 &&
      recurringSwitch &&
      recurringTime === 3 &&
      setRecurringMonthErr(fieldValidations.recurringMonth);
    onEdit === 0 &&
      recurringSwitch &&
      recurringTime === 2 &&
      setRecurringWeekErr(fieldValidations.selectedDays);
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

    setClientTaskNameWorklogsErr(
      clientTaskNameWorklogs.trim().length < 4 ||
        clientTaskNameWorklogs.trim().length > 50
    );
    setQuantityWorklogsErr(
      quantityWorklogs.length <= 0 ||
        quantityWorklogs.length > 4 ||
        quantityWorklogs <= 0 ||
        quantityWorklogs.toString().includes(".")
    );

    const hasErrors = Object.values(fieldValidations).some((error) => error);

    const fieldValidationsEdit = {
      clientName: validateField(clientNameWorklogs),
      typeOfWork: validateField(typeOfWorkWorklogs),
      projectName: validateField(projectNameWorklogs),
      processName: validateField(processNameWorklogs),
      subProcess: validateField(subProcessWorklogs),
      clientTaskName: validateField(clientTaskNameWorklogs),
      status: validateField(statusWorklogs),
      quantity: validateField(quantityWorklogs),
      receiverDate: validateField(receiverDateWorklogs),
      dueDate: validateField(dueDateWorklogs),
      assignee: validateField(assigneeWorklogs),
      reviewer: validateField(reviewerWorklogs),
      manager: validateField(managerWorklogs),
      returnYear: typeOfWorkWorklogs === 3 && validateField(returnYearWorklogs),
      checklistWorkpaper:
        typeOfWorkWorklogs === 3 && validateField(checklistWorkpaperWorklogs),
    };

    const hasEditErrors = Object.values(fieldValidationsEdit).some(
      (error) => error
    );

    // Sub-Task
    let hasSubErrors = false;
    const newTaskErrors = subTaskFieldsWorklogs.map(
      (field) =>
        (onEdit === 0 &&
          subTaskSwitchWorklogs &&
          field.Title.trim().length < 5) ||
        (onEdit === 0 &&
          subTaskSwitchWorklogs &&
          field.Title.trim().length > 500)
    );
    subTaskSwitchWorklogs && setTaskNameWorklogsErr(newTaskErrors);
    const newSubTaskDescErrors = subTaskFieldsWorklogs.map(
      (field) =>
        (onEdit === 0 &&
          subTaskSwitchWorklogs &&
          field.Description.trim().length < 5) ||
        (onEdit === 0 &&
          subTaskSwitchWorklogs &&
          field.Description.trim().length > 500)
    );
    subTaskSwitchWorklogs &&
      setSubTaskDescriptionWorklogsErr(newSubTaskDescErrors);
    hasSubErrors =
      newTaskErrors.some((error) => error) ||
      newSubTaskDescErrors.some((error) => error);

    // Maual
    let hasManualErrors = false;
    const newInputDateWorklogsErrors = manualFieldsWorklogs.map(
      (field) => onEdit === 0 && manualSwitchWorklogs && field.inputDate === ""
    );
    manualSwitchWorklogs &&
      setInputDateWorklogsErrors(newInputDateWorklogsErrors);
    const newStartTimeWorklogsErrors = manualFieldsWorklogs.map(
      (field) =>
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.startTime.trim().length === 0) ||
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.startTime.trim().length < 8)
    );
    manualSwitchWorklogs &&
      setStartTimeWorklogsErrors(newStartTimeWorklogsErrors);
    const newEndTimeWorklogsErrors = manualFieldsWorklogs.map(
      (field) =>
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.endTime.trim().length === 0) ||
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.endTime.trim().length < 8) ||
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.endTime <= field.startTime) ||
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
    manualSwitchWorklogs && setEndTimeWorklogsErrors(newEndTimeWorklogsErrors);
    const newManualDescWorklogsErrors = manualFieldsWorklogs.map(
      (field) =>
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.manualDesc.trim().length < 5) ||
        (onEdit === 0 &&
          manualSwitchWorklogs &&
          field.manualDesc.trim().length > 500)
    );
    manualSwitchWorklogs &&
      setManualDescWorklogsErrors(newManualDescWorklogsErrors);
    hasManualErrors =
      newInputDateWorklogsErrors.some((error) => error) ||
      newStartTimeWorklogsErrors.some((error) => error) ||
      newEndTimeWorklogsErrors.some((error) => error) ||
      newManualDescWorklogsErrors.some((error) => error);

    const data = {
      WorkItemId: onEdit > 0 ? onEdit : 0,
      ClientId: clientNameWorklogs,
      WorkTypeId: typeOfWorkWorklogs,
      taskName: clientTaskNameWorklogs,
      ProjectId: projectNameWorklogs === 0 ? null : projectNameWorklogs,
      ProcessId: processNameWorklogs === 0 ? null : processNameWorklogs,
      SubProcessId: subProcessWorklogs === 0 ? null : subProcessWorklogs,
      StatusId: statusWorklogs,
      Priority: priorityWorklogs === 0 ? 0 : priorityWorklogs,
      Quantity: quantityWorklogs,
      Description:
        descriptionWorklogs.toString().length <= 0
          ? null
          : descriptionWorklogs.toString().trim(),
      ReceiverDate: dayjs(receiverDateWorklogs).format("YYYY/MM/DD"),
      DueDate: dayjs(dueDateWorklogs).format("YYYY/MM/DD"),
      allInfoDate: allInfoDateWorklogs === "" ? null : allInfoDateWorklogs,
      AssignedId: assigneeWorklogs,
      ReviewerId: reviewerWorklogs,
      managerId: managerWorklogs,
      TaxReturnType: null,
      TaxCustomFields:
        typeOfWorkWorklogs !== 3
          ? null
          : {
              ReturnYear: returnYearWorklogs,
              Complexity: null,
              CountYear: null,
              NoOfPages: noOfPagesWorklogs,
            },
      checklistWorkpaper:
        checklistWorkpaperWorklogs === 1
          ? true
          : checklistWorkpaperWorklogs === 2
          ? false
          : null,
      ManualTimeList:
        onEdit > 0
          ? null
          : manualSwitchWorklogs
          ? manualFieldsWorklogs.map(
              (i: any) =>
                new Object({
                  Date: i.inputDate,
                  startTime:
                    dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.startTime,
                  endTime:
                    dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.endTime,
                  comment: i.manualDesc,
                })
            )
          : null,
      SubTaskList:
        onEdit > 0
          ? null
          : subTaskSwitchWorklogs
          ? subTaskFieldsWorklogs.map(
              (i: any) =>
                new Object({
                  SubtaskId: i.SubtaskId,
                  Title: i.Title.trim(),
                  Description: i.Description.trim(),
                })
            )
          : null,
      RecurringObj:
        onEdit > 0
          ? null
          : recurringSwitch
          ? {
              Type: recurringTime,
              IsActive: true,
              StartDate: dayjs(recurringStartDate).format("YYYY/MM/DD"),
              EndDate: dayjs(recurringEndDate).format("YYYY/MM/DD"),
              triggerIdList:
                recurringTime === 1
                  ? []
                  : recurringTime === 2
                  ? selectedDays
                  : recurringMonth.map((i: any) => i.value),
            }
          : null,
      ReminderObj:
        onEdit > 0
          ? null
          : reminderSwitch
          ? {
              Type: reminderCheckboxValue,
              IsActive: true,
              ReminderDate: reminderDate.length > 0 ? reminderDate : null,
              ReminderTime: reminderTime,
              ReminderUserList: reminderNotification.map((i: any) => i.value),
            }
          : null,
    };

    const saveWorklog = async () => {
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
            onEdit > 0 && getEditDataWorklogs();
            onEdit > 0 && typeOfWorkWorklogs === 3 && getCheckListData();
            onEdit === 0 && onClose();
            onEdit === 0 && handleClose();
          } else {
            const data = response.data.Message;
            onEdit > 0 && getEditDataWorklogs();
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };

    if (
      onEdit === 0 &&
      typeOfWorkWorklogs !== 3 &&
      !hasErrors &&
      !hasSubErrors &&
      !hasManualErrors &&
      clientTaskNameWorklogs.trim().length > 3 &&
      clientTaskNameWorklogs.trim().length < 50 &&
      !quantityWorklogsErr &&
      quantityWorklogs > 0 &&
      quantityWorklogs < 10000 &&
      !quantityWorklogs.toString().includes(".")
    ) {
      if (hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")) {
        saveWorklog();
      } else {
        toast.error("User don't have permission to Create Task.");
      }
    }

    if (
      onEdit === 0 &&
      typeOfWorkWorklogs === 3 &&
      !hasErrors &&
      !hasSubErrors &&
      !hasManualErrors &&
      clientTaskNameWorklogs.trim().length > 3 &&
      clientTaskNameWorklogs.trim().length < 50 &&
      !quantityWorklogsErr &&
      quantityWorklogs > 0 &&
      quantityWorklogs < 10000 &&
      !quantityWorklogs.toString().includes(".")
    ) {
      if (hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")) {
        saveWorklog();
      } else {
        toast.error("User don't have permission to Create Task.");
      }
    }

    if (
      (onEdit > 0 && editStatusWorklogs === 4) ||
      (onEdit > 0 && editStatusWorklogs === 5) ||
      (onEdit > 0 && statusWorklogs === 7) ||
      (onEdit > 0 && statusWorklogs === 8) ||
      (onEdit > 0 && statusWorklogs === 9) ||
      (onEdit > 0 && statusWorklogs === 13)
    ) {
      toast.warning(
        "Cannot change task for status 'Stop', 'ErrorLog', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
      );
      getEditDataWorklogs();
    } else if (
      onEdit > 0 &&
      editStatusWorklogs !== 4 &&
      editStatusWorklogs !== 5 &&
      statusWorklogs !== 7 &&
      statusWorklogs !== 8 &&
      statusWorklogs !== 9 &&
      statusWorklogs !== 13 &&
      typeOfWorkWorklogs !== 3 &&
      !hasEditErrors &&
      clientTaskNameWorklogs.trim().length > 3 &&
      clientTaskNameWorklogs.trim().length < 50 &&
      quantityWorklogs > 0 &&
      quantityWorklogs < 10000 &&
      !quantityWorklogsErr &&
      !quantityWorklogs.toString().includes(".")
    ) {
      if (hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")) {
        saveWorklog();
      } else {
        toast.error("User don't have permission to Update Task.");
        getEditDataWorklogs();
      }
    } else if (
      onEdit > 0 &&
      editStatusWorklogs !== 4 &&
      editStatusWorklogs !== 5 &&
      statusWorklogs !== 7 &&
      statusWorklogs !== 8 &&
      statusWorklogs !== 9 &&
      statusWorklogs !== 13 &&
      typeOfWorkWorklogs === 3 &&
      !hasEditErrors &&
      clientTaskNameWorklogs.trim().length > 3 &&
      clientTaskNameWorklogs.trim().length < 50 &&
      quantityWorklogs > 0 &&
      quantityWorklogs < 10000 &&
      !quantityWorklogsErr &&
      !quantityWorklogs.toString().includes(".")
    ) {
      if (hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")) {
        saveWorklog();
      } else {
        toast.error("User don't have permission to Update Task.");
        getEditDataWorklogs();
      }
    }
  };

  // OnEdit
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
                      AttachmentPath: "",
                    },
                  ],
                  isSolved: false,
                  DisableErrorLog: false,
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
                        i.Attachment === null || i.Attachment.length <= 0
                          ? [
                              {
                                AttachmentId: 0,
                                UserFileName: "",
                                SystemFileName: "",
                                AttachmentPath: "",
                              },
                            ]
                          : i.Attachment,
                      isSolved: i.IsSolved,
                      DisableErrorLog: i.DisableErrorLog,
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
      if (error.response && error.response?.status === 401) {
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
      if (error.response && error.response?.status === 401) {
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

  const getEditDataWorklogs = async () => {
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
        setEditDataWorklogs(ResponseData);
        setIsCreatedByClientWorklogsDrawer(ResponseData.IsCreatedByClient);
        setIsManual(ResponseData.IsManual);
        setClientNameWorklogs(ResponseData.ClientId);
        setTypeOfWorkWorklogs(ResponseData.WorkTypeId);
        setProjectNameWorklogs(
          ResponseData.ProjectId === null ? "" : ResponseData.ProjectId
        );
        setProcessNameWorklogs(
          ResponseData.ProcessId === null ? "" : ResponseData.ProcessId
        );
        setSubProcessWorklogs(
          ResponseData.SubProcessId === null ? "" : ResponseData.SubProcessId
        );
        setClientTaskNameWorklogs(
          ResponseData.TaskName === null ? "" : ResponseData.TaskName
        );
        setEditStatusWorklogs(ResponseData.StatusId);
        setStatusWorklogs(ResponseData.StatusId);
        setAllInfoDateWorklogs(
          ResponseData.AllInfoDate === null ? "" : ResponseData.AllInfoDate
        );
        ResponseData.StatusId === 2 && ResponseData.IsManual === true
          ? setStatusWorklogsDropdownDataUse(
              statusWorklogsDropdownData
                .map((i: any) =>
                  i.Type === "OnHoldFromClient" ||
                  i.Type === "WithDraw" ||
                  i.Type === "Stop" ||
                  i.value === ResponseData.StatusId
                    ? i
                    : ""
                )
                .filter((i: any) => i !== "")
            )
          : setStatusWorklogsDropdownDataUse(
              statusWorklogsDropdownData
                .map((i: any) =>
                  i.Type === "OnHoldFromClient" ||
                  i.Type === "WithDraw" ||
                  i.value === ResponseData.StatusId
                    ? i
                    : ""
                )
                .filter((i: any) => i !== "")
            );
        setPriorityWorklogs(
          ResponseData.Priority === null ? 0 : ResponseData.Priority
        );
        setQuantityWorklogs(ResponseData.Quantity);
        setDescriptionWorklogs(
          ResponseData.Description === null ? "" : ResponseData.Description
        );
        setReceiverDateWorklogs(ResponseData.ReceiverDate);
        setDueDateWorklogs(ResponseData.DueDate);
        setDateOfReviewWorklogs(ResponseData.ReviewerDate);
        setDateOfPreperationWorklogs(ResponseData.PreparationDate);
        setAssigneeWorklogs(ResponseData.AssignedId);
        setReviewerWorklogs(ResponseData.ReviewerId);
        setManagerWorklogs(
          ResponseData.ManagerId === null ? 0 : ResponseData.ManagerId
        );
        setReturnYearWorklogs(
          ResponseData.TypeOfReturnId === 0
            ? null
            : ResponseData.TaxCustomFields.ReturnYear
        );
        setNoOfPagesWorklogs(
          ResponseData.TypeOfReturnId === 0
            ? null
            : ResponseData.TaxCustomFields.NoOfPages
        );
        setChecklistWorkpaperWorklogs(
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

  const onEditDataWorklogs = () => {
    if (onEdit > 0) {
      getEditDataWorklogs();
      getSubTaskDataWorklogs();
      getRecurringDataWorklogs();
      getManualDataWorklogs();
      getCheckListData();
      getCommentData(1);
      getReviewerNoteData();
    }
  };

  useEffect(() => {
    onEdit > 0 && assigneeWorklogsDropdownData.length > 0 && getErrorLogData();
    onEdit > 0 &&
      assigneeWorklogsDropdownData.length > 0 &&
      getReminderDataWorklogs();
  }, [assigneeWorklogsDropdownData]);

  // GEtDropdownData
  useEffect(() => {
    const getData = async () => {
      await setStatusWorklogsDropdownData(await getStatusDropdownData());
      await setCCDropdownData(await getCCDropdownData());
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      onOpen &&
        statusWorklogsDropdownData.length === 0 &&
        (await setStatusWorklogsDropdownData(await getStatusDropdownData()));
      onOpen &&
        onEdit === 0 &&
        setStatusWorklogs(
          statusWorklogsDropdownData
            .map((i: any) => (i.Type === "NotStarted" ? i.value : undefined))
            .filter((i: any) => i !== undefined)[0]
        );
      onOpen &&
        statusWorklogsDropdownData.length === 0 &&
        (await setCCDropdownData(await getCCDropdownData()));
      statusWorklogsDropdownData.length > 0 && (await onEditDataWorklogs());
    };
    getData();
  }, [onEdit, onOpen, statusWorklogsDropdownData]);

  useEffect(() => {
    const getData = async () => {
      getUserDetails();
      setClientWorklogsDropdownData(await getClientDropdownData());
      setManagerWorklogsDropdownData(await getManagerDropdownData());
      const workTypeData: any =
        clientNameWorklogs > 0 &&
        (await getTypeOfWorkDropdownData(clientNameWorklogs));
      workTypeData.length > 0 &&
        setTypeOfWorkWorklogsDropdownData(workTypeData);
      workTypeData.length > 0 &&
        onEdit === 0 &&
        setTypeOfWorkWorklogs(
          workTypeData.map((i: any) => i.value).includes(3)
            ? 3
            : workTypeData.map((i: any) => i.value).includes(1)
            ? 1
            : workTypeData.map((i: any) => i.value).includes(2)
            ? 2
            : 0
        );
      const projectData: any =
        clientNameWorklogs > 0 &&
        (await getProjectDropdownData(clientNameWorklogs));
      projectData.length > 0 && setProjectWorklogsDropdownData(projectData);
      projectData.length > 0 &&
        projectData.length === 1 &&
        onEdit === 0 &&
        setProjectNameWorklogs(projectData.map((i: any) => i.value)[0]);
      const processData: any =
        clientNameWorklogs > 0 &&
        (await getProcessDropdownData(clientNameWorklogs));
      setProcessWorklogsDropdownData(
        processData.map((i: any) => new Object({ label: i.Name, value: i.Id }))
      );
    };

    onOpen && getData();
  }, [clientNameWorklogs, onOpen]);

  useEffect(() => {
    const getData = async () => {
      const data: any =
        processNameWorklogs !== 0 &&
        (await getSubProcessDropdownData(
          clientNameWorklogs,
          processNameWorklogs
        ));
      data.length > 0 && setEstTimeDataWorklogs(data);
      data.length > 0 &&
        setSubProcessWorklogsDropdownData(
          data.map((i: any) => new Object({ label: i.Name, value: i.Id }))
        );
    };

    getData();
  }, [processNameWorklogs]);

  useEffect(() => {
    const getData = async () => {
      const assigneeData = await getAssigneeDropdownData(
        clientNameWorklogs,
        typeOfWorkWorklogs
      );
      assigneeData.length > 0 && setAssigneeWorklogsDropdownData(assigneeData);
      const assigneeId =
        onEdit > 0 &&
        assigneeWorklogs > 0 &&
        assigneeData.length > 0 &&
        assigneeData
          .map((i: any) =>
            i.value === assigneeWorklogs ? assigneeWorklogs : false
          )
          .filter((j: any) => j !== false)[0];
      onEdit > 0 &&
        assigneeWorklogs > 0 &&
        assigneeData.length > 0 &&
        setAssigneeWorklogs(assigneeId !== undefined ? assigneeId : 0);

      const reviewerData = await getReviewerDropdownData(
        clientNameWorklogs,
        typeOfWorkWorklogs
      );
      reviewerData.length > 0 && setReviewerWorklogsDropdownData(reviewerData);
      const UserId: any = await localStorage.getItem("UserId");
      const reviwerId =
        reviewerData.length > 0 &&
        reviewerData
          .map((i: any) => (i.value === parseInt(UserId) ? i.value : undefined))
          .filter((i: any) => i !== undefined)[0];
      reviewerData.length > 0 &&
        onEdit === 0 &&
        setReviewerWorklogs(reviwerId === false ? 0 : reviwerId);
    };

    typeOfWorkWorklogs !== 0 && getData();
  }, [typeOfWorkWorklogs, clientNameWorklogs]);

  // Add Checklist
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
    if (
      editStatusWorklogs === 4 ||
      statusWorklogs === 7 ||
      statusWorklogs === 8 ||
      statusWorklogs === 9 ||
      statusWorklogs === 13
    ) {
      toast.warning(
        "Cannot change task for status 'Stop', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
      );
      getCheckListData();
    } else {
      setCheckListNameError(
        checkListName.trim().length < 5 || checkListName.trim().length > 500
      );

      if (
        !checkListNameError &&
        checkListName.trim().length > 4 &&
        checkListName.trim().length < 500
      ) {
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
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            router.push("/login");
            localStorage.clear();
          }
        }
      }
    }
  };

  const handleChangeChecklist = async (
    Category: any,
    IsCheck: any,
    Title: any
  ) => {
    if (
      editStatusWorklogs === 4 ||
      statusWorklogs === 7 ||
      statusWorklogs === 8 ||
      statusWorklogs === 9 ||
      statusWorklogs === 13
    ) {
      toast.warning(
        "Cannot change task for status 'Stop', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
      );
      getCheckListData();
    } else {
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
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    }
  };

  const getUserDetails = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.get(
        `${process.env.api_url}/auth/getuserdetails`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setAssigneeWorklogsDisable(
            response.data.ResponseData.IsHaveManageAssignee
          );
          setUserId(response.data.ResponseData.UserId);
          !response.data.ResponseData.IsHaveManageAssignee &&
            setAssigneeWorklogs(response.data.ResponseData.UserId);
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

  const users =
    assigneeWorklogsDropdownData?.length > 0 &&
    assigneeWorklogsDropdownData.map(
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
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
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
              toast.error("Failed Please try again.");
            } else {
              toast.error(data);
            }
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

  const handleClose = () => {
    setEditDataWorklogs([]);
    setIsCreatedByClientWorklogsDrawer(false);
    setUserId(0);
    setClientNameWorklogs(0);
    setClientNameWorklogsErr(false);
    setTypeOfWorkWorklogs(0);
    setTypeOfWorkWorklogsErr(false);
    setProjectNameWorklogs(0);
    setProjectNameWorklogsErr(false);
    setClientTaskNameWorklogs("");
    setClientTaskNameWorklogsErr(false);
    setProcessNameWorklogs(0);
    setProcessNameWorklogsErr(false);
    setSubProcessWorklogs(0);
    setSubProcessWorklogsErr(false);
    setManagerWorklogs(0);
    setManagerWorklogsErr(false);
    setEditStatusWorklogs(0);
    setStatusWorklogs(0);
    setStatusWorklogsErr(false);
    setDescriptionWorklogs("");
    setPriorityWorklogs(0);
    setQuantityWorklogs(1);
    setQuantityWorklogsErr(false);
    setReceiverDateWorklogs("");
    setReceiverDateWorklogsErr(false);
    setDueDateWorklogs("");
    setAllInfoDateWorklogs("");
    setAssigneeWorklogs(0);
    setAssigneeWorklogsErr(false);
    setAssigneeWorklogsDisable(true);
    setReviewerWorklogs(0);
    setReviewerWorklogsErr(false);
    setDateOfReviewWorklogs("");
    setDateOfPreperationWorklogs("");
    setEstTimeDataWorklogs([]);
    setReturnYearWorklogs(0);
    setReturnYearWorklogsErr(false);
    setNoOfPagesWorklogs(0);
    setChecklistWorkpaperWorklogs(0);
    setChecklistWorkpaperWorklogsErr(false);

    // Sub-Task
    setSubTaskSwitchWorklogs(false);
    setSubTaskFieldsWorklogs([
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameWorklogsErr([false]);
    setSubTaskDescriptionWorklogsErr([false]);

    // Recurring
    setRecurringSwitch(false);
    setRecurringStartDate("");
    setRecurringStartDateErr(false);
    setRecurringEndDate("");
    setRecurringEndDateErr(false);
    setRecurringTime(1);
    setRecurringMonth(0);
    setRecurringMonthErr(false);

    // Manual
    setIsManual(null);
    setManualSwitchWorklogs(false);
    setManualFieldsWorklogs([
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
    setInputDateWorklogsErrors([false]);
    setStartTimeWorklogsErrors([false]);
    setEndTimeWorklogsErrors([false]);
    setManualDescWorklogsErrors([false]);
    setDeletedManualTimeWorklogs([]);
    setManualSubmitWorklogsDisable(true);

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

    // checklist
    setCheckListName("");
    setCheckListNameError(false);
    setCheckListData([]);
    setItemStates({});

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
            AttachmentPath: "",
          },
        ],
        isSolved: false,
        DisableErrorLog: false,
      },
    ]);
    setErrorTypeErr([false]);
    setRootCauseErr([false]);
    setErrorLogPriorityErr([false]);
    setErrorCountErr([false]);
    setNatureOfErr([false]);

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

    // Reviewer note
    setReviewerNoteData([]);

    // Dropdown
    setClientWorklogsDropdownData([]);
    setTypeOfWorkWorklogsDropdownData([]);
    setProjectWorklogsDropdownData([]);
    setProcessWorklogsDropdownData([]);
    setSubProcessWorklogsDropdownData([]);
    setStatusWorklogsDropdownDataUse([]);
    setAssigneeWorklogsDropdownData([]);
    setReviewerWorklogsDropdownData([]);

    // Others
    scrollToPanel(0);
    onDataFetch();

    if (typeof window !== "undefined") {
      const pathname = window.location.href.includes("=");
      if (pathname) {
        onClose();
        router.push("/worklogs");
      } else {
        onClose();
      }
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-30 h-screen overflow-y-auto w-[1300px] border border-lightSilver bg-pureWhite transform  ${
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
                    } cursor-pointer font-bold hover:text-[#0592C6] text-slatyGrey`}
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
                      <span>Created By : {editDataWorklogs.CreatedByName}</span>
                    )}
                    <span
                      className={`cursor-pointer ${
                        taskWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setTaskWorklogsDrawer(!taskWorklogsDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                {taskWorklogsDrawer && (
                  <Grid container className="px-8">
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={clientWorklogsDropdownData}
                        value={
                          clientWorklogsDropdownData.find(
                            (i: any) => i.value === clientNameWorklogs
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setClientNameWorklogs(value.value);
                          setTypeOfWorkWorklogsErr(false);
                          setProjectNameWorklogs(0);
                          setProjectNameWorklogsErr(false);
                          setProcessNameWorklogs(0);
                          setProcessNameWorklogsErr(false);
                          setSubProcessWorklogs(0);
                          setSubProcessWorklogsErr(false);
                          setDescriptionWorklogs("");
                          setManagerWorklogs(0);
                          setManagerWorklogsErr(false);
                          setPriorityWorklogs(0);
                          setQuantityWorklogs(1);
                          setQuantityWorklogsErr(false);
                          setReceiverDateWorklogs("");
                          setReceiverDateWorklogsErr(false);
                          setDueDateWorklogs("");
                          assigneeWorklogsDisable && setAssigneeWorklogs(0);
                          assigneeWorklogsDisable &&
                            setAssigneeWorklogsErr(false);
                          setReviewerWorklogs(0);
                          setReviewerWorklogsErr(false);
                        }}
                        disabled={
                          isCreatedByClientWorklogsDrawer &&
                          editDataWorklogs.ClientId > 0
                        }
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
                            error={clientNameWorklogsErr}
                            onBlur={(e) => {
                              if (clientNameWorklogs > 0) {
                                setClientNameWorklogsErr(false);
                              }
                            }}
                            helperText={
                              clientNameWorklogsErr
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
                        error={typeOfWorkWorklogsErr}
                        disabled={
                          isCreatedByClientWorklogsDrawer &&
                          editDataWorklogs.WorkTypeId > 0
                        }
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Type of Work
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            typeOfWorkWorklogs === 0 ? "" : typeOfWorkWorklogs
                          }
                          onChange={(e) => {
                            onEdit === 0 && setProjectNameWorklogs(0);
                            onEdit === 0 && setProjectNameWorklogsErr(false);
                            onEdit === 0 && setProcessNameWorklogs(0);
                            onEdit === 0 && setProcessNameWorklogsErr(false);
                            onEdit === 0 && setSubProcessWorklogs(0);
                            onEdit === 0 && setSubProcessWorklogsErr(false);
                            onEdit === 0 && setDescriptionWorklogs("");
                            onEdit === 0 && setManagerWorklogs(0);
                            onEdit === 0 && setManagerWorklogsErr(false);
                            onEdit === 0 && setPriorityWorklogs(0);
                            onEdit === 0 && setQuantityWorklogs(1);
                            onEdit === 0 && setQuantityWorklogsErr(false);
                            onEdit === 0 && setReceiverDateWorklogs("");
                            onEdit === 0 && setReceiverDateWorklogsErr(false);
                            onEdit === 0 && setDueDateWorklogs("");
                            assigneeWorklogsDisable && setAssigneeWorklogs(0);
                            setReviewerWorklogs(0);
                            setTypeOfWorkWorklogs(e.target.value);
                            onEdit === 0 && setDateOfReviewWorklogs("");
                            onEdit === 0 && setDateOfPreperationWorklogs("");
                            onEdit === 0 && setReturnYearWorklogs(0);
                            onEdit === 0 && setNoOfPagesWorklogs(0);
                          }}
                          onBlur={(e: any) => {
                            if (e.target.value > 0) {
                              setTypeOfWorkWorklogsErr(false);
                            }
                          }}
                        >
                          {typeOfWorkWorklogsDropdownData.map(
                            (i: any, index: number) => (
                              <MenuItem value={i.value} key={index}>
                                {i.label}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        {typeOfWorkWorklogsErr && (
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
                        options={projectWorklogsDropdownData}
                        value={
                          projectWorklogsDropdownData.find(
                            (i: any) => i.value === projectNameWorklogs
                          ) || null
                        }
                        disabled={
                          isCreatedByClientWorklogsDrawer &&
                          editDataWorklogs.ProjectId > 0
                        }
                        onChange={(e, value: any) => {
                          value && setProjectNameWorklogs(value.value);
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
                            error={projectNameWorklogsErr}
                            onBlur={(e) => {
                              if (projectNameWorklogs > 0) {
                                setProjectNameWorklogsErr(false);
                              }
                            }}
                            helperText={
                              projectNameWorklogsErr
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
                            ? statusWorklogsDropdownData
                            : statusWorklogsDropdownDataUse
                        }
                        disabled={
                          onEdit === 0 ||
                          statusWorklogs === 7 ||
                          statusWorklogs === 8 ||
                          statusWorklogs === 9
                        }
                        value={
                          onEdit === 0 && manualSwitchWorklogs
                            ? statusWorklogsDropdownData.find(
                                (i: any) => i.value === statusWorklogs
                              ) || null
                            : onEdit === 0
                            ? statusWorklogsDropdownData.find(
                                (i: any) => i.value === statusWorklogs
                              ) || null
                            : statusWorklogsDropdownDataUse.find(
                                (i: any) => i.value === statusWorklogs
                              ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setStatusWorklogs(value.value);
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
                            error={statusWorklogsErr}
                            onBlur={(e) => {
                              if (subProcessWorklogs > 0) {
                                setStatusWorklogsErr(false);
                              }
                            }}
                            helperText={
                              statusWorklogsErr
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
                        options={processWorklogsDropdownData}
                        value={
                          processWorklogsDropdownData.find(
                            (i: any) => i.value === processNameWorklogs
                          ) || null
                        }
                        disabled={
                          isCreatedByClientWorklogsDrawer &&
                          editDataWorklogs.ProcessId > 0
                        }
                        onChange={(e, value: any) => {
                          value && setProcessNameWorklogs(value.value);
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
                            error={processNameWorklogsErr}
                            onBlur={(e) => {
                              if (processNameWorklogs > 0) {
                                setProcessNameWorklogsErr(false);
                              }
                            }}
                            helperText={
                              processNameWorklogsErr
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
                        options={subProcessWorklogsDropdownData}
                        value={
                          subProcessWorklogsDropdownData.find(
                            (i: any) => i.value === subProcessWorklogs
                          ) || null
                        }
                        disabled={
                          isCreatedByClientWorklogsDrawer &&
                          editDataWorklogs.SubProcessId > 0
                        }
                        onChange={(e, value: any) => {
                          value && setSubProcessWorklogs(value.value);
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
                            error={subProcessWorklogsErr}
                            onBlur={(e) => {
                              if (subProcessWorklogs > 0) {
                                setSubProcessWorklogsErr(false);
                              }
                            }}
                            helperText={
                              subProcessWorklogsErr
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
                          clientTaskNameWorklogs?.trim().length <= 0
                            ? ""
                            : clientTaskNameWorklogs
                        }
                        onChange={(e) => {
                          setClientTaskNameWorklogs(e.target.value);
                          setClientTaskNameWorklogsErr(false);
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value.trim().length > 4) {
                            setClientTaskNameWorklogsErr(false);
                          }
                          if (
                            e.target.value.trim().length > 4 &&
                            e.target.value.trim().length < 50
                          ) {
                            setClientTaskNameWorklogsErr(false);
                          }
                        }}
                        error={clientTaskNameWorklogsErr}
                        helperText={
                          clientTaskNameWorklogsErr &&
                          clientTaskNameWorklogs?.trim().length > 0 &&
                          clientTaskNameWorklogs?.trim().length < 4
                            ? "Minimum 4 characters required."
                            : clientTaskNameWorklogsErr &&
                              clientTaskNameWorklogs?.trim().length > 50
                            ? "Maximum 50 characters allowed."
                            : clientTaskNameWorklogsErr
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
                          descriptionWorklogs?.trim().length <= 0
                            ? ""
                            : descriptionWorklogs
                        }
                        onChange={(e) => setDescriptionWorklogs(e.target.value)}
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
                          value={priorityWorklogs === 0 ? "" : priorityWorklogs}
                          onChange={(e) => setPriorityWorklogs(e.target.value)}
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
                          subProcessWorklogs > 0
                            ? (estTimeDataWorklogs as any[])
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
                                  return subProcessWorklogs === i.Id
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
                        value={quantityWorklogs}
                        onChange={(e) => {
                          setQuantityWorklogs(e.target.value);
                          setQuantityWorklogsErr(false);
                        }}
                        onBlur={(e: any) => {
                          if (
                            e.target.value.trim().length > 0 &&
                            e.target.value.trim().length < 5 &&
                            !e.target.value.trim().includes(".")
                          ) {
                            setQuantityWorklogsErr(false);
                          }
                        }}
                        error={quantityWorklogsErr}
                        helperText={
                          quantityWorklogsErr &&
                          quantityWorklogs.toString().includes(".")
                            ? "Only intiger value allowed."
                            : quantityWorklogsErr && quantityWorklogs === ""
                            ? "This is a required field."
                            : quantityWorklogsErr && quantityWorklogs <= 0
                            ? "Enter valid number."
                            : quantityWorklogsErr && quantityWorklogs.length > 4
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
                          subProcessWorklogs > 0
                            ? (estTimeDataWorklogs as any[])
                                .map((i) => {
                                  const hours = Math.floor(
                                    (i.EstimatedHour * quantityWorklogs) / 3600
                                  );
                                  const minutes = Math.floor(
                                    ((i.EstimatedHour * quantityWorklogs) %
                                      3600) /
                                      60
                                  );
                                  const remainingSeconds =
                                    (i.EstimatedHour * quantityWorklogs) % 60;
                                  const formattedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedSeconds = remainingSeconds
                                    .toString()
                                    .padStart(2, "0");
                                  return subProcessWorklogs === i.Id
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
                          mt: typeOfWorkWorklogs === 3 ? -0.9 : -0.8,
                        }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <div
                        className={`inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          receiverDateWorklogsErr ? "datepickerError" : ""
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
                            onError={() => setReceiverDateWorklogsErr(false)}
                            value={
                              receiverDateWorklogs === ""
                                ? null
                                : dayjs(receiverDateWorklogs)
                            }
                            shouldDisableDate={isWeekend}
                            maxDate={dayjs(Date.now())}
                            onChange={(newDate: any) => {
                              setReceiverDateWorklogs(newDate.$d);
                              setReceiverDateWorklogsErr(false);
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
                              setDueDateWorklogs(nextDate);
                            }}
                            slotProps={{
                              textField: {
                                helperText: receiverDateWorklogsErr
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
                      <div
                        className={`inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
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
                              dueDateWorklogs === ""
                                ? null
                                : dayjs(dueDateWorklogs)
                            }
                            disabled
                            onChange={(newDate: any) => {
                              setDueDateWorklogs(newDate.$d);
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
                        className={`inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="All Info Date"
                            value={
                              allInfoDateWorklogs === ""
                                ? null
                                : dayjs(allInfoDateWorklogs)
                            }
                            onChange={(newDate: any) =>
                              setAllInfoDateWorklogs(newDate.$d)
                            }
                          />
                        </LocalizationProvider>
                      </div>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assigneeWorklogsDropdownData}
                        disabled={!assigneeWorklogsDisable}
                        value={
                          assigneeWorklogsDropdownData.find(
                            (i: any) => i.value === assigneeWorklogs
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setAssigneeWorklogs(value.value);
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
                            error={assigneeWorklogsErr}
                            onBlur={(e) => {
                              if (assigneeWorklogs > 0) {
                                setAssigneeWorklogsErr(false);
                              }
                            }}
                            helperText={
                              assigneeWorklogsErr
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
                        typeOfWorkWorklogs === 3 ? "pt-4" : "pt-5"
                      }`}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={reviewerWorklogsDropdownData}
                        value={
                          reviewerWorklogsDropdownData.find(
                            (i: any) => i.value === reviewerWorklogs
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setReviewerWorklogs(value.value);
                        }}
                        sx={{
                          width: 300,
                          mt: typeOfWorkWorklogs === 3 ? 0.2 : -1,
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
                            error={reviewerWorklogsErr}
                            onBlur={(e) => {
                              if (reviewerWorklogs > 0) {
                                setReviewerWorklogsErr(false);
                              }
                            }}
                            helperText={
                              reviewerWorklogsErr
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
                        typeOfWorkWorklogs === 3 ? "pt-4" : "pt-5"
                      }`}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={managerWorklogsDropdownData}
                        value={
                          managerWorklogsDropdownData.find(
                            (i: any) => i.value === managerWorklogs
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setManagerWorklogs(value.value);
                        }}
                        sx={{
                          width: 300,
                          mt: typeOfWorkWorklogs === 3 ? 0.2 : -1,
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
                            error={managerWorklogsErr}
                            onBlur={(e) => {
                              if (managerWorklogs > 0) {
                                setManagerWorklogsErr(false);
                              }
                            }}
                            helperText={
                              managerWorklogsErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    {typeOfWorkWorklogs === 3 && (
                      <>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ width: 300, mt: -0.3, mx: 0.75 }}
                            error={returnYearWorklogsErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Return Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={
                                returnYearWorklogs === 0
                                  ? ""
                                  : returnYearWorklogs
                              }
                              onChange={(e) =>
                                setReturnYearWorklogs(e.target.value)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setReturnYearWorklogsErr(false);
                                }
                              }}
                            >
                              {yearWorklogsDrawerDropdown.map(
                                (i: any, index: number) => (
                                  <MenuItem value={i.value} key={index}>
                                    {i.label}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {returnYearWorklogsErr && (
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
                              noOfPagesWorklogs === 0 ? "" : noOfPagesWorklogs
                            }
                            onChange={(e) =>
                              setNoOfPagesWorklogs(e.target.value)
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
                            error={checklistWorkpaperWorklogsErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Checklist/Workpaper
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={
                                checklistWorkpaperWorklogs === 0
                                  ? ""
                                  : checklistWorkpaperWorklogs
                              }
                              onChange={(e) =>
                                setChecklistWorkpaperWorklogs(e.target.value)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setChecklistWorkpaperWorklogsErr(false);
                                }
                              }}
                            >
                              <MenuItem value={1}>Yes</MenuItem>
                              <MenuItem value={2}>No</MenuItem>
                            </Select>
                            {checklistWorkpaperWorklogsErr && (
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
                            typeOfWorkWorklogs === 3 ? "pt-4" : "pt-5"
                          }`}
                        >
                          <TextField
                            label="Date of Preperation"
                            type={inputTypePreperationWorklogsDrawer}
                            disabled
                            fullWidth
                            value={dateOfPreperationWorklogs}
                            onChange={(e) =>
                              setDateOfPreperationWorklogs(e.target.value)
                            }
                            onFocus={() =>
                              setInputTypePreperationWorklogsDrawer("date")
                            }
                            onBlur={(e: any) => {
                              setInputTypePreperationWorklogsDrawer("text");
                            }}
                            margin="normal"
                            variant="standard"
                            sx={{
                              width: 300,
                              mt: typeOfWorkWorklogs === 3 ? -0.4 : -1,
                              mx: 0.75,
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          className={`${
                            typeOfWorkWorklogs === 3 ? "pt-4" : "pt-5"
                          }`}
                        >
                          <TextField
                            label="Date of Review"
                            disabled
                            type={inputTypeReviewWorklogsDrawer}
                            fullWidth
                            value={dateOfReviewWorklogs}
                            onChange={(e) =>
                              setDateOfReviewWorklogs(e.target.value)
                            }
                            onFocus={() =>
                              setInputTypeReviewWorklogsDrawer("date")
                            }
                            onBlur={(e: any) => {
                              setInputTypeReviewWorklogsDrawer("text");
                            }}
                            margin="normal"
                            variant="standard"
                            sx={{
                              width: 300,
                              mt: typeOfWorkWorklogs === 3 ? -0.4 : -1,
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
                    {onEdit > 0 && subTaskSwitchWorklogs && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitSubTaskWorklogs}
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
                        checked={subTaskSwitchWorklogs}
                        onChange={(e) => {
                          setSubTaskSwitchWorklogs(e.target.checked);
                          onEdit === 0 &&
                            setSubTaskFieldsWorklogs([
                              {
                                SubtaskId: 0,
                                Title: "",
                                Description: "",
                              },
                            ]);
                          onEdit === 0 && setTaskNameWorklogsErr([false]);
                          onEdit === 0 &&
                            setSubTaskDescriptionWorklogsErr([false]);
                          onEdit === 0 && setDeletedSubTaskWorklogs([]);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        subTaskWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setSubTaskWorklogsDrawer(!subTaskWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {subTaskWorklogsDrawer && (
                  <div className="mt-3 pl-6">
                    {subTaskFieldsWorklogs.map((field, index) => (
                      <div className="w-[100%] flex" key={index}>
                        <TextField
                          label={
                            <span>
                              Task Name
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          disabled={!subTaskSwitchWorklogs}
                          value={field.Title}
                          onChange={(e) =>
                            handleSubTaskChangeWorklogs(e, index)
                          }
                          onBlur={(e: any) => {
                            if (e.target.value.trim().length > 0) {
                              const newTaskNameWorklogsErrors = [
                                ...taskNameWorklogsErr,
                              ];
                              newTaskNameWorklogsErrors[index] = false;
                              setTaskNameWorklogsErr(newTaskNameWorklogsErrors);
                            }
                          }}
                          error={taskNameWorklogsErr[index]}
                          helperText={
                            taskNameWorklogsErr[index] &&
                            field.Title.length > 0 &&
                            field.Title.length < 5
                              ? "Minumum 5 characters required."
                              : taskNameWorklogsErr[index] &&
                                field.Title.length > 500
                              ? "Maximum 500 characters allowed."
                              : taskNameWorklogsErr[index]
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
                          disabled={!subTaskSwitchWorklogs}
                          value={field.Description}
                          onChange={(e) =>
                            handleSubTaskDescriptionChangeWorklogs(e, index)
                          }
                          onBlur={(e: any) => {
                            if (e.target.value.trim().length > 0) {
                              const newSubTaskDescErrors = [
                                ...subTaskDescriptionWorklogsErr,
                              ];
                              newSubTaskDescErrors[index] = false;
                              setSubTaskDescriptionWorklogsErr(
                                newSubTaskDescErrors
                              );
                            }
                          }}
                          error={subTaskDescriptionWorklogsErr[index]}
                          helperText={
                            subTaskDescriptionWorklogsErr[index] &&
                            field.Description.length > 0 &&
                            field.Description.length < 5
                              ? "Minumum 5 characters required."
                              : subTaskDescriptionWorklogsErr[index] &&
                                field.Description.length > 500
                              ? "Maximum 500 characters allowed."
                              : subTaskDescriptionWorklogsErr[index]
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
                            onClick={addTaskFieldWorklogs}
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
                            onClick={
                              hasPermissionWorklog(
                                "Task/SubTask",
                                "Delete",
                                "WorkLogs"
                              ) &&
                              hasPermissionWorklog(
                                "Task/SubTask",
                                "Save",
                                "WorkLogs"
                              )
                                ? () => removeTaskFieldWorklogs(index)
                                : undefined
                            }
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

            {onEdit > 0 &&
              hasPermissionWorklog("CheckList", "View", "WorkLogs") && (
                <div className="mt-14" id={`${onEdit > 0 && "tabpanel-2"}`}>
                  <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                    <span className="flex items-center">
                      <CheckListIcon />
                      <span className="ml-[21px]">Checklist</span>
                    </span>
                    <span
                      className={`cursor-pointer ${
                        checkListWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setCheckListWorklogsDrawer(!checkListWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </div>
                  <div className="pl-12 mt-5">
                    {checkListWorklogsDrawer &&
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

            {onEdit > 0 &&
              hasPermissionWorklog("Comment", "View", "WorkLogs") && (
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
                        commentsWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setCommentsWorklogsDrawer(!commentsWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </div>
                  <div className="my-5 px-16">
                    <div className="flex flex-col gap-4">
                      {commentsWorklogsDrawer &&
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
                                              getData={(
                                                data1: any,
                                                data2: any
                                              ) =>
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
                                            <span className="ml-2 cursor-pointer">
                                              {
                                                commentAttachment[0]
                                                  ?.UserFileName
                                              }
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
                                          assigneeWorklogsDropdownData.map(
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
                                        <span className="ml-2 cursor-pointer">
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
                                                  i.Attachment[0]
                                                    .SystemFileName,
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
                  {commentsWorklogsDrawer &&
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
                            onClick={(e) =>
                              handleSubmitComment(e, commentSelect)
                            }
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
                                <span className="mt-6 ml-2 cursor-pointer">
                                  {commentAttachment[0]?.UserFileName}
                                </span>
                                <span
                                  className="mt-6"
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
              <div
                className="mt-14"
                id={`${onEdit > 0 ? "tabpanel-4" : "tabpanel-2"}`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Recurring</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && recurringSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitRecurringWorklogs}
                      >
                        Update
                      </Button>
                    )}
                    {hasPermissionWorklog("Reccuring", "Save", "WorkLogs") ? (
                      <Switch
                        checked={recurringSwitch}
                        onChange={(e) => {
                          setRecurringSwitch(e.target.checked);
                          setRecurringStartDate("");
                          setRecurringStartDateErr(false);
                          setRecurringEndDate("");
                          setRecurringEndDateErr(false);
                          setRecurringTime(1);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        recurringWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setRecurringWorklogsDrawer(!recurringWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {recurringWorklogsDrawer && (
                  <>
                    <div className="mt-0 pl-6">
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          recurringStartDateErr ? "datepickerError" : ""
                        }`}
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
                            disabled={!recurringSwitch}
                            onError={() => setRecurringStartDateErr(false)}
                            minDate={dayjs(receiverDateWorklogs)}
                            maxDate={dayjs(recurringEndDate)}
                            value={
                              recurringStartDate === ""
                                ? null
                                : dayjs(recurringStartDate)
                            }
                            onChange={(newDate: any) => {
                              setRecurringStartDate(newDate.$d);
                              setRecurringStartDateErr(false);
                            }}
                            slotProps={{
                              textField: {
                                helperText: recurringStartDateErr
                                  ? "This is a required field."
                                  : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          recurringEndDateErr ? "datepickerError" : ""
                        }`}
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
                            minDate={dayjs(receiverDateWorklogs)}
                            disabled={!recurringSwitch}
                            onError={() => setRecurringEndDateErr(false)}
                            value={
                              recurringEndDate === ""
                                ? null
                                : dayjs(recurringEndDate)
                            }
                            onChange={(newDate: any) => {
                              setRecurringEndDate(newDate.$d);
                              setRecurringEndDateErr(false);
                            }}
                            slotProps={{
                              textField: {
                                helperText: recurringEndDateErr
                                  ? "This is a required field."
                                  : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="mt-0 pl-6">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 145 }}
                        disabled={!recurringSwitch}
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
                          onChange={(e) => {
                            setRecurringTime(e.target.value);
                            setRecurringMonth(0);
                            setSelectedDays([]);
                            setRecurringWeekErr(false);
                          }}
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
                              error={recurringMonthErr}
                              onBlur={(e) => {
                                if (recurringMonth.length > 0) {
                                  setRecurringMonthErr(false);
                                }
                              }}
                              helperText={
                                recurringMonthErr
                                  ? "This is a required field."
                                  : ""
                              }
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
                      {recurringWeekErr && (
                        <span className="text-defaultRed ml-8 text-sm p-0">
                          Please Select day.
                        </span>
                      )}
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
                id={`${onEdit > 0 ? "tabpanel-5" : "tabpanel-3"}`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <ClockIcon />
                    <span className="ml-[21px]">Manual Time</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && manualSwitchWorklogs && (
                      <Button
                        variant="contained"
                        className={`rounded-[4px] !h-[36px] mr-6 ${
                          manualSubmitWorklogsDisable ? "" : "!bg-secondary"
                        }`}
                        disabled={manualSubmitWorklogsDisable}
                        onClick={
                          manualSubmitWorklogsDisable
                            ? undefined
                            : handleSubmitManualWorklogs
                        }
                      >
                        Update
                      </Button>
                    )}
                    <Switch
                      checked={manualSwitchWorklogs}
                      onChange={(e) => {
                        setManualSwitchWorklogs(e.target.checked);
                        setManualFieldsWorklogs([
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
                        setInputDateWorklogsErrors([false]);
                        setStartTimeWorklogsErrors([false]);
                        setEndTimeWorklogsErrors([false]);
                        setManualDescWorklogsErrors([false]);
                        setInputTypeWorklogsDate(["text"]);
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
                        e.target.checked === true
                          ? setStatusWorklogs(
                              statusWorklogsDropdownData
                                .map((i: any) =>
                                  i.Type === "InProgress" ? i.value : undefined
                                )
                                .filter((i: any) => i !== undefined)[0]
                            )
                          : setStatusWorklogs(
                              statusWorklogsDropdownData
                                .map((i: any) =>
                                  i.Type === "NotStarted" ? i.value : undefined
                                )
                                .filter((i: any) => i !== undefined)[0]
                            );
                      }}
                    />
                    <span
                      className={`cursor-pointer ${
                        manualTimeWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setManualTimeWorklogsDrawer(!manualTimeWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {manualTimeWorklogsDrawer && (
                  <>
                    <div className="-mt-2 pl-6">
                      {manualFieldsWorklogs.map((field, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[230px] ${
                              inputDateWorklogsErrors[index]
                                ? "datepickerError"
                                : ""
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
                                  !manualSwitchWorklogs ||
                                  field.IsApproved ||
                                  (field.AssigneeId !== 0 &&
                                    field.AssigneeId !== userId)
                                }
                                onError={() => {
                                  if (
                                    field.inputDate[index]?.trim().length > 0
                                  ) {
                                    const newInputDateWorklogsErrors = [
                                      ...inputDateWorklogsErrors,
                                    ];
                                    newInputDateWorklogsErrors[index] = false;
                                    setInputDateWorklogsErrors(
                                      newInputDateWorklogsErrors
                                    );
                                  }
                                }}
                                value={
                                  field.inputDate === ""
                                    ? null
                                    : dayjs(field.inputDate)
                                }
                                onChange={(newDate: any) => {
                                  handleInputDateChangeWorklogs(
                                    newDate.$d,
                                    index
                                  );
                                }}
                                slotProps={{
                                  textField: {
                                    helperText: inputDateWorklogsErrors[index]
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
                              !manualSwitchWorklogs ||
                              field.IsApproved ||
                              (field.AssigneeId !== 0 &&
                                field.AssigneeId !== userId)
                            }
                            fullWidth
                            value={field.startTime}
                            onChange={(e) =>
                              handleStartTimeChangeWorklogs(e, index)
                            }
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 7) {
                                const newStartTimeWorklogsErrors = [
                                  ...startTimeWorklogsErrors,
                                ];
                                newStartTimeWorklogsErrors[index] = false;
                                setStartTimeWorklogsErrors(
                                  newStartTimeWorklogsErrors
                                );
                              }
                            }}
                            error={startTimeWorklogsErrors[index]}
                            helperText={
                              field.startTime.trim().length > 0 &&
                              field.startTime.trim().length < 8 &&
                              startTimeWorklogsErrors[index]
                                ? "Start time must be in HH:MM:SS"
                                : field.startTime.trim().length <= 0 &&
                                  startTimeWorklogsErrors[index]
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
                              !manualSwitchWorklogs ||
                              field.IsApproved ||
                              (field.AssigneeId !== 0 &&
                                field.AssigneeId !== userId)
                            }
                            fullWidth
                            value={field.endTime}
                            onChange={(e) =>
                              handleEndTimeChangeWorklogs(e, index)
                            }
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
                                const newEndTimeWorklogsErrors = [
                                  ...endTimeWorklogsErrors,
                                ];
                                newEndTimeWorklogsErrors[index] = false;
                                setEndTimeWorklogsErrors(
                                  newEndTimeWorklogsErrors
                                );
                              }
                            }}
                            error={endTimeWorklogsErrors[index]}
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
                                  endTimeWorklogsErrors[index]
                                ? "Start time must be in HH:MM:SS"
                                : field.endTime.trim().length <= 0 &&
                                  endTimeWorklogsErrors[index]
                                ? "This is a required field"
                                : endTimeWorklogsErrors[index] &&
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
                              !manualSwitchWorklogs ||
                              field.IsApproved ||
                              (field.AssigneeId !== 0 &&
                                field.AssigneeId !== userId)
                            }
                            fullWidth
                            value={field.manualDesc}
                            onChange={(e) =>
                              handleManualDescChangeWorklogs(e, index)
                            }
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 0) {
                                const newManualDescWorklogsErrors = [
                                  ...manualDescWorklogsErrors,
                                ];
                                newManualDescWorklogsErrors[index] = false;
                                setManualDescWorklogsErrors(
                                  newManualDescWorklogsErrors
                                );
                              }
                            }}
                            error={manualDescWorklogsErrors[index]}
                            helperText={
                              manualDescWorklogsErrors[index] &&
                              field.manualDesc.length > 0 &&
                              field.manualDesc.length < 5
                                ? "Minumum 5 characters required."
                                : manualDescWorklogsErrors[index] &&
                                  field.manualDesc.length > 500
                                ? "Maximum 500 characters allowed."
                                : manualDescWorklogsErrors[index]
                                ? "This is a required field."
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230, mt: 2 }}
                          />
                          {index === 0
                            ? manualSwitchWorklogs && (
                                <span
                                  className="cursor-pointer"
                                  onClick={addManulaFieldWorklogs}
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
                            : manualSwitchWorklogs &&
                              !field.IsApproved && (
                                <span
                                  className="cursor-pointer"
                                  onClick={() =>
                                    removePhoneFieldWorklogs(index)
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
                  onEdit > 0 && (isManual === true || isManual === null)
                    ? "tabpanel-6"
                    : onEdit > 0
                    ? "tabpanel-5"
                    : "tabpanel-4"
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
                        onClick={handleSubmitReminderWorklogs}
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
                        reminderWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setReminderWorklogsDrawer(!reminderWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {reminderWorklogsDrawer && (
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
                          Array.isArray(assigneeWorklogsDropdownData)
                            ? assigneeWorklogsDropdownData
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

            {hasPermissionWorklog("ErrorLog", "View", "WorkLogs") &&
              onEdit > 0 && (
                <div
                  className="mt-14"
                  id={`${
                    isManual === true || isManual === null
                      ? "tabpanel-7"
                      : "tabpanel-6"
                  }`}
                >
                  <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                    <span className="flex items-center">
                      <TaskIcon />
                      <span className="ml-[21px]">Error Logs</span>
                    </span>
                    <span
                      className={`cursor-pointer ${
                        reviewerErrWorklogsDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() =>
                        setReviewerErrWorklogsDrawer(!reviewerErrWorklogsDrawer)
                      }
                    >
                      <ChevronDownIcon />
                    </span>
                  </div>
                  {reviewerErrWorklogsDrawer && (
                    <div className="mt-3 pl-6">
                      {errorLogFields.length > 0 &&
                        errorLogFields[0].SubmitedBy.length > 0 &&
                        errorLogFields.map((i: any, index: number) => (
                          <>
                            <div className="ml-1 mt-8">
                              <span className="font-bold">Correction By</span>
                              <span className="ml-3 mr-10 text-[14px]">
                                {i.SubmitedBy}
                              </span>
                              <span className="font-bold">Reviewer Date</span>
                              <span className="ml-3">{i.SubmitedOn}</span>
                            </div>
                            <div
                              className="w-[100%] mt-2 text-[14px]"
                              key={index}
                            >
                              <FormControl
                                variant="standard"
                                sx={{ mx: 0.75, minWidth: 230 }}
                                error={errorTypeErr[index]}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Error Type
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.ErrorType === 0 ? "" : i.ErrorType}
                                  readOnly={
                                    i.ErrorType > 0 ||
                                    i.Remark.trim().length <= 0 ||
                                    i.DisableErrorLog
                                  }
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
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.RootCause === 0 ? "" : i.RootCause}
                                  onChange={(e) =>
                                    handleRootCauseChange(e, index)
                                  }
                                  onBlur={(e: any) => {
                                    if (e.target.value > 0) {
                                      const newRootCauseErrors = [
                                        ...rootCauseErr,
                                      ];
                                      newRootCauseErrors[index] = false;
                                      setRootCauseErr(newRootCauseErrors);
                                    }
                                  }}
                                  readOnly={
                                    i.RootCause > 0 ||
                                    i.Remark.trim().length <= 0 ||
                                    i.DisableErrorLog
                                  }
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
                                sx={{ mx: 0.75, minWidth: 230 }}
                                error={natureOfErr[index]}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Nature of Error
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={
                                    i.NatureOfError === 0 ? "" : i.NatureOfError
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
                                  readOnly={
                                    i.NatureOfError > 0 ||
                                    i.Remark.trim().length <= 0 ||
                                    i.DisableErrorLog
                                  }
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
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.Priority === 0 ? "" : i.Priority}
                                  onChange={(e) =>
                                    handlePriorityChange(e, index)
                                  }
                                  onBlur={(e: any) => {
                                    if (e.target.value > 0) {
                                      const newPriorityErrors = [
                                        ...errorLogPriorityErr,
                                      ];
                                      newPriorityErrors[index] = false;
                                      setErrorLogPriorityErr(newPriorityErrors);
                                    }
                                  }}
                                  readOnly={
                                    i.Priority > 0 ||
                                    i.Remark.trim().length <= 0 ||
                                    i.DisableErrorLog
                                  }
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
                                    <span className="text-defaultRed">
                                      &nbsp;*
                                    </span>
                                  </span>
                                }
                                type="number"
                                fullWidth
                                value={i.ErrorCount}
                                onChange={(e) =>
                                  handleErrorCountChange(e, index)
                                }
                                onBlur={(e: any) => {
                                  if (e.target.value.length > 0) {
                                    const newErrorCountErrors = [
                                      ...errorCountErr,
                                    ];
                                    newErrorCountErrors[index] = false;
                                    setErrorCountErr(newErrorCountErrors);
                                  }
                                }}
                                error={errorCountErr[index]}
                                helperText={
                                  errorCountErr[index] && i.ErrorCount <= 0
                                    ? "Add valid number."
                                    : errorCountErr[index] &&
                                      i.ErrorCount.toString().length > 4
                                    ? "Maximum 4 numbers allowed."
                                    : errorCountErr[index]
                                    ? "This is a required field."
                                    : ""
                                }
                                margin="normal"
                                variant="standard"
                                sx={{ mx: 0.75, maxWidth: 180, mt: 0.4 }}
                                InputProps={{ readOnly: i.DisableErrorLog }}
                                inputProps={{ readOnly: i.DisableErrorLog }}
                              />
                              <div className="flex items-center justify-start ml-2">
                                <Autocomplete
                                  multiple
                                  limitTags={2}
                                  id="checkboxes-tags-demo"
                                  readOnly={
                                    cCDropdownData.filter((obj: any) =>
                                      i.CC.includes(obj.value)
                                    ).length > 0 ||
                                    i.Remark.trim().length <= 0 ||
                                    i.DisableErrorLog
                                  }
                                  options={
                                    Array.isArray(cCDropdownData)
                                      ? cCDropdownData
                                      : []
                                  }
                                  value={i.CC}
                                  onChange={(e, newValue) =>
                                    handleCCChange(newValue, index)
                                  }
                                  getOptionLabel={(option) => option.label}
                                  disableCloseOnSelect
                                  style={{ width: 500 }}
                                  renderInput={(params) => (
                                    <TextField
                                      label="cc"
                                      {...params}
                                      variant="standard"
                                    />
                                  )}
                                  sx={{ maxWidth: 230, mt: 0.3 }}
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
                                  value={i.Remark}
                                  margin="normal"
                                  variant="standard"
                                  sx={{
                                    mx: 0.75,
                                    maxWidth: 485,
                                    mt: 1,
                                    ml: 1.5,
                                    mr: 1.5,
                                  }}
                                  InputProps={{ readOnly: true }}
                                  inputProps={{ readOnly: true }}
                                />
                                <div className="flex flex-col">
                                  <div className="flex">
                                    <ImageUploader isDisable={true} />
                                    {i.Attachments[0]?.SystemFileName.length >
                                      0 && (
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="mt-6 ml-2 cursor-pointer">
                                          {i.Attachments[0]?.UserFileName}
                                        </span>
                                        <span
                                          className="mt-6"
                                          onClick={() =>
                                            getFileFromBlob(
                                              i.Attachments[0]?.SystemFileName,
                                              i.Attachments[0]?.UserFileName
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
                                <FormGroup>
                                  <FormControlLabel
                                    className="ml-2 mt-5"
                                    disabled={
                                      // editStatusWorklogs === 4 ||
                                      // statusWorklogs === 7 ||
                                      // statusWorklogs === 9 ||
                                      // statusWorklogs === 8 ||
                                      i.DisableErrorLog
                                    }
                                    control={
                                      <Checkbox
                                        checked={
                                          i.isSolved === true ? true : false
                                        }
                                        onChange={(e) =>
                                          i.ErrorType > 0 &&
                                          handleCheckboxChange(
                                            onEdit,
                                            i.ErrorLogId,
                                            e.target.checked,
                                            index
                                          )
                                        }
                                      />
                                    }
                                    label="Is Resolved"
                                  />
                                </FormGroup>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  )}
                </div>
              )}

            {onEdit > 0 && (
              <div
                className="mt-14"
                id={`${
                  isManual === true || isManual === null
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
                      reasonWorklogsDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() =>
                      setReasonWorklogsDrawer(!reasonWorklogsDrawer)
                    }
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {reasonWorklogsDrawer &&
                  reviewerNote.length > 0 &&
                  reviewerNote.map((i: any, index: number) => (
                    <div className="mt-5 pl-[70px] text-sm">
                      <span className="font-semibold">{i.ReviewedDate}</span>
                      {i.Details.map((j: any, index: number) => (
                        <div className="flex gap-3 mt-4">
                          <span className="mt-2">{index + 1}</span>
                          {j.ReviewerName.length > 0 ? (
                            <Tooltip
                              title={j.ReviewerName}
                              placement="top"
                              arrow
                            >
                              <Avatar>
                                {j.ReviewerName.split(" ")
                                  .map((word: any) =>
                                    word.charAt(0).toUpperCase()
                                  )
                                  .join("")}
                              </Avatar>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title={j.ReviewerName}
                              placement="top"
                              arrow
                            >
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
            )}

            {/* Logs */}
            {/* {onEdit > 0 && (
              <div className="mt-14" id={`${onEdit > 0 && "tabpanel-9"}`}>
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Logs</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      logsDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setLogsDrawer(!logsDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {logsDrawer && <div className="mt-5 pl-[70px] text-sm">
                  <span className="font-semibold">13/06/2023</span>
                  <div className="flex gap-3 mt-4">
                    <span className="mt-2">1</span>
                    <Avatar
                      alt="Remy Sharp"
                      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIgAiAMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIEBQcDBgj/xAA9EAABAwIDBAYGCAYDAAAAAAABAAIDBBEFBhIhMUFRByJhcYGRFBUjMlKhE0JykqKxwdFDYnOCsuEXMzX/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAQMEBQIG/8QAKhEBAAICAQQBAgUFAAAAAAAAAAECAxEEEiExQVEzcRQiMkJhBRNSgaH/2gAMAwEAAhEDEQA/AGLrOGEAgEAgRAIEJQNQIVAQok0qAhKJNUBCUDSUDUFgvbyEAgECIBAhKBpQIVAQokhKgNJRJqgISgaSgRA0lQLFWPIQCBEAgQlBxqKiKnZqlcB2cT4Lza8U8vdMdrzqqrlxl5NoIgBzebrLbkz6hsrw4/dLh61qr39n93/a8fibrPwmN1jxh4PtYmu+ybL1HJn3Dxbh1/bKbBWQ1GxjrO+F2wq+mSt/DNfDennw7KxUQlQGkoGoEJUBpKJWaseAgRAIGkoK7Fa409oYv+wi5PwhZ8+bp/LXy1cbBF/zW8KNxc5xc5xcTxJusPny6MREdoIiQgEALggg2I4oLjD6v6ZgjkPtGjf8S24cnVHdzeRiiltx4lLJVzOagQlQGkok1QLVWvBEAgQlA1B5isk+kq5nni471zMk7tMuxijppEPV5eyFU4lTNqsQnNJFI3VGxrLvI5m+wLJfkRWdR3a6YJtG5UOP4FXYFVGGsZeNzrRTtHUkHYefYraZK38K70mk91YvbwEAgfES2QWNlZinVoUciu8cramqRINDzZ/5rbEubMO5K9INJUJNUBpKC2VrwECEoGqAIIGVMMbieaoqeVuqFkjpZAeIab28TYLj8i3RFne49erphsy5jpOdRBFUwuhqImSxPFnMe0EHwUxMx3hExE9peUxHo8weqJdSvnoz8MbtTfJ23yIV9eRaPPdTbj1nwrf+M26//WOn+ht/yXv8V/Dx+G/lZUvR3g8UDmTyVM8jhskL9OnuA/W68Tybz4e449dd2bYpQPwvFZ6GQhzoJNOofWG8HxBBW7Dbq1Zhz11W0SZuW9yU2nqNfVkPW5816iUadiiDSUCKBbq54ISgaoCFAAFxDWi5JsAo3rumI3Onp8qZbqcEzFVy1BY+OWnvHIwbAS8Xb3jZ5r5/kZq5I3Hy+k4+Kceon4exWVrCAQCAQZ5mXK1djOZsQqqbQyKOKM6n/wAR4Z7o8ht7VswZq4612xcjDbJ1a+Hhl2XBKglQT6uq/fwPNSh2RBpKC4JVzwaoCIEJRIY8xyNeN7XBw8F5mNxMJrOpiWrxSNmjZLGbse0OB7Cvl5r0zMS+sraLREwcoeggEAgEEfEallFQVFXKbMhjc8nuC90r12ise1eS8UpNp9MLG5fRPmAgEEiKa/VcdvPmpQ6k2RC4VrwQoEKJNKgISiXq8n428SxYXOAWEH6J99rbC+nu3rl87jRqcsf7dXgcqdxhnx6exXJdkIBAIBBm2fsxzVFTPg8DQynheBJIHXMpsDbsAPnZdbh8eKxGSfLi87k2tM4o8R/14xb3OCAQCDvHJfY7fzUoXqtVkKJISoDSUSaoD6eofTVEU8R68bg4eC83rF6zWfb1S00tFo9NVpKiOrpYqiL3JWBw8V81es1tNZ9PqaXi9YtHt2Xl7CAQQ8Xr48LwyorZbaYmEgfE7gPE2CsxY5yXise1WbLGKk2liUsj5pZJZTeSRxe48yTc/Mr6GIiI1D5mZmZ3PmTEAgEAgEHoyVcrISoDSUSaoCEoGkoNMysdWX6LsYR8yvn+X9ez6ThfQqtVmaggEHjuk9xGDUrQTZ1SLi+/qlb/AOn/AFJ+znf1L6cfdmi6zihAIBAIBB6Eq1WQlEmoEJUBpKCDVVzWBzYTd3F3AKjJmivarVi402728NvZQx0NNBFTRhkAjbpA7tv7ri8mJ6+qfbucaYinTHoLO0BAIKjOlBFU5QxGeojaTAwSQuI2tcDvHhs8Vt4kWrPUxcuKXiKyxlrrrqUyxb7uPkwzTv6KrFIQCAQCD0BKteDUHOaVsQBJ2ncFXfJFI3KzHjtknUIrq0/VZ5lUTyPiGqvE+Zcn1Mjgdtu5VzmvK2vGxx6VxGppB4qpe+jMsVQxLLWG1L7OMtMwv+1ax+d1ExE9pTEzE7h2nw8bTC638rllvxv8WinI9WQ2RPfMYmjrjeL7lnjHaba00TesV6k+nw9jTeU6zy4LVTjxH6u7NfkTP6Xm+ler9FydPEDZ1RLHE372o/JpWlnYgz3296b1O0TETGpSNIVsZrQonjUkmjkV7jP8wrni/EmkWKurMTG4ZbVms6kilAQXyteCE2BJ3BRMp8quaQySFx8Oxc+9uq23VxY/7dYgxeFhr9jT3IIqDaOh/EPSctSUbnXfRzOaB/K7rD56vJBBz/jrqmu9W0shENOfauaban23dwv59y14Meo6pb+NiiI6p9vItkka7Ux72u5hxBV+oa9Q0To+x6Sujkw+sldJNENccjjcubyJ5j9Vlz44r3hz+Tiiv5oea6asQ1VeG4a12yNjp5B2nqt/J3ms7KzVvvBBLQCBrhsVuK2p0z8inVXfw5rUwBBekqx4R6t+mE23nYqs1tUaOPTqv9kBYXSCBHi7SEEZzQPrA9yD2/RDiXoeZpKN5AZWwlu/e9vWb8tSDTMzYVh0uEV88tJAJWwPeJWxgPBAve+9W47W6oja7Fe0XiIlkhOy/DiAtzptxpIKeGJvosUccZAIEbQBbwXNmZ9uPMzM92AZ2xP1tmnEalpvG2Uwx/ZZ1QfGxPioQp42tJF3DuQSEAgE2OR3rdWdxEuVevTaYIpeV2SrHhDrXXe1vIXWTkTuYhv4lfyzKMs7WECOF2kc0ERBJw2sfh2I0tdFfXTzNlAHGxvbx3IN8zPVRy5Sq6mF2qOanBYRxDrfurMUbvC3DG8kMk4Le6rT6rHPV/R960LvaNpGtYech6g/EufeNWmHIyxq8wwbv2leHg5gu4BBKQCAQMfvWrDO66YOVXV9mK1nXKseFfO7VK49qwZZ3eXVwxrHEGKtaEAgjzNs+/AoOaDTMIxj03ovfTPfeakmbTm/w6g5vy2f2q3B+uF/GjeSHnVudN0zLjZkyth2DMdtZNJJKOwe4PxHyWLPGrubyo1keRVLO6wDbq8kHdAIBA1+5XYZ7s3KjdIlzWlhf//Z"
                    />
                    <div className="flex flex-col items-start">
                      <span>{splittedText}</span>
                      <span>Accepted Reason</span>
                      <span>at 04:47 pm</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="mt-2">2</span>
                    <Avatar />
                    <div className="flex flex-col items-start">
                      <span>{splittedText}</span>
                      <span>Accepted Reason</span>
                      <span>at 04:47 pm</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="mt-2">3</span>
                    <Avatar />
                    <div className="flex flex-col items-start">
                      <span>{splittedText}</span>
                      <span>Accepted Reason</span>
                      <span>at 04:47 pm</span>
                    </div>
                  </div>
                </div>}
              </div>
            )} */}

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
    </>
  );
};

export default EditDrawer;
