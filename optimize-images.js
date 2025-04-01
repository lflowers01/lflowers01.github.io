import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "src/assets"; // Directory containing original images
const outputDir = "optimized-assets"; // Directory for optimized images at the root
const maxWidth = 850; // Maximum width for images

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to optimize images
const optimizeImages = (dir, output) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const outputFilePath = path.join(output, file); // Keep the original extension

    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursively optimize images in subdirectories
      if (!fs.existsSync(outputFilePath)) {
        fs.mkdirSync(outputFilePath, { recursive: true });
      }
      optimizeImages(filePath, outputFilePath);
    } else if (/\.(jpg|jpeg)$/i.test(file)) {
      // Optimize JPG images
      console.log(`Processing ${file}...`);
      sharp(filePath)
        .rotate() // Automatically correct orientation based on EXIF data
        .resize({ width: maxWidth, withoutEnlargement: true }) // Resize to maxWidth, without enlarging smaller images
        .toFormat("jpeg", { quality: 80 }) // Keep as JPEG with 80% quality
        .toFile(outputFilePath)
        .then(() => console.log(`Optimized and saved: ${outputFilePath}`))
        .catch((err) => console.error(`Error optimizing ${file}:`, err));
    } else if (/\.(png)$/i.test(file)) {
      // Optimize PNG images
      console.log(`Processing ${file}...`);
      sharp(filePath)
        .rotate() // Automatically correct orientation based on EXIF data
        .resize({ width: maxWidth, withoutEnlargement: true }) // Resize to maxWidth, without enlarging smaller images
        .toFormat("png", { compressionLevel: 9 }) // Keep as PNG with maximum compression
        .toFile(outputFilePath)
        .then(() => console.log(`Optimized and saved: ${outputFilePath}`))
        .catch((err) => console.error(`Error optimizing ${file}:`, err));
    } else if (/\.(gif)$/i.test(file)) {
      // Copy GIFs without resizing
      console.log(`Copying GIF: ${file}`);
      fs.copyFileSync(filePath, outputFilePath);
    } else {
      console.log(`Skipping unsupported file: ${file}`);
    }
  });
};

// Start optimization
console.log("Starting image optimization...");
optimizeImages(inputDir, outputDir);
console.log("Image optimization completed.");
