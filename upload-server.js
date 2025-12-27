import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import http from 'http';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.UPLOAD_PORT || 3001;
const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD || 'SecureUploadPass123!';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', '*'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure multer for temporary file storage
const upload = multer({ 
  dest: 'uploads/temp/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir('uploads/temp');
ensureDir('src/assets/carousel');

// Carousel metadata file
const carouselMetaFile = 'carousel-metadata.json';

const loadCarouselMeta = () => {
  try {
    if (fs.existsSync(carouselMetaFile)) {
      return JSON.parse(fs.readFileSync(carouselMetaFile, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading metadata:', error);
  }
  return [];
};

const saveCarouselMeta = (data) => {
  try {
    fs.writeFileSync(carouselMetaFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving metadata:', error);
    throw error;
  }
};

// Password verification middleware
const verifyPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password !== UPLOAD_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Upload server is running', password: UPLOAD_PASSWORD });
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), verifyPassword, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { description } = req.body;
    const uniqueName = `carousel-${crypto.randomBytes(8).toString('hex')}-${Date.now()}`;
    const outputPath = path.join('src/assets/carousel', `${uniqueName}.jpg`);

    console.log(`Processing image: ${req.file.originalname}`);

    // Optimize image with sharp while maintaining aspect ratio
    await sharp(req.file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);

    console.log(`Image saved to: ${outputPath}`);

    // Clean up temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Save metadata to both locations
    const meta = loadCarouselMeta();
    const newImage = {
      id: uniqueName,
      filename: `${uniqueName}.jpg`,
      description: description || 'Carousel image',
      uploadedAt: new Date().toISOString()
    };
    meta.push(newImage);
    saveCarouselMeta(meta);

    // Also save to src folder for dev server
    const srcMetaFile = 'src/carousel-metadata.json';
    try {
      fs.writeFileSync(srcMetaFile, JSON.stringify(meta, null, 2));
      console.log(`Updated metadata: ${srcMetaFile}`);
    } catch (e) {
      console.error('Error saving to src metadata:', e);
    }

    res.json({
      success: true,
      message: 'Image uploaded and optimized successfully',
      image: {
        id: uniqueName,
        filename: `${uniqueName}.jpg`,
        description: description || 'Carousel image'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error cleaning up temp file:', e);
      }
    }
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

// Get carousel images endpoint
app.get('/api/carousel', (req, res) => {
  try {
    const meta = loadCarouselMeta();
    res.json(meta);
  } catch (error) {
    console.error('Error getting carousel:', error);
    res.status(500).json({ error: 'Failed to load carousel images' });
  }
});

// Reorder carousel images endpoint
app.post('/api/reorder', express.json(), verifyPassword, (req, res) => {
  try {
    const { newOrder } = req.body;
    
    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const meta = loadCarouselMeta();
    const reorderedMeta = newOrder.map(id => {
      const image = meta.find(img => img.id === id);
      if (!image) {
        throw new Error(`Image with id ${id} not found`);
      }
      return image;
    });

    saveCarouselMeta(reorderedMeta);

    // Also save to src folder for dev server
    const srcMetaFile = 'src/carousel-metadata.json';
    try {
      fs.writeFileSync(srcMetaFile, JSON.stringify(reorderedMeta, null, 2));
      console.log(`Updated metadata: ${srcMetaFile}`);
    } catch (e) {
      console.error('Error saving to src metadata:', e);
    }

    res.json({ success: true, message: 'Images reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Failed to reorder images: ' + error.message });
  }
});

// Delete image endpoint
app.post('/api/delete/:id', express.json(), verifyPassword, (req, res) => {
  try {
    const { id } = req.params;
    const meta = loadCarouselMeta();
    const imageIndex = meta.findIndex(img => img.id === id);

    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imagePath = path.join('src/assets/carousel', meta[imageIndex].filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image: ${imagePath}`);
    }

    meta.splice(imageIndex, 1);
    saveCarouselMeta(meta);

    // Also save to src folder for dev server
    const srcMetaFile = 'src/carousel-metadata.json';
    try {
      fs.writeFileSync(srcMetaFile, JSON.stringify(meta, null, 2));
      console.log(`Updated metadata: ${srcMetaFile}`);
    } catch (e) {
      console.error('Error saving to src metadata:', e);
    }

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image: ' + error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error: ' + err.message });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    Upload Server Running               ║
║    http://localhost:${PORT}              ║
║    API: http://localhost:${PORT}/api     ║
║    Password: ${UPLOAD_PASSWORD}              ║
╚════════════════════════════════════════╝
  `);
  console.log('Ready to accept uploads...\n');
});