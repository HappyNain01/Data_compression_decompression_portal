import React from 'react';

const ProgressIndicator = ({ progress, algorithm, mode }) => {
  const getAlgorithmName = (alg) => {
    const names = {
      huffman: 'Huffman Coding',
      rle: 'Run-Length Encoding',
      lz77: 'LZ77'
    };
    return names[alg] || alg;
  };

  const getProgressMessage = (progress, algorithm, mode) => {
    if (progress < 25) {
      return mode === 'compress' ? 'Analyzing file structure...' : 'Reading compressed data...';
    } else if (progress < 50) {
      if (algorithm === 'huffman') {
        return mode === 'compress' ? 'Building frequency table...' : 'Reconstructing Huffman tree...';
      } else if (algorithm === 'rle') {
        return mode === 'compress' ? 'Finding repetitive patterns...' : 'Expanding run-length codes...';
      } else if (algorithm === 'lz77') {
        return mode === 'compress' ? 'Searching for matches...' : 'Resolving references...';
      }
    } else if (progress < 75) {
      if (algorithm === 'huffman') {
        return mode === 'compress' ? 'Generating Huffman codes...' : 'Decoding bit sequences...';
      } else if (algorithm === 'rle') {
        return mode === 'compress' ? 'Encoding repetitive data...' : 'Restoring original sequences...';
      } else if (algorithm === 'lz77') {
        return mode === 'compress' ? 'Creating compressed tokens...' : 'Expanding matched patterns...';
      }
    } else if (progress < 95) {
      return mode === 'compress' ? 'Finalizing compression...' : 'Finalizing decompression...';
    } else {
      return 'Completing process...';
    }
    return 'Processing...';
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="font-medium text-blue-800">
            {mode === 'compress' ? 'Compressing' : 'Decompressing'} with {getAlgorithmName(algorithm)}
          </span>
        </div>
        <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Message */}
      <p className="text-sm text-blue-700">
        {getProgressMessage(progress, algorithm, mode)}
      </p>
    </div>
  );
};

export default ProgressIndicator;
