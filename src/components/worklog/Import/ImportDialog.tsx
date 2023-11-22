import React, { useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { FormControl, FormHelperText } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { Table_Options, Table_Columns } from "./options/Table_Options";
import { toast } from "react-toastify";
import axios from "axios";

interface ImportDialogProp {
  onOpen: boolean;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ImportDialog: React.FC<ImportDialogProp> = ({ onOpen, onClose }) => {
  const [error, setError] = useState("");
  const [importText, setImportText] = useState("");
  const [importFields, setImportFields] = useState<any[]>([]);
  const [isNextCliecked, setIsNextClicked] = useState<boolean>(false);
  const [selectedTasks, setselectedtasks] = useState<any[]>([]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setError("");
    setImportText("");
    setImportFields([]);
    setIsNextClicked(false);
    setselectedtasks([]);
  };

  //   function to set selected Tasks from table
  const handleRowSelect = (allRowsSelected: any) => {
    const selectedData = allRowsSelected.map(
      (row: any) => importFields[row.dataIndex]
    );

    const updatedSelectedTasks = [...selectedTasks];

    selectedData.forEach((selectedRow: any) => {
      const existingIndex = updatedSelectedTasks.findIndex(
        (item: any) => item.id === selectedRow.id
      );

      if (existingIndex !== -1) {
        updatedSelectedTasks.splice(existingIndex, 1);
      } else {
        updatedSelectedTasks.push({
          TaskName: selectedRow.field,
        });
      }
    });

    setselectedtasks(updatedSelectedTasks);
  };

  //   converting importText to Array of Object
  const convertToArrayOfObjects = (data: string) => {
    let dataArray;
    if (data.includes(",")) {
      dataArray = data
        .split(",")
        .map((item, index) => ({ id: index + 1, field: item.trim() }));
    } else if (data.includes("\n")) {
      dataArray = data
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((item, index) => ({ id: index + 1, field: item.trim() }));
    } else {
      dataArray = data
        .split(" ")
        .map((item, index) => ({ id: index + 1, field: item }));
    }
    return dataArray;
  };

  //  adding data into table
  const handleProcessData = () => {
    if (importText.trim() === "") {
      setError("Please enter import fields");
      return;
    }

    setIsNextClicked(true);
    setImportFields(convertToArrayOfObjects(importText));
  };

  //  Calling Import API
  const handleApplyImport = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/import`,
        {
          TaskNameList: selectedTasks,
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
          toast.success("Task has been imported successfully.");
          handleClose();
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
          toast.error("Please try again later.");
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
      <Dialog
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        onClose={handleClose}
      >
        <DialogTitle className="h-[64px] p-[20px] flex items-center justify-between border-b border-b-lightSilver">
          <span className="text-lg font-medium">Import</span>
          {!isNextCliecked ? (
            <Button color="error" onClick={handleReset}>
              Reset
            </Button>
          ) : (
            <Button color="info" onClick={() => setIsNextClicked(false)}>
              Back
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          {isNextCliecked ? (
            <div className="pt-6 pb-1 w-[40vw]">
              <MUIDataTable
                options={{
                  ...Table_Options,
                  onRowSelectionChange: (allRowsSelected: any) =>
                    handleRowSelect(allRowsSelected),
                }}
                columns={Table_Columns}
                data={importFields}
                title={undefined}
              />
            </div>
          ) : (
            <div className="pt-6 px-[10px] pb-[10px] h-[235px] w-[40vw]">
              <FormControl sx={{ mx: 0.75 }} variant="standard">
                <TextareaAutosize
                  color="error"
                  aria-label="import_TextArea"
                  minRows={8}
                  required
                  placeholder="Enter Import Fields"
                  className={`outline-none border-b border-lightSilver !w-[37.5vw] ${
                    Boolean(error) ? "!border-defaultRed" : ""
                  }`}
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value), setError("");
                  }}
                />
                {Boolean(error) && (
                  <FormHelperText error>{error}</FormHelperText>
                )}
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          {isNextCliecked ? (
            <Button
              className="!bg-secondary"
              variant="contained"
              onClick={handleApplyImport}
            >
              Submit
            </Button>
          ) : (
            <Button
              className="!bg-secondary"
              variant="contained"
              onClick={handleProcessData}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImportDialog;
