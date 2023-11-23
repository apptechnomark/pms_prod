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

import ExcelIcon from "@/assets/icons/Import/ExcelIcon";
import FileIcon from "@/assets/icons/Import/FileIcon";
import UploadIcon from "@/assets/icons/Import/UploadIcon";

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
  const [isExcelClicked, setIsExcelClicked] = useState<boolean>(false);
  const [isTaskClicked, setIsTaskClicked] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>("");

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setError("");
    setImportText("");
    setImportFields([]);
    setIsNextClicked(false);
    setIsExcelClicked(false);
    setIsTaskClicked(false);
    setselectedtasks([]);
    setSelectedFile("");
  };

  //   function to set selected Tasks from table
  const handleRowSelect = (
    currentRowsSelected: any,
    allRowsSelected: any,
    rowsSelected: any
  ) => {
    const selectedData = allRowsSelected.map(
      (row: any) => importFields[row.dataIndex]
    );

    const tasks =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => ({
            TaskName: selectedRow.field,
          }))
        : [];

    setselectedtasks(tasks);
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
    setIsTaskClicked(false);
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

  // Adding file
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
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
          {isTaskClicked ? (
            <Button
              color="info"
              onClick={() => {
                setIsTaskClicked(false);
                setImportText("");
              }}
            >
              Back
            </Button>
          ) : isNextCliecked ? (
            <Button
              color="info"
              onClick={() => {
                setIsNextClicked(false);
                setIsTaskClicked(true);
              }}
            >
              Back
            </Button>
          ) : isExcelClicked ? (
            <Button
              color="info"
              onClick={() => {
                setIsExcelClicked(false);
                setSelectedFile("");
              }}
            >
              Back
            </Button>
          ) : (
            <Button color="error" onClick={handleReset}>
              Reset
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          {isTaskClicked ? (
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
          ) : isNextCliecked ? (
            <div className="pt-6 pb-1 w-[40vw]">
              <MUIDataTable
                options={{
                  ...Table_Options,
                  onRowSelectionChange: (
                    currentRowsSelected: any,
                    allRowsSelected: any,
                    rowsSelected: any
                  ) =>
                    handleRowSelect(
                      currentRowsSelected,
                      allRowsSelected,
                      rowsSelected
                    ),
                }}
                columns={Table_Columns}
                data={importFields}
                title={undefined}
              />
            </div>
          ) : isExcelClicked ? (
            <div className="pt-6 px-[10px] pb-[10px] h-[235px] w-[40vw]">
              <input
                accept=".xls,.xlsx"
                style={{ display: "none" }}
                id="raised-button-file"
                onChange={handleFileChange}
                // multiple
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  className="w-full h-52 flex-col gap-[15px]"
                >
                  <span className="border border-lightSilver rounded p-2">
                    <UploadIcon />
                  </span>
                  <span className="capitalize text-darkCharcoal text-base">
                    Drag and Drop or{" "}
                    <span className="text-secondary">Browse</span> to Upload
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="pt-6 px-[10px] pb-[10px] h-[235px] w-[40vw]">
              <div className="flex items-center justify-around gap-5">
                <div
                  className="flex items-center justify-center border border-lightSilver rounded-md w-full h-52 shadow-md hover:shadow-xl hover:bg-[#f5fcff] hover:border-[#a4e3fe] cursor-pointer"
                  onClick={() => setIsExcelClicked(true)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <ExcelIcon />
                    Import Excel
                  </div>
                </div>
                <div
                  className="flex items-center justify-center border border-lightSilver rounded-md w-full h-52 shadow-md hover:shadow-xl hover:bg-[#f5fcff] hover:border-[#a4e3fe] cursor-pointer"
                  onClick={() => setIsTaskClicked(true)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <FileIcon />
                    Import Task
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          {isTaskClicked ? (
            <Button
              className="!bg-secondary"
              variant="contained"
              onClick={handleProcessData}
            >
              Next
            </Button>
          ) : isNextCliecked ? (
            <Button
              className={`${selectedTasks.length <= 0 ? "" : "!bg-secondary"}`}
              variant="contained"
              onClick={handleApplyImport}
              disabled={selectedTasks.length <= 0}
            >
              Submit
            </Button>
          ) : isExcelClicked ? (
            <Button
              className={`${selectedFile === "" ? "" : "!bg-secondary"}`}
              variant="contained"
              disabled={selectedFile === ""}
            >
              Upload
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImportDialog;
