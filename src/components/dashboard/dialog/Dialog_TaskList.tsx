import React from "react";
// material imports
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
// Internal Components
import Datatable_FullScreen from "@/components/dashboard/datatable/Datatable_FullScreen";

interface TaskListDialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_TaskList: React.FC<TaskListDialogProps> = ({
  onOpen,
  onClose,
  onSelectedProjectIds,
  onSelectedWorkType,
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <div>
      <Dialog
        fullWidth
        fullScreen
        open={onOpen}
        keepMounted
        maxWidth="xl"
        onClose={handleClose}
      >
        <DialogContent>
          <Datatable_FullScreen
            onClose={handleClose}
            onSelectedWorkType={onSelectedWorkType}
            onSelectedProjectIds={onSelectedProjectIds}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_TaskList;
