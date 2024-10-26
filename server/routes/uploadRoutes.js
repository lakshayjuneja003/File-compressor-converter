import express from "express";
import multer from "multer";
import tinify from "tinify"; 
import { compressImage, convertImage } from "../controllers/uploads.controller.js";

const router = express.Router();

// Configure Multer storage options
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage });

// Set TinyPNG API key
tinify.key = "h88T089hcY1f6mk1t44fKHfqGk20h6Xc"; 

// Routes
router.post("/compress-image", upload.single("file"), compressImage);
router.post("/convertImage/:format", upload.single("file"), convertImage); 

export default router;
