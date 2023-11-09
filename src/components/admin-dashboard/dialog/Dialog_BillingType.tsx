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
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import SearchIcon from "@/assets/icons/SearchIcon";
import Datatable_BillingType from "../Datatables/Datatable_BillingType";

interface Status {
  Type: string;
  label: string;
  value: number;
}

interface BillingTypeDialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedWorkType: number;
  onSelectedStatusName: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_BillingType: React.FC<BillingTypeDialogProps> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onSelectedStatusName,
}) => {
  const [allBillingType, setAllBillingType] = useState<Status[]>([]);
  const [billingType, setBillingType] = useState<number | any>(0);
  const [clickedStatusName, setClickedStatusName] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");

  const handleClose = () => {
    onClose();
    setBillingType(0);
    setClickedStatusName("");
  };

  //   function to extract values from label/type/name
  function getValueByLabelOrType(labelOrType: any): number {
    const billingType = allBillingType.find(
      (billingType: Status) =>
        billingType.Type === labelOrType || billingType.label === labelOrType
    );
    if (billingType) {
      return billingType.value;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    setClickedStatusName(onSelectedStatusName);
    const billingTypeValue: number = getValueByLabelOrType(clickedStatusName);
    setBillingType(billingTypeValue);
  }, [clickedStatusName, onSelectedStatusName]);

  // API for billingType dropdown list
  useEffect(() => {
    const getAllStatus = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.get(
          `${process.env.pms_api_url}/BillingType/GetDropdown`,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setAllBillingType(response.data.ResponseData);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Error duplicating task.");
            } else {
              toast.error(data);
            }
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Error duplicating task.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    // if (onOpen) {
    getAllStatus();
    // }
  }, []);

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
          <span className="font-semibold text-lg">Billing Type</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-between items-center">
            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
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
            </FormControl>

            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="Billing Type"
                id="Billing Type"
                value={billingType ? billingType : 0}
                onChange={(e) => setBillingType(e.target.value)}
                sx={{ height: "36px" }}
              >
                <MenuItem value={0}>All</MenuItem>
                {allBillingType.map((i: any, index: number) => (
                  <MenuItem value={i.value} key={index}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_BillingType
            onSelectedWorkType={onSelectedWorkType}
            onSelectedStatusName={onSelectedStatusName}
            onCurrentSelectedBillingType={billingType}
            onSearchValue={searchValue}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_BillingType;
