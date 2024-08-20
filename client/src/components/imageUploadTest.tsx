import React, { useState } from "react";
import { httpClient } from "../api/http";

const ImageUploadTest: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      setUploadStatus("No files selected.");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await httpClient.post("/s3test", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadStatus("Files uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload files.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.status);
        setUploadStatus(
          `Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error(error.message);
      }
    }
  };

  const handleGetImage = async () => {
    try {
      const response = await httpClient.get("/s3test");
      if (response) {
        setImageSrc(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = async () => {
    await httpClient.delete("/s3test");
  };

  return (
    <div>
      <h1>S3 Image Upload Test</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to S3</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      <button onClick={handleDeleteImage}>Delete from S3</button>
      <button onClick={handleGetImage}>Get Image</button>
      {imageSrc &&
        imageSrc.map((srcLink, idx) => (
          <img src={srcLink} alt="Uploaded from S3" key={idx} />
        ))}
      {!imageSrc && <h1>사진 없다</h1>}
    </div>
  );
};

export default ImageUploadTest;
