import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface BillingTypeProps {
  currTaskStatusData: any[];
}

const getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#F6F6F6",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            overflowX: "auto",
            whiteSpace: "nowrap",
          },
        },
      },
    },
  });

const Datatable_BillingType: React.FC<BillingTypeProps> = ({
  currTaskStatusData,
}) => {
  // Table Columns
  const columns = [
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Client Name</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "TypeOfWorkName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Type Of Work</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "BillingTypeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Billing Type</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Billing Type</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">
              {value === null || ""
                ? "-"
                : value === true
                ? "Active"
                : "Inactive"}
            </div>
          );
        },
      },
    },
    {
      name: "ContractedHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Contracted Hours</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "InternalHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Internal Hours</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
  ];

  // Table Customization Options
  const options: any = {
    filterType: "checkbox",
    responsive: "standard",
    tableBodyHeight: "60vh",
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    selectToolbarPlacement: "none",
    draggableColumns: {
      enabled: true,
      transitionTime: 300,
    },
    selectableRows: "none",
    elevation: 0,
    textLabels: {
      body: {
        noMatch: (
          <div className="flex items-start">
            <span>Currently there is no record</span>
          </div>
        ),
        toolTip: "",
      },
    },
  };

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={currTaskStatusData}
          columns={columns}
          title={undefined}
          options={options}
          data-tableid="taskStatusInfo_Datatable"
        />
      </ThemeProvider>
    </div>
  );
};

export default Datatable_BillingType;
