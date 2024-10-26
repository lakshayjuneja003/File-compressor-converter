import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ImageCompressor from "../Components/FileUplaodAndDownload";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Uncomment and add the components for these routes when ready */}
      <Route path="/aboutus" element={<ImageCompressor />} />
      {/* <Route path="/pricing" element={<Pricing />} /> */}
    </Routes>
  );
};

export default AppRoutes;
