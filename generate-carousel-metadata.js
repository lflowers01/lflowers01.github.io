import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const carouselDir = path.join(__dirname, 'assets', 'carousel');
const outputFile = path.join(__dirname, 'carousel-metadata.json');

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'];

// Image optimization settings
const MAX_WIDTH = 250;  // Fixed width for carousel images
const MAX_HEIGHT = 333; // Fixed height for carousel images (3:4 portrait ratio)
const JPEG_QUALITY = 85; // Quality for JPEG compression (85 is good balance)
const PNG_QUALITY = 85;  // Quality for PNG compression

async function optimizeImage(filePath) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Check if image needs optimization
    const needsResize = metadata.width !== MAX_WIDTH || metadata.height !== MAX_HEIGHT;
    const fileStats = fs.statSync(filePath);
    const fileSizeKB = fileStats.size / 1024;
    
    if (!needsResize && fileSizeKB < 500) {
      // Image is already the correct size
      return { optimized: false, originalSize: fileSizeKB };
    }

    // Create backup of original (if not already exists)
    const backupPath = filePath.replace(/(\.[^.]+)$/, '.original$1');
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Optimize the image with proper orientation handling and cropping to 3:4 portrait
    let pipeline = image
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'cover',
        position: 'center'
      });

    // Apply format-specific optimization
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true });
    } else if (metadata.format === 'png') {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
    } else if (metadata.format === 'webp') {
      pipeline = pipeline.webp({ quality: JPEG_QUALITY });
    }

    await pipeline.toFile(filePath + '.tmp');
    
    // Replace original with optimized
    fs.renameSync(filePath + '.tmp', filePath);
    
    const newStats = fs.statSync(filePath);
    const newSizeKB = newStats.size / 1024;
    
    return {
      optimized: true,
      originalSize: fileSizeKB,
      newSize: newSizeKB,
      savings: fileSizeKB - newSizeKB
    };
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
    return { optimized: false, error: error.message };
  }
}

try {
  // Check if carousel directory exists
  if (!fs.existsSync(carouselDir)) {
    console.error(`Carousel directory not found: ${carouselDir}`);
    process.exit(1);
  }

  // Read all files in the carousel directory
  const files = fs.readdirSync(carouselDir);
  
  // Filter for image files only (exclude .original backups)
  const imageFiles = files.filter(file => {
    const ext = path.extname(file);
    return imageExtensions.includes(ext) && !file.includes('.original');
  });

  // Sort files alphabetically
  imageFiles.sort();

  console.log('🖼️  Optimizing images...\n');
  
  // Optimize images
  let totalSavings = 0;
  let optimizedCount = 0;
  
  for (const filename of imageFiles) {
    const filePath = path.join(carouselDir, filename);
    const result = await optimizeImage(filePath);
    
    if (result.optimized) {
      optimizedCount++;
      totalSavings += result.savings;
      console.log(`  ✓ ${filename}: ${result.originalSize.toFixed(1)}KB → ${result.newSize.toFixed(1)}KB (saved ${result.savings.toFixed(1)}KB)`);
    } else if (result.error) {
      console.log(`  ✗ ${filename}: Error - ${result.error}`);
    } else {
      console.log(`  ○ ${filename}: Already optimized (${result.originalSize.toFixed(1)}KB)`);
    }
  }
  
  if (optimizedCount > 0) {
    console.log(`\n💾 Total savings: ${totalSavings.toFixed(1)}KB across ${optimizedCount} images`);
  }

  // Generate metadata array
  const metadata = imageFiles.map(filename => {
    // Generate a description from filename (remove extension, replace dashes/underscores with spaces)
    const nameWithoutExt = path.parse(filename).name;
    const description = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word

    return {
      filename: filename,
      description: description
    };
  });

  // Write metadata to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Generated carousel metadata for ${metadata.length} images`);
  console.log(`📁 Output: ${outputFile}`);
  
  if (metadata.length === 0) {
    console.warn('⚠️  No images found in assets/carousel directory');
  }

} catch (error) {
  console.error('❌ Error generating carousel metadata:', error.message);
  process.exit(1);
}
