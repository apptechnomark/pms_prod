import React, { useEffect, useState } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";

interface OnHoldProps {
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

const Datatable_OnHold: React.FC<OnHoldProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
}) => {
  const [data, setData] = useState<any | any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [options, setOptions] = useState<any>({
    filterType: "checkbox",
    responsive: "standard",
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
            <span>Currently there is no record.</span>
          </div>
        ),
        toolTip: "",
      },
    },
  });

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

  // Resizing the table according to the fileds
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let tableBodyHeight = "86vh";

      if (screenWidth > 1440) {
        tableBodyHeight = "77vh";
      } else if (screenWidth > 1280) {
        tableBodyHeight = "86vh";
      }

      setOptions((prevOptions: any) => ({
        ...prevOptions,
        tableBodyHeight,
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/tasklistbyproject`,
          {
            PageNo: page + 1,
            PageSize: rowsPerPage,
            SortColumn: null,
            IsDesc: true,
            projectIds: onSelectedProjectIds,
            typeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
            onHold: true,
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
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    // calling function
    getData();
  }, [onSelectedProjectIds, onSelectedWorkType, page, rowsPerPage]);

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
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
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
          return (
            <div className="ml-2">
              {value === null || value === "" ? "-" : value}
            </div>
          );
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold">Start Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },
    {
      name: "DueDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold">Due Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },
    {
      name: "DueFrom",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold">Due From</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <div className="ml-2">
              {value === null || "" ? "-" : value}&nbsp;
              {value > 1 ? "days" : "day"}
            </div>
          );
        },
      },
    },
  ];

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={data}
          columns={columns}
          title={undefined}
          options={options}
          data-tableid="dashboard_OnHold_Datatable"
        />
        <TablePagination
          component="div"
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

export default Datatable_OnHold;
