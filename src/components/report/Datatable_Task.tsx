import { ThemeProvider } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { callAPI } from "@/utils/API/callAPI";
import { report_Options } from "@/utils/datatable/TableOptions";
import { reportDatatableTaskCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const pageNoReportTask = 1;
const pageSizeReportTask = 10;

const initialReportTaskFilter = {
  PageNo: pageNoReportTask,
  PageSize: pageSizeReportTask,
  GlobalSearch: null,
  IsDesc: false,
  SortColumn: null,
  Priority: null,
  StatusFilter: null,
  OverDueBy: 1,
  WorkType: null,
  AssignedIdsForFilter: [],
  ProjectIdsForFilter: [],
  StartDate: null,
  EndDate: null,
  IsDownload: false,
};

const Datatable_Task = ({
  currentFilterData,
  onSearchData,
  onHandleExport,
}: any) => {
  const [allReportTaskFields, setAllReportTaskFields] = useState<any>({
    loaded: true,
    taskData: [],
    page: 0,
    rowsPerPage: pageSizeReportTask,
    tableDataCount: 0,
  });
  const [filteredObjectReportTask, setFilteredOjectReportTask] = useState<any>(
    initialReportTaskFilter
  );

  // functions for handling pagination
  const handleChangePageReportTask = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setAllReportTaskFields({
      ...allReportTaskFields,
      page: newPage,
    });
    setFilteredOjectReportTask({
      ...filteredObjectReportTask,
      PageNo: newPage + 1,
    });
  };

  const handleChangeRowsPerPageReportTask = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilteredOjectReportTask({
      ...filteredObjectReportTask,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchData) {
      setAllReportTaskFields({
        ...allReportTaskFields,
        taskData: onSearchData,
      });
    } else {
      getReportTaskList();
    }
  }, [onSearchData]);

  // TaskList API
  const getReportTaskList = async () => {
    setAllReportTaskFields({
      ...allReportTaskFields,
      loaded: false,
    });
    const params = filteredObjectReportTask;
    const url = `${process.env.report_api_url}/report/client/task`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (
        ResponseStatus === "Success" &&
        ResponseData.List.length > 0 &&
        error === false
      ) {
        onHandleExport(ResponseData.List.length > 0);
        setAllReportTaskFields({
          ...allReportTaskFields,
          loaded: true,
          taskData: ResponseData.List,
          tableDataCount: ResponseData.TotalCount,
        });
      } else {
        setAllReportTaskFields({
          ...allReportTaskFields,
          loaded: true,
        });
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    setFilteredOjectReportTask({
      ...filteredObjectReportTask,
      ...currentFilterData,
    });
  }, [currentFilterData]);

  useEffect(() => {
    getReportTaskList();
  }, [filteredObjectReportTask]);

  return allReportTaskFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={allReportTaskFields.taskData}
        columns={reportDatatableTaskCols}
        title={undefined}
        options={{
          ...report_Options,
        }}
        data-tableid="task_Report_Datatable"
      />
      <TablePagination
        component="div"
        count={allReportTaskFields.tableDataCount}
        page={allReportTaskFields.page}
        onPageChange={handleChangePageReportTask}
        rowsPerPage={allReportTaskFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPageReportTask}
      />
    </ThemeProvider>
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default Datatable_Task;
