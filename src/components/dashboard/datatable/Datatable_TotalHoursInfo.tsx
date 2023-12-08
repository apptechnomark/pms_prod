import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  handleChangePage,
  handleChangeRowsPerPage,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { dashboard_Options } from "@/utils/datatable/TableOptions";

interface TotalHoursInfoProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
}

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
  const columnNames = [
    "ProjectName",
    "TaskName",
    "ContractedTotalHours",
    "ContractedAccountingHrs",
    "ContractedTaxHrs",
    "ContractedAuditHrs",
    "ActualAccountingHrs",
    "ActualTaxHrs",
    "ActualAuditHrs",
    "ActualTotalHours",
  ];

  const columns = columnNames.map((columnName) => {
    const displayCondition = (type: number) =>
      onSelectedWorkType === 0 || onSelectedWorkType === type;

    const options = {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => generateCommonBodyRender(value),
    };

    switch (columnName) {
      case "ProjectName":
        return {
          name: columnName,
          options: {
            ...options,
            customHeadLabelRender: () =>
              generateCustomHeaderName("Project Name"),
          },
        };
      case "TaskName":
        return {
          name: columnName,
          options: {
            ...options,
            customHeadLabelRender: () => generateCustomHeaderName("Task Name"),
          },
        };
      case "ContractedTotalHours":
      case "ActualTotalHours":
        return {
          name: columnName,
          options: {
            ...options,
            customHeadLabelRender: () =>
              generateCustomHeaderName(
                `Total ${
                  columnName === "ContractedTotalHours" ? "Cont. " : ""
                }Hours`
              ),
          },
        };
      default:
        return {
          name: columnName,
          options: {
            ...options,
            display: displayCondition(
              columnName.includes("Accounting")
                ? 1
                : columnName.includes("Tax")
                ? 3
                : columnName.includes("Audit")
                ? 2
                : 0
            ),
            customHeadLabelRender: () =>
              generateCustomHeaderName(
                `${
                  columnName.includes("Contracted") ? "Cont. " : ""
                }${columnName.replace("Actual", "")}`
              ),
          },
        };
    }
  });

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={tableData}
          columns={columns}
          title={undefined}
          options={dashboard_Options}
          data-tableid="totalHoursInfo_Datatable"
        />
        <TablePagination
          component="div"
          count={tableDataCount}
          page={page}
          onPageChange={(event: any, newPage) => {
            handleChangePage(event, newPage, setPage);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handleChangeRowsPerPage(event, setRowsPerPage, setPage);
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default Datatable_TotalHoursInfo;
