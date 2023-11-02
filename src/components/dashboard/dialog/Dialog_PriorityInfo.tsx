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
// Internal Components
import Datatable_PriorityInfo from "../datatable/Datatable_PriorityInfo";

interface Priority {
  Type: string;
  label: string;
  value: number;
}

interface DialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedProjectIds: number[];
  onSelectedPriorityName: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_PriorityInfo: React.FC<DialogProps> = ({
  onOpen,
  onClose,
  onSelectedProjectIds,
  onSelectedPriorityName,
}) => {
  const [priority, setPriority] = useState<number | any>(0);
  const [clickedPriorityName, setClickedPriorityName] = useState<string>("");

  const priority_Data = [
    {
      Type: "Low",
      label: "Low",
      value: 3,
    },
    {
      Type: "Medium",
      label: "Medium",
      value: 2,
    },
    {
      Type: "High",
      label: "High",
      value: 1,
    },
  ];

  const handleClose = () => {
    onClose();
    setPriority(0);
    setClickedPriorityName("");
  };

  //   function to extract values from label/type/name
  function getValueByLabelOrType(labelOrType: any): number {
    const priority = priority_Data.find(
      (priority: Priority) =>
        priority.Type === labelOrType || priority.label === labelOrType
    );
    if (priority) {
      return priority.value;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    setClickedPriorityName(onSelectedPriorityName);
    const priorityValue: number = getValueByLabelOrType(clickedPriorityName);
    setPriority(priorityValue);
  }, [onSelectedPriorityName, clickedPriorityName]);

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
            <FormControl sx={{ mx: 0.75, minWidth: 150, marginTop: 1 }}>
              <Select
                labelId="status"
                id="status"
                value={priority ? priority : 0}
                onChange={(e) => setPriority(e.target.value)}
                sx={{ height: "36px" }}
              >
                <MenuItem value={0}>All</MenuItem>
                {priority_Data.map((i: any, index: number) => (
                  <MenuItem value={i.value} key={index}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Datatable_PriorityInfo
            onSelectedProjectIds={onSelectedProjectIds}
            onSelectedPriorityId={priority}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_PriorityInfo;
