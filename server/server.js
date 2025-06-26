const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://data-compression-decompression-portal-awsi-emzkkpw5r.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  }
});

// Import compression algorithms
const huffman = require('./algorithms/huffman');
const rle = require('./algorithms/rle');
const lz77 = require('./algorithms/lz77');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Data Compression Portal API',
    version: '1.0.0',
    endpoints: [
      'POST /api/process - Process files',
      'GET /api/download/:filename - Download files',
      'GET /health - Health check'
    ]
  });
});

// Main processing endpoint
app.post('/api/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { algorithm, mode } = req.body;
    
    if (!algorithm || !mode) {
      return res.status(400).json({ error: 'Algorithm and mode are required' });
    }

    const filePath = req.file.path;
    const originalSize = req.file.size;
    const startTime = Date.now();

    let result;
    
    // Process based on algorithm
    switch (algorithm) {
      case 'huffman':
        result = mode === 'compress' ? 
          await huffman.compress(filePath) : 
          await huffman.decompress(filePath);
        break;
      case 'rle':
        result = mode === 'compress' ? 
          await rle.compress(filePath) : 
          await rle.decompress(filePath);
        break;
      case 'lz77':  
        result = mode === 'compress' ? 
          await lz77.compress(filePath) : 
          await lz77.decompress(filePath);
        break;
      default:
        return res.status(400).json({ error: 'Invalid algorithm' });
    }

    const processingTime = Date.now() - startTime;
    const processedSize = fs.statSync(result.outputPath).size;
    
    // Calculate compression ratio
    const compressionRatio = mode === 'compress' ? 
      ((originalSize - processedSize) / originalSize * 100).toFixed(2) :
      ((processedSize - originalSize) / originalSize * 100).toFixed(2);

    // Clean up original file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      fileName: path.basename(result.outputPath),
      stats: {
        originalSize,
        processedSize,
        compressionRatio: parseFloat(compressionRatio),
        processingTime,
        spaceSaved: originalSize - processedSize
      }
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Processing failed: ' + error.message });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      } else {
        // Clean up file after download
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Data Compression Portal API',
    status: 'Running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
