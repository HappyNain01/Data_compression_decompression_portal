const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const huffman = require('./algorithms/huffman');
const rle = require('./algorithms/rle');
const lz77 = require('./algorithms/lz77');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  limits: { fileSize: parseInt(process.env.UPLOAD_LIMIT) || 10 * 1024 * 1024 }
});

// Process file endpoint
app.post('/api/process', upload.single('file'), (req, res) => {
  const { algorithm, mode } = req.body;
  const inputPath = req.file.path;
  const originalSize = req.file.size;

  try {
    // Read file based on type
    let inputData;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Handle different file types
    if (['.txt', '.js', '.html', '.css', '.json'].includes(fileExtension)) {
      inputData = fs.readFileSync(inputPath, 'utf-8');
    } else {
      inputData = fs.readFileSync(inputPath);
    }

    const startTime = Date.now();
    let outputData;
    let processedSize;

    // Process based on algorithm
    switch(algorithm) {
      case 'huffman':
        outputData = mode === 'compress' 
          ? huffman.compress(inputData) 
          : huffman.decompress(inputData);
        break;
      case 'rle':
        outputData = mode === 'compress' 
          ? rle.compress(inputData) 
          : rle.decompress(inputData);
        break;
      case 'lz77':
        outputData = mode === 'compress' 
          ? lz77.compress(inputData) 
          : lz77.decompress(inputData);
        break;
      default:
        throw new Error('Unknown algorithm');
    }

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    // Save processed file
    const outputFileName = `${mode}ed_${Date.now()}_${req.file.originalname}`;
    const outputPath = path.join('uploads', outputFileName);

    if (typeof outputData === 'string') {
      fs.writeFileSync(outputPath, outputData, 'utf-8');
      processedSize = Buffer.byteLength(outputData, 'utf-8');
    } else {
      fs.writeFileSync(outputPath, outputData);
      processedSize = outputData.length;
    }

    // Calculate compression ratio
    const compressionRatio = mode === 'compress' 
      ? ((originalSize - processedSize) / originalSize * 100).toFixed(2)
      : ((processedSize - originalSize) / originalSize * 100).toFixed(2);

    // Send response with statistics
    res.json({
      success: true,
      fileName: outputFileName,
      stats: {
        originalSize,
        processedSize,
        compressionRatio: parseFloat(compressionRatio),
        processingTime,
        spaceSaved: originalSize - processedSize
      }
    });

  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).json({
      success: false,
      error: 'Processing error: ' + err.message
    });
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
  }
});

// Download processed file endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      } else {
        // Clean up file after download
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, 30000); // Delete after 30 seconds
      }
    });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Algorithm info endpoint
app.get('/api/algorithms', (req, res) => {
  const algorithms = {
    huffman: {
      name: "Huffman Coding",
      description: "A lossless data compression algorithm that uses variable-length codes to represent characters. More frequent characters get shorter codes, while less frequent characters get longer codes.",
      complexity: "O(n log n) time complexity",
      bestFor: "Text files with non-uniform character distribution",
      worstCase: "Files with uniform character distribution"
    },
    rle: {
      name: "Run-Length Encoding",
      description: "A simple compression algorithm that replaces sequences of the same data value (runs) with a single data value and count.",
      complexity: "O(n) time complexity",
      bestFor: "Files with long sequences of repeated data (images, simple graphics)",
      worstCase: "Files with no repeated sequences"
    },
    lz77: {
      name: "LZ77",
      description: "A dictionary-based compression algorithm that uses a sliding window approach. It replaces repeated occurrences of data with references to a single copy.",
      complexity: "O(n) to O(n²) time complexity",
      bestFor: "General-purpose compression with good compression ratios",
      worstCase: "Very small files or files with no repetition"
    }
  };

  res.json(algorithms);
});

// Serve React app for all other routes (in production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
