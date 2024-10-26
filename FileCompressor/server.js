const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = 3000;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the frontend
app.use(express.static('frontend'));
app.use(cors());

// Endpoint to handle file upload and compression
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
        {
            resource_type: 'auto',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }, // Automatic quality and format
            ],
        },
        (error, result) => {
            if (error) {
                console.error('Error during upload:', error);
                return res.status(500).send('Error during upload.');
            }
            res.json({
                success: true,
                url: result.secure_url, // URL of the uploaded and compressed image
            });
        }
    );

    // Pipe the buffer from multer to the Cloudinary upload stream
    uploadStream.end(req.file.buffer); // Use req.file.buffer instead of req.file.stream
});
// Endpoint to handle file download
app.get('/download', async (req, res) => {
    const fileUrl = req.query.url; // Expecting the file URL as a query parameter

    if (!fileUrl) {
        return res.status(400).send('File URL is required.');
    }

    try {
        // Redirect to the file URL (Cloudinary or wherever the file is hosted)
        res.redirect(fileUrl);
    } catch (error) {
        console.error('Error during file download:', error);
        res.status(500).send('Error downloading the file.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
