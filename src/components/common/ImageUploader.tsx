/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import FileIcon from "@/assets/icons/worklogs/FileIcon";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import CloseIcon from "@/assets/icons/reports/CloseIcon";
import { Button, Popover } from "@mui/material";
import { Transition } from "../reports/Filter/Transition/Transition";

export default function ImageUploader({
  getData,
  onClose,
  systemFile,
  originalFile,
  isOpen,
  onHandlePopoverClose,
  isDisable,
  className,
}: any) {
  const [fileData, setFileData] = useState<any>(null);
  const [selectedFileDisplay, setSelectedFileDisplay] = useState<any>("");
  const [originalFileDisplay, setOriginalFileDisplay] = useState<any>("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    systemFile?.length > 0 && getFileFromBlob(systemFile);
    originalFile?.length > 0 && setOriginalFileDisplay(originalFile);
    systemFile?.length > 0 && setIsExpanded(isOpen);
  }, [systemFile]);

  useEffect(() => {
    setFileData(null);
    setSelectedFileDisplay("");
    setOriginalFileDisplay("");
  }, [onClose]);

  const handleImageChange = async (event: any) => {
    const fileData = event.target.files[0];
    const uuidv4 = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;

          return v.toString(16);
        }
      );
    };
    const fileName = uuidv4().slice(0, 32);
    setOriginalFileDisplay(fileData.name);
    getData(fileData.name, fileName);
    if (fileData) {
      await uploadFileToBlob(fileData, fileName);
    }
  };

  const uploadFileToBlob = useCallback(
    async (file: any | null, newFileName: string) => {
      const storageAccount = "pmsdevstorage";
      const containerName: any = process.env.attachment;
      const sasToken =
        "sp=racwdl&st=2023-11-09T10:49:18Z&se=2023-12-30T18:49:18Z&sv=2022-11-02&sr=c&sig=%2FZvhReFGg0jpW6oX5BLY%2FzmiL86ocutLIbYmZkDsjH0%3D";

      const blobServiceClient = new BlobServiceClient(
        `https://${storageAccount}.blob.core.windows.net?${sasToken}`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const blockBlobClient: BlockBlobClient =
        containerClient.getBlockBlobClient(newFileName);
      setSelectedFileDisplay(newFileName);

      await blockBlobClient
        .uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
        })
        .then(async (res) => {
          getFileFromBlob(newFileName);
        })
        .catch((err) => console.log("err", err));
    },
    []
  );

  const getFileFromBlob = async (fileName: string) => {
    const storageAccount = "pmsdevstorage";
    const containerName: any = process.env.attachment;
    const sasToken =
      "sp=racwdl&st=2023-11-09T10:49:18Z&se=2023-12-30T18:49:18Z&sv=2022-11-02&sr=c&sig=%2FZvhReFGg0jpW6oX5BLY%2FzmiL86ocutLIbYmZkDsjH0%3D";

    const blobServiceClient = new BlobServiceClient(
      `https://${storageAccount}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    if (downloadBlockBlobResponse.blobBody) {
      const url = URL.createObjectURL(await downloadBlockBlobResponse.blobBody);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = fileName;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      setSelectedFileDisplay(fileName);
      setFileData(url);
    } else {
      console.error("Blob body is undefined");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   renderFileContent();
  // }, [fileData]);

  // const renderFileContent = () => {
  //   if (selectedFileDisplay) {
  //     console.log(selectedFileDisplay);
  //     if (selectedFileDisplay.includes(".jpg") || selectedFileDisplay.includes(".png") || selectedFileDisplay.includes(".jpeg")) {
  //       return (
  //         <img
  //           src={fileData}
  //           alt="Image Preview"
  //           style={{ maxWidth: "200px" }}
  //         />
  //       );
  //     } else if (selectedFileDisplay.includes(".pdf")) {
  //       return (
  //         <embed
  //           src={fileData}
  //           width="100%"
  //           height="300px"
  //           type="application/pdf"
  //         />
  //       );
  //     } else {
  //       return <p>Unsupported File Type: {selectedFileDisplay.name}</p>;
  //     }
  //   } else {
  //     return <p>No file selected</p>;
  //   }
  // };

  return (
    <div className="flex gap-2">
      {/* <input type="file" accept="image/*,.pdf" onChange={handleImageChange} /> */}
      <span
        className={`text-white cursor-pointer max-w-1 mt-6 ${className}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileIcon />
        <input
          disabled={isDisable}
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef}
          multiple
          className="input-field hidden"
          onChange={handleImageChange}
        />
      </span>
      {/* <div onClick={() => setIsExpanded(true)} className="mt-6">
        {originalFileDisplay.length > 0 && originalFileDisplay}
      </div> */}

      <Popover
        id="id"
        open={isExpanded}
        TransitionComponent={Transition}
        onClose={() => {
          setIsExpanded(false);
          onHandlePopoverClose();
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="px-5 w-full flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-[100%] gap-20">
            <div className="my-5 flex items-center">{originalFileDisplay}</div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsExpanded(false);
                onHandlePopoverClose();
              }}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="w-[300px] h-[150px] bg-gray-200 border rounded-lg flex items-center justify-center mt-6 mb-2">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 640 512"
              height="6rem"
              width="6rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zm-132.9 88.7L299.3 420.7c-6.2 6.2-16.4 6.2-22.6 0L171.3 315.3c-10.1-10.1-2.9-27.3 11.3-27.3H248V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h65.4c14.2 0 21.4 17.2 11.3 27.3z"></path>
            </svg>
          </div>
          <Button
            className="my-5 flex items-center gap-2 bg-secondary"
            variant="contained"
            onClick={() => {
              const a = document.createElement("a");
              a.href = fileData;
              a.download = selectedFileDisplay;
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
          >
            DOWNLOAD
          </Button>
        </div>
      </Popover>
      {/* <div>{fileData && renderFileContent()}</div> */}
    </div>
  );
}
