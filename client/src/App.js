import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import CompressionStats from './components/CompressionStats';
import AlgorithmInfo from './components/AlgorithmInfo';
import ProgressIndicator from './components/ProgressIndicator';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('huffman');
  const [selectedMode, setSelectedMode] = useState('compress');
  const [stats, setStats] = useState(null);
  const [algorithms, setAlgorithms] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  // Fetch algorithm information on component mount
  useEffect(() => {
    fetchAlgorithmInfo();
  }, []);

  const fetchAlgorithmInfo = async () => {
    try {
      const response = await fetch('/api/algorithms');
      const data = await response.json();
      setAlgorithms(data);
    } catch (err) {
      console.error('Failed to fetch algorithm info:', err);
    }
  };

  const handleFileProcess = async (file) => {
    setIsProcessing(true);
    setError(null);
    setStats(null);
    setProcessedFile(null);
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('algorithm', selectedAlgorithm);
      formData.append('mode', selectedMode);

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Processing failed');
      }

      setProgress(100);
      setStats(data.stats);
      setProcessedFile(data.fileName);

    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleDownload = async () => {
    if (!processedFile) return;

    try {
      const response = await fetch(`/api/download/${processedFile}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = processedFile;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download file: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Data Compression Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload files and apply various compression algorithms including Huffman Coding, 
              Run-Length Encoding, and LZ77. Compare efficiency and download processed files.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - File Upload & Controls */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">File Processing</h2>

                {/* Algorithm Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Algorithm
                  </label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="select-field"
                    disabled={isProcessing}
                  >
                    <option value="huffman">Huffman Coding</option>
                    <option value="rle">Run-Length Encoding</option>
                    <option value="lz77">LZ77</option>
                  </select>
                </div>

                {/* Mode Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Mode
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="compress"
                        checked={selectedMode === 'compress'}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="mr-2"
                        disabled={isProcessing}
                      />
                      Compress
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="decompress"
                        checked={selectedMode === 'decompress'}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="mr-2"
                        disabled={isProcessing}
                      />
                      Decompress
                    </label>
                  </div>
                </div>

                {/* File Upload */}
                <FileUpload 
                  onFileProcess={handleFileProcess}
                  isProcessing={isProcessing}
                  selectedMode={selectedMode}
                />

                {/* Progress Indicator */}
                {isProcessing && (
                  <ProgressIndicator 
                    progress={progress}
                    algorithm={selectedAlgorithm}
                    mode={selectedMode}
                  />
                )}

                {/* Error Display */}
                {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

                {/* Download Button */}
                {processedFile && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-green-800">Processing Complete!</h3>
                        <p className="text-sm text-green-600">Your file is ready for download.</p>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="btn-primary bg-green-600 hover:bg-green-700"
                      >
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Algorithm Information */}
              <AlgorithmInfo 
                algorithm={selectedAlgorithm}
                algorithmData={algorithms[selectedAlgorithm]}
              />
            </div>

            {/* Right Column - Statistics & Visualization */}
            <div className="space-y-6">
              {stats ? (
                <CompressionStats 
                  stats={stats}
                  algorithm={selectedAlgorithm}
                  mode={selectedMode}
                />
              ) : (
                <div className="card">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      Upload a file to see statistics
                    </h3>
                    <p className="text-gray-500">
                      Compression ratios, file sizes, and processing time will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
