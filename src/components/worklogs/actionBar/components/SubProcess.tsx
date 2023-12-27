import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { InputBase, List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import SubProcessIcon from "@/assets/icons/worklogs/SubProcess";
import SearchIcon from "@/assets/icons/SearchIcon";

const SubProcess = ({
  subProcessDropdownData,
  selectedRowIds,
  getWorkItemList,
  getOverLay,
}: any) => {
  const [subProcessSearchQuery, setSubProcessSearchQuery] = useState("");

  const [anchorElSubProcess, setAnchorElSubProcess] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickSubProcess = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElSubProcess(event.currentTarget);
  };

  const handleCloseSubProcess = () => {
    setAnchorElSubProcess(null);
  };

  const openSubProcess = Boolean(anchorElSubProcess);
  const idSubProcess = openSubProcess ? "simple-popover" : undefined;

  const handleSubProcessSearchChange = (event: any) => {
    setSubProcessSearchQuery(event.target.value);
  };

  const filteredSubProcess = subProcessDropdownData?.filter((subProcess: any) =>
    subProcess.Name.toLowerCase().includes(subProcessSearchQuery.toLowerCase())
  );

  const handleOptionSubProcess = (id: any) => {
    updateSubProcess(selectedRowIds, id);
    handleCloseSubProcess();
  };

  const updateSubProcess = async (id: number[], processId: number) => {
    getOverLay(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemsubprocess`,
        {
          WorkitemIds: id,
          SubProcessId: processId,
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
          toast.success("Sub-Process has been updated successfully.");
          getWorkItemList();
          getOverLay(false);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
          getOverLay(false);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
        getOverLay(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ColorToolTip title="Sub-Process" arrow>
        <span aria-describedby={idSubProcess} onClick={handleClickSubProcess}>
          <SubProcessIcon />
        </span>
      </ColorToolTip>

      <Popover
        id={idSubProcess}
        open={openSubProcess}
        anchorEl={anchorElSubProcess}
        onClose={handleCloseSubProcess}
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
          <div className="mr-4 ml-4 mt-4">
            <div
              className="flex items-center h-10 rounded-md pl-2 flex-row"
              style={{
                border: "1px solid lightgray",
              }}
            >
              <span className="mr-2">
                <SearchIcon />
              </span>
              <span>
                <InputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  value={subProcessSearchQuery}
                  onChange={handleSubProcessSearchChange}
                  style={{ fontSize: "13px" }}
                />
              </span>
            </div>
          </div>
          <List>
            {subProcessDropdownData.length === 0 ? (
              <span className="flex flex-col py-2 px-4  text-sm">
                No Data Available
              </span>
            ) : (
              filteredSubProcess.map((subProcess: any) => {
                return (
                  <span
                    key={subProcess.Id}
                    className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                  >
                    <span
                      className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                      onClick={() => handleOptionSubProcess(subProcess.Id)}
                    >
                      <span className="pt-[0.8px]">{subProcess.Name}</span>
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

export default SubProcess;
