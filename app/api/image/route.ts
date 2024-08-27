import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const keyFilename = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE_PATH;
  const bucketName = process.env.GOOGLE_STORAGE_BUCKET;
  if (!keyFilename || !bucketName) {
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 }
    );
  }

  const storage = new Storage({ keyFilename });
  const destination = file.name;
  const bucket = await storage.bucket(bucketName);
  const [exists] = await bucket.exists();
  if (!exists) {
    return NextResponse.json(
      { error: "Bucket does not exist" },
      { status: 500 }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  bucket.file(destination).save(buffer);

  const [signedUrl] = await bucket.file(destination).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60,
  });

  return NextResponse.json({ signedUrl });
}
