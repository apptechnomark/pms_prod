import {
  generateBillingStatusBodyRender,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generateCustomHeaderName,
  generateDashboardReportBodyRender,
  generatePriorityWithColor,
  generateRatingsBodyRender,
  generateStatusWithColor,
} from "../CommonFunction";

const adminDashboardReportCols: any = [
  {
    name: "ClientName",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Client Name"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "Accept",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Accept"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "AcceptWithNotes",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () =>
        generateCustomHeaderName("Accept With Notes"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "Errorlogs",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Errorlogs"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "InProgress",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("In Progress"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "InReview",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("In Review"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "NotStarted",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Not Started"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "OnHoldFromClient",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () =>
        generateCustomHeaderName("On Hold From Client"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "PartialSubmitted",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () =>
        generateCustomHeaderName("Partial Submitted"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "Rework",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Rework"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "SignedOff",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Signed Off"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "Stop",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Stop"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "WithDraw",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("WithDraw"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
  {
    name: "Total",
    options: {
      filter: true,
      sort: true,
      viewColumns: false,
      customHeadLabelRender: () => generateCustomHeaderName("Total"),
      customBodyRender: (value: any) => {
        return generateDashboardReportBodyRender(value);
      },
    },
  },
];

const adminDashboardBillingTypeCols: any = [
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
    name: "TypeOfWorkName",
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
    name: "BillingTypeName",
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
    name: "Status",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any) => {
        return generateBillingStatusBodyRender(value);
      },
    },
  },
  {
    name: "ContractedHours",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Contracted Hours"),
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
        return generateCommonBodyRender(value);
      },
    },
  },
];

const adminDashboardSummaryCols: any = [
  {
    name: "TaskName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task Name"),
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
      customHeadLabelRender: () => generateCustomHeaderName("Project Name"),
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[11]),
    },
  },
  {
    name: "TaxReturnTypeName",
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
    name: "WorkTypeName",
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
    name: "EndDate",
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
    name: "PriorityName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Priority"),
      customBodyRender: (value: any) => generatePriorityWithColor(value),
    },
  },
  {
    name: "AssignedByName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Assigned By"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "AssignedToName",
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
    name: "StatusColorCode",
    options: {
      filter: false,
      sort: false,
      display: false,
    },
  },
];

const adminDashboardProjectStatusCols = [
  {
    name: "TaskName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task Name"),
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
      customHeadLabelRender: () => generateCustomHeaderName("Project Name"),
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[11]),
    },
  },
  {
    name: "TaxReturnTypeName",
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
    name: "WorkTypeName",
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
    name: "EndDate",
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
    name: "PriorityName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Priority"),
      customBodyRender: (value: any) => generatePriorityWithColor(value),
    },
  },
  {
    name: "AssignedByName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Assigned By"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "AssignedToName",
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
    name: "StatusColorCode",
    options: {
      filter: false,
      sort: false,
      display: false,
    },
  },
];

const adminDashboardTaskStatusCols = [
  {
    name: "TaskName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Task Name"),
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
      customHeadLabelRender: () => generateCustomHeaderName("Project Name"),
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[11]),
    },
  },
  {
    name: "TaxReturnTypeName",
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
    name: "WorkTypeName",
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
    name: "EndDate",
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
    name: "PriorityName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Priority"),
      customBodyRender: (value: any) => generatePriorityWithColor(value),
    },
  },
  {
    name: "AssignedByName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Assigned By"),
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
  },
  {
    name: "AssignedToName",
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
    name: "StatusColorCode",
    options: {
      filter: false,
      sort: false,
      display: false,
    },
  },
];



export {
  adminDashboardReportCols,
  adminDashboardBillingTypeCols,
  adminDashboardSummaryCols,
  adminDashboardProjectStatusCols,
  adminDashboardTaskStatusCols,
};
