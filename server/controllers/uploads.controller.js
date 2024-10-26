import tinify from "tinify"; 
import sharp from "sharp"
import path from "path"
import fs from 'fs';
export const compressImage =  async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // Access the uploaded file buffer

    // Compress the image using TinyPNG
    const source = tinify.fromBuffer(fileBuffer);
    const compressedBuffer = await source.toBuffer();

    // Set response headers to prompt download
    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename=optimized.png`,
    });

    // Send the compressed image buffer as response
    res.send(compressedBuffer);
  } catch (error) {
    console.error("Error during image compression:", error);
    res.status(500).json({ message: "Image compression failed", error: error.message });
  }
}

// Convert Image Controller

export const convertImage = async (req, res) => {
  try {
    const { format } = req.params; // Get the desired format (webp, jpeg, png)
    const { buffer, originalname } = req.file; // Get the file buffer from the uploaded file
    const fileName = originalname.split('.')[0]; // Extract the file name
    console.log(fileName)
    const width = 1024; // Resize width
    const quality = 70; // Compression quality for lossy formats

    // Set format-specific options
    let options = {};
    if (format === "webp") {
      options = { quality: quality };
    } else if (format === "jpeg") {
      options = { quality: quality };
    } else if (format === "png") {
      options = { compressionLevel: 9 }; // PNG compression
    } else {
      return res.status(400).json({ error: "Unsupported format" });
    }

    // Convert and resize the image using buffer
    const convertedBuffer = await sharp(buffer)
      .resize({ width })
      .toFormat(format, options)
      .toBuffer(); // Return the output as a buffer

    // Set response headers to prompt file download
    res.set({
      "Content-Type": `image/${format}`,
      "Content-Disposition": `attachment; filename=${fileName}.${format}`,
    });

    // Send the converted image buffer as response
    res.send(convertedBuffer);
  } catch (error) {
    console.error("Error during image conversion:", error);
    res.status(500).json({ message: "Image conversion failed", error: error.message });
  }
};



