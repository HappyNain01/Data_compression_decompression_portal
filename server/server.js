const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow your frontend domain
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://data-compression-decompression-port-liart.vercel.app'
    ];
    const vercelRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;
    
    if (!origin || allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Basic middleware BEFORE file upload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for specific routes only
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
  }
});

// Health check endpoint (NO FILE UPLOAD MIDDLEWARE)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Data Compression Server is running',
    timestamp: new Date().toISOString()
  });
});

// API info endpoint (NO FILE UPLOAD MIDDLEWARE)
app.get('/api', (req, res) => {
  res.json({
    message: 'Data Compression Portal API',
    version: '1.0.0',
    endpoints: [
      'POST /api/process - Process files',
      'GET /api/download/:filename - Download files',
      'GET /health - Health check',
      'GET /api - API information'
    ]
  });
});

// Root endpoint (NO FILE UPLOAD MIDDLEWARE)
app.get('/', (req, res) => {
  res.json({
    message: 'Data Compression Portal Backend',
    status: 'Running',
    version: '1.0.0',
    docs: '/api'
  });
});

// File processing endpoint (WITH FILE UPLOAD MIDDLEWARE)
app.post('/api/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please select a file to process'
      });
    }

    const { algorithm, mode } = req.body;
    
    if (!algorithm || !mode) {
      return res.status(400).json({ 
        error: 'Missing parameters',
        message: 'Algorithm and mode (compress/decompress) are required'
      });
    }

    const filePath = req.file.path;
    const originalSize = req.file.size;
    const startTime = Date.now();

    // Basic compression simulation (replace with actual algorithms)
    let processedSize;
    let outputFileName;

    if (mode === 'compress') {
      // Simulate compression
      processedSize = Math.floor(originalSize * 0.7); // 30% compression
      outputFileName = `compressed_${req.file.filename}`;
    } else {
      // Simulate decompression
      processedSize = Math.floor(originalSize * 1.3); // Decompression expansion
      outputFileName = `decompressed_${req.file.filename}`;
    }

    const processingTime = Date.now() - startTime;
    const compressionRatio = ((originalSize - processedSize) / originalSize * 100).toFixed(2);

    // Create a copy of the file with new name (simulating processing)
    const outputPath = path.join(uploadsDir, outputFileName);
    fs.copyFileSync(filePath, outputPath);

    // Clean up original file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      fileName: outputFileName,
      downloadUrl: `/api/download/${outputFileName}`,
      stats: {
        originalSize,
        processedSize,
        compressionRatio: parseFloat(compressionRatio),
        processingTime,
        spaceSaved: originalSize - processedSize,
        algorithm,
        mode
      }
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: 'Processing failed',
      message: error.message 
    });
  }
});

// Download endpoint (NO FILE UPLOAD MIDDLEWARE)
app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        error: 'File not found',
        message: 'The requested file does not exist or has expired'
      });
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

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large',
        message: 'Maximum file size is 10MB'
      });
    }
  }
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api',
      'POST /api/process',
      'GET /api/download/:filename'
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Data Compression Server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
  console.log(`🌐 CORS enabled for development and production`);
});

