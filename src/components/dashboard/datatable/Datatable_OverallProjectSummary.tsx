import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import {
  handleChangePage,
  handleChangeRowsPerPage,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { dashboard_Options } from "@/utils/datatable/TableOptions";
import { dashboardOverallProjectSumCols } from "@/utils/datatable/columns/ClientDatatableColumns";

interface OverallProjectSummaryProps {
  onSelectedWorkType: number;
  onSelectedTaskStatus: string;
  onSelectedProjectIds: number[];
  onCurrselectedtaskStatus: string;
}

const Datatable_OverallProjectSummary: React.FC<OverallProjectSummaryProps> = ({
  onSelectedWorkType,
  onSelectedTaskStatus,
  onSelectedProjectIds,
  onCurrselectedtaskStatus,
}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableDataCount, setTableDataCount] = useState(0);

  // API for Project Status list
  const getOverallProjectSummaryData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/clientdashboard/overallprojectcompletionlist`,
        {
          PageNo: page + 1,
          PageSize: rowsPerPage,
          SortColumn: null,
          IsDesc: true,
          TypeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          ProjectIds: onSelectedProjectIds ? onSelectedProjectIds : [],
          Key: onCurrselectedtaskStatus
            ? onCurrselectedtaskStatus
            : onSelectedTaskStatus,
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
          setData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (onCurrselectedtaskStatus !== "" || onSelectedTaskStatus !== "") {
      getOverallProjectSummaryData();
    }
  }, [
    onSelectedWorkType,
    onSelectedTaskStatus,
    onSelectedProjectIds,
    onCurrselectedtaskStatus,
    page,
    rowsPerPage,
  ]);

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={data}
          columns={dashboardOverallProjectSumCols}
          title={undefined}
          options={dashboard_Options}
          data-tableid="taskStatusInfo_Datatable"
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

export default Datatable_OverallProjectSummary;
