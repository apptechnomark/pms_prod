import { ThemeProvider } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { callAPI } from "@/utils/API/callAPI";
import { report_Options } from "@/utils/datatable/TableOptions";
import { reportDatatableTaskCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  PageNo: pageNo,
  PageSize: pageSize,
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
  const [allFields, setAllFields] = useState<any>({
    loaded: false,
    taskData: [],
    page: 0,
    rowsPerPage: pageSize,
    tableDataCount: 0,
  });
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setAllFields({
      ...allFields,
      page: newPage,
    });
    setFilteredOject({ ...filteredObject, PageNo: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilteredOject({
      ...filteredObject,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchData) {
      setAllFields({
        ...allFields,
        taskData: onSearchData,
      });
    } else {
      getTaskList();
    }
  }, [onSearchData]);

  // TaskList API
  const getTaskList = async () => {
    const params = filteredObject;
    const url = `${process.env.report_api_url}/report/client/task`;
    const successCallback = (ResponseData: any, error: any) => {
      if (ResponseData !== null && error === false) {
        onHandleExport(ResponseData.List.length > 0);
        setAllFields({
          ...allFields,
          loaded: true,
          taskData: ResponseData.List,
          tableDataCount: ResponseData.TotalCount,
        });
      } else {
        setAllFields({
          ...allFields,
          loaded: false,
        });
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    setFilteredOject({ ...filteredObject, ...currentFilterData });
  }, [currentFilterData]);

  useEffect(() => {
    getTaskList();
  }, [filteredObject]);

  return allFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={allFields.taskData}
        columns={reportDatatableTaskCols}
        title={undefined}
        options={{
          ...report_Options,
        }}
        data-tableid="task_Report_Datatable"
      />
      <TablePagination
        component="div"
        // rowsPerPageOptions={[5, 10, 15]}
        count={allFields.tableDataCount}
        page={allFields.page}
        onPageChange={handleChangePage}
        rowsPerPage={allFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default Datatable_Task;
