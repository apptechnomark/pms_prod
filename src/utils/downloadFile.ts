import { BlobServiceClient } from "@azure/storage-blob";

export const getFileFromBlob = async (fileName: string) => {
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
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    console.error("Blob body is undefined");
  }
};
