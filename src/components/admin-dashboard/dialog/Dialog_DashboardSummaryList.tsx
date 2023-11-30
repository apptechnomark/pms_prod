import React, { useEffect, useState } from "react";
// material imports
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import Datatable_DashboardSummaryList from "../Datatables/Datatable_DashboardSummaryList";

interface Status {
  Type: string;
  label: string;
  value: number;
}

interface DashboardSummaryListProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedWorkType: number;
  onClickedSummaryTitle: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_DashboardSummaryList: React.FC<DashboardSummaryListProps> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onClickedSummaryTitle,
}) => {
  const [summaryList, setSummaryList] = useState<Status[]>([]);
  const [summaryName, setSummaryName] = useState<string>("");

  const handleClose = () => {
    onClose();
    setSummaryName("");
  };

  // API for Dashboard Summary list
  const getProjectSummary = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/dashboard/summary`,
        {
          WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
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
          setSummaryList(response.data.ResponseData);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjectSummary();
  }, [onSelectedWorkType]);

  return (
    <div>
      <Dialog
        fullWidth
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xl"
        onClose={handleClose}
      >
        <DialogTitle className="flex justify-between p-5 bg-whiteSmoke">
          <span className="font-semibold text-lg">Task Status</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-end items-center">
            {/* <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <div className="flex items-center h-full relative">
                <TextField
                  className="m-0"
                  placeholder="Search"
                  fullWidth
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 300 }}
                />
                <span className="absolute right-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            </FormControl> */}

            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="summary list"
                id="summary list"
                value={summaryName ? summaryName : onClickedSummaryTitle}
                onChange={(e) => setSummaryName(e.target.value)}
                sx={{ height: "36px" }}
              >
                {summaryList.map((i: any) => (
                  <MenuItem value={i.Key} key={i.Key}>
                    {i.Key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_DashboardSummaryList
            onSelectedWorkType={onSelectedWorkType}
            onClickedSummaryTitle={onClickedSummaryTitle}
            onCurrSelectedSummaryTitle={summaryName}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_DashboardSummaryList;
