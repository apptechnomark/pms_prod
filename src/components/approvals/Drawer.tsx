/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import TaskIcon from "@/assets/icons/TaskIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import BellIcon from "@/assets/icons/BellIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import CheckListIcon from "../../assets/icons/CheckListIcon";
import CommentsIcon from "../../assets/icons/CommentsIcon";
import FileIcon from "../../assets/icons/worklogs/FileIcon";
import SendIcon from "../../assets/icons/worklogs/SendIcon";
import AddIcon from "../../assets/icons/worklogs/AddIcon";
import RemoveIcon from "../../assets/icons/worklogs/RemoveIcon";
import ThreeDotIcon from "../../assets/icons/worklogs/ThreeDotIcon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Close, Save } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import ImageUploader from "../common/ImageUploader";
import { Mention, MentionsInput } from "react-mentions";
import mentionsInputStyle from "../worklog/mentionsInputStyle";
import EditIcon from "@mui/icons-material/Edit";
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
  getTypeOfReturnDropdownData,
  getTypeOfWorkDropdownData,
  hours,
  months,
} from "@/utils/commonDropdownApiCall";

const EditDrawer = ({
  onOpen,
  onClose,
  onEdit,
  onDataFetch,
  onHasId,
  hasIconIndex,
}: any) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [inputTypeReview, setInputTypeReview] = useState("text");
  const [inputTypePreperation, setInputTypePreperation] = useState("text");

  const [taskDrawer, setTaskDrawer] = useState(true);
  const [subTaskDrawer, setSubTaskDrawer] = useState(true);
  const [recurringDrawer, setRecurringDrawer] = useState(true);
  const [manualTimeDrawer, setManualTimeDrawer] = useState(true);
  const [reminderDrawer, setReminderDrawer] = useState(true);
  const [checkListDrawer, setCheckListDrawer] = useState(true);
  const [commentsDrawer, setCommentsDrawer] = useState(true);
  const [logsDrawer, setLogsDrawer] = useState(true);
  const [reasonDrawer, setReasonDrawer] = useState(true);
  const [reviewerErrDrawer, setReviewerErrDrawer] = useState(true);

  // Dropdowns
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [workTypeDropdownData, setWorkTypeDropdownData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);
  const [statusDropdownData, setStatusDropdownData] = useState([]);
  const [assigneeDropdownData, setAssigneeDropdownData] = useState<any>([]);
  const [reviewerDropdownData, setReviewerDropdownData] = useState([]);
  const [cCDropdownData, setCCDropdownData] = useState<any>([]);
  const [typeOfReturnDropdownData, setTypeOfReturnDropdownData] = useState<any>(
    []
  );
  const [managerDropdownData, setManagerDropdownData] = useState<any>([]);

  const [selectedDays, setSelectedDays] = useState<any>([]);
  const [isManual, setIsManual] = useState(null);
  const [manualSwitch, setManualSwitch] = useState(false);
  const [manualSubmitDisable, setManualSubmitDisable] = useState(true);
  const [isPartiallySubmitted, setIsPartiallySubmitted] =
    useState<boolean>(false);
  const [inputDateErrors, setInputDateErrors] = useState([false]);
  const [startTimeErrors, setStartTimeErrors] = useState([false]);
  const [endTimeErrors, setEndTimeErrors] = useState([false]);
  const [manualDescErrors, setManualDescErrors] = useState([false]);
  const [inputTypeDate, setInputTypeDate] = useState(["text"]);
  const [inputTypeStartTime, setInputTypeStartTime] = useState(["text"]);
  const [inputTypeEndTime, setInputTypeEndTime] = useState(["text"]);
  const [userId, setUserId] = useState(0);

  // Task
  const [clientName, setClientName] = useState<any>(0);
  const [typeOfWork, setTypeOfWork] = useState<string | number>(0);
  const [projectName, setProjectName] = useState<string | number>(0);
  const [processName, setProcessName] = useState<string | number>(0);
  const [subProcess, setSubProcess] = useState<string | number>(0);
  const [clientTaskName, setClientTaskName] = useState<string>("");
  const [status, setStatus] = useState<string | number>(0);
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string | number>(0);
  const [quantity, setQuantity] = useState<any>("");
  const [receiverDate, setReceiverDate] = useState<any>("");
  const [allInfoDate, setAllInfoDate] = useState<any>("");
  const [manager, setManager] = useState<any>(0);
  const [dueDate, setDueDate] = useState<any>("");
  const [assignee, setAssignee] = useState<string | number>(0);
  const [reviewer, setReviewer] = useState<string | number>(0);
  const [dateOfReview, setDateOfReview] = useState<string>("");
  const [dateOfPreperation, setDateOfPreperation] = useState<string>("");
  const [assigneeDisable, setAssigneeDisable] = useState(true);
  const [estTimeData, setEstTimeData] = useState([]);

  // Selected Taxation
  const [returnType, setReturnType] = useState<string | number>(0);
  const [typeOfReturn, setTypeOfReturn] = useState<string | number>(0);
  const [returnYear, setReturnYear] = useState<string | number>(0);
  const [complexity, setComplexity] = useState<string | number>("");
  const [countYear, setCountYear] = useState<string | number>(0);
  const [noOfPages, setNoOfPages] = useState<string | number>(0);
  const [checklistWorkpaper, setChecklistWorkpaper] = useState<any>(0);

  // Sub-Task
  const [subTaskFields, setSubTaskFields] = useState([
    {
      SubtaskId: 0,
      Title: "",
      Description: "",
    },
  ]);

  // Recurring
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [recurringTime, setRecurringTime] = useState<any>(1);
  const [recurringMonth, setRecurringMonth] = useState<any>(0);

  // ErrorLog
  const [errorLogData, setErrorLogData] = useState([]);

  // Reminder
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState<any>(0);
  const [reminderNotification, setReminderNotification] = useState<any>([]);
  const [reminderCheckboxValue, setReminderCheckboxValue] = useState<any>(1);

  // CheclkList
  const [checkListData, setCheckListData] = useState([]);
  const [itemStates, setItemStates] = useState<any>({});

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

  // Comments
  const [commentData, setCommentData] = useState([]);
  const [value, setValue] = useState("");
  const [valueError, setValueError] = useState(false);
  const [valueEdit, setValueEdit] = useState("");
  const [valueEditError, setValueEditError] = useState(false);
  const [mention, setMention] = useState<any>([]);
  let commentAttachment: any = [];
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const users =
    assigneeDropdownData?.length > 0 &&
    assigneeDropdownData.map(
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
              Attachment: i.Attachment,
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

  const handleFileChange = (e: any) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const selectedFile = selectedFiles[i];
        const fileName = selectedFile.name;
        const fileExtension = fileName.split(".").pop();
        let newFileName;

        const uuidv4 = () => {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;

              return v.toString(16);
            }
          );
        };

        if (!fileName.toLowerCase().includes(".")) {
          newFileName = `${uuidv4().slice(0, 32)}.txt`;
        } else {
          newFileName = `${uuidv4().slice(0, 32)}.${fileExtension}`;
        }

        const filePath = URL.createObjectURL(selectedFile).slice(5);
        const fileObject = {
          AttachmentId: 0,
          SystemFileName: newFileName,
          UserFileName: fileName,
          AttachmentPath: filePath,
        };
        commentAttachment.push(fileObject);
      }
    }
  };

  const handleSubmitComment = async (
    e: { preventDefault: () => void },
    type: any
  ) => {
    e.preventDefault();
    setValueError(value.trim().length < 5 || value.trim().length > 500);

    if (value.trim().length > 5 && value.trim().length < 501 && !valueError) {
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
              Attachment: commentAttachment.length > 0 ? commentAttachment : [],
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
              commentAttachment = [];
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

  const extractText = (inputString: any) => {
    const regex = /@\[([^\]]+)\]\([^)]+\)|\[([^\]]+)\]|[^@\[\]]+/g;
    const matches = [];
    let match;
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1] || match[2] || match[0]);
    }
    return matches;
  };

  const saveReviewerManualTimelog = async () => {
    const local: any = await localStorage.getItem("UserId");
    if (assignee === parseInt(local)) {
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
                    assigneeId: i.AssigneeId === 0 ? assignee : i.AssigneeId,
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
    } else {
      toast.warning("Only Assingnee can Edit Manual time.");
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
          const getTimeDifference = (startTime: any, endTime: any) => {
            const [s, e, s_sec] = startTime.split(":").map(Number);
            const [t, r, e_sec] = endTime.split(":").map(Number);
            const d = t * 60 + r - s * 60 - e;

            return `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(
              d % 60
            ).padStart(2, "0")}:${(e_sec - s_sec).toString().padStart(2, "0")}`;
          };
          // setManualDataLength(data.length);
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
    setInputDateErrors([...inputDateErrors, false]),
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
    newValue = newValue.replace(/[^0-9]/g, "");
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

  const toggleColor = (index: any) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(
        selectedDays.filter((dayIndex: any) => dayIndex !== index)
      );
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const currentYear = new Date().getFullYear();
  const Years = [];

  for (let year = 2010; year <= currentYear; year++) {
    Years.push({ label: String(year), value: year });
  }

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
    // "Logs",
  ];

  useEffect(() => {
    scrollToPanel(
      (isManual === null || isManual === true) && isPartiallySubmitted
        ? 8
        : isManual === null || isManual === true
        ? 7
        : isPartiallySubmitted
        ? 7
        : 6
    );
    if (hasIconIndex > 0) {
      setIsPartiallySubmitted(true);
      scrollToPanel(isManual === null || isManual === true ? 6 : 5);
    }
  }, [onEdit]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
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
          const getTimeDifference = (startTime: any, endTime: any) => {
            const [s, e] = startTime.split(":").map(Number);
            const [t, r] = endTime.split(":").map(Number);
            const d = t * 60 + r - s * 60 - e;
            return `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(
              d % 60
            ).padStart(2, "0")}`;
          };
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
          setReminderCheckboxValue(data.ReminderType);
          setReminderDate(data.ReminderDate);
          setReminderTime(data.ReminderTime);
          setReminderNotification(
            data.ReminderUserIds.map((reminderUserId: any) =>
              assigneeDropdownData.find(
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
      if (error.response && error.response.status === 401) {
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
                  Attachments: "",
                  // [
                  //   {
                  //     AttachmentId: 0,
                  //     UserFileName: "Attachment300.txt",
                  //     SystemFileName: "Attachment3_system.txt",
                  //     AttachmentPath: "/path/to/attachment300.txt",
                  //   },
                  // ],
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
                      Attachments: "",
                      // [
                      //   {
                      //     AttachmentId: 0,
                      //     UserFileName: "Attachment300.txt",
                      //     SystemFileName: "Attachment3_system.txt",
                      //     AttachmentPath: "/path/to/attachment300.txt",
                      //   },
                      // ],
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
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  useEffect(() => {
    if (onEdit > 0) {
      const getEditData = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/getbyid`,
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
              setIsManual(data.IsManual);
              setClientName(data.ClientId);
              setTypeOfWork(data.WorkTypeId);
              setProjectName(data.ProjectId);
              setProcessName(data.ProcessId);
              setSubProcess(data.SubProcessId);
              setClientTaskName(data.TaskName === null ? "" : data.TaskName);
              setStatus(data.StatusId);
              setAllInfoDate(data.AllInfoDate === null ? "" : data.AllInfoDate);
              setStatus(data.StatusId);
              setPriority(data.Priority);
              setQuantity(data.Quantity);
              setDescription(data.Description === null ? "" : data.Description);
              setReceiverDate(data.ReceiverDate);
              setDueDate(data.DueDate);
              setDateOfReview(data.ReviewerDate);
              setDateOfPreperation(data.PreparationDate);
              setAssignee(data.AssignedId);
              setReviewer(data.ReviewerId);
              setManager(data.ManagerId === null ? 0 : data.ManagerId);
              setReturnType(data.TaxReturnType);
              setTypeOfReturn(data.TypeOfReturnId);
              setReturnYear(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.ReturnYear
              );
              setComplexity(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.Complexity
              );
              setCountYear(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.CountYear
              );
              setNoOfPages(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.NoOfPages
              );
              setChecklistWorkpaper(
                data.ChecklistWorkpaper === true
                  ? 1
                  : data.ChecklistWorkpaper === false
                  ? 2
                  : 0
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

      // Call the function here
      getEditData();
      getWorklogData();
      getRecurringData();
      getManualData();
      getReminderData();
      getCheckListData();
      getCommentData(1);
      getReviewerNoteData();
    }
  }, [onEdit]);

  useEffect(() => {
    onEdit > 0 && assigneeDropdownData.length > 0 && getErrorLogData();
  }, [assigneeDropdownData]);

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
      Attachments: "",
      // [
      //   {
      //     AttachmentId: 0,
      //     UserFileName: "Attachment300.txt",
      //     SystemFileName: "Attachment3_system.txt",
      //     AttachmentPath: "/path/to/attachment300.txt",
      //   },
      // ],
      isSolved: false,
    },
  ]);
  const [errorTypeErr, setErrorTypeErr] = useState([false]);
  const [rootCauseErr, setRootCauseErr] = useState([false]);
  const [errorLogPriorityErr, setErrorLogPriorityErr] = useState([false]);
  const [errorCountErr, setErrorCountErr] = useState([false]);
  const [natureOfErr, setNatureOfErr] = useState([false]);
  const [ccErr, setCCErr] = useState([false]);
  const [remarkErr, setRemarkErr] = useState([false]);
  const [attachmentsErr, setAttachmentsErr] = useState([false]);
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
        Attachments: "",
        // [
        //   {
        //     AttachmentId: 0,
        //     UserFileName: "Attachment300.txt",
        //     SystemFileName: "Attachment3_system.txt",
        //     AttachmentPath: "/path/to/attachment300.txt",
        //   },
        // ],
        isSolved: false,
      },
    ]);
    setErrorTypeErr([...errorTypeErr, false]);
    setRootCauseErr([...rootCauseErr, false]);
    setErrorLogPriorityErr([...errorLogPriorityErr, false]);
    setErrorCountErr([...errorCountErr, false]);
    setNatureOfErr([...natureOfErr, false]);
    setCCErr([...ccErr, false]);
    setRemarkErr([...remarkErr, false]);
    setAttachmentsErr([...attachmentsErr, false]);
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

    const newCCErrors = [...ccErr];
    newCCErrors.splice(index, 1);
    setCCErr(newCCErrors);

    const newRemarkErrors = [...remarkErr];
    newRemarkErrors.splice(index, 1);
    setRemarkErr(newRemarkErrors);

    const newAttachmentErrors = [...attachmentsErr];
    newAttachmentErrors.splice(index, 1);
    setAttachmentsErr(newAttachmentErrors);
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

    const newErrors = [...ccErr];
    newErrors[index] = newValue.length === 0;
    setCCErr(newErrors);
  };

  const handleRemarksChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Remark = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...remarkErr];
    newErrors[index] = e.target.value.trim().length <= 0;
    setRemarkErr(newErrors);
  };

  const handleAttachmentsChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Attachments = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...attachmentsErr];
    newErrors[index] = e.target.value.trim().length <= 0;
    setAttachmentsErr(newErrors);
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
      (field) => field.ErrorCount < 0 || field.ErrorCount > 9999
    );
    setErrorCountErr(newErrorCountErrors);
    const newCCErrors = errorLogFields.map((field) => field.CC.length <= 0);
    setCCErr(newCCErrors);
    const newRemarkErrors = errorLogFields.map(
      (field) =>
        field.Remark.trim().length < 5 || field.Remark.trim().length > 500
    );
    setRemarkErr(newRemarkErrors);
    // const newAttachmentsErrors = errorLogFields.map(
    //   (field) => field.Attachments.length === 0
    // );
    // setAttachmentsErr(newAttachmentsErrors);

    hasErrorLogErrors =
      newErrorTypeErrors.some((error) => error) ||
      newRootCauseErrors.some((error) => error) ||
      newNatureOfErrors.some((error) => error) ||
      newPriorityErrors.some((error) => error) ||
      newErrorCountErrors.some((error) => error) ||
      newCCErrors.some((error) => error) ||
      newRemarkErrors.some((error) => error);
    // ||
    // newAttachmentsErrors.some((error) => error);

    if (!hasErrorLogErrors) {
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
                    Attachments: null,
                    // [
                    //   {
                    //     AttachmentId: 0,
                    //     UserFileName: "Attachment300.txt",
                    //     SystemFileName: "Attachment3_system.txt",
                    //     AttachmentPath: "/path/to/attachment300.txt",
                    //   },
                    // ],
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
        setAssigneeDisable(response.data.ResponseData.IsHaveManageAssignee);
        setUserId(response.data.ResponseData.UserId);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const toggleGeneralOpen = (index: any) => {
    setItemStates((prevStates: any) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  useEffect(() => {
    const getData = async () => {
      await setStatusDropdownData(await getStatusDropdownData());
      await setCCDropdownData(await getCCDropdownData());
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      getUserDetails();
      setClientDropdownData(await getClientDropdownData());
      setManagerDropdownData(await getManagerDropdownData());
      clientName > 0 &&
        setWorkTypeDropdownData(await getTypeOfWorkDropdownData(clientName));
      clientName > 0 &&
        setProjectDropdownData(await getProjectDropdownData(clientName));
      const processData: any =
        clientName > 0 && (await getProcessDropdownData(clientName));
      setProcessDropdownData(await getProcessDropdownData(clientName));
    };

    onOpen && getData();
  }, [clientName, onOpen]);

  useEffect(() => {
    const getData = async () => {
      const data: any =
        processName !== 0 &&
        (await getSubProcessDropdownData(clientName, processName));
      data.length > 0 && setEstTimeData(data);
      data.length > 0 &&
        setSubProcessDropdownData(
          await getSubProcessDropdownData(clientName, processName)
        );
    };

    getData();
  }, [processName]);

  useEffect(() => {
    const getData = async () => {
      const assigneeData = await getAssigneeDropdownData(
        clientName,
        typeOfWork
      );
      assigneeData.length > 0 && setAssigneeDropdownData(assigneeData);
      const UserId: any = localStorage.getItem("UserId");
      assigneeData.length > 0 &&
        setAssignee(
          assigneeData
            .map((i: any) =>
              i.value === parseInt(UserId) ? i.value : undefined
            )
            .filter((i: any) => i !== undefined)[0]
        );
      setReviewerDropdownData(
        await getReviewerDropdownData(clientName, typeOfWork)
      );
    };

    const getTypeOfReturn = async () => {
      setTypeOfReturnDropdownData(await getTypeOfReturnDropdownData());
    };

    typeOfWork !== 0 && getData();
    typeOfWork === 3 && getTypeOfReturn();
  }, [typeOfWork, clientName]);

  const handleClose = () => {
    setClientName(0);
    setTypeOfWork(0);
    setProjectName(0);
    setProcessName(0);
    setSubProcess(0);
    setStatus(0);
    setDescription("");
    setPriority(0);
    setQuantity("");
    setReceiverDate("");
    setDueDate("");
    setAssignee(0);
    setReviewer(0);
    setDateOfReview("");
    setDateOfPreperation("");
    setAssigneeDisable(true);
    setManager(0);
    setClientTaskName("");
    setAllInfoDate("");
    setEstTimeData([]);

    // Taxation selected
    setReturnType(0);
    setTypeOfReturn(0);
    setReturnYear(0);
    setComplexity(0);
    setCountYear(0);
    setNoOfPages("");
    setChecklistWorkpaper(0);

    // Sub-Task
    setSubTaskFields([
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);

    // Checklist
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
    setReminderCheckboxValue(1);
    setReminderDate("");
    setReminderTime(0);
    setReminderNotification(0);

    // Error Logs
    setErrorLogData([]);

    // Comments
    setCommentData([]);

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
        Attachments: "",
        // [
        //   {
        //     AttachmentId: 0,
        //     UserFileName: "Attachment300.txt",
        //     SystemFileName: "Attachment3_system.txt",
        //     AttachmentPath: "/path/to/attachment300.txt",
        //   },
        // ],
        isSolved: false,
      },
    ]);
    setErrorTypeErr([false]);
    setRootCauseErr([false]);
    setErrorLogPriorityErr([false]);
    setErrorCountErr([false]);
    setNatureOfErr([false]);
    setCCErr([false]);
    setRemarkErr([false]);
    setAttachmentsErr([false]);
    setDeletedErrorLog([]);

    onDataFetch();
    onClose();
  };

  const getAttachmentData = (data1: any, data2: any) => {
    // console.log(data1, data2);
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
          <form>
            {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
              <div className="pt-1" id="tabpanel-0">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Task</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      taskDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setTaskDrawer(!taskDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {taskDrawer && (
                  <Grid container className="px-8">
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Client Name
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={clientName === 0 ? "" : clientName}
                          readOnly
                        >
                          {clientDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Type of Work
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={typeOfWork === 0 ? "" : typeOfWork}
                          readOnly
                        >
                          {workTypeDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Project Name
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={projectName === 0 ? "" : projectName}
                          readOnly
                        >
                          {projectDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Status
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={status === 0 ? "" : status}
                          readOnly
                        >
                          {statusDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Process Name
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={processName === 0 ? "" : processName}
                          readOnly
                        >
                          {processDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.Id} key={index}>
                              {i.Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Sub Process
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={subProcess === 0 ? "" : subProcess}
                          readOnly
                        >
                          {subProcessDropdownData.map(
                            (i: any, index: number) => (
                              <MenuItem value={i.Id}>{i.Name}</MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
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
                          clientTaskName?.trim().length <= 0
                            ? ""
                            : clientTaskName
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300, mt: -0.2, ml: 1 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label={
                          <span>
                            Description
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        className="pt-1"
                        value={
                          description?.trim().length <= 0 ? "" : description
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300, mt: -0.2 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300, mt: -1.2 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Priority
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={priority === 0 ? "" : priority}
                          readOnly
                        >
                          <MenuItem value={1}>High</MenuItem>
                          <MenuItem value={2}>Medium</MenuItem>
                          <MenuItem value={3}>Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {typeOfWork === 3 && (
                      <Grid item xs={3} className="pt-4">
                        <FormControl
                          variant="standard"
                          sx={{ mx: 0.75, minWidth: 300, mt: -1.2 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Complexity
                            <span className="text-defaultRed">&nbsp;*</span>
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={complexity === 0 ? "" : complexity}
                            readOnly
                          >
                            <MenuItem value={1}>Moderate</MenuItem>
                            <MenuItem value={2}>Intermediate</MenuItem>
                            <MenuItem value={3}>Complex</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label={
                          <span>
                            Estimated Time
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        value={
                          subProcess !== 0
                            ? (estTimeData as any[])
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
                                  return subProcess === i.Id
                                    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
                                    : null;
                                })
                                .filter((i) => i !== null)
                            : ""
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300, mt: -0.8 }}
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
                        type="number"
                        fullWidth
                        value={quantity}
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300, mt: -0.8 }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <TextField
                        label={
                          <span>
                            Standard Time
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        value={
                          subProcess !== 0
                            ? (estTimeData as any[])
                                .map((i) => {
                                  const hours = Math.floor(
                                    (i.EstimatedHour * quantity) / 3600
                                  );
                                  const minutes = Math.floor(
                                    ((i.EstimatedHour * quantity) % 3600) / 60
                                  );
                                  const remainingSeconds =
                                    (i.EstimatedHour * quantity) % 60;
                                  const formattedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedSeconds = remainingSeconds
                                    .toString()
                                    .padStart(2, "0");
                                  return subProcess === i.Id
                                    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
                                    : null;
                                })
                                .filter((i) => i !== null)
                            : ""
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{
                          mx: 0.75,
                          maxWidth: 300,
                          mt: typeOfWork === 3 ? -0.9 : -0.8,
                        }}
                      />
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <div
                        className={`inline-flex -mt-[11px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
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
                            value={
                              receiverDate === "" ? null : dayjs(receiverDate)
                            }
                            readOnly
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
                            value={dueDate === "" ? null : dayjs(dueDate)}
                            minDate={dayjs(receiverDate)}
                            readOnly
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
                              allInfoDate === "" ? null : dayjs(allInfoDate)
                            }
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300, mt: -1.2 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Assignee
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={assignee === 0 ? "" : assignee}
                          readOnly
                        >
                          {assigneeDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{
                          mx: 0.75,
                          minWidth: 300,
                          mt: typeOfWork === 3 ? -1.2 : -0.5,
                        }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Reviewer
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={reviewer === 0 ? "" : reviewer}
                          readOnly
                        >
                          {reviewerDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} className="pt-4">
                      <FormControl
                        variant="standard"
                        sx={{
                          mx: 0.75,
                          minWidth: 300,
                          mt: typeOfWork === 3 ? -1.2 : -0.5,
                        }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Manager
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={manager === 0 ? "" : manager}
                          readOnly
                        >
                          {managerDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {typeOfWork === 3 && (
                      <>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{
                              mx: 0.75,
                              minWidth: 300,
                              mt: -1.2,
                            }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Return Type
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={returnType === 0 ? "" : returnType}
                              readOnly
                            >
                              <MenuItem value={1}>Individual Return</MenuItem>
                              <MenuItem value={2}>Business Return</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Type of Return
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={typeOfReturn === 0 ? "" : typeOfReturn}
                              readOnly
                            >
                              {typeOfReturnDropdownData.map(
                                (i: any, index: number) => (
                                  <MenuItem value={i.value} key={index}>
                                    {i.label}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Return Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={returnYear === 0 ? "" : returnYear}
                              readOnly
                            >
                              {Years.map((i: any, index: number) => (
                                <MenuItem value={i.value} key={index}>
                                  {i.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300, ml: 1 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Current Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={countYear === 0 ? "" : countYear}
                              readOnly
                            >
                              {Years.map((i: any, index: number) => (
                                <MenuItem value={i.value} key={index}>
                                  {i.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <TextField
                            label={
                              <span>
                                No of Pages
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            type="number"
                            fullWidth
                            value={noOfPages === 0 ? "" : noOfPages}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 300, mt: 0.3 }}
                          />
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300, mt: -1 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Checklist/Workpaper
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={
                                checklistWorkpaper === 0
                                  ? ""
                                  : checklistWorkpaper
                              }
                              readOnly
                            >
                              <MenuItem value={1}>True</MenuItem>
                              <MenuItem value={2}>False</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    {onEdit > 0 && (
                      <>
                        <Grid item xs={3} className="pt-4">
                          <TextField
                            label={
                              <span>
                                Date of Preperation
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            type={inputTypePreperation}
                            disabled
                            fullWidth
                            value={dateOfPreperation}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{
                              mx: 0.75,
                              maxWidth: 300,
                              mt: typeOfWork === 3 ? -0.6 : -0.2,
                            }}
                          />
                        </Grid>
                        <Grid item xs={3} className="pt-4">
                          <TextField
                            label={
                              <span>
                                Date of Review
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            disabled
                            type={inputTypeReview}
                            fullWidth
                            value={dateOfReview}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{
                              mx: 0.75,
                              maxWidth: 300,
                              mt: typeOfWork === 3 ? -0.6 : -0.2,
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
                  <span
                    className={`cursor-pointer ${
                      subTaskDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setSubTaskDrawer(!subTaskDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {subTaskDrawer && (
                  <div className="mt-3 pl-6">
                    {subTaskFields.map((field, index) => (
                      <div className="w-[100%]" key={index}>
                        <TextField
                          label={
                            <span>
                              Task Name
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          value={field.Title}
                          InputProps={{ readOnly: true }}
                          inputProps={{ readOnly: true }}
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
                          value={field.Description}
                          InputProps={{ readOnly: true }}
                          inputProps={{ readOnly: true }}
                          margin="normal"
                          variant="standard"
                          sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                        />
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
                          <ThreeDotIcon />
                        </span>
                        {itemStates[index] && (
                          <FormGroup className="ml-8 mt-2">
                            {i.Activities.map((j: any, index: number) => (
                              <FormControlLabel
                                control={
                                  <Checkbox checked={j.IsCheck} disabled />
                                }
                                label={j.Title}
                              />
                            ))}
                          </FormGroup>
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
                          setCommentSelect(e.target.value),
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
                                        style={{ backgroundColor: "#cee4e5" }}
                                        trigger="@"
                                      />
                                    </MentionsInput>
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
                                      const assignee = assigneeDropdownData.map(
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
                                  {userId === i.UserId &&
                                    hasPermissionWorklog(
                                      "Comment",
                                      "save",
                                      "WorkLogs"
                                    ) && (
                                      <button
                                        type="button"
                                        className="flex items-start !bg-secondary text-white border rounded-md p-[4px]"
                                        onClick={() =>
                                          handleEditClick(index, i.Message)
                                        }
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
                        <span
                          className="text-white cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileIcon />
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            className="input-field hidden"
                            onChange={(e) => handleFileChange(e)}
                          />
                        </span>
                        <button
                          type="button"
                          className="!bg-secondary text-white p-[6px] rounded-md cursor-pointer mr-2"
                          onClick={(e) => handleSubmitComment(e, commentSelect)}
                        >
                          <SendIcon />
                        </button>
                      </div>
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
                      {manualFields.map((field, index) => (
                        <div key={index}>
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
                                Start Time
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
                                End Time
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
                          <TextField
                            label={
                              <span>
                                Total Time
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            type={
                              field.startTime && field.endTime !== ""
                                ? "time"
                                : "text"
                            }
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            fullWidth
                            value={field.totalTime}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230 }}
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
                    : "tabpanel-5"
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
                        e.target.checked === true
                          ? setStatus(
                              statusDropdownData
                                .map((i: any) =>
                                  i.Type === "InProgress" ? i.value : undefined
                                )
                                .filter((i: any) => i !== undefined)[0]
                            )
                          : setStatus(
                              statusDropdownData
                                .map((i: any) =>
                                  i.Type === "NotStarted" ? i.value : undefined
                                )
                                .filter((i: any) => i !== undefined)[0]
                            );
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
                        <div key={index} className="flex items-center">
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
                                Start Time
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
                                End Time
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
                    : "tabpanel-6"
                }`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <BellIcon />
                    <span className="ml-[21px]">Reminder</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      reminderDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setReminderDrawer(!reminderDrawer)}
                  >
                    <ChevronDownIcon />
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
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Due Date"
                          disabled
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label="Specific Date"
                          disabled
                        />
                        <FormControlLabel
                          value={3}
                          control={<Radio />}
                          label="Daily"
                          disabled
                        />
                        <FormControlLabel
                          value={4}
                          control={<Radio />}
                          label="Days Before Due Date"
                          disabled
                        />
                      </RadioGroup>
                    </div>
                    <div className="pl-6 flex">
                      {reminderCheckboxValue === 2 && onEdit === 0 && (
                        <div
                          className={`inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
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
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              readOnly
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      {reminderCheckboxValue === 2 && onEdit > 0 && (
                        <div className="inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]">
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
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              readOnly
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 100 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Hour
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={reminderTime === 0 ? "" : reminderTime}
                          readOnly
                        >
                          {hours.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Autocomplete
                        multiple
                        limitTags={2}
                        id="checkboxes-tags-demo"
                        options={
                          Array.isArray(assigneeDropdownData)
                            ? assigneeDropdownData
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
                        readOnly
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
                    : "tabpanel-7"
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
                              <span className="ml-3">{field.SubmitedOn}</span>
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
                              errorCountErr[index] && field.ErrorCount < 0
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
                                  label={
                                    <span>
                                      cc
                                      <span className="text-defaultRed">
                                        &nbsp;*
                                      </span>
                                    </span>
                                  }
                                  {...params}
                                  variant="standard"
                                  error={ccErr[index]}
                                  helperText={
                                    ccErr[index]
                                      ? "This is a required field."
                                      : ""
                                  }
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
                            {/* <ImageUploader getData={getAttachmentData} /> */}
                            {/* <TextField
                              label={
                                <span>
                                  Attachments
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              fullWidth
                              disabled={
                                !hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                hasPermissionWorklog(
                                  "ErrorLog",
                                  "Delete",
                                  "WorkLogs"
                                )
                              }
                              value={
                                field.Attachments.trim().length === 0
                                  ? ""
                                  : field.Attachments
                              }
                              onChange={(e) =>
                                handleAttachmentsChange(e, index)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value.length > 0) {
                                  const newAttachmentErrors = [
                                    ...attachmentsErr,
                                  ];
                                  newAttachmentErrors[index] = false;
                                  setAttachmentsErr(newAttachmentErrors);
                                }
                              }}
                              error={attachmentsErr[index]}
                              helperText={
                                attachmentsErr[index]
                                  ? "This is a required field."
                                  : ""
                              }
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 475, mt: 1 }}
                            /> */}
                            {field.isSolved && (
                              <FormGroup>
                                <FormControlLabel
                                  className="mt-5"
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
                  : "tabpanel-8"
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
                    <span className="font-semibold">{i.ReviewedDate}</span>
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
            {/* <div className="mt-14" id="tabpanel-9">
              <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                <span className="flex items-center">
                  <HistoryIcon />
                  <span className="ml-[21px]">Logs</span>
                </span>
                <span
                  className={`cursor-pointer ${logsDrawer ? "rotate-180" : ""}`}
                  onClick={() => setLogsDrawer(!logsDrawer)}
                >
                  <ChevronDownIcon />
                </span>
              </div>
              {logsDrawer && (
                <div className="mt-5 pl-[70px] text-sm">
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
                </div>
              )}
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditDrawer;
