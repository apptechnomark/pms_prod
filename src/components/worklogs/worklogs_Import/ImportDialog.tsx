import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { CircularProgress, FormControl, FormHelperText } from "@mui/material";
import MUIDataTable from "mui-datatables";

// Icons Imports
import ExcelIcon from "@/assets/icons/Import/ExcelIcon";
import FileIcon from "@/assets/icons/Import/FileIcon";
import UploadIcon from "@/assets/icons/Import/UploadIcon";
import Download from "@/assets/icons/Import/Download";

// Internal components
import { Table_Options, Table_Columns } from "./options/Table_Options";

interface ImportDialogProp {
  onOpen: boolean;
  onClose: () => void;
  onDataFetch: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ImportDialog: React.FC<ImportDialogProp> = ({
  onOpen,
  onClose,
  onDataFetch,
}) => {
  const [error, setError] = useState("");
  const [importText, setImportText] = useState("");
  const [importFields, setImportFields] = useState<any[]>([]);
  const [isNextCliecked, setIsNextClicked] = useState<boolean>(false);
  const [selectedTasks, setselectedtasks] = useState<any[]>([]);
  const [isExcelClicked, setIsExcelClicked] = useState<boolean>(false);
  const [isTaskClicked, setIsTaskClicked] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUplaoding] = useState<boolean>(false);

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
    setSelectedFile(null);
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
      dataArray = [{ id: 1, field: data.trim() }];
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

  // Adding file
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
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
          onDataFetch();
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

  //  Calling Import Excel API
  const handleApplyImportExcel = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    if (selectedFile) {
      try {
        setIsUplaoding(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/importexcel`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            toast.success("Task has been imported successfully.");
            onDataFetch();
            setIsUplaoding(false);
            handleClose();
          } else if (response.data.ResponseStatus === "Warning") {
            toast.warning(
              `Valid Task has been imported and an Excel file ${response.data.ResponseData.FileDownloadName} has been downloaded for invalid tasks.`
            );

            const byteCharacters = atob(
              response.data.ResponseData.FileContents
            );
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const fileBlob = new Blob([byteArray], {
              type: `${response.data.ResponseData.ContentType}`,
            });

            const fileURL = URL.createObjectURL(fileBlob);
            const downloadLink = document.createElement("a");
            downloadLink.href = fileURL;
            downloadLink.setAttribute(
              "download",
              response.data.ResponseData.FileDownloadName
            );
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(fileURL);

            onDataFetch();
            setIsUplaoding(false);
            handleClose();
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
            setIsUplaoding(false);
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
          setIsUplaoding(false);
        }
      } catch (error) {
        console.error(error);
      }
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
                setSelectedFile(null);
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
                    setImportText(e.target.value);
                    setError("");
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
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button
                  component="span"
                  variant="outlined"
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
                    <span className="text-darkCharcoal">Import Excel</span>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center border border-lightSilver rounded-md w-full h-52 shadow-md hover:shadow-xl hover:bg-[#f5fcff] hover:border-[#a4e3fe] cursor-pointer"
                  onClick={() => setIsTaskClicked(true)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <FileIcon />
                    <span className="text-darkCharcoal">Import Task</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions
          className={`border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px] ${
            isExcelClicked ? "flex justify-between" : ""
          }`}
        >
          {isExcelClicked && (
            <div className="text-secondary">
              <a
                href="/demo excel/DemoExcel.xlsx"
                download={"DemoExcel.xlsx"}
                className="flex items-center gap-2 text-sm"
              >
                Download Demo Excel Sheet
                <span className="text-xl">
                  <Download />
                </span>
              </a>
            </div>
          )}

          <div className="flex gap-[10px]">
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
                className={`${
                  selectedTasks.length <= 0 ? "" : "!bg-secondary"
                }`}
                variant="contained"
                onClick={handleApplyImport}
                disabled={selectedTasks.length <= 0}
              >
                Submit
              </Button>
            ) : isExcelClicked ? (
              isUploading ? (
                <div className="px-8">
                  <CircularProgress size="1.75rem" />
                </div>
              ) : (
                <Button
                  className={`${!selectedFile ? "" : "!bg-secondary"}`}
                  variant="contained"
                  disabled={!selectedFile}
                  onClick={handleApplyImportExcel}
                >
                  Upload
                </Button>
              )
            ) : null}
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImportDialog;
