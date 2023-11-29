import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
} from "@/utils/datatable/CommonFunction";

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
  const [clientDetails, setClientDetails] = useState<any | any[]>([]);
  const [clientProjectDetails, setClientProjectDetails] = useState<any | any[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableDataCount, setTableDataCount] = useState(0);

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  // API Call
  useEffect(() => {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/clienttotalhoursinformationlist`,
          {
            PageNo: page + 1,
            PageSize: rowsPerPage,
            SortColumn: "",
            IsDesc: true,
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
          setClientDetails(response.data.ResponseData.ClientDetail);
          setClientProjectDetails(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
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
  }, [onSelectedProjectIds, onSelectedWorkType, page, rowsPerPage]);

  // extracting data
  const tableData = [];

  // Add ClientDetail as the first row
  if (clientDetails) {
    tableData.push({
      ProjectName: <span className="font-extrabold">Project List</span>,
      TaskName: <span className="font-extrabold">Task List</span>,
      ContractedTotalHours: clientDetails.ContractedTotalHours || "-",
      ContractedAccountingHrs: clientDetails.ContractedAccountingHrs || "-",
      ContractedAuditHrs: clientDetails.ContractedAuditHrs || "-",
      ContractedTaxHrs: clientDetails.ContractedTaxHrs || "-",
      ActualAccountingHrs: clientDetails.ActualAccountingHrs || null,
      ActualAuditHrs: clientDetails.ActualAuditHrs || null,
      ActualTaxHrs: clientDetails.ActualTaxHrs || null,
      ActualTotalHours: clientDetails.ActualTotalHours || "-",
    });
  }

  // Add ClientProjectDetails as subsequent rows
  if (clientProjectDetails && clientProjectDetails.length > 0) {
    clientProjectDetails.forEach((project: any) => {
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
        customHeadLabelRender: () => genrateCustomHeaderName("Project Name"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Task Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ContractedTotalHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          genrateCustomHeaderName("Total Cont. Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
        customHeadLabelRender: () =>
          genrateCustomHeaderName("Cont. Acc. Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
        customHeadLabelRender: () => genrateCustomHeaderName("Cont. Tax Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
        customHeadLabelRender: () =>
          genrateCustomHeaderName("Cont. Audit Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
        customHeadLabelRender: () => genrateCustomHeaderName("Account Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
        customHeadLabelRender: () => genrateCustomHeaderName("Tax Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
        customHeadLabelRender: () => genrateCustomHeaderName("Audit Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ActualTotalHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Hours"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
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
    pagination: false,
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
        <TablePagination
          component="div"
          // rowsPerPageOptions={[5, 10, 15]}
          count={tableDataCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
    </div>
  );
};

export default Datatable_TotalHoursInfo;
