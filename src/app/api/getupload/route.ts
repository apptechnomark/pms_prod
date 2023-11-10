/* eslint-disable import/no-anonymous-default-export */
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse)  {
  if (req.method === "POST") {
    try {
      const { fileName } = await req.json();
      // Azure Blob Storage Configuration
      const storageAccount = "pmsdevstorage";
      const containerName = "dev/attachment";
      const sasToken =
        "sp=racwdl&st=2023-11-09T10:49:18Z&se=2023-12-30T18:49:18Z&sv=2022-11-02&sr=c&sig=%2FZvhReFGg0jpW6oX5BLY%2FzmiL86ocutLIbYmZkDsjH0%3D";

      const blobServiceClient = new BlobServiceClient(
        `https://${storageAccount}.blob.core.windows.net?${sasToken}`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient :BlockBlobClient = containerClient.getBlockBlobClient(fileName);

      const response: any = await blockBlobClient.downloadToBuffer();
        const base64 = response.toString('base64');
    //   res.setHeader("Content-Type", response.contentType);
    //   res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    //   response.readableStreamBody?.pipe(res);

      return new NextResponse(
        JSON.stringify({
          message: "File found successfully",
          data: base64,
        }),
        {
          status: 200,
        }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: "Error occurred while downloading file" }),
        {
          status: 500,
        }
      );
    }
  } else {
    return new NextResponse(JSON.stringify({ error: "mehtod not allowed" }), {
      status: 404,
    });
  }
};