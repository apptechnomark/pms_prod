import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { base64Image, fileName } = await req.json();

      const storageAccount = "pmsdevstorage";
      const containerName = "dev/attachment";
      const accessKey =
        "DGOxxmdRHZjwRx7b9B9RAAepyapHAt5qfaXola10qna06K/HExgT1K0FAt2neC8eObJdubeA+QO/+ASteuBecw==";
      const connectionString = `DefaultEndpointsProtocol=https;AccountName=${storageAccount};AccountKey=${accessKey};EndpointSuffix=core.windows.net`;

      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const pdfBuffer = Buffer.from(base64Image, "base64");
      const blockBlobClient: BlockBlobClient =
        containerClient.getBlockBlobClient(fileName);
      const data = await blockBlobClient.uploadData(pdfBuffer, {
        blobHTTPHeaders: { blobContentType: "" },
      });

      return new NextResponse(
        JSON.stringify({ message: "File uploaded successfully", data: data }),
        {
          status: 200,
        }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: "Error occurred while uploading file" }),
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
}
