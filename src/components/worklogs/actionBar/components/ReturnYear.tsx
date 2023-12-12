import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { List, Popover } from "@mui/material";
import ReturnYearIcon from "@/assets/icons/worklogs/ReturnYearIcon";
import { getYears } from "@/utils/commonFunction";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";

const ReturnYear = ({ selectedRowIds, getWorkItemList }: any) => {
  const yearDropdown = getYears();

  const [anchorElReturnYear, setAnchorElReturnYear] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickReturnYear = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElReturnYear(event.currentTarget);
  };

  const handleCloseReturnYear = () => {
    setAnchorElReturnYear(null);
  };

  const openReturnYear = Boolean(anchorElReturnYear);
  const idReturnYear = openReturnYear ? "simple-popover" : undefined;

  const handleOptionreturnYear = (id: any) => {
    updateReturnYear(selectedRowIds, id);
    handleCloseReturnYear();
  };

  // API for update Return Year
  const updateReturnYear = async (id: number[], retunYear: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemreturnyear`,
        {
          workitemIds: id,
          returnYear: retunYear,
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
          toast.success("Return Year has been updated successfully.");
          // handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ColorToolTip title="Return Year" arrow>
        <span aria-describedby={idReturnYear} onClick={handleClickReturnYear}>
          <ReturnYearIcon />
        </span>
      </ColorToolTip>

      {/* Return Year Popover */}
      <Popover
        id={idReturnYear}
        open={openReturnYear}
        anchorEl={anchorElReturnYear}
        onClose={handleCloseReturnYear}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <nav className="!w-52">
          <List>
            {yearDropdown.length === 0 ? (
              <span className="flex flex-col py-2 px-4  text-sm">
                No Data Available
              </span>
            ) : (
              yearDropdown.map((yr: any) => {
                return (
                  <span
                    key={yr.value}
                    className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                  >
                    <span
                      className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                      onClick={() => handleOptionreturnYear(yr.value)}
                    >
                      <span className="pt-[0.8px]">{yr.label}</span>
                    </span>
                  </span>
                );
              })
            )}
          </List>
        </nav>
      </Popover>
    </div>
  );
};

export default ReturnYear;
