# Data Compression & Decompression Portal

A comprehensive web application that allows users to upload files and apply various data compression algorithms (Huffman Coding, Run-Length Encoding, LZ77) to reduce file size, as well as decompress previously compressed files. The system demonstrates the efficiency of different algorithms by providing compression ratios and allows users to download the processed files.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://compression-portal.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-green)](https://github.com/yourusername/compression-portal)

## Features

### Core Functionality
- **File Upload**: Support for text, image, and binary files (up to 10MB)
- **Multiple Compression Algorithms**: Huffman Coding, Run-Length Encoding (RLE), and LZ77
- **Compression & Decompression**: Bidirectional processing with the same algorithms
- **Real-time Statistics**: Compression ratios, file sizes, processing time, and space savings
- **File Download**: Download processed files with appropriate naming conventions
- **Progress Tracking**: Real-time progress indicators with algorithm-specific status messages

### Educational Components
- **Algorithm Explanations**: Detailed descriptions of each compression method
- **Performance Analysis**: Time complexity, best/worst case scenarios
- **Interactive Visualizations**: Charts showing compression statistics using Chart.js
- **Efficiency Ratings**: Smart analysis of compression effectiveness

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Error Handling**: Comprehensive error messages and recovery suggestions
- **File Type Detection**: Automatic handling of different file formats
- **Drag & Drop**: Intuitive file upload interface
- **Processing Feedback**: Visual indicators during file processing

## Tech Stack

### Frontend
- **Framework**: React.js 18
- **Styling**: Tailwind CSS 3.3
- **Charts**: Chart.js 4.4 with react-chartjs-2
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **File Upload**: Multer
- **CORS**: cors middleware
- **File System**: Node.js fs module

### Compression Algorithms (Custom Implementation)
- **Huffman Coding**: Variable-length encoding with binary tree
- **Run-Length Encoding**: Sequential repetition compression
- **LZ77**: Dictionary-based sliding window compression

### Deployment
- **Frontend**: Vercel (recommended) / Netlify
- **Backend**: Render / Heroku / Railway

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/compression-portal.git
   cd compression-portal
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```
   This will start:
   - Backend server on `http://localhost:5000`
   - React frontend on `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000` to use the application.

## Project Structure

```
compression-portal/
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html              # Main HTML template
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── FileUpload.js       # File upload with drag & drop
│   │   │   ├── CompressionStats.js # Statistics with charts
│   │   │   ├── AlgorithmInfo.js    # Algorithm explanations
│   │   │   ├── ProgressIndicator.js # Processing progress
│   │   │   ├── ErrorMessage.js     # Error handling
│   │   │   ├── Header.js           # App header
│   │   │   └── Footer.js           # App footer
│   │   ├── styles/
│   │   │   └── index.css           # Tailwind CSS styles
│   │   ├── App.js                  # Main app component
│   │   └── index.js                # React entry point
│   ├── package.json                # Client dependencies
│   ├── tailwind.config.js          # Tailwind configuration
│   └── postcss.config.js           # PostCSS configuration
├── server/                          # Node.js backend
│   ├── algorithms/                 # Compression algorithms
│   │   ├── huffman.js              # Huffman coding implementation
│   │   ├── rle.js                  # Run-length encoding
│   │   └── lz77.js                 # LZ77 compression
│   ├── uploads/                    # Temporary file storage
│   ├── server.js                   # Express server
│   └── package.json                # Server dependencies
├── package.json                    # Root package.json
└── README.md                       # Project documentation
```

## 🔧 API Endpoints

### POST /api/process
Process (compress or decompress) uploaded files.

**Request:**
- `file`: Uploaded file (multipart/form-data)
- `algorithm`: 'huffman' | 'rle' | 'lz77'
- `mode`: 'compress' | 'decompress'

**Response:**
```json
{
  "success": true,
  "fileName": "compressed_1640995200000_example.txt",
  "stats": {
    "originalSize": 1024,
    "processedSize": 512,
    "compressionRatio": 50.0,
    "processingTime": 15,
    "spaceSaved": 512
  }
}
```

### GET /api/download/:filename
Download processed files.

### GET /api/algorithms
Get information about available algorithms.

## Algorithm Implementations

### Huffman Coding
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Best For**: Text files with non-uniform character distribution
- **Implementation**: Custom binary tree with min-heap priority queue

### Run-Length Encoding (RLE)
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **Best For**: Files with long sequences of repeated data
- **Implementation**: Sequential scan with count-value encoding

### LZ77
- **Time Complexity**: O(n) to O(n²)
- **Space Complexity**: O(1)
- **Best For**: General-purpose compression
- **Implementation**: Sliding window with configurable buffer sizes

## Performance Characteristics

| Algorithm | Text Files | Images | Binary | Speed | Compression Ratio |
|-----------|------------|--------|--------|-------|-------------------|
| Huffman   | Excellent  | Good   | Good   | Medium| High              |
| RLE       | Poor       | Excellent| Medium| Fast  | Variable          |
| LZ77      | Good       | Good   | Good   | Medium| Medium-High       |

## Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   cd client
   vercel
   ```

2. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `build`

### Backend Deployment (Render)

1. **Create Render account** and connect your GitHub repository

2. **Configure service**
   - Environment: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

3. **Set environment variables**
   ```
   NODE_ENV=production
   PORT=5000
   ```

### Environment Variables

Create `.env` files for environment-specific configuration:

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
UPLOAD_LIMIT=10485760
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing the Application

### Manual Testing Checklist

1. **File Upload**
   - [ ] Drag and drop functionality
   - [ ] File size validation (10MB limit)
   - [ ] Multiple file format support

2. **Compression Testing**
   - [ ] Text files (.txt, .md, .js)
   - [ ] Image files (.jpg, .png, .gif)
   - [ ] Binary files (.pdf, .zip)

3. **Algorithm Testing**
   - [ ] Huffman compression/decompression
   - [ ] RLE compression/decompression
   - [ ] LZ77 compression/decompression

4. **Statistics Display**
   - [ ] Compression ratios
   - [ ] Processing times
   - [ ] File size comparisons
   - [ ] Chart visualizations

## Acknowledgments

- Algorithm implementations based on academic research
- Chart.js for beautiful data visualizations
- Tailwind CSS for responsive design
- React community for excellent documentation


## Demo Video

Watch the full demonstration: [Demo Video Link](https://drive.google.com/your-demo-video)

The demo covers:
- File upload and algorithm selection
- Compression and decompression processes
- Statistics visualization
- Download functionality
- Algorithm explanations

---


