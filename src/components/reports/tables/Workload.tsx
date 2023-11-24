import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  Popover,
  TablePagination,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for workload
import { workLoad_InitialFilter } from "@/utils/reports/getFilters";

//transition for popover
import { Transition } from "../Filter/Transition/Transition";

//icons
import LineIcon from "@/assets/icons/reports/LineIcon";
import CloseIcon from "@/assets/icons/reports/CloseIcon";

// common functions for datatable
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
  generateDateWithTime,
  generateDateWithoutTime,
} from "@/utils/datatable/CommonFunction";

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

const Workload = ({ filteredData, searchValue }: any) => {
  const [page, setPage] = useState<number>(0);
  const [workloadData, setWorkloadData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const [anchorElFilter, setAnchorElFilter] =
    useState<HTMLButtonElement | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [clickedRowId, setClickedRowId] = useState<number>(-1);
  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/workLoad`,
        { ...arg1 },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setWorkloadData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    getData({ ...filteredData, pageNo: newPage + 1, pageSize: rowsPerPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    getData({
      ...filteredData,
      pageNo: 1,
      pageSize: event.target.value,
    });
  };

  useEffect(() => {
    getData(workLoad_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, globalSearch: searchValue });
      setPage(0);
      setRowsPerPage(10);
    } else {
      getData({ ...workLoad_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData]);

  const columns: any[] = [
    {
      name: "UserName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("User Name"),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div
              className="flex flex-col cursor-pointer"
              onClick={
                workloadData[tableMeta.rowIndex].workLoadWorkItemData.length > 0
                  ? () => {
                      setIsExpanded(true);
                      setClickedRowId(tableMeta.rowIndex);
                    }
                  : () => {
                      toast.error("There is no workitem data available!");
                    }
              }
            >
              {value === null || "" ? (
                "-"
              ) : (
                <>
                  <span>{value}</span>
                  <span>{workloadData[tableMeta.rowIndex].DepartmentName}</span>
                </>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "RoleType",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Designation"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TotalStandardTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Std. Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalCount",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Qty."),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
  ];

  const expandableColumns: any[] = [
    {
      name: "CreatedDate",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Created Date"),
        customBodyRender: (value: any) => {
          return generateDateWithoutTime(value);
        },
      },
    },
    {
      name: "ClientName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Client Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Project"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Task/Process"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "EstimateTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Est. Time"),
        customBodyRender: (value: any) => {
          return (
            <div>{value === null || value === "" ? "00:00:00" : value}</div>
          );
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={columns}
        data={workloadData}
        options={options}
      />
      <TablePagination
        component="div"
        count={tableDataCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Popover
        id={idFilter}
        open={isExpanded}
        anchorEl={anchorElFilter}
        TransitionComponent={Transition}
        onClose={() => setIsExpanded(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="px-5 w-full flex items-center justify-between">
          <div className="my-5 flex items-center">
            <div className="mr-[10px]">
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize mr-[5px]">
                username:
              </label>
              <label className="text-sm font-bold font-proxima capitalize">
                {workloadData[clickedRowId]?.UserName}
              </label>
            </div>
            <LineIcon />
            <div className="mx-[10px]">
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize mr-[5px]">
                Designation:
              </label>
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize">
                {workloadData[clickedRowId]?.DepartmentName}
              </label>
            </div>
            <LineIcon />
            <div className="mx-[10px]">
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize mr-[5px]">
                Standard Time:
              </label>
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize">
                {workloadData[clickedRowId]?.TotalStandardTime}
              </label>
            </div>
            <LineIcon />
            <div className="mx-[10px]">
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize mr-[5px]">
                total time:
              </label>
              <label className="text-sm font-normal font-proxima text-slatyGrey capitalize">
                {workloadData[clickedRowId]?.TotalTime}
              </label>
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => setIsExpanded(false)}>
            <CloseIcon />
          </div>
        </div>
        <MUIDataTable
          title={undefined}
          columns={expandableColumns}
          data={
            workloadData.length > 0 && clickedRowId !== -1
              ? workloadData[clickedRowId].workLoadWorkItemData
              : []
          }
          options={{ ...options, tableBodyHeight: "276px" }}
        />
      </Popover>
    </ThemeProvider>
  );
};

export default Workload;
