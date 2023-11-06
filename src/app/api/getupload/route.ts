/* eslint-disable import/no-anonymous-default-export */
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse)  {
  if (req.method === "POST") {
    try {
      const { fileName } = await req.json();
console.log("object: ",fileName)
      // Azure Blob Storage Configuration
      const storageAccount = "pmsdevstorage";
      const containerName = "dev/attachment";
      const accessKey =
        "DGOxxmdRHZjwRx7b9B9RAAepyapHAt5qfaXola10qna06K/HExgT1K0FAt2neC8eObJdubeA+QO/+ASteuBecw==";
      const connectionString = `DefaultEndpointsProtocol=https;AccountName=${storageAccount};AccountKey=${accessKey};EndpointSuffix=core.windows.net`;

      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
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
