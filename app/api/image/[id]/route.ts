import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const objectId = params.id;
  if (!objectId) {
    return NextResponse.json({
      status: 400,
      body: { error: "No image ID provided" },
    });
  }

  const keyFilename = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE_PATH;
  const bucketName = process.env.GOOGLE_STORAGE_BUCKET;
  if (!keyFilename || !bucketName) {
    return NextResponse.json({
      status: 500,
      body: { error: "Missing environment variables" },
    });
  }

  const storage = new Storage({ keyFilename });
  const bucket = await storage.bucket(bucketName);
  const [exists] = await bucket.exists();
  if (!exists) {
    return NextResponse.json({
      status: 500,
      body: { error: "Bucket does not exist" },
    });
  }
  const file = bucket.file(objectId);
  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60,
  });

  return NextResponse.json({ signedUrl });
}
