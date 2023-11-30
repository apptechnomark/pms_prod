import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import CommentsIcon from "@/assets/icons/CommentsIcon";
import TaskIcon from "@/assets/icons/TaskIcon";
import EditIcon from "@mui/icons-material/Edit";
import FileIcon from "@/assets/icons/worklogs/FileIcon";
import SendIcon from "@/assets/icons/worklogs/SendIcon";
import { Close, Download, Save } from "@mui/icons-material";
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
  Select,
  Switch,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import mentionsInputStyle from "./mentionsInputStyle";
import { toast } from "react-toastify";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import {
  getCCDropdownData,
  getProcessDropdownData,
  getProjectDropdownData,
  getSubProcessDropdownData,
  getTypeOfWorkDropdownData,
} from "@/utils/commonDropdownApiCall";
import ImageUploader from "../common/ImageUploader";
import { getFileFromBlob } from "@/utils/downloadFile";
import styled from "@emotion/styled";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Drawer = ({
  onOpen,
  onClose,
  onEdit,
  onDataFetch,
  onHasId,
  onComment,
  onErrorLog,
  errorLog,
  isCompletedTaskClicked,
}: any) => {
  const router = useRouter();
  const [userId, setUserId] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isCreatedByClient, setIsCreatedByClient] = useState(true);
  const [fieldsData, setFieldsData] = useState([]);
  const [editData, setEditData] = useState<any>([]);
  let Task;
  {
    onEdit > 0
      ? errorLog
        ? (Task = ["Task", "Sub-Task", "Comments", "Error Logs"])
        : (Task = ["Task", "Sub-Task", "Comments"])
      : (Task = ["Task", "Sub-Task"]);
  }

  const currentYear = new Date().getFullYear();
  const Years: any = [];

  for (let year = 2010; year <= currentYear + 1; year++) {
    Years.push({ label: String(year), value: year });
  }

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

  const getFieldsByClient = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const clientId = await localStorage.getItem("clientId");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/GetFields`,
        {
          clientId: clientId || 0,
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
          setFieldsData(response.data.ResponseData);
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
  };

  useEffect(() => {
    onOpen && getFieldsByClient();
    onComment && scrollToPanel(2);
    onErrorLog && scrollToPanel(3);
    const userIdLocal: any = localStorage.getItem("UserId");
    setUserId(parseInt(userIdLocal));
  }, [onOpen, onComment, onErrorLog]);

  // Task
  const [taskDrawer, setTaskDrawer] = useState(true);
  const [typeOfWorkDropdownData, setTypeOfWorkDropdownData] = useState([]);
  const [typeOfWork, setTypeOfWork] = useState<any>(0);
  const [projectDropdownData, setProjectDropdownData] = useState<any>([]);
  const [projectName, setProjectName] = useState<any>(0);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [processName, setProcessName] = useState<any>(0);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);
  const [subProcessName, setSubProcessName] = useState<any>(0);
  const priorityDropdownData = [
    { label: "High", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Low", value: 3 },
  ];
  const [priority, setPriority] = useState<any>(0);
  const [quantity, setQuantity] = useState<any>(1);
  const [receiverDate, setReceiverDate] = useState<any>("");
  const [dueDate, setDueDate] = useState<any>("");
  const [clientTaskName, setClientTaskName] = useState<string>("");
  const [clientTaskNameErr, setClientTaskNameErr] = useState(false);
  const [editStatus, setEditStatus] = useState<any>(0);
  const [returnYear, setReturnYear] = useState<any>(0);
  const [status, setStatus] = useState<any>(0);

  // Sub-Task
  const [subTaskSwitch, setSubTaskSwitch] = useState(false);
  const [subTaskDrawer, setSubTaskDrawer] = useState(true);
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

  // getSubTaskData
  const getSubTaskData = async () => {
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
          setSubTaskSwitch(data.length <= 0 ? false : true);
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
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  // Save SubTask
  const handleSubmitSubTask = async () => {
    let hasSubErrors = false;
    const newTaskErrors = subTaskFields.map(
      (field) =>
        (subTaskSwitch && field.Title.trim().length < 5) ||
        (subTaskSwitch && field.Title.trim().length > 50)
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
      if (
        (onEdit > 0 && editStatus === 4) ||
        (onEdit > 0 && editStatus === 7) ||
        (onEdit > 0 && editStatus === 8) ||
        (onEdit > 0 && editStatus === 9) ||
        (onEdit > 0 && editStatus === 13)
      ) {
        toast.warning(
          "Cannot change task for status 'Stop', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
        );
        onEdit > 0 && getSubTaskData();
      } else {
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
              getSubTaskData();
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

  // Comments
  const [commentsDrawer, setCommentsDrawer] = useState(true);
  const [commentData, setCommentData] = useState<any>([]);
  const [value, setValue] = useState("");
  const [valueError, setValueError] = useState(false);
  const [valueEdit, setValueEdit] = useState("");
  const [valueEditError, setValueEditError] = useState(false);
  const [mention, setMention] = useState<any>([]);
  const [commentAttachment, setCommentAttachment] = useState([
    {
      AttachmentId: 0,
      UserFileName: "",
      SystemFileName: "",
      AttachmentPath: process.env.attachment,
    },
  ]);
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1);
  const [commentDropdownData, setCommentDropdownData] = useState([]);

  const users: any = commentDropdownData.map(
    (i: any) =>
      new Object({
        id: i.value,
        display: i.label,
      })
  );

  const extractText = (inputString: any) => {
    const regex = /@\[([^\]]+)\]\([^)]+\)|\[([^\]]+)\]|[^@\[\]]+/g;
    const matches = [];
    let match;
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1] || match[2] || match[0]);
    }
    return matches;
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

  const handleEditClick = (index: any, message: any) => {
    setEditingCommentIndex(index);
    setValueEdit(message);
  };

  const handleSaveClick = async (e: any, i: any) => {
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
              Attachment: commentAttachment,
              type: 2,
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
              getCommentData();
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
        getCommentData();
      }
    }
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

  // Save Comment
  const handleSubmitComment = async (e: { preventDefault: () => void }) => {
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
              type: 2,
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
              getCommentData();
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
        getCommentData();
      }
    }
  };

  // Error Logs
  const [errorLogDrawer, setErrorLogDrawer] = useState(true);
  const [cCDropdownData, setCCDropdownData] = useState<any>([]);
  const [errorLogFields, setErrorLogFields] = useState([
    {
      SubmitedBy: "",
      SubmitedOn: "",
      ErrorLogId: 0,
      ErrorType: 1,
      RootCause: 0,
      Priority: 0,
      ErrorCount: 0,
      NatureOfError: 0,
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
  const [remarkErr, setRemarkErr] = useState([false]);
  const [deletedErrorLog, setDeletedErrorLog] = useState<any>([]);

  const addErrorLogField = () => {
    setErrorLogFields([
      ...errorLogFields,
      {
        SubmitedBy: "",
        SubmitedOn: "",
        ErrorLogId: 0,
        ErrorType: 2,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
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
    setRemarkErr([...remarkErr, false]);
  };

  const removeErrorLogField = (index: number) => {
    setDeletedErrorLog([...deletedErrorLog, errorLogFields[index].ErrorLogId]);
    const newErrorLogFields = [...errorLogFields];
    newErrorLogFields.splice(index, 1);
    setErrorLogFields(newErrorLogFields);
    const newRemarkErrors = [...remarkErr];
    newRemarkErrors.splice(index, 1);
    setRemarkErr(newRemarkErrors);
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
    const newRemarkErrors = errorLogFields.map(
      (field) =>
        field.Remark.trim().length < 5 || field.Remark.trim().length > 500
    );
    setRemarkErr(newRemarkErrors);

    hasErrorLogErrors = newRemarkErrors.some((error) => error);

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
                    ErrorType: 2,
                    RootCause: 0,
                    Priority: 0,
                    ErrorCount: 0,
                    NatureOfError: 0,
                    CC: [],
                    Remark: i.Remark,
                    Attachments:
                      i.Attachments[0].SystemFileName.length > 0
                        ? i.Attachments
                        : null,
                  })
              ),
              IsClientWorklog: true,
              SubmissionId: null,
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
              toast.success(`ErrorLog Updated successfully.`);
              setDeletedErrorLog([]);
              getErrorLogData();
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

  // Submit Task
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

    const typeChecked = (type: any) => {
      return fieldsData
        .map((field: any) => field.Type === type && field.IsChecked)
        .some((result: boolean) => result === true);
    };

    const fieldValidations = {
      clientTaskName: typeChecked("TaskName") && validateField(clientTaskName),
    };

    fieldsData.map((field: any) => {
      field.Type === "TaskName" &&
        field.IsChecked &&
        setClientTaskNameErr(fieldValidations.clientTaskName);
    });

    const hasErrors = Object.values(fieldValidations).some((error) => error);

    // Sub-Task
    let hasSubErrors = false;
    const newTaskErrors = subTaskFields.map(
      (field) =>
        (onEdit === 0 && subTaskSwitch && field.Title.trim().length < 5) ||
        (onEdit === 0 && subTaskSwitch && field.Title.trim().length > 500)
    );
    setTaskNameErr(newTaskErrors);
    const newSubTaskDescErrors = subTaskFields.map(
      (field) =>
        (onEdit === 0 &&
          subTaskSwitch &&
          field.Description.trim().length < 5) ||
        (onEdit === 0 && subTaskSwitch && field.Description.trim().length > 500)
    );
    setSubTaskDescriptionErr(newSubTaskDescErrors);
    hasSubErrors =
      newTaskErrors.some((error) => error) ||
      newSubTaskDescErrors.some((error) => error);

    const saveWorklog = async () => {
      const clientId = await localStorage.getItem("clientId");
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/ClientWorkitem/saveworkitem`,
          {
            ClientId: clientId,
            WorkItemId: onEdit > 0 ? onEdit : 0,
            taskName: clientTaskName.length <= 0 ? null : clientTaskName,
            WorkTypeId: typeOfWork === 0 ? null : typeOfWork,
            ProjectId: projectName === 0 ? null : projectName,
            ProcessId: processName === 0 ? null : processName,
            SubProcessId: subProcessName === 0 ? null : subProcessName,
            Priority: priority === 0 ? null : priority,
            Quantity: quantity <= 0 ? null : quantity,
            ReceiverDate:
              receiverDate.length === 0
                ? null
                : dayjs(receiverDate).format("YYYY/MM/DD"),
            DueDate:
              dueDate.length === 0 ? null : dayjs(dueDate).format("YYYY/MM/DD"),
            TaxReturnType: null,
            TypeOfReturnId: null,
            TaxCustomFields:
              typeOfWork !== 3
                ? null
                : {
                    ReturnYear: returnYear === 0 ? null : returnYear,
                    Complexity: null,
                    CountYear: null,
                    NoOfPages: null,
                  },
            SubTaskList:
              onEdit > 0
                ? null
                : subTaskSwitch
                ? subTaskFields.map(
                    (i: any) =>
                      new Object({
                        SubtaskId: i.SubtaskId,
                        Title: i.Title.trim(),
                        Description: i.Description.trim(),
                      })
                  )
                : null,
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
              `Worklog ${onEdit > 0 ? "Updated" : "created"} successfully.`
            );
            onEdit === 0 && handleClose();
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
    };

    if (!hasErrors && !hasSubErrors) {
      if (hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")) {
        if (
          (onEdit > 0 && editStatus === 4) ||
          (onEdit > 0 && editStatus === 7) ||
          (onEdit > 0 && editStatus === 8) ||
          (onEdit > 0 && editStatus === 9) ||
          (onEdit > 0 && editStatus === 13)
        ) {
          toast.warning(
            "Cannot change task for status 'Stop', 'Accept', 'Reject', 'Accept with Notes' or 'Signed-off'."
          );
          onEdit > 0 && getEditData();
        } else {
          saveWorklog();
        }
      } else {
        toast.error("User don't have permission to Update Task.");
        onEdit > 0 && getEditData();
      }
    }
  };

  // getCommentData
  const getCommentData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/comment/getByWorkitem`,
        {
          WorkitemId: onEdit,
          type: 2,
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

  // getErrorlogData
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
                        i.Attachment === null || i.Attachment.length <= 0
                          ? [
                              {
                                AttachmentId: 0,
                                UserFileName: "",
                                SystemFileName: "",
                                AttachmentPath: process.env.attachment,
                              },
                            ]
                          : i.Attachment,
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

  const getEditData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/ClientWorkitem/getbyid`,
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
          setEditData(data);
          setIsCreatedByClient(data.IsCreatedByClient);
          setTypeOfWork(data.WorkTypeId === null ? 0 : data.WorkTypeId);
          setProjectName(data.ProjectId === null ? 0 : data.ProjectId);
          setProcessName(data.ProcessId === null ? 0 : data.ProcessId);
          setSubProcessName(data.SubProcessId === null ? 0 : data.SubProcessId);
          setPriority(
            data.Priority === null || data.Priority === 0 ? 0 : data.Priority
          );
          setQuantity(
            data.Quantity === null || data.Quantity === 0 ? 0 : data.Quantity
          );
          setReceiverDate(data.ReceiverDate === null ? 0 : data.ReceiverDate);
          setDueDate(data.DueDate === null ? 0 : data.DueDate);
          setClientTaskName(data.TaskName === null ? "" : data.TaskName);
          setStatus(data.StatusId === null ? 0 : data.StatusId);
          setReturnYear(
            data.TaxCustomFields.ReturnYear === null ||
              data.TaxCustomFields.ReturnYear === 0
              ? 0
              : data.TaxCustomFields.ReturnYear
          );
          setEditStatus(
            data.StatusId === null || data.StatusId === 0 ? 0 : data.StatusId
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

  // getDropdownData
  useEffect(() => {
    const getData = async () => {
      const clientId: any = await localStorage.getItem("clientId");
      const workTypeData: any =
        clientId > 0 && (await getTypeOfWorkDropdownData(clientId));
      workTypeData.length > 0 && setTypeOfWorkDropdownData(workTypeData);
      workTypeData.length > 0 &&
        onEdit === 0 &&
        setTypeOfWork(
          workTypeData.map((i: any) => i.value).includes(3)
            ? 3
            : workTypeData.map((i: any) => i.value).includes(1)
            ? 1
            : workTypeData.map((i: any) => i.value).includes(2)
            ? 2
            : 0
        );
      const projectData: any =
        clientId > 0 && (await getProjectDropdownData(clientId));
      projectData.length > 0 && setProjectDropdownData(projectData);
      const processData: any =
        clientId > 0 && (await getProcessDropdownData(clientId));
      setProcessDropdownData(
        processData.map((i: any) => new Object({ label: i.Name, value: i.Id }))
      );
      const subProcessData: any =
        clientId > 0 &&
        processName !== 0 &&
        (await getSubProcessDropdownData(clientId, processName));
      subProcessData.length > 0 &&
        setSubProcessDropdownData(
          subProcessData.map(
            (i: any) => new Object({ label: i.Name, value: i.Id })
          )
        );
      setCCDropdownData(await getCCDropdownData());
    };

    if (onEdit > 0) {
      getEditData();
      getSubTaskData();
      getCommentData();
      getErrorLogData();
      getData();
    }

    onOpen && getData();
  }, [onOpen, onEdit, processName]);

  useEffect(() => {
    const getData = async () => {
      const clientId = await localStorage.getItem("clientId");
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.api_url}/user/GetClientCommentUserDropdown`,
          {
            clientId: clientId,
            WorktypeId: typeOfWork,
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
            setCommentDropdownData(response.data.ResponseData);
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
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };
    typeOfWork !== 0 && onEdit > 0 && getData();
  }, [typeOfWork]);

  const handleClose = () => {
    setEditData([]);
    setIsCreatedByClient(true);
    setUserId(0);
    setActiveTab(0);
    setTaskDrawer(true);
    setTypeOfWork(0);
    setProjectName(0);
    setProcessName(0);
    setSubProcessName(0);
    setPriority(0);
    setQuantity(0);
    setReceiverDate("");
    setDueDate("");
    setClientTaskName("");
    setClientTaskNameErr(false);
    setReturnYear(0);
    setEditStatus(0);
    setStatus(0);
    setSubProcessDropdownData([]);

    // Sub-Task
    setSubTaskDrawer(true);
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

    // Comments
    setCommentsDrawer(true);
    setCommentData([]);
    setValue("");
    setValueError(false);
    setValueEdit("");
    setValueEditError(false);
    setMention([]);
    setCommentAttachment([
      {
        AttachmentId: 0,
        UserFileName: "",
        SystemFileName: "",
        AttachmentPath: process.env.attachment,
      },
    ]);
    setEditingCommentIndex(-1);
    setCommentDropdownData([]);

    // ErrorLogs
    setErrorLogDrawer(true);
    setErrorLogFields([
      {
        SubmitedBy: "",
        SubmitedOn: "",
        ErrorLogId: 0,
        ErrorType: 1,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
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
    setRemarkErr([false]);
    setDeletedErrorLog([]);

    onDataFetch();
    onClose();
  };

  const ColorToolTip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#0281B9",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#0281B9",
    },
  }));

  const isWeekend = (date: any) => {
    const day = date.day();
    return day === 6 || day === 0;
  };

  return (
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
                    index !== Task.length - 1 && "border-r border-r-lightSilver"
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
      <div className={`${onEdit > 0 && "overflow-y-scroll"} !h-[91%]`}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-[100%]"
        >
          <div>
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
                      taskDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setTaskDrawer(!taskDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              {taskDrawer && (
                <Grid container className="px-8">
                  {fieldsData.map((type: any) => (
                    <>
                      {type.Type === "TypeOfWork" &&
                        type.IsChecked &&
                        typeOfWorkDropdownData.length > 1 && (
                          <Grid item xs={3} className="pt-4">
                            <FormControl
                              variant="standard"
                              sx={{ width: 300, mt: -0.3 }}
                              disabled={
                                !isCreatedByClient ||
                                (isCompletedTaskClicked &&
                                  onEdit > 0 &&
                                  !isCreatedByClient) ||
                                status > 1
                              }
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Type of Work
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={typeOfWork === 0 ? "" : typeOfWork}
                                onChange={(e) => {
                                  setTypeOfWork(e.target.value);
                                }}
                              >
                                {typeOfWorkDropdownData.map(
                                  (i: any, index: number) => (
                                    <MenuItem value={i.value} key={index}>
                                      {i.label}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}
                      {type.Type === "ProjectName" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            options={projectDropdownData}
                            value={
                              projectDropdownData.find(
                                (i: any) => i.value === projectName
                              ) || null
                            }
                            onChange={(e, value: any) => {
                              value && setProjectName(value.value);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Project Name"
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {type.Type === "ProcessName" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            options={processDropdownData}
                            value={
                              processDropdownData.find(
                                (i: any) => i.value === processName
                              ) || null
                            }
                            onChange={(e, value: any) => {
                              value && setProcessName(value.value);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Process Name"
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {type.Type === "SubProcessName" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            options={subProcessDropdownData}
                            value={
                              subProcessDropdownData.find(
                                (i: any) => i.value === subProcessName
                              ) || null
                            }
                            onChange={(e, value: any) => {
                              value && setSubProcessName(value.value);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Sub-Process"
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {type.Type === "TaskName" && type.IsChecked && (
                        <Grid item xs={3}>
                          <TextField
                            label={
                              <span>
                                Task Name
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            fullWidth
                            value={
                              clientTaskName?.trim().length <= 0
                                ? ""
                                : clientTaskName
                            }
                            onChange={(e) => {
                              setClientTaskName(e.target.value);
                              setClientTaskNameErr(false);
                            }}
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 4) {
                                setClientTaskNameErr(false);
                              }
                              if (
                                e.target.value.trim().length > 4 &&
                                e.target.value.trim().length < 50
                              ) {
                                setClientTaskNameErr(false);
                              }
                            }}
                            error={clientTaskNameErr}
                            helperText={
                              clientTaskNameErr &&
                              clientTaskName?.trim().length > 0 &&
                              clientTaskName?.trim().length < 4
                                ? "Minimum 4 characters required."
                                : clientTaskNameErr &&
                                  clientTaskName?.trim().length > 50
                                ? "Maximum 50 characters allowed."
                                : clientTaskNameErr
                                ? "This is a required field."
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ width: 300 }}
                          />
                        </Grid>
                      )}
                      {type.Type === "Priority" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            options={priorityDropdownData}
                            value={
                              priorityDropdownData.find(
                                (i: any) => i.value === priority
                              ) || null
                            }
                            onChange={(e, value: any) => {
                              value && setPriority(value.value);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Priority"
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {type.Type === "Quantity" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <TextField
                            label="Quantity"
                            onFocus={(e) =>
                              e.target.addEventListener(
                                "wheel",
                                function (e) {
                                  e.preventDefault();
                                },
                                { passive: false }
                              )
                            }
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            type="number"
                            fullWidth
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            margin="normal"
                            variant="standard"
                            sx={{ width: 300, mt: 0 }}
                          />
                        </Grid>
                      )}
                      {type.Type === "StartDate" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <div
                            className={`inline-flex -mt-[4px] muiDatepickerCustomizer w-full max-w-[300px]`}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Received Date"
                                value={
                                  receiverDate === ""
                                    ? null
                                    : dayjs(receiverDate)
                                }
                                disabled={
                                  !isCreatedByClient ||
                                  (isCompletedTaskClicked &&
                                    onEdit > 0 &&
                                    !isCreatedByClient) ||
                                  status > 1
                                }
                                shouldDisableDate={isWeekend}
                                maxDate={dayjs(Date.now())}
                                onChange={(newDate: any) => {
                                  setReceiverDate(newDate.$d);
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
                                  setDueDate(nextDate);
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
                      )}
                      {type.Type === "EndDate" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <div
                            className={`inline-flex -mt-[4px] muiDatepickerCustomizer w-full max-w-[300px]`}
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
                                disabled
                                onChange={(newDate: any) => {
                                  setDueDate(newDate.$d);
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
                      )}
                      {type.Type === "ReturnYear" &&
                        type.IsChecked &&
                        typeOfWork === 3 && (
                          <Grid item xs={3} className="pt-4">
                            <FormControl
                              variant="standard"
                              sx={{ width: 300, mt: -0.4, mx: 0.75 }}
                              disabled={
                                !isCreatedByClient ||
                                (isCompletedTaskClicked &&
                                  onEdit > 0 &&
                                  !isCreatedByClient) ||
                                status > 1
                              }
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Return Year
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={returnYear === 0 ? "" : returnYear}
                                onChange={(e) => setReturnYear(e.target.value)}
                              >
                                {Years.map((i: any, index: number) => (
                                  <MenuItem value={i.value} key={index}>
                                    {i.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}
                    </>
                  ))}
                </Grid>
              )}
            </div>
            {fieldsData.map((field: any) => field.IsChecked).includes(true) && (
              <div className="mt-14" id="tabpanel-1">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Sub-Task</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && subTaskSwitch && isCreatedByClient && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitSubTask}
                      >
                        Update
                      </Button>
                    )}
                    <Switch
                      checked={subTaskSwitch}
                      disabled={
                        !isCreatedByClient ||
                        (isCompletedTaskClicked &&
                          onEdit > 0 &&
                          !isCreatedByClient) ||
                        status > 1
                      }
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
                  <>
                    <div className="mt-3 pl-6">
                      {subTaskFields.map((field, index) => (
                        <div className="w-[100%] flex" key={index}>
                          <TextField
                            label={
                              <span>
                                Task Name
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            fullWidth
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
                                : taskNameErr[index] && field.Title.length > 50
                                ? "Maximum 50 characters allowed."
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
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            disabled={
                              !isCreatedByClient ||
                              (isCompletedTaskClicked &&
                                onEdit > 0 &&
                                !isCreatedByClient) ||
                              status > 1
                            }
                            fullWidth
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
                          {index === 0
                            ? (onEdit === 0 || !isCompletedTaskClicked) &&
                              isCreatedByClient && (
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
                              )
                            : (onEdit === 0 || !isCompletedTaskClicked) &&
                              isCreatedByClient && (
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
                  </>
                )}
              </div>
            )}
            {onEdit > 0 && (
              <div className="mt-14" id="tabpanel-2">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <CommentsIcon />
                    <span className="ml-[21px]">Comments</span>
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
                        <div className="flex gap-4" key={index}>
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
                                  <div className="flex flex-col items-start">
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
                                      {commentAttachment[0]?.SystemFileName
                                        .length > 0 && (
                                        <div className="flex items-center justify-center gap-2">
                                          <span className="ml-2 cursor-pointer">
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
                                    onClick={(e) => handleSaveClick(e, i)}
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="hidden"></span>
                                  <div className="flex items-start">
                                    {extractText(i.Message).map((i: any) => {
                                      const assignee = commentDropdownData.map(
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
                          onClick={handleSubmitComment}
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
            {onEdit > 0 && errorLog && (
              <div className="my-14" id="tabpanel-3">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Error Logs</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && (
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
                        errorLogDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setErrorLogDrawer(!errorLogDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {errorLogDrawer &&
                  hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && (
                    <>
                      <div className="mt-3 pl-6">
                        {errorLogFields.map((field: any, index: any) => (
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
                            <div className="flex !ml-0">
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
                                value={
                                  field.Remark.trim().length === 0
                                    ? ""
                                    : field.Remark
                                }
                                disabled={field.isSolved}
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
                                            field.Attachments[0]
                                              ?.SystemFileName,
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
                                    className="mt-4 ml-2"
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
          </div>
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
              {isCreatedByClient &&
                !isCompletedTaskClicked &&
                fieldsData
                  .map((field: any) => field.IsChecked)
                  .includes(true) && (
                  <Button
                    type="submit"
                    variant="contained"
                    className="rounded-[4px] !h-[36px] !mx-6 !bg-secondary"
                  >
                    <span className="flex items-center justify-center gap-[10px] px-[5px]">
                      {onEdit > 0 ? "Save Task" : "Create Task"}
                    </span>
                  </Button>
                )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Drawer;
