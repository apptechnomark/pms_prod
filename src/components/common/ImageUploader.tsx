// import axios from "axios";

// export default function ImageUploader({ getData }: any) {
//   const handleImageChange = async (event: any) => {
//     const fileData = event.target.files[0];
//     if (fileData) {
//       try {
//         const reader = new FileReader();
//         reader.readAsDataURL(fileData);
//         reader.onloadend = async () => {
//           let base64Image: any;
//           if (reader.result) {
//             base64Image = reader.result;
//           }
//           const uuidv4 = () => {
//             return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//               /[xy]/g,
//               function (c) {
//                 const r = (Math.random() * 16) | 0,
//                   v = c == "x" ? r : (r & 0x3) | 0x8;

//                 return v.toString(16);
//               }
//             );
//           };
//           // const fileName = uuidv4().slice(0, 32);
//           const fileName = fileData.name
//           // fetch("/api/upload", {
//           //   method: "POST",
//           //   headers: {
//           //     "Content-Type": "application/json",
//           //   },
//           //   body: JSON.stringify({ base64Image:base64Image, fileName:fileName }),
//           // })
//           //   .then((response) => response.json())
//           //   .then((data) => console.log("data", data))
//           //   .catch((error) => console.error("Error:", error));
//           const formData = new FormData();
//           formData.append("base64Image",fileData)
//           formData.append("fileName",fileName)
//           console.log("Formdata : ",formData)
//           await axios
//             .post("/api/upload", formData)
//             .then(async (res) => {
//               if (res.status === 200) {
//                 // getData(fileData.name, fileName);
//               }
//             })
//             .catch((error) => {
//               console.error(error);
//             });
//         };
//       } catch (error: any) {
//         console.error(error.message);
//       }
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//       {/* <img
//         src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0xMjAtMTYwdi02NDBsNzYwIDMyMC03NjAgMzIwWm04MC0xMjAgNDc0LTIwMC00NzQtMjAwdjE0MGwyNDAgNjAtMjQwIDYwdjE0MFptMCAwdi00MDAgNDAwWiIvPjwvc3ZnPg=="
//         alt=""
//       /> */}
//       {/* <button onClick={handleImageUpload}>Upload Image to storage account</button> */}
//     </div>
//   );
// }

/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import FileIcon from "@/assets/icons/worklogs/FileIcon";
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from "@azure/storage-blob";
interface ImageUploaderProps {
  getData: (name: string, fileName: string) => void;
}

export default function ImageUploader({ getData, onClose }: any) {
  const [fileData, setFileData] = useState<any>(null);
  const [selectedFileDisplay, setSelectedFileDisplay] = useState<any>("");

  useEffect(() => {
    setFileData(null);
    setSelectedFileDisplay("");
  }, [onClose]);

  const handleImageChange = async (event: any) => {
    const fileData = event.target.files[0];
    console.log(fileData);
    if (fileData) {
      await uploadFileToBlob(fileData, fileData.name);
    }
  };

  const uploadFileToBlob = useCallback(
    async (file: any | null, newFileName: string) => {
      const storageAccount = "pmsdevstorage";
      const containerName = "dev/attachment";
      const sasToken =
        "sp=racwdl&st=2023-11-09T10:49:18Z&se=2023-12-30T18:49:18Z&sv=2022-11-02&sr=c&sig=%2FZvhReFGg0jpW6oX5BLY%2FzmiL86ocutLIbYmZkDsjH0%3D";

      const blobServiceClient = new BlobServiceClient(
        `https://${storageAccount}.blob.core.windows.net?${sasToken}`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const blockBlobClient: BlockBlobClient =
        containerClient.getBlockBlobClient(newFileName);

      await blockBlobClient
        .uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
        })
        .then(
          async (res) =>
            await axios
              .post("/api/getupload", { fileName: "latest.pdf" })
              .then(async (res) => {
                if (res.status === 200) {
                  setFileData(res.data.data);
                }
              })
              .catch((error) => {
                console.error(error);
              })
        )
        .catch((err) => console.log("err", err));
    },
    []
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    renderFileContent();
  }, [fileData]);

  const renderFileContent = () => {
    if (selectedFileDisplay) {
      if (selectedFileDisplay.type?.includes("image")) {
        return (
          <img
            src={fileData}
            alt="Image Preview"
            style={{ maxWidth: "200px" }}
          />
        );
      } else if (selectedFileDisplay.name.endsWith(".pdf")) {
        return (
          <embed
            src={fileData}
            width="100%"
            height="300px"
            type="application/pdf"
          />
        );
      } else {
        return <p>Unsupported File Type: {selectedFileDisplay.name}</p>;
      }
    } else {
      return <p>No file selected</p>;
    }
  };

  return (
    <div className="flex gap-2">
      {/* <input type="file" accept="image/*,.pdf" onChange={handleImageChange} /> */}
      <span
        className="text-white cursor-pointer max-w-1"
        onClick={() => fileInputRef.current?.click()}
      >
        <FileIcon />
        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef}
          multiple
          className="input-field hidden"
          onChange={handleImageChange}
        />
      </span>
      <div>{fileData && renderFileContent()}</div>
    </div>
  );
}
