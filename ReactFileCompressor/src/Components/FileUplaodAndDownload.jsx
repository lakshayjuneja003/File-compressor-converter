import React, { useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { FileAtom } from "../store/fileStore"; // Import Recoil atom

const ImageCompressor = () => {
  const [file, setFile] = useState(null); // Store the uploaded file temporarily
  const [progress, setProgress] = useState(0); // Store overall progress
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [fileState, setFileState] = useRecoilState(FileAtom); // Recoil state for files

  const MAX_FILE_SIZE_MB = 10; // Maximum file size in MB

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMessage("");
    setProgress(0);

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setFile(selectedFile);
  };

  // Handle file upload and compression
  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3000/upload/compress-image", formData, {
        responseType: "blob", // Important to receive binary data
        onUploadProgress: (progressEvent) => {
          const uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total) * 0.5;
          setProgress(uploadProgress); // Update progress to reflect upload
        },
        onDownloadProgress: (progressEvent) => {
          const downloadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total) * 0.5;
          setProgress((prevProgress) => prevProgress + downloadProgress); // Add download progress
        },
      });

      // Create a download URL for the compressed image
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);

      // Add the new file information to the Recoil state
      setFileState((prevState) => ({
        uploadedFiles: [
          ...prevState.uploadedFiles,
          {
            fileName: file.name,
            downloadUrl: url,
            error: null
          }
        ]
      }));

    } catch (error) {
      console.error("Error uploading and compressing file:", error);
      setErrorMessage("Failed to compress image.");

      // Store the error in the Recoil state for that file
      setFileState((prevState) => ({
        uploadedFiles: [
          ...prevState.uploadedFiles,
          {
            fileName: file.name,
            downloadUrl: null,
            error: "Failed to compress image."
          }
        ]
      }));
    }
  };

  return (
    <div className="container">
      <h2 className="header">Image Compressor</h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        className="file-input"
      />

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Upload Button */}
      <button onClick={handleUpload} className="button upload-button">
        Upload and Compress
      </button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress-container">
          <p>Progress: {Math.round(progress)}%</p>
          <progress value={progress} max="100" className="progress-bar" />
        </div>
      )}

      {/* Render Uploaded Files with Download Links */}
      <div className="uploaded-files">
        {fileState.uploadedFiles.map((fileData, index) => (
          <div key={index} className="file-item">
            <p>{fileData.fileName}</p>
            {fileData.error ? (
              <p className="error-message">{fileData.error}</p>
            ) : (
              <a href={fileData.downloadUrl} download={fileData.fileName} className="downloadLink">
                <button className="button download-button">Download {fileData.fileName}</button>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCompressor;
