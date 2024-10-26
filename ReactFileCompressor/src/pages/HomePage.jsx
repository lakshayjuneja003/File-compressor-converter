import "../App.css";
import React, { useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { FileAtom } from "../store/fileStore";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/SIdebar/SIdebar";

const HomePage = () => {
  // nav bar states
  const [isopen, setisopen] = useState(false);
  const toggle = () => {
    setisopen(!isopen);
  };
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileState, setFileState] = useRecoilState(FileAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Default: false (menu hidden)
  const MAX_FILE_SIZE_MB = 10;
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMessage("");
    setProgress(0);
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3000/upload/compress-image", formData, {
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          const uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total) * 0.5;
          setProgress(uploadProgress);
        },
        onDownloadProgress: (progressEvent) => {
          const downloadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total) * 0.5;
          setProgress((prev) => prev + downloadProgress);
        },
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);

      setFileState((prevState) => ({
        uploadedFiles: [
          ...prevState.uploadedFiles,
          {
            fileName: file.name,
            downloadUrl: url,
            error: null,
          },
        ],
      }));
    } catch (error) {
      console.error("Error uploading and compressing file:", error);
      setErrorMessage("Failed to compress image.");
      setFileState((prevState) => ({
        uploadedFiles: [
          ...prevState.uploadedFiles,
          {
            fileName: file.name,
            downloadUrl: null,
            error: "Failed to compress image.",
          },
        ],
      }));
    }
  };

  return (
    <div className="container">
      <div className="parent">
      <Navbar toggle={toggle} location={"/"} />
      <Sidebar isopen={isopen} toggle={toggle} />
        <div className="crousel">
          <div className="crouseldiv">
            <img src="george-account-page.webp" className="pandaimg" alt="Panda" />
            <img src="cloud_home.webp" alt="Cloud" className="cloudimg" />
            <img src="bamboo_isolated.webp" alt="Bamboo" className="bambooimg" />
            <div className="leftcrousel">
              <div className="leftcrouselitem">
                <h1>Smart WebP, PNG, and JPEG Compression for Faster Websites</h1>
                <button>Go Web Pro</button>
              </div>
            </div>
            <div className="rightcrousel">
              <div className="rightcrouselitems">
                <section className="filebox">
                  <label className="file-input">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <img src="newpluginbox.svg" alt="Plugin Box" />
                    <h4>Drop Your image here</h4>
                    <h5 className="max-size">Max 5MB File size supported</h5>
                  </label>
                </section>
              </div>
            </div>
          </div>
        </div>
        {file && (
          <UploadStatus
            handleUpload={handleUpload}
            progress={progress}
          />
        )}
        <div className="content">
          <div className="contentdiv">
            <h4 className="contentproduct">Our Products</h4>
            <h1 className="contentoptimization">Optimization for each project</h1>
            <p className="contenttext">
              Tailored solutions for website owners, developers, and designers, ensuring optimal website performance for every project. Discover the advantages of faster loading times with our image optimization tools.
            </p>
            <div className="webpro">
              <div className="main">
                <div className="webprocontent">
                  <img src="crown.svg" alt="Crown" />
                  <h3>
                    <span>Web Pro</span> and <span>Web Ultra</span>
                  </h3>
                  <button>Go Web Pro</button>
                </div>
              </div>
            </div>
            <h4 className="footer-text">Trusted by thousands of companies worldwide</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

const UploadStatus = ({ handleUpload, progress }) => {
  const [fileState] = useRecoilState(FileAtom); // Recoil state for files

  return (
    <div className="upload-status">
      {/* Upload Button */}
      <button onClick={handleUpload} className="button upload-button">
        Upload and Compress
      </button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress-container">
          <p className="progress-text">Progress: {Math.round(progress)}%</p>
          <progress value={progress} max="100" className="progress-bar" />
        </div>
      )}

      {/* Render Uploaded Files with Download Links */}
      <div className="uploaded-files">
        {fileState.uploadedFiles.map((fileData, index) => (
          <div key={index} className="file-item">
            <div className="file-details">
              <p className="file-name">{fileData.fileName}</p>
              <div className="extrainfo">
                <p className="file-type">File Type: {fileData.fileType}</p>
                <p className="file-size">Size: {fileData.fileSize} MB</p>
              </div>
            </div>
            {fileData.error ? (
              <p className="error-message">{fileData.error}</p>
            ) : (
              <a
                href={fileData.downloadUrl}
                download={fileData.fileName}
                className="download-link"
              >
                <button className="button download-button">Download</button>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

