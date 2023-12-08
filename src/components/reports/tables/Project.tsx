import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { callAPI } from "@/utils/API/callAPI";
import { FieldsType } from "../types/FieldsType";
import { options } from "@/utils/datatable/TableOptions";
import ReportLoader from "@/components/common/ReportLoader";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { TablePagination, ThemeProvider } from "@mui/material";
import { client_project_InitialFilter } from "@/utils/reports/getFilters";
import { reportsProjectsCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const project_InitialFilter = {
  ...client_project_InitialFilter,
  isClientReport: false,
};

const Project = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [projectFields, setProjectFields] = useState<FieldsType>({
    loaded: false,
    page: 0,
    rowsPerPage: 10,
    data: [],
    dataCount: 0,
  });

  const getData = async (arg1: any) => {
    const url = `${process.env.report_api_url}/report/project`;

    const successCallback = (data: any, error: any) => {
      if (data !== null && error === false) {
        onHandleExport(data.List.length > 0);
        setProjectFields({
          ...projectFields,
          loaded: true,
          data: data.List,
          dataCount: data.TotalCount,
        });
      } else {
        setProjectFields({ ...projectFields, loaded: false });
      }
    };

    callAPI(url, arg1, successCallback, "post");
  };

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setProjectFields({ ...projectFields, page: newPage });
    if (filteredData !== null) {
      getData({
        ...filteredData,
        pageNo: newPage + 1,
        pageSize: projectFields.rowsPerPage,
      });
    } else {
      getData({
        ...project_InitialFilter,
        pageNo: newPage + 1,
        pageSize: projectFields.rowsPerPage,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectFields({
      ...projectFields,
      page: 0,
      rowsPerPage: parseInt(event.target.value),
    });
    if (filteredData !== null) {
      getData({
        ...filteredData,
        pageNo: 1,
        pageSize: projectFields.rowsPerPage,
      });
    } else {
      getData({
        ...project_InitialFilter,
        pageNo: 1,
        pageSize: event.target.value,
      });
    }
  };

  useEffect(() => {
    getData(project_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, globalSearch: searchValue });
      setProjectFields({
        ...projectFields,
        page: 0,
        rowsPerPage: 10,
      });
    } else {
      getData({ ...project_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  return projectFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        columns={reportsProjectsCols}
        data={projectFields.data}
        title={undefined}
        options={options}
      />
      <TablePagination
        component="div"
        count={projectFields.dataCount}
        page={projectFields.page}
        onPageChange={handleChangePage}
        rowsPerPage={projectFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <ReportLoader />
  );
};

export default Project;
