import {
  generateBillingStatusBodyRender,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generateDashboardReportBodyRender,
  generatePriorityWithColor,
  generateStatusWithColor,
} from "../CommonFunction";
import {
  generateCustomColumn,
  generateStatusColumn,
} from "./ColsGenerateFunctions";

const adminDashboardReportCols = [
  { header: "ClientName", label: "Client Name" },
  { header: "Accept", label: "Accept" },
  { header: "AcceptWithNotes", label: "Accept With Notes" },
  { header: "Errorlogs", label: "Errorlogs" },
  { header: "InProgress", label: "In Progress" },
  { header: "InReview", label: "In Review" },
  { header: "NotStarted", label: "Not Started" },
  { header: "OnHoldFromClient", label: "On Hold From Client" },
  { header: "PartialSubmitted", label: "Partial Submitted" },
  { header: "Rework", label: "Rework" },
  { header: "SignedOff", label: "Signed Off" },
  { header: "Stop", label: "Stop" },
  { header: "WithDraw", label: "WithDraw" },
  { header: "Total", label: "Total" },
].map((i: any) =>
  generateCustomColumn(i.header, i.label, generateDashboardReportBodyRender)
);

const adminDashboardBillingTypeCols = [
  { header: "ClientName", label: "Client Name" },
  { header: "TypeOfWorkName", label: "Type of Work" },
  { header: "BillingTypeName", label: "Billing Type" },
  { header: "Status", label: "Status" },
  { header: "ContractedHours", label: "Contracted Hours" },
  { header: "InternalHours", label: "Internal Hours" },
].map((i: any) =>
  generateCustomColumn(
    i.header,
    i.label,
    i.header === "Status"
      ? generateBillingStatusBodyRender
      : generateDashboardReportBodyRender
  )
);

const SummaryColConfig = [
  {
    name: "TaskName",
    label: "Task Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "ProjectName",
    label: "Project Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "ClientName",
    label: "Client Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "StatusName",
    label: "Status",
    bodyRenderer: (value: any, tableMeta: any) =>
      generateStatusWithColor(value, tableMeta.rowData[11]),
  },
  {
    name: "TaxReturnTypeName",
    label: "Return Type",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "WorkTypeName",
    label: "Type of Work",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "StartDate",
    label: "Start Date",
    bodyRenderer: generateCustomFormatDate,
  },
  {
    name: "EndDate",
    label: "Due Date",
    bodyRenderer: generateCustomFormatDate,
  },
  {
    name: "PriorityName",
    label: "Priority",
    bodyRenderer: generatePriorityWithColor,
  },
  {
    name: "AssignedByName",
    label: "Assigned By",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "AssignedToName",
    label: "Assigned To",
    bodyRenderer: generateCommonBodyRender,
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

const adminDashboardSummaryCols = SummaryColConfig.map((column: any) =>
  generateStatusColumn(column, 11)
);

const adminDashboardProjectStatusCols = SummaryColConfig.map((column: any) =>
  generateStatusColumn(column, 11)
);

const adminDashboardTaskStatusCols = SummaryColConfig.map((column: any) =>
  generateStatusColumn(column, 11)
);

export {
  adminDashboardReportCols,
  adminDashboardBillingTypeCols,
  adminDashboardSummaryCols,
  adminDashboardProjectStatusCols,
  adminDashboardTaskStatusCols,
};
