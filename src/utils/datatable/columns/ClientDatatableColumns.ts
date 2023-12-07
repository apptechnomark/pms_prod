import {
  generateCommonBodyRender,
  generateCustomFormatDate,
  generateCustomHeaderName,
  generateDaysBodyRender,
  generatePriorityWithColor,
  generateStatusWithColor,
} from "../CommonFunction";

const dashboardOnHoldCols = [
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
    name: "DueFrom",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Due From"),
      customBodyRender: (value: any) => {
        return generateDaysBodyRender(value);
      },
    },
  },
];

const dashboardOverduCols = [
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
    name: "CloseMonth",
    options: {
      filter: true,
      sort: true,
      display: false,
      // display: onSelectedWorkType === 3 ? false : true,
      customHeadLabelRender: () => generateCustomHeaderName("Month Close"),
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
    name: "DueFrom",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Due From"),
      customBodyRender: (value: any) => {
        return generateDaysBodyRender(value);
      },
    },
  },
];

const dashboardOverallProjectSumCols = [
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[10]),
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
      customHeadLabelRender: () => generateCustomHeaderName("End Date"),
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

const dashboardPriorityInfoCols = [
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
      customHeadLabelRender: () => generateCustomHeaderName("End Date"),
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
      customHeadLabelRender: () => generateCustomHeaderName("Type of Work"),
      customBodyRender: (value: any) => {
        return generateCustomFormatDate(value);
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
        generateStatusWithColor(value, tableMeta.rowData[9]),
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

const dashboardReturnTypeCols = [
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
      customHeadLabelRender: () => generateCustomHeaderName("End Date"),
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[9]),
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

const dashboardSummaryListCols = [
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[10]),
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
      customHeadLabelRender: () => generateCustomHeaderName("End Date"),
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

const dashboardTaskStatusInfoCols = [
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
      customHeadLabelRender: () => generateCustomHeaderName("End Date"),
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
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[9]),
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

const datatableWorklogCols = [
  {
    name: "WorkitemId",
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
    name: "PriorityName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Priority"),
      customBodyRender: (value: any) => generatePriorityWithColor(value),
    },
  },
  {
    name: "StatusName",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Status"),
      customBodyRender: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[9]),
    },
  },
  {
    name: "Quantity",
    options: {
      filter: true,
      sort: true,
      customHeadLabelRender: () => generateCustomHeaderName("Qty."),
    },
    customBodyRender: (value: any) => {
      return generateCommonBodyRender(value);
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
    name: "StatusColorCode",
    options: {
      display: false,
    },
  },
  {
    name: "IsCreatedByClient",
    options: {
      display: false,
    },
  },
];

export {
  dashboardOnHoldCols,
  dashboardOverduCols,
  dashboardOverallProjectSumCols,
  dashboardPriorityInfoCols,
  dashboardReturnTypeCols,
  dashboardSummaryListCols,
  dashboardTaskStatusInfoCols,
  datatableWorklogCols,
};
