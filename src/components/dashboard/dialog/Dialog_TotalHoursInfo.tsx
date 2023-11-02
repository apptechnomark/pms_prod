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
import Datatable_TotalHoursInfo from "../datatable/Datatable_TotalHoursInfo";

interface TotalHoursInfoDialogProps {
  onOpen: boolean;
  onClose: () => void;
  onWorkTypeData: string[] | any;
  onSelectedProjectIds: number[];
  onSelectedWorkTypeName: string;
}
interface WorkType {
  label: string;
  value: number | any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_TotalHoursInfo: React.FC<TotalHoursInfoDialogProps> = ({
  onOpen,
  onClose,
  onWorkTypeData,
  onSelectedProjectIds,
  onSelectedWorkTypeName,
}) => {
  const [workType, setWorkType] = useState<number | any>(0);
  const [clickedWorkTypeName, setClickedWorkTypeName] = useState<string>("");

  // function to extract values from label/type/name
  function getValueByLabelOrType(labelOrType: any): number {
    const workType = onWorkTypeData.find(
      (workType: WorkType) => workType.label === labelOrType
    );
    if (workType) {
      return workType.value;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    setClickedWorkTypeName(onSelectedWorkTypeName);
    const workTypeValue: number = getValueByLabelOrType(clickedWorkTypeName);
    setWorkType(workTypeValue);
  }, [onSelectedWorkTypeName, clickedWorkTypeName]);

  const handleClose = () => {
    setWorkType(0);
    setClickedWorkTypeName("");
    onClose();
  };

  return (
    <div>
      <Dialog
        fullWidth
        // fullScreen
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xl"
        onClose={handleClose}
      >
        <DialogTitle className="flex justify-between p-5 bg-whiteSmoke">
          <span className="font-semibold text-lg">Total Hours</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-end items-center">
            <FormControl sx={{ mx: 0.75, minWidth: 150, marginTop: 1 }}>
              <Select
                labelId="workType"
                id="workType"
                value={workType === 0 ? 0 : workType}
                onChange={(e) => setWorkType(e.target.value)}
                sx={{ height: "36px" }}
              >
                <MenuItem value={0}>All</MenuItem>
                {onWorkTypeData.map((i: any, index: number) => (
                  <MenuItem value={i.value} key={index}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_TotalHoursInfo
            onSelectedProjectIds={onSelectedProjectIds}
            onSelectedWorkType={workType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_TotalHoursInfo;
