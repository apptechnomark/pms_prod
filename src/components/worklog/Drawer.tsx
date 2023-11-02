import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import CommentsIcon from "@/assets/icons/CommentsIcon";
import TaskIcon from "@/assets/icons/TaskIcon";
import EditIcon from "@mui/icons-material/Edit";
import FileIcon from "@/assets/icons/worklogs/FileIcon";
import SendIcon from "@/assets/icons/worklogs/SendIcon";
import { Close, Save } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import mentionsInputStyle from "./mentionsInputStyle";
import { toast } from "react-toastify";
import { hasPermissionWorklog } from "@/utils/commonFunction";

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
  let Task;
  {
    onEdit > 0
      ? errorLog
        ? (Task = ["TASK", "SUB-TASK", "COMMENTS", "ERROR LOGS"])
        : (Task = ["TASK", "SUB-TASK", "COMMENTS"])
      : (Task = ["TASK", "SUB-TASK"]);
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
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [projectName, setProjectName] = useState<any>(0);
  const [projectNameErr, setProjectNameErr] = useState(false);
  const [typeOfWorkDropdownData, setTypeOfWorkDropdownData] = useState([]);
  const [typeOfWork, setTypeOfWork] = useState<string | number>(0);
  const [typeOfWorkErr, setTypeOfWorkErr] = useState(false);
  const [typeOfReturnDropdownData, setTypeOfReturnDropdownData] = useState<any>(
    []
  );
  const [priority, setPriority] = useState<string | number>(0);
  const [priorityErr, setPriorityErr] = useState(false);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [processName, setProcessName] = useState<any>(0);
  const [processNameErr, setProcessNameErr] = useState(false);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);
  const [subProcess, setSubProcess] = useState<any>(0);
  const [subProcessErr, setSubProcessErr] = useState(false);
  const [clientTaskName, setClientTaskName] = useState<string>("");
  const [clientTaskNameErr, setClientTaskNameErr] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startDateErr, setStartDateErr] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState(false);
  const [quantity, setQuantity] = useState<any>(1);
  const [quantityErr, setQuantityErr] = useState(false);
  const [returnType, setReturnType] = useState<string | number>(0);
  const [returnTypeErr, setReturnTypeErr] = useState(false);
  const [typeOfReturn, setTypeOfReturn] = useState<string | number>(0);
  const [typeOfReturnErr, setTypeOfReturnErr] = useState(false);
  const [editStatus, setEditStatus] = useState<any>(0);

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
    setTaskNameErr([...taskNameErr, false]),
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
  let commentAttachment: any = [];
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1);
  const [commentDropdownData, setCommentDropdownData] = useState([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
              Attachment: i.Attachment,
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

  const handleFileChange = (e: any) => {
    const selectedFiles = e.target.files;
    // if (selectedFiles) {
    //   for (let i = 0; i < selectedFiles.length; i++) {
    //     const selectedFile = selectedFiles[i];
    //     const fileName = selectedFile.name;
    //     const fileExtension = fileName.split(".").pop();
    //     let newFileName;
    //     const uuidv4 = () => {
    //       return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    //         /[xy]/g,
    //         function (c) {
    //           const r = (Math.random() * 16) | 0,
    //             v = c == "x" ? r : (r & 0x3) | 0x8;
    //           return v.toString(16);
    //         }
    //       );
    //     };
    //     if (!fileName.toLowerCase().includes(".")) {
    //       newFileName = `${uuidv4().slice(0, 32)}.txt`;
    //     } else {
    //       newFileName = `${uuidv4().slice(0, 32)}.${fileExtension}`;
    //     }
    //     const filePath = URL.createObjectURL(selectedFile).slice(5);
    //     const fileObject = {
    //       AttachmentId: 0,
    //       SystemFileName: newFileName,
    //       UserFileName: fileName,
    //       AttachmentPath: filePath,
    //     };
    //     commentAttachment.push(fileObject);
    //   }
    // }
  };

  // Save Comment
  const handleSubmitComment = async (e: { preventDefault: () => void }) => {
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
              commentAttachment = [];
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
        ErrorType: 2,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
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
    setRootCauseErr([...rootCauseErr, false]);
    setErrorLogPriorityErr([...errorLogPriorityErr, false]);
    setErrorCountErr([...errorCountErr, false]);
    setNatureOfErr([...natureOfErr, false]);
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
    const newRemarkErrors = [...remarkErr];
    newRemarkErrors.splice(index, 1);
    setRemarkErr(newRemarkErrors);
    const newAttachmentErrors = [...attachmentsErr];
    newAttachmentErrors.splice(index, 1);
    setAttachmentsErr(newAttachmentErrors);
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
    // const newAttachmentsErrors = errorLogFields.map(
    //   (field) => field.Attachments.length === 0
    // );
    // setAttachmentsErr(newAttachmentsErrors);
    hasErrorLogErrors =
      newRootCauseErrors.some((error) => error) ||
      newNatureOfErrors.some((error) => error) ||
      newPriorityErrors.some((error) => error) ||
      newErrorCountErrors.some((error) => error) ||
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
                    ErrorType: 2,
                    RootCause: i.RootCause,
                    Priority: i.Priority,
                    ErrorCount: i.ErrorCount,
                    NatureOfError: i.NatureOfError,
                    CC: null,
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
              IsClientWorklog: true,
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
      // projectName: typeChecked("ProjectName") && validateField(projectName),
      // typeOfWork: typeChecked("TypeOfWork") && validateField(typeOfWork),
      // returnType:
      //   typeOfWork === 3 &&
      //   typeChecked("ReturnType") &&
      //   validateField(returnType),
      // typeOfReturn:
      //   typeOfWork === 3 &&
      //   typeChecked("TypeOfReturn") &&
      //   validateField(typeOfReturn),
      // priority: typeChecked("Priority") && validateField(priority),
      // processName: typeChecked("ProcessName") && validateField(processName),
      // subProcess: typeChecked("SubProcessName") && validateField(subProcess),
      clientTaskName: typeChecked("TaskName") && validateField(clientTaskName),
      // startDate: typeChecked("StartDate") && validateField(startDate),
      // endDate: typeChecked("EndDate") && validateField(endDate),
      // quantity: typeChecked("Quantity") && validateField(quantity),
    };

    fieldsData.map((field: any) => {
      // field.Type === "ProjectName" &&
      //   field.IsChecked &&
      //   setProjectNameErr(fieldValidations.projectName);
      // field.Type === "TypeOfWork" &&
      //   field.IsChecked &&
      //   setTypeOfWorkErr(fieldValidations.typeOfWork);
      // field.Type === "Priority" &&
      //   field.IsChecked &&
      //   setPriorityErr(fieldValidations.priority);
      // field.Type === "ProcessName" &&
      //   field.IsChecked &&
      //   setProcessNameErr(fieldValidations.processName);
      // field.Type === "SubProcessName" &&
      //   field.IsChecked &&
      //   setSubProcessErr(fieldValidations.subProcess);
      field.Type === "TaskName" &&
        field.IsChecked &&
        setClientTaskNameErr(fieldValidations.clientTaskName);
      // field.Type === "StartDate" &&
      //   field.IsChecked &&
      //   setStartDateErr(fieldValidations.startDate);
      // field.Type === "EndDate" &&
      //   field.IsChecked &&
      //   setEndDateErr(fieldValidations.endDate);
      // field.Type === "Quantity" &&
      //   field.IsChecked &&
      //   setQuantityErr(fieldValidations.quantity);
      // field.Type === "Quantity" &&
      //   field.IsChecked &&
      //   setQuantityErr(
      //     quantity.length <= 0 ||
      //       quantity.length > 4 ||
      //       quantity <= 0 ||
      //       quantity.toString().includes(".")
      //   );
      // typeOfWork === 3 && setReturnTypeErr(fieldValidations.returnType);
      // field.Type === "TypeOfReturn" &&
      //   field.IsChecked &&
      //   typeOfWork === 3 &&
      //   setTypeOfReturnErr(fieldValidations.typeOfReturn);
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
            SubProcessId: subProcess === 0 ? null : subProcess,
            Priority: priority === 0 ? null : priority,
            Quantity: quantity,
            ReceiverDate:
              startDate.length <= 0
                ? null
                : dayjs(startDate).format("YYYY/MM/DD"),
            DueDate:
              endDate.length <= 0 ? null : dayjs(endDate).format("YYYY/MM/DD"),
            TaxReturnType:
              typeOfWork === 3 ? (returnType === 0 ? null : returnType) : null,
            TypeOfReturnId:
              typeOfWork === 3
                ? typeOfReturn === 0
                  ? null
                  : typeOfReturn
                : null,
            TaxCustomFields: null,
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
          setIsCreatedByClient(data.IsCreatedByClient);
          setProjectName(data.ProjectId === null ? 0 : data.ProjectId);
          setTypeOfWork(data.WorkTypeId === null ? 0 : data.WorkTypeId);
          setReturnType(data.TaxReturnType === null ? 0 : data.TaxReturnType);
          setTypeOfReturn(
            data.TypeOfReturnId === null ? 0 : data.TypeOfReturnId
          );
          setPriority(data.Priority === null ? 0 : data.Priority);
          setProcessName(data.ProcessId === null ? 0 : data.ProcessId);
          setSubProcess(data.SubProcessId === null ? 0 : data.SubProcessId);
          setClientTaskName(data.TaskName === null ? "" : data.TaskName);
          setStartDate(data.ReceiverDate === null ? "" : data.ReceiverDate);
          setEndDate(data.DueDate === null ? "" : data.DueDate);
          setQuantity(data.Quantity === null ? 0 : data.Quantity);
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
    if (onEdit > 0) {
      getEditData();
      getSubTaskData();
      getCommentData();
      getErrorLogData();
    }

    const getClientId = async () => {
      const clientId = await localStorage.getItem("clientId");

      const getData = async (api: any) => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          let response: any;
          if (api === "/WorkType/GetDropdown") {
            response = await axios.post(
              `${process.env.pms_api_url}${api}`,
              {
                clientId: clientId,
              },
              {
                headers: {
                  Authorization: `bearer ${token}`,
                  org_token: `${Org_Token}`,
                },
              }
            );
          } else if (api === "/project/getdropdown") {
            response = await axios.post(
              `${process.env.pms_api_url}${api}`,
              {
                clientId: clientId,
              },
              {
                headers: {
                  Authorization: `bearer ${token}`,
                  org_token: `${Org_Token}`,
                },
              }
            );
          } else if (api === "/Process/GetDropdownByClient") {
            response = await axios.post(
              `${process.env.pms_api_url}${api}`,
              {
                clientId: clientId,
              },
              {
                headers: {
                  Authorization: `bearer ${token}`,
                  org_token: `${Org_Token}`,
                },
              }
            );
          }

          if (response.status === 200) {
            if (response.data.ResponseStatus === "Success") {
              if (api === "/WorkType/GetDropdown") {
                setTypeOfWorkDropdownData(response.data.ResponseData);
                response.data.ResponseData.length > 0 &&
                  onEdit === 0 &&
                  setTypeOfWork(
                    response.data.ResponseData.map(
                      (i: any) => i.value
                    ).includes(3)
                      ? 3
                      : response.data.ResponseData.map(
                          (i: any) => i.value
                        ).includes(1)
                      ? 1
                      : response.data.ResponseData.map(
                          (i: any) => i.value
                        ).includes(2)
                      ? 2
                      : 0
                  );
                getData("/project/getdropdown");
              }
              if (api === "/project/getdropdown") {
                setProjectDropdownData(response.data.ResponseData.List);
                response.data.ResponseData.List.length > 0 &&
                  onEdit === 0 &&
                  setProjectName(
                    response.data.ResponseData.List.map((i: any) => i.value)[0]
                  );
                getData("/Process/GetDropdownByClient");
              }
              if (api === "/Process/GetDropdownByClient") {
                setProcessDropdownData(
                  response.data.ResponseData.map(
                    (i: any) => new Object({ label: i.Name, value: i.Id })
                  )
                );
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

      getData("/WorkType/GetDropdown");
      getTypeOfReturn();
    };

    const getTypeOfReturn = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.get(
          `${process.env.worklog_api_url}/workitem/getformtypelist`,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setTypeOfReturnDropdownData(response.data.ResponseData);
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
      } catch (error) {
        console.error(error);
      }
    };

    const getCCData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.get(
          `${process.env.api_url}/user/getdropdown`,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setCCDropdownData(response.data.ResponseData);
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
      } catch (error) {
        console.error(error);
      }
    };

    onOpen && getClientId();
    onEdit > 0 && getCCData();
  }, [onOpen, onEdit]);

  useEffect(() => {
    const getData = async () => {
      const clientId = await localStorage.getItem("clientId");
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/Process/GetDropdownByClient`,
          {
            clientId: clientId,
            processId: processName,
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
            setSubProcessDropdownData(
              response.data.ResponseData.map(
                (i: any) => new Object({ label: i.Name, value: i.Id })
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
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };
    processName !== 0 && getData();
  }, [processName]);

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
    setIsCreatedByClient(true);
    setUserId(0);
    setActiveTab(0);
    setTaskDrawer(true);
    setProjectName(0);
    // setProjectNameErr(false);
    setTypeOfWork(0);
    // setTypeOfWorkErr(false);
    setReturnType(0);
    // setReturnTypeErr(false);
    setTypeOfReturn(0);
    // setTypeOfReturnErr(false);
    setPriority(0);
    // setPriorityErr(false);
    setProcessName(0);
    // setProcessNameErr(false);
    setSubProcess(0);
    // setSubProcessErr(false);
    setClientTaskName("");
    setClientTaskNameErr(false);
    setStartDate("");
    // setStartDateErr(false);
    setEndDate("");
    // setEndDateErr(false);
    setQuantity(0);
    // setQuantityErr(false);
    setSubProcessDropdownData([]);
    setEditStatus(0);

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
    commentAttachment = [];
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
    setRootCauseErr([false]);
    setErrorLogPriorityErr([false]);
    setErrorCountErr([false]);
    setNatureOfErr([false]);
    setRemarkErr([false]);
    setAttachmentsErr([false]);
    setDeletedErrorLog([]);

    onDataFetch();
    onClose();
  };

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
                <span
                  className={`cursor-pointer ${taskDrawer ? "rotate-180" : ""}`}
                  onClick={() => setTaskDrawer(!taskDrawer)}
                >
                  <ChevronDownIcon />
                </span>
              </div>
              {taskDrawer && (
                <Grid container className="px-8">
                  {fieldsData.map((type: any) => (
                    <>
                      {type.Type === "ProjectName" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            disabled={
                              !isCreatedByClient || isCompletedTaskClicked
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
                                // error={projectNameErr}
                                // onBlur={(e) => {
                                //   if (projectName > 0) {
                                //     setProjectNameErr(false);
                                //   }
                                // }}
                                // helperText={
                                //   projectNameErr
                                //     ? "This is a required field."
                                //     : ""
                                // }
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {type.Type === "TypeOfWork" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ width: 300, mt: -0.3 }}
                            // error={typeOfWorkErr}
                            disabled={
                              !isCreatedByClient || isCompletedTaskClicked
                            }
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Type of Work
                              {/* <span className="text-defaultRed">&nbsp;*</span> */}
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={typeOfWork === 0 ? "" : typeOfWork}
                              onChange={(e) => {
                                setTypeOfWork(e.target.value);
                              }}
                              // onBlur={(e: any) => {
                              //   if (e.target.value > 0) {
                              //     setTypeOfWorkErr(false);
                              //   }
                              // }}
                            >
                              {typeOfWorkDropdownData.map(
                                (i: any, index: number) => (
                                  <MenuItem value={i.value} key={index}>
                                    {i.label}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {/* {typeOfWorkErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )} */}
                          </FormControl>
                        </Grid>
                      )}
                      {type.Type === "Priority" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <FormControl
                            variant="standard"
                            sx={{ width: 300, mt: -0.3 }}
                            // error={priorityErr}
                            disabled={
                              !isCreatedByClient || isCompletedTaskClicked
                            }
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Priority
                              {/* <span className="text-defaultRed">&nbsp;*</span> */}
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={priority === 0 ? "" : priority}
                              onChange={(e) => setPriority(e.target.value)}
                              // onBlur={(e: any) => {
                              //   if (e.target.value > 0) {
                              //     setPriorityErr(false);
                              //   }
                              // }}
                            >
                              <MenuItem value={1}>High</MenuItem>
                              <MenuItem value={2}>Medium</MenuItem>
                              <MenuItem value={3}>Low</MenuItem>
                            </Select>
                            {/* {priorityErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )} */}
                          </FormControl>
                        </Grid>
                      )}
                      {type.Type === "ProcessName" && type.IsChecked && (
                        <Grid item xs={3} className="pt-4">
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            disabled={
                              !isCreatedByClient || isCompletedTaskClicked
                            }
                            options={processDropdownData}
                            value={
                              processDropdownData.find(
                                (i: any) => i.value === processName
                              ) || null
                            }
                            onChange={(e, value: any) => {
                              value && setProcessName(value.value);
                              setSubProcess(0);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Process Name"
                                // error={processNameErr}
                                // onBlur={(e) => {
                                //   if (processName > 0) {
                                //     setProcessNameErr(false);
                                //   }
                                // }}
                                // helperText={
                                //   processNameErr
                                //     ? "This is a required field."
                                //     : ""
                                // }
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
                            options={subProcessDropdownData}
                            disabled={
                              !isCreatedByClient || isCompletedTaskClicked
                            }
                            value={
                              subProcessDropdownData.find(
                                (i: any) => i.value === subProcess
                              ) || null
                            }
                            onChange={(e, value: any) => {
                              value && setSubProcess(value.value);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Sub Process"
                                // error={subProcessErr}
                                // onBlur={(e) => {
                                //   if (subProcess > 0) {
                                //     setSubProcessErr(false);
                                //   }
                                // }}
                                // helperText={
                                //   subProcessErr
                                //     ? "This is a required field."
                                //     : ""
                                // }
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {type.Type === "TaskName" && type.IsChecked && (
                        <Grid item xs={3} className="pt-0.5">
                          <TextField
                            label={
                              <span>
                                Task Name
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
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
                      {type.Type === "StartDate" && type.IsChecked && (
                        <Grid item xs={3} className="pt-[13px]">
                          <div
                            className={`inline-flex mb-[8px] mt-[-1px] muiDatepickerCustomizer w-full max-w-[300px] ${
                              startDateErr ? "datepickerError" : ""
                            }`}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Received Date"
                                disabled={
                                  !isCreatedByClient || isCompletedTaskClicked
                                }
                                onError={() => setStartDateErr(false)}
                                shouldDisableDate={isWeekend}
                                maxDate={dayjs(Date.now())}
                                value={
                                  startDate === "" ? null : dayjs(startDate)
                                }
                                onChange={(newDate: any) => {
                                  setStartDate(newDate.$d);
                                  setStartDateErr(false);
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
                                  setEndDate(nextDate);
                                }}
                                slotProps={{
                                  textField: {
                                    // helperText: startDateErr
                                    //   ? "This is a required field."
                                    //   : "",
                                    readOnly: true,
                                  } as Record<string, any>,
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                        </Grid>
                      )}
                      {type.Type === "EndDate" && type.IsChecked && (
                        <Grid item xs={3} className="pt-[13px]">
                          <div
                            className={`inline-flex mb-[8px] mt-[-1px] muiDatepickerCustomizer w-full max-w-[300px]`}
                            // ${
                            //   endDateErr ? "datepickerError" : ""
                            // }
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Due Date"
                                disabled
                                shouldDisableDate={isWeekend}
                                onError={() => setEndDateErr(false)}
                                value={endDate === "" ? null : dayjs(endDate)}
                                onChange={(newDate: any) => {
                                  setEndDate(newDate.$d);
                                  setEndDateErr(false);
                                }}
                                slotProps={{
                                  textField: {
                                    // helperText: endDateErr
                                    //   ? "This is a required field."
                                    //   : "",
                                    readOnly: true,
                                  } as Record<string, any>,
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                        </Grid>
                      )}
                      {type.Type === "Quantity" && type.IsChecked && (
                        <Grid item xs={3} className="pt-0">
                          <TextField
                            label="Quantity"
                            disabled={
                              !isCreatedByClient || isCompletedTaskClicked
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
                            value={quantity === 0 ? "" : quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value);
                              // setQuantityErr(false);
                            }}
                            // onBlur={(e: any) => {
                            //   if (
                            //     e.target.value.trim().length > 0 &&
                            //     e.target.value.trim().length < 5 &&
                            //     !e.target.value.trim().includes(".")
                            //   ) {
                            //     setQuantityErr(false);
                            //   }
                            // }}
                            // error={quantityErr}
                            // helperText={
                            //   quantityErr && quantity.toString().includes(".")
                            //     ? "Only intiger value allowed."
                            //     : quantityErr && quantity === ""
                            //     ? "This is a required field."
                            //     : quantityErr && quantity <= 0
                            //     ? "Enter valid number."
                            //     : quantityErr && quantity.length > 4
                            //     ? "Maximum 4 numbers allowed."
                            //     : ""
                            // }
                            margin="normal"
                            variant="standard"
                            sx={{ width: 300 }}
                          />
                        </Grid>
                      )}
                      {type.Type === "ReturnType" &&
                        type.IsChecked &&
                        typeOfWork === 3 && (
                          <Grid item xs={3} className="pt-3">
                            <FormControl
                              variant="standard"
                              sx={{ width: 300 }}
                              // error={returnTypeErr}
                              disabled={
                                !isCreatedByClient || isCompletedTaskClicked
                              }
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Return Type
                                {/* <span className="text-defaultRed">&nbsp;*</span> */}
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={returnType === 0 ? "" : returnType}
                                onChange={(e) => setReturnType(e.target.value)}
                                // onBlur={(e: any) => {
                                //   if (e.target.value > 0) {
                                //     setReturnTypeErr(false);
                                //   }
                                // }}
                              >
                                <MenuItem value={1}>Individual Return</MenuItem>
                                <MenuItem value={2}>Business Return</MenuItem>
                              </Select>
                              {/* {returnTypeErr && (
                                <FormHelperText>
                                  This is a required field.
                                </FormHelperText>
                              )} */}
                            </FormControl>
                          </Grid>
                        )}
                      {type.Type === "TypeOfReturn" &&
                        type.IsChecked &&
                        typeOfWork === 3 && (
                          <Grid item xs={3} className="pt-3">
                            <FormControl
                              variant="standard"
                              sx={{ width: 300 }}
                              // error={typeOfReturnErr}
                              disabled={
                                !isCreatedByClient || isCompletedTaskClicked
                              }
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Type of Return
                                {/* <span className="text-defaultRed">&nbsp;*</span> */}
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={typeOfReturn === 0 ? "" : typeOfReturn}
                                onChange={(e) =>
                                  setTypeOfReturn(e.target.value)
                                }
                                // onBlur={(e: any) => {
                                //   if (e.target.value > 0) {
                                //     setTypeOfReturnErr(false);
                                //   }
                                // }}
                              >
                                {typeOfReturnDropdownData.map(
                                  (i: any, index: number) => (
                                    <MenuItem value={i.value} key={index}>
                                      {i.label}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                              {/* {typeOfReturnErr && (
                                <FormHelperText>
                                  This is a required field.
                                </FormHelperText>
                              )} */}
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
                        (onEdit > 0 && isCompletedTaskClicked)
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
                              (onEdit > 0 && isCompletedTaskClicked)
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
                              (onEdit > 0 && isCompletedTaskClicked)
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
                          onClick={handleSubmitComment}
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
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Error Type
                                <span className="text-defaultRed">&nbsp;*</span>
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                disabled
                                value={2}
                              >
                                <MenuItem value={1}>Internal</MenuItem>
                                <MenuItem value={2}>External</MenuItem>
                              </Select>
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
                                value={
                                  field.RootCause === 0 ? "" : field.RootCause
                                }
                                disabled={field.isSolved}
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
                                value={
                                  field.NatureOfError === 0
                                    ? ""
                                    : field.NatureOfError
                                }
                                disabled={field.isSolved}
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
                                <MenuItem value={10}>Other</MenuItem>
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
                                value={
                                  field.Priority === 0 ? "" : field.Priority
                                }
                                disabled={field.isSolved}
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
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              type="number"
                              fullWidth
                              value={
                                field.ErrorCount === 0 ? "" : field.ErrorCount
                              }
                              disabled={field.isSolved}
                              onChange={(e) => handleErrorCountChange(e, index)}
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
