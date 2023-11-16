import { getDates } from "@/utils/timerFunctions";

export const client_project_InitialFilter: any = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalFilter: "",
  typeOfWork: null,
  billType: null,
  clients: [],
  projects: [],
  department: null,
  isActive: true,
  showSubProject: false,
  isClientReport: false,
  isDownload: false,
  startDate: null,
  endDate: null,
};

export const user_InitialFilter: any = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  departmentId: null,
  isActive: true,
  users: [],
  startDate: getDates()[getDates().length - 7],
  endDate: getDates()[getDates().length - 1],
  isDownload: false,
};

export const timeSheet_InitialFilter: any = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  departmentId: null,
  isActive: true,
  users: [],
  startDate: getDates()[getDates().length - 5],
  endDate: getDates()[getDates().length - 1],
  isDownload: false,
};

export const workLoad_InitialFilter: any = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  departmentId: null,
  dateFilter: null,
  isDownload: false,
};

export const userLogs_InitialFilter: any = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  departmentId: null,
  isActive: true,
  users: [],
  dateFilter: null,
  isLoggedInFilter: 0,
  isDownload: false,
};

export const audit_InitialFilter: any = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  startDate: null,
  endDate: null,
  isDownload: false,
};

export const billingreport_InitialFilter = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  startDate: null,
  endDate: null,
  isDownload: false,
  clients: [],
  IsBTC: false,
  projects: [],
  returnTypeId: null,
  assigneeId: null,
  reviewerId: null,
  typeofReturnId: null,
  numberOfPages: null,
};

export const customreport_InitialFilter = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  projectIdsJSON: [],
  clientIdsJSON: [],
  processIdsJSON: [],
  assignedById: null,
  assigneeId: null,
  returnTypeId: null,
  typeOfReturnId: null,
  numberOfPages: null,
  returnYear: null,
  currentYear: null,
  reviewerId: null,
  complexity: null,
  priority: null,
  receivedDate: null,
  dueDate: null,
  allInfoDate: null,
  startDate: null,
  endDate: null,
  isDownload: false,
};

const Data = new Date();
export const rating_InitialFilter: any = {
  PageNo: 1,
  PageSize: 10,
  GlobalSearch: "",
  SortColumn: "",
  IsDesc: false,
  Projects: [],
  ReturnTypeId: null,
  TypeofReturnId: null,
  Ratings: null,
  Users: [],
  DepartmentId: null,
  DateSubmitted: null,
  StartDate: new Date(Data.getFullYear(), Data.getMonth(), 1),
  EndDate: Data,
};

export const getCurrentTabDetails = (
  activeTab: number,
  getBody?: boolean,
  lastTab?: string
) => {
  if (activeTab === 1) {
    return getBody ? client_project_InitialFilter : "project";
  }
  if (activeTab === 2) {
    return getBody ? user_InitialFilter : "user";
  }
  if (activeTab === 3) {
    return getBody ? timeSheet_InitialFilter : "timesheet";
  }
  if (activeTab === 4) {
    return getBody ? workLoad_InitialFilter : "workLoad";
  }
  if (activeTab === 5) {
    return getBody ? userLogs_InitialFilter : "userLog";
  }
  if (activeTab === 6) {
    return getBody ? audit_InitialFilter : "audit";
  }
  if (activeTab === 7) {
    return getBody ? billingreport_InitialFilter : "billing";
  }
  if (activeTab === 8) {
    return getBody ? customreport_InitialFilter : "custom";
  }
  if (activeTab === 9) {
    return getBody ? customreport_InitialFilter : "rating";
  }
};
