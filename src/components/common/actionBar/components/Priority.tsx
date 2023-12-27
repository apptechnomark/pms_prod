import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { List, Popover } from "@mui/material";
import PriorityIcon from "@/assets/icons/worklogs/Priority";

const priorityOptions = [
  { id: 3, text: "Low" },
  { id: 2, text: "Medium" },
  { id: 1, text: "High" },
];

const Priority = ({
  selectedRowIds,
  selectedRowStatusId,
  selectedRowsCount,
  getData,
  getOverLay,
}: any) => {
  const [anchorElPriority, setAnchorElPriority] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickPriority = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPriority(event.currentTarget);
  };

  const handleClosePriority = () => {
    setAnchorElPriority(null);
  };

  const openPriority = Boolean(anchorElPriority);
  const idPriority = openPriority ? "simple-popover" : undefined;

  const handleOptionPriority = (id: any) => {
    updatePriority(selectedRowIds, id);
    handleClosePriority();
  };

  const updatePriority = async (id: number[], priorityId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    getOverLay(true);
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/UpdatePriority`,
        {
          workitemIds: id,
          priority: priorityId,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.Message;
        if (response.data.ResponseStatus === "Success") {
          toast.success("Priority has been updated successfully.");
          getData();
          getOverLay(false);
        } else {
          toast.error(data || "Please try again later.");
          getOverLay(false);
        }
      } else {
        const data = response.data.Message;
        toast.error(data || "Please try again later.");
        getOverLay(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ColorToolTip title="Priority" arrow>
        <span aria-describedby={idPriority} onClick={handleClickPriority}>
          <PriorityIcon />
        </span>
      </ColorToolTip>

      {/* Priority Popover */}
      <Popover
        id={idPriority}
        open={openPriority}
        anchorEl={anchorElPriority}
        onClose={handleClosePriority}
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
            {priorityOptions.map((option: any) => (
              <span
                key={option.id}
                className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
              >
                <span
                  className="p-1 cursor-pointer"
                  onClick={() => handleOptionPriority(option.id)}
                >
                  {option.text}
                </span>
              </span>
            ))}
          </List>
        </nav>
      </Popover>
    </div>
  );
};

export default Priority;
