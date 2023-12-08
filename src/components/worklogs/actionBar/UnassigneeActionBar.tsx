import React, { useEffect, useState } from "react";
import { Avatar, Card, InputBase, List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import Assignee from "@/assets/icons/worklogs/Assignee";
import Minus from "@/assets/icons/worklogs/Minus";
import Priority from "@/assets/icons/worklogs/Priority";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";
import Recurring from "@/assets/icons/worklogs/Recurring";
import Comments from "@/assets/icons/worklogs/Comments";
import SearchIcon from "@/assets/icons/SearchIcon";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import ClientIcon from "@/assets/icons/worklogs/ClientIcon";
import ProjectIcon from "@/assets/icons/worklogs/ProjectIcon";
import ProcessIcon from "@/assets/icons/worklogs/ProcessIcon";
import ReturnYearIcon from "@/assets/icons/worklogs/ReturnYearIcon";
import ManagerIcon from "@/assets/icons/worklogs/ManagerIcon";
import DateIcon from "@/assets/icons/worklogs/DateIcon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getYears, hasPermissionWorklog } from "@/utils/commonFunction";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getClientDropdownData,
  getManagerDropdownData,
  getProjectDropdownData,
  getSubProcessDropdownData,
} from "@/utils/commonDropdownApiCall";

const priorityOptions = [
  { id: 3, text: "Low" },
  { id: 2, text: "Medium" },
  { id: 1, text: "High" },
];

