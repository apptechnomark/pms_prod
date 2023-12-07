import {
  generateCommonBodyRender,
  generateCustomFormatDate,
  generateCustomHeaderName,
  generateDateWithTime,
  generateDateWithoutTime,
  generateDaysBodyRender,
  generateInitialTimer,
  generateIsLoggedInBodyRender,
  generatePriorityWithColor,
  generateRatingsBodyRender,
  generateStatusWithColor,
} from "../CommonFunction";

const reportDatatatbleRatingCols: any = [
  {
    name: "WorkItemId",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task ID"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProjectName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Project"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "TaskName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProcessName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Process"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ReturnTypes",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Return Type"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "RatingOn",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Rating Date"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
      },
    },
  },
  {
    name: "DateSubmitted",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Date Submitted"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
      },
    },
  },
  {
    name: "HoursLogged",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Hours Logged"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "Ratings",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Ratings"),
      customBodyRender: (value: any) => {
        return generateRatingsBodyRender(value);
      },
    },
  },
  {
    name: "Comments",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Comments"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
];

const reportDatatableTaskCols: any = [
  {
    name: "WorkItemId",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task ID"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProjectName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Project"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "TaskName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProcessName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Process"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "Type",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Type"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "Priority",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Priority"),
      customBodyRender: (value: any) => generatePriorityWithColor(value),
    },
  },
  {
    name: "Status",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[11]),
    },
  },
  {
    name: "AssignedTo",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Assigned To"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "HoursLogged",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Hours Logged"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "StartDate",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Start Date"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
      },
    },
  },
  {
    name: "DueDate",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Due Date"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
      },
    },
  },
  {
    name: "ColorCode",
    options: {
      display: false,
    },
  },
];

const reportsAuditCols: any[] = [
  {
    name: "UserName",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("User Name"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "DepartmentName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Department"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "TaskCreatedDate",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () =>
        generateCustomHeaderName("Task Created Date"),
      customBodyRender: (value: any) => {
        return generateDateWithoutTime(value);
      },
    },
  },
  {
    name: "LoginTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Login Time"),
      customBodyRender: (value: any, tableMeta: any) => {
        return generateDateWithTime(value);
      },
    },
  },
  {
    name: "LogoutTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Logout Time"),
      customBodyRender: (value: any) => {
        return generateDateWithTime(value);
      },
    },
  },
  {
    name: "ClientName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Client"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProjectName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Project"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProcessName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Process"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "SubProcessName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Sub-Process"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "StandardTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Std. Time"),
    },
    customBodyRender: (value: any) => {
      return generateInitialTimer(value);
    },
  },
  {
    name: "TotalTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Total Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "TotalBreakTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Break Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "TotalIdleTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Idle Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
];

const reportsClientCols: any[] = [
  {
    name: "ClientName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Client Name"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "WorkType",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Type of Work"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "BillingType",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Billing Type"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "InternalHours",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Internal Hours"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "ContractedHours",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Cont. Hours"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "StandardTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Std. Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "EditHours",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Edited Hours"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "TotalTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Total Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "DifferenceTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Differences"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "ContractedDifference",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Cont. Diff"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
];

const reportsProjectsCols: any[] = [
  {
    name: "ProjectName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Project"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ClientName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Client Name"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "WorkType",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Type of Work"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "BillingType",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Billing Type"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "InternalHours",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Internal Hours"),
      customBodyRender: (value: any, tableMeta: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "StandardTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Std. Time"),
      customBodyRender: (value: any, tableMeta: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "EditHours",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Edited Hours"),
      customBodyRender: (value: any, tableMeta: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "TotalTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Total Time"),
      customBodyRender: (value: any, tableMeta: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "DifferenceTime",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Difference"),
      customBodyRender: (value: any, tableMeta: any) => {
        return generateInitialTimer(value);
      },
    },
  },
];

const reportsRatingCols: any = [
  {
    name: "WorkItemId",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task ID"),

      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ClientName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Client"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ProjectName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Project"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "TaskName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ReturnTypes",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Return Type"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "RatingOn",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Rating Date"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
      },
    },
  },
  {
    name: "DateSubmitted",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Date Submitted"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
      },
    },
  },
  {
    name: "HoursLogged",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Hours Logged"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "Ratings",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Ratings"),
      customBodyRender: (value: any) => {
        return generateRatingsBodyRender(value);
      },
    },
  },
  {
    name: "Comments",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Comments"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
];

const reportsUserLogsCols: any[] = [
  {
    name: "UserName",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("User Name"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "ReportingManager",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Reporting To"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "DepartmentName",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Department"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "LoginTime",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Login"),
      customBodyRender: (value: any) => {
        return generateDateWithTime(value);
      },
    },
  },
  {
    name: "LogoutTime",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Logout"),
      customBodyRender: (value: any) => {
        return generateDateWithTime(value);
      },
    },
  },
  {
    name: "TotalIdleTime",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Idle Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "TotalBreakTime",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Break Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "TotalProductiveTime",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Productive Time"),
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
  },
  {
    name: "IsLoggedIn",
    options: {
      sort: true,
      filter: true,
      customHeadLabelRender: () => generateCustomHeaderName("Is Logged In"),
      customBodyRender: (value: any) => generateIsLoggedInBodyRender(value),
    },
  },
];



export {
  reportDatatatbleRatingCols,
  reportDatatableTaskCols,
  reportsAuditCols,
  reportsClientCols,
  reportsProjectsCols,
  reportsRatingCols,
  reportsUserLogsCols,
};
