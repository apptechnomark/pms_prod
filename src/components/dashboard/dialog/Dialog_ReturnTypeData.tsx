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
import Datatable_ReturnTypeData from "../datatable/Datatable_ReturnTypeData";
import axios from "axios";
import { toast } from "react-toastify";

interface Priority {
  Type: string;
  label: string;
  value: number;
}

interface DialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedProjectIds: number[];
  onSelectedReturnTypeValue: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_ReturnTypeData: React.FC<DialogProps> = ({
  onOpen,
  onClose,
  onSelectedProjectIds,
  onSelectedReturnTypeValue,
}) => {
  const [returnType, setReturnType] = useState<number | any>(0);
  const [data, setData] = useState<any | any[]>([]);

  const handleClose = () => {
    onClose();
    setReturnType(0);
  };

  useEffect(() => {
    // if (onSelectedProjectIds.length > 0) {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/taskstatusandprioritylist`,
          {
            PageNo: 1,
            PageSize: 1000,
            SortColumn: null,
            IsDesc: true,
            projectIds: onSelectedProjectIds,
            typeOfWork: null,
            priorityId: null,
            statusId: null,
            ReturnTypeId: returnType ? returnType : onSelectedReturnTypeValue,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (
          response.status === 200 &&
          response.data.ResponseStatus === "Success"
        ) {
          setData(response.data.ResponseData.List);
        } else {
          const errorMessage = response.data.Message || "Something went wrong.";
          toast.error(errorMessage);
        }
      } catch (error) {
        toast.error("Error fetching data. Please try again later.");
      }
    };

    // Fetch data when component mounts
    getData();
    // }
  }, [onSelectedProjectIds, onSelectedReturnTypeValue, returnType]);

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
            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="return type"
                id="return type"
                value={returnType ? returnType : onSelectedReturnTypeValue}
                onChange={(e) => setReturnType(e.target.value)}
                sx={{ height: "36px" }}
              >
                <MenuItem value={1}>Individual Return</MenuItem>
                <MenuItem value={2}>Business Return</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Datatable_ReturnTypeData
            onSelectedProjectIds={onSelectedProjectIds}
            onSelectedReturnTypeValue={onSelectedReturnTypeValue}
            onCurrSelectedReturnType={returnType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_ReturnTypeData;
