import React, { useState } from "react";
import axios from "axios";
import { Avatar, InputBase, List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { toast } from "react-toastify";
import EditUserIcon from "@/assets/icons/EditUserIcon";
import SearchIcon from "@/assets/icons/SearchIcon";

const Reviewer = ({
  selectedWorkItemIds,
  selectedRowClientId,
  selectedRowWorkTypeId,
  selectedRowStatusId,
  selectedRowsCount,
  handleClearSelection,
  getReviewList,
}: any) => {
  const [searchQueryRW, setSearchQueryRW] = useState("");
  const [reviewer, setReviewer] = useState<any | any[]>([]);

  const [anchorElReviewer, setAnchorElReviewer] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickReviewer = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElReviewer(event.currentTarget);
    getReviwer();
  };

  const handleCloseReviewer = () => {
    setAnchorElReviewer(null);
  };

  const openReviewer = Boolean(anchorElReviewer);
  const idReviewer = openReviewer ? "simple-popover" : undefined;

  const handleSearchChangeRW = (event: any) => {
    setSearchQueryRW(event.target.value);
  };

  const filteredReviewer = reviewer.filter((reviewer: any) =>
    reviewer.label.toLowerCase().includes(searchQueryRW.toLowerCase())
  );

  const handleOptionReviewer = (id: any) => {
    updateReviewer(selectedWorkItemIds, id);
    handleCloseReviewer();
  };

  // API for get Assignee with all conditions
  const getReviwer = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/GetReviewerDropdown`,
        {
          ClientIds: selectedRowClientId,
          WorktypeId: selectedRowWorkTypeId[0],
          IsAll: selectedRowClientId.length > 0 ? true : false,
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
          setReviewer(response.data.ResponseData);
        } else {
          toast.error("Please try again later.");
        }
      } else {
        toast.error("Please try again.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
      }
    }
  };

  // API for update Assignee
  const updateReviewer = async (id: number[], reviewerId: number) => {
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      // const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
      //   [7, 8, 9, 13].includes(statusId)
      // );

      // if (selectedRowsCount >= 1 && isInvalidStatus) {
      //   toast.warning(
      //     "Cannot change Reviewer for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
      //   );
      // } else {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateReviewer`,
          {
            workitemIds: id,
            ReviewerId: reviewerId,
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
            toast.success("Reviewer has been updated successfully.");
            handleClearSelection();
            getReviewList();
          } else {
            toast.error(data || "Please try again after some time.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Please try again after some time.");
        }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ColorToolTip title="Reviewer" arrow>
        <span
          aria-describedby={idReviewer}
          onClick={handleClickReviewer}
        >
          <EditUserIcon />
        </span>
      </ColorToolTip>

      {/* Reviewer Popover */}
      <Popover
        id={idReviewer}
        open={openReviewer}
        anchorEl={anchorElReviewer}
        onClose={handleCloseReviewer}
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
                  value={searchQueryRW}
                  onChange={handleSearchChangeRW}
                  style={{ fontSize: "13px" }}
                />
              </span>
            </div>
          </div>
          <List>
            {reviewer.length === 0 ? (
              <span className="flex flex-col py-2 px-4  text-sm">
                No Data Available
              </span>
            ) : (
              filteredReviewer.map((reviewer: any) => {
                return (
                  <span
                    key={reviewer.value}
                    className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                  >
                    <span
                      className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                      onClick={() => handleOptionReviewer(reviewer.value)}
                    >
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {reviewer.label
                          ?.split(" ")
                          .map((word: any) => word.charAt(0).toUpperCase())
                          .join("")}
                      </Avatar>

                      <span className="pt-[0.8px]">{reviewer.label}</span>
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

export default Reviewer;
