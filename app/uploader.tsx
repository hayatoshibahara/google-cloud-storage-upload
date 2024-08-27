"use client";

import { useRef } from "react";
import { useState } from "react";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function UploadButton() {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setDisabled(true);
          const file = fileInputRef.current?.files?.[0];
          if (!file) throw new Error("No file selected");
          const formData = new FormData();
          formData.append("image", file);
          const response = await fetch("/api/image", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) throw new Error("Failed to upload image");
          // Delay is required for the processing signed URL in Google Cloud Storage
          await delay(5000);
          const getResponse = await fetch("/api/image/" + file.name);
          const getJson = await getResponse.json();
          setSignedUrl(getJson.signedUrl);
          setDisabled(false);
        }}
      >
        <input
          type="file"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          disabled={disabled}
        />
        <input
          disabled={disabled}
          type="submit"
          value="Upload Image"
          className="px-4 py-2 bg-blue-500 text-white rounded w-full mt-4 disabled:bg-gray-200"
        />
      </form>
      {signedUrl && (
        <img className="max-w-60" src={signedUrl} alt="Uploaded Image" />
      )}
    </>
  );
}
