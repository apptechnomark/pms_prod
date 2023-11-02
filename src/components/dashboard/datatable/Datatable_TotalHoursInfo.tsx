import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface TotalHoursInfoProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
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

const Datatable_TotalHoursInfo: React.FC<TotalHoursInfoProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
}) => {
  const [data, setData] = useState<any | any[]>([]);

  // API Call
  useEffect(() => {
    // if (onSelectedProjectIds.length > 0) {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/clienttotalhoursinformationlist`,
          {
            projectIds: onSelectedProjectIds,
            typeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (
          response.status === 200 &&
          response.data.ResponseStatus === "Success"
        ) {
          setData(response.data.ResponseData);
        } else {
          const errorMessage = response.data.Message || "Something went wrong.";
          toast.error(errorMessage);
        }
      } catch (error) {
        toast.error("Error fetching data. Please try again later.");
      }
    };

    // Fetch data when component mounts
    getData();
    // }
  }, [onSelectedProjectIds, onSelectedWorkType]);

  // extracting data
  const { ClientDetail, ClientProjectDetails } = data;
  const tableData = [];

  // Add ClientDetail as the first row
  if (ClientDetail) {
    tableData.push({
      ProjectName: <span className="font-extrabold">Project List</span>,
      TaskName: <span className="font-extrabold">Task List</span>,
      ContractedTotalHours: ClientDetail.ContractedTotalHours || "--",
      ContractedAccountingHrs: ClientDetail.ContractedAccountingHrs || "--",
      ContractedAuditHrs: ClientDetail.ContractedAuditHrs || "--",
      ContractedTaxHrs: ClientDetail.ContractedTaxHrs || "--",
      ActualAccountingHrs: ClientDetail.ActualAccountingHrs || null,
      ActualAuditHrs: ClientDetail.ActualAuditHrs || null,
      ActualTaxHrs: ClientDetail.ActualTaxHrs || null,
      ActualTotalHours: ClientDetail.ActualTotalHours || "--",
    });
  }

  // Add ClientProjectDetails as subsequent rows
  if (ClientProjectDetails && ClientProjectDetails.length > 0) {
    ClientProjectDetails.forEach((project: any) => {
      tableData.push({
        ProjectName: project.ProjectName || null,
        TaskName: project.TaskName || null,
        ContractedTotalHours: project.ContractedTotalHours || null,
        ContractedAccountingHrs: project.ContractedAccountingHrs || null,
        ContractedAuditHrs: project.ContractedAccountingHrs || null,
        ContractedTaxHrs: project.ContractedTaxHrs || null,
        ActualAccountingHrs: project.ActualAccountingHrs || null,
        ActualTaxHrs: project.ActualTaxHrs || null,
        ActualAuditHrs: project.ActualAuditHrs || null,
      });
    });
  }

  // Table Columns
  const columns = [
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Project Name</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value}</div>;
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Task Name</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value}</div>;
        },
      },
    },
    {
      name: "ContractedTotalHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Total Cont. Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "" : value}</div>;
        },
      },
    },
    {
      name: "ContractedAccountingHrs",
      options: {
        filter: true,
        sort: true,
        display:
          onSelectedWorkType === 0 || onSelectedWorkType === 1 ? true : false,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Cont. Acc. Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "" : value}</div>;
        },
      },
    },
    {
      name: "ContractedTaxHrs",
      options: {
        filter: true,
        sort: true,
        display:
          onSelectedWorkType === 0 || onSelectedWorkType === 3 ? true : false,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Cont. Tax Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "" : value}</div>;
        },
      },
    },
    {
      name: "ContractedAuditHrs",
      options: {
        filter: true,
        sort: true,
        display:
          onSelectedWorkType === 0 || onSelectedWorkType === 2 ? true : false,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Cont. Audit Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "" : value}</div>;
        },
      },
    },
    {
      name: "ActualAccountingHrs",
      options: {
        filter: true,
        sort: true,
        display:
          onSelectedWorkType === 0 || onSelectedWorkType === 1 ? true : false,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Account Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "--" : value}</div>;
        },
      },
    },
    {
      name: "ActualTaxHrs",
      options: {
        filter: true,
        sort: true,
        display:
          onSelectedWorkType === 0 || onSelectedWorkType === 3 ? true : false,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Tax Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "--" : value}</div>;
        },
      },
    },
    {
      name: "ActualAuditHrs",
      options: {
        filter: true,
        sort: true,
        display:
          onSelectedWorkType === 0 || onSelectedWorkType === 2 ? true : false,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Audit Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "--" : value}</div>;
        },
      },
    },
    {
      name: "ActualTotalHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Total Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div className="ml-2">{value === null ? "" : value}</div>;
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
          data={tableData}
          columns={columns}
          title={undefined}
          options={options}
          data-tableid="totalHoursInfo_Datatable"
        />
      </ThemeProvider>
    </div>
  );
};

export default Datatable_TotalHoursInfo;
