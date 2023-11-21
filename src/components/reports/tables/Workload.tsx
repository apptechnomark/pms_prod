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

const Workload = ({ filteredData, onWorkloadSearchData }: any) => {
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

  // getting Workload data by search
  useEffect(() => {
    if (onWorkloadSearchData) {
      setWorkloadData(onWorkloadSearchData);
    } else {
      getData(workLoad_InitialFilter);
    }
  }, [onWorkloadSearchData]);

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
      getData(filteredData);
    }
  }, [filteredData]);

  const columns: any[] = [
    {
      name: "UserName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">user name</span>
        ),
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">designation</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "TotalStandardTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">std time</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">total time</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalCount",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Qty.</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Created date</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "00:00:00"
                : value.split("T")[0]}
            </div>
          );
        },
      },
    },
    {
      name: "ClientName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">client name</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">project</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">task/process</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "EstimateTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Estimate Time</span>
        ),
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