const UnassigneeActionBar = ({
  selectedRowsCount,
  selectedRows,
  selectedRowStatusId,
  selectedRowId,
  selectedRowClientId,
  selectedRowWorkTypeId,
  selectedRowIds,
  onEdit,
  handleClearSelection,
  onRecurring,
  onComment,
  workItemData,
  getWorkItemList,
}: any) => {
  const yearDropdown = getYears();
  const [searchQuery, setSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [projectSearchQuery, setprojectSearchQuery] = useState("");
  const [processSearchQuery, setprocessSearchQuery] = useState("");
  const [subProcessSearchQuery, setSubProcessSearchQuery] = useState("");
  const [assignee, setAssignee] = useState<any | any[]>([]);
  const [allStatus, setAllStatus] = useState<any | any[]>([]);
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [managerDropdownData, setManagerDropdownData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);

  const [anchorElPriority, setAnchorElPriority] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElAssignee, setAnchorElAssignee] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElStatus, setAnchorElStatus] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElClient, setAnchorElClient] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElProject, setAnchorElProject] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElProcess, setAnchorElProcess] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElSubProcess, setAnchorElSubProcess] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElReturnYear, setAnchorElReturnYear] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElManager, setAnchorElManager] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElDateReceived, setAnchorElDateReceived] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickPriority = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPriority(event.currentTarget);
  };

  const handleClosePriority = () => {
    setAnchorElPriority(null);
  };

  const handleClickAssignee = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAssignee(event.currentTarget);
  };

  const handleCloseAssignee = () => {
    setAnchorElAssignee(null);
  };

  const handleClickStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElStatus(event.currentTarget);
    getAllStatus();
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const handleClickClient = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElClient(event.currentTarget);
    getClientData();
  };

  const handleCloseClient = () => {
    setAnchorElClient(null);
  };

  const handleClickProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProject(event.currentTarget);
  };

  const handleCloseProject = () => {
    setAnchorElProject(null);
  };

  const handleClickProcess = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProcess(event.currentTarget);
  };

  const handleCloseProcess = () => {
    setAnchorElProcess(null);
  };

  const handleClickSubProcess = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElSubProcess(event.currentTarget);
  };

  const handleCloseSubProcess = () => {
    setAnchorElSubProcess(null);
  };

  const handleClickReturnYear = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElReturnYear(event.currentTarget);
  };

  const handleCloseReturnYear = () => {
    setAnchorElReturnYear(null);
  };

  const handleClickManager = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElManager(event.currentTarget);
    getManagerData();
  };

  const handleCloseManager = () => {
    setAnchorElManager(null);
  };

  const handleClickDateReceived = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElDateReceived(event.currentTarget);
  };

  const handleCloseDateReceived = () => {
    setAnchorElDateReceived(null);
  };

  const openPriority = Boolean(anchorElPriority);
  const idPriority = openPriority ? "simple-popover" : undefined;

  const openAssignee = Boolean(anchorElAssignee);
  const idAssignee = openAssignee ? "simple-popover" : undefined;

  const openStatus = Boolean(anchorElStatus);
  const idStatus = openStatus ? "simple-popover" : undefined;

  const openClient = Boolean(anchorElClient);
  const idClient = openClient ? "simple-popover" : undefined;

  const openProject = Boolean(anchorElProject);
  const idProject = openProject ? "simple-popover" : undefined;

  const openProcess = Boolean(anchorElProcess);
  const idProcess = openProcess ? "simple-popover" : undefined;

  const openSubProcess = Boolean(anchorElSubProcess);
  const idSubProcess = openSubProcess ? "simple-popover" : undefined;

  const openReturnYear = Boolean(anchorElReturnYear);
  const idReturnYear = openReturnYear ? "simple-popover" : undefined;

  const openManager = Boolean(anchorElManager);
  const idManager = openManager ? "simple-popover" : undefined;

  const openDateReceived = Boolean(anchorElDateReceived);
  const idDateReceived = openDateReceived ? "simple-popover" : undefined;

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredAssignees = assignee?.filter((assignee: any) =>
    assignee.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSearchChange = (event: any) => {
    setClientSearchQuery(event.target.value);
  };

  const handleManagerSearchChange = (event: any) => {
    setManagerSearchQuery(event.target.value);
  };

  const handleProjectSearchChange = (event: any) => {
    setprojectSearchQuery(event.target.value);
  };

  const handleProcessSearchChange = (event: any) => {
    setprocessSearchQuery(event.target.value);
  };

  const handleSubProcessSearchChange = (event: any) => {
    setSubProcessSearchQuery(event.target.value);
  };

  const filteredClient = clientDropdownData?.filter((client: any) =>
    client.label.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const filteredManager = managerDropdownData?.filter((manager: any) =>
    manager.label.toLowerCase().includes(managerSearchQuery.toLowerCase())
  );

  const filteredProject = projectDropdownData?.filter((project: any) =>
    project.label.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  const filteredProcess = processDropdownData?.filter((process: any) =>
    process.label.toLowerCase().includes(processSearchQuery.toLowerCase())
  );

  const filteredSubProcess = subProcessDropdownData?.filter((subProcess: any) =>
    subProcess.Name.toLowerCase().includes(subProcessSearchQuery.toLowerCase())
  );

  // actions for priority popup
  const handleOptionPriority = (id: any) => {
    updatePriority(selectedRowIds, id);
    handleClosePriority();
  };

  const handleOptionAssignee = (id: any) => {
    updateAssignee(selectedRowIds, id);
    handleCloseAssignee();
  };

  const handleOptionStatus = (id: any) => {
    updateStatus(selectedRowIds, id);
    handleCloseStatus();
  };

  const handleOptionreturnYear = (id: any) => {
    updateReturnYear(selectedRowIds, id);
    handleCloseReturnYear();
  };

  const handleOptionManager = (id: any) => {
    updateManager(selectedRowIds, id);
    handleCloseManager();
  };

  const handleOptionClient = (id: any) => {
    updateClient(selectedRowIds, id);
    handleCloseClient();
  };

  const handleOptionProject = (id: any) => {
    updateProject(selectedRowIds, id);
    handleCloseProject();
  };

  const handleOptionProcess = (id: any) => {
    updateProcess(selectedRowIds, id);
    handleCloseProcess();
  };

  const handleOptionSubProcess = (id: any) => {
    updateSubProcess(selectedRowIds, id);
    handleCloseSubProcess();
  };

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

  // function for getting weekends
  const isWeekend = (date: any) => {
    const day = date.day();
    return day === 6 || day === 0;
  };

  // API for status dropdown in Filter Popup
  const getAllStatus = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/status/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setAllStatus(
            response.data.ResponseData.map((i: any) =>
              i.Type === "OnHoldFromClient" || i.Type === "WithDraw" ? i : ""
            ).filter((i: any) => i !== "")
          );
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for get Assignee with all conditions
  useEffect(() => {
    if (
      selectedRowClientId.length > 0 &&
      selectedRowWorkTypeId.length > 0 &&
      areAllValuesSame(selectedRowClientId) &&
      areAllValuesSame(selectedRowWorkTypeId)
    ) {
      const getAssignee = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.api_url}/user/GetAssigneeUserDropdown`,
            {
              ClientIds: selectedRowClientId,
              WorktypeId: selectedRowWorkTypeId[0],
              IsAll: selectedRowClientId.length > 1 ? true : false,
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
              setAssignee(response.data.ResponseData);
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Something went wrong, Please try again later..");
              } else {
                toast.error(data);
              }
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Something went wrong, Please try again later..");
            } else {
              toast.error(data);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };

      // calling function
      getAssignee();
    }
  }, [selectedRowClientId, selectedRowWorkTypeId]);

  // client Dropdown API
  const getClientData = async () => {
    setClientDropdownData(await getClientDropdownData());
  };

  const getManagerData = async () => {
    setManagerDropdownData(await getManagerDropdownData());
  };

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

  // Update Priority API
  const updatePriority = async (id: number[], priorityId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
        [7, 8, 9, 13].includes(statusId)
      );

      if (selectedRowsCount >= 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change Priority for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdatePriority`,
          {
            workitemIds: id,
            priority: priorityId,
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
            toast.success("Priority has been updated successfully.");
            // handleClearSelection();
            getWorkItemList();
          } else {
            toast.error(data || "Please try again later.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Please try again later.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Assignee
  const updateAssignee = async (id: number[], assigneeId: number) => {
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
        [7, 8, 9, 13].includes(statusId)
      );

      if (selectedRowsCount >= 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change Assignee for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateAssignee`,
          {
            workitemIds: id,
            assigneeId: assigneeId,
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
            toast.success("Assignee has been updated successfully.");
            // handleClearSelection();
            getWorkItemList();
          } else {
            toast.error(data || "Error duplicating task.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Error duplicating task.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update status
  const updateStatus = async (id: number[], statusId: number) => {
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const isInvalidStatus = selectedRowStatusId.some((status: number) =>
        [7, 8, 9, 13].includes(status)
      );

      const hasRunningTasks = workItemData.some((item: any) =>
        id.includes(item.WorkitemId)
          ? item.TimelogId !== null
            ? true
            : false
          : false
      );

      if (selectedRowsCount === 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else if (selectedRowsCount > 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else if (hasRunningTasks) {
        toast.warning("Cannot change status for running task.");
      } else {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateStatus`,
          {
            workitemIds: workItemData
              .map((item: any) =>
                id.includes(item.WorkitemId)
                  ? item.TimelogId === null &&
                    ![7, 8, 9, 13].includes(item.StatusId)
                    ? item.WorkitemId
                    : false
                  : undefined
              )
              .filter((i: any) => i !== undefined)
              .filter((i: any) => i !== false),
            statusId: statusId,
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
            toast.success("Status has been updated successfully.");
            // handleClearSelection();
            getWorkItemList();
          } else {
            toast.error(data || "Error duplicating task.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Error duplicating task.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Return Year
  const updateReturnYear = async (id: number[], retunYear: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemreturnyear`,
        {
          workitemIds: id,
          returnYear: retunYear,
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
          toast.success("Return Year has been updated successfully.");
          // handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Client
  const updateClient = async (id: number[], clientId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemclient`,
        {
          workitemIds: id,
          ClientId: clientId,
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
          toast.success("Client has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Process
  const updateProject = async (id: number[], processId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemproject`,
        {
          workitemIds: id,
          ProjectId: processId,
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
          toast.success("Project has been updated successfully.");
          // handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Process
  const updateProcess = async (id: number[], processId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemprocess`,
        {
          workitemIds: id,
          ProcessId: processId,
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
          toast.success("Process has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update SubProcess
  const updateSubProcess = async (id: number[], processId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemsubprocess`,
        {
          WorkitemIds: id,
          SubProcessId: processId,
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
          toast.success("Sub-Process has been updated successfully.");
          // handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Manager
  const updateManager = async (id: number[], manager: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemmanager`,
        {
          WorkitemIds: id,
          ManagerId: manager,
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
          toast.success("Manager has been updated successfully.");
          // handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update date
  const updateDate = async (id: number[], date: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const selectedDate = dayjs(date);
    let nextDate: any = selectedDate;
    if (selectedDate.day() === 4 || selectedDate.day() === 5) {
      nextDate = nextDate.add(4, "day");
    } else {
      nextDate = dayjs(date).add(2, "day").toDate();
    }
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemreceiverdate`,
        {
          WorkitemIds: id,
          ReceiverDate: dayjs(date).format("YYYY/MM/DD"),
          DueDate: dayjs(nextDate).format("YYYY/MM/DD"),
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
          toast.success("Reciever Date has been updated successfully.");
          // handleClearSelection();
          handleCloseDateReceived();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function for checking that All vlaues in the arrar are same or not
  function areAllValuesSame(arr: any[]) {
    return arr.every((value, index, array) => value === array[0]);
  }

  // function to fetch the only assignee which has logged in from the all data

  return (
    <div>
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-center">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg  w-[75%] bottom-0 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[40%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div className="flex flex-row z-10 h-8 justify-center w-[90%]">
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  selectedRowsCount === 1 &&
                  !selectedRowStatusId.some((statusId: number) =>
                    [7, 8, 9].includes(statusId)
                  ) && (
                    <ColorToolTip title="Edit" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 text-slatyGrey cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => {
                          onEdit(selectedRowId);
                        }}
                      >
                        <EditIcon />
                      </span>
                    </ColorToolTip>
                  )}

                <ColorToolTip title="Priority" arrow>
                  <span
                    aria-describedby={idPriority}
                    onClick={handleClickPriority}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                  >
                    <Priority />
                  </span>
                </ColorToolTip>

                {/* Priority Popover */}
                <Popover
                  id={idPriority}
                  open={openPriority}
                  anchorEl={anchorElPriority}
                  onClose={handleClosePriority}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <List>
                      {priorityOptions.map((option) => (
                        <span
                          key={option.id}
                          className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                        >
                          <span
                            className="p-1 cursor-pointer"
                            onClick={() => handleOptionPriority(option.id)}
                          >
                            {option.text}
                          </span>
                        </span>
                      ))}
                    </List>
                  </nav>
                </Popover>

                {/* if the selected client Ids and worktype ids are same then only the Assignee icon will show */}
                {areAllValuesSame(selectedRowClientId) &&
                  areAllValuesSame(selectedRowWorkTypeId) && (
                    <ColorToolTip title="Assignee" arrow>
                      <span
                        aria-describedby={idAssignee}
                        onClick={handleClickAssignee}
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                      >
                        <Assignee />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Assignee Popover */}
                <Popover
                  id={idAssignee}
                  open={openAssignee}
                  anchorEl={anchorElAssignee}
                  onClose={handleCloseAssignee}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <List>
                      {filteredAssignees.map((assignee: any) => {
                        return (
                          <span
                            key={assignee.value}
                            className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                          >
                            <span
                              className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                              onClick={() =>
                                handleOptionAssignee(assignee.value)
                              }
                            >
                              <Avatar
                                sx={{ width: 32, height: 32, fontSize: 14 }}
                              >
                                {assignee.label
                                  .split(" ")
                                  .map((word: any) =>
                                    word.charAt(0).toUpperCase()
                                  )
                                  .join("")}
                              </Avatar>

                              <span className="pt-[0.8px]">
                                {assignee.label}
                              </span>
                            </span>
                          </span>
                        );
                      })}
                    </List>
                    <div className="mr-4 ml-4 mb-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <span className="mr-2">
                          <SearchIcon />
                        </span>
                        <span>
                          <InputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                  </nav>
                </Popover>

                <ColorToolTip title="Status" arrow>
                  <span
                    aria-describedby={idStatus}
                    onClick={handleClickStatus}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                  >
                    <DetectorStatus />
                  </span>
                </ColorToolTip>

                {/* Status Popover */}
                <Popover
                  id={idStatus}
                  open={openStatus}
                  anchorEl={anchorElStatus}
                  onClose={handleCloseStatus}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <List>
                      {allStatus.map((option: any) => {
                        return (
                          <span
                            key={option.value}
                            className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                          >
                            <span
                              className="p-1 cursor-pointer"
                              onClick={() => handleOptionStatus(option.value)}
                            >
                              {option.label}
                            </span>
                          </span>
                        );
                      })}
                    </List>
                  </nav>
                </Popover>

                {hasPermissionWorklog("Reccuring", "View", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Recurring" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => onRecurring(true, selectedRowId)}
                      >
                        <Recurring />
                      </span>
                    </ColorToolTip>
                  )}

                {hasPermissionWorklog("Comment", "View", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Comments" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => onComment(true, selectedRowId)}
                      >
                        <Comments />
                      </span>
                    </ColorToolTip>
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
                    <ColorToolTip title="Client" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idClient}
                        onClick={handleClickClient}
                      >
                        <ClientIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Client Popover */}
                <Popover
                  id={idClient}
                  open={openClient}
                  anchorEl={anchorElClient}
                  onClose={handleCloseClient}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <div className="mr-4 ml-4 mt-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <span className="mr-2">
                          <SearchIcon />
                        </span>
                        <span>
                          <InputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={clientSearchQuery}
                            onChange={handleClientSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {clientDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredClient.map((client: any) => {
                          return (
                            <span
                              key={client.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() => handleOptionClient(client.value)}
                              >
                                <span className="pt-[0.8px]">
                                  {client.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

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
                    <ColorToolTip title="Project" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idProject}
                        onClick={handleClickProject}
                      >
                        <ProjectIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Process Popover */}
                <Popover
                  id={idProject}
                  open={openProject}
                  anchorEl={anchorElProject}
                  onClose={handleCloseProject}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <div className="mr-4 ml-4 mt-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <span className="mr-2">
                          <SearchIcon />
                        </span>
                        <span>
                          <InputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={projectSearchQuery}
                            onChange={handleProjectSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {projectDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredProject.map((project: any) => {
                          return (
                            <span
                              key={project.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionProject(project.value)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {project.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

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
                    <ColorToolTip title="Process" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idProcess}
                        onClick={handleClickProcess}
                      >
                        <ProcessIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Process Popover */}
                <Popover
                  id={idProcess}
                  open={openProcess}
                  anchorEl={anchorElProcess}
                  onClose={handleCloseProcess}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <div className="mr-4 ml-4 mt-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <span className="mr-2">
                          <SearchIcon />
                        </span>
                        <span>
                          <InputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={processSearchQuery}
                            onChange={handleProcessSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {processDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredProcess.map((process: any) => {
                          return (
                            <span
                              key={process.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionProcess(process.value)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {process.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

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
                    <ColorToolTip title="Sub-Process" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idSubProcess}
                        onClick={handleClickSubProcess}
                      >
                        <ProcessIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Sub-Process Popover */}
                <Popover
                  id={idSubProcess}
                  open={openSubProcess}
                  anchorEl={anchorElSubProcess}
                  onClose={handleCloseSubProcess}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <div className="mr-4 ml-4 mt-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <span className="mr-2">
                          <SearchIcon />
                        </span>
                        <span>
                          <InputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={subProcessSearchQuery}
                            onChange={handleSubProcessSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {subProcessDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredSubProcess.map((subProcess: any) => {
                          return (
                            <span
                              key={subProcess.Id}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionSubProcess(subProcess.Id)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {subProcess.Name}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

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
                    <ColorToolTip title="Return Year" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idReturnYear}
                        onClick={handleClickReturnYear}
                      >
                        <ReturnYearIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Return Year Popover */}
                <Popover
                  id={idReturnYear}
                  open={openReturnYear}
                  anchorEl={anchorElReturnYear}
                  onClose={handleCloseReturnYear}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <List>
                      {yearDropdown.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        yearDropdown.map((yr: any) => {
                          return (
                            <span
                              key={yr.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() => handleOptionreturnYear(yr.value)}
                              >
                                <span className="pt-[0.8px]">{yr.label}</span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

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
                    <ColorToolTip title="Manager" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idManager}
                        onClick={handleClickManager}
                      >
                        <ManagerIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Manager Popover */}
                <Popover
                  id={idManager}
                  open={openManager}
                  anchorEl={anchorElManager}
                  onClose={handleCloseManager}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <div className="mr-4 ml-4 mt-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <span className="mr-2">
                          <SearchIcon />
                        </span>
                        <span>
                          <InputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={managerSearchQuery}
                            onChange={handleManagerSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {managerDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredManager.map((manager: any) => {
                          return (
                            <span
                              key={manager.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionManager(manager.value)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {manager.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

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
                    <ColorToolTip title="Date Received" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idDateReceived}
                        onClick={handleClickDateReceived}
                      >
                        <DateIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Date Received Popover */}
                <Popover
                  id={idDateReceived}
                  open={openDateReceived}
                  anchorEl={anchorElDateReceived}
                  onClose={handleCloseDateReceived}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <div className="mx-4 my-2">
                      <div className="flex items-center h-16 rounded-md pl-2 flex-row">
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
                            className="b-lightgray"
                            shouldDisableDate={isWeekend}
                            maxDate={dayjs(Date.now())}
                            onChange={(newDate: any) =>
                              updateDate(selectedRowIds, newDate.$d)
                            }
                            slotProps={{
                              textField: {
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </nav>
                </Popover>
              </div>
              <div className="flex right-0 justify-end pr-3 pt-1 w-[60%]">
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

export default UnassigneeActionBar;
