import React, { useState } from 'react';

const AlgorithmInfo = ({ algorithm, algorithmData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!algorithmData) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getAlgorithmIcon = (alg) => {
    const icons = {
      huffman: '🌳',
      rle: '🔄',
      lz77: '🔍'
    };
    return icons[alg] || '⚙️';
  };

  const getComplexityColor = (complexity) => {
    if (complexity.includes('O(n)') && !complexity.includes('O(n²)')) {
      return 'text-green-600 bg-green-50';
    } else if (complexity.includes('O(n log n)')) {
      return 'text-yellow-600 bg-yellow-50';
    } else if (complexity.includes('O(n²)')) {
      return 'text-red-600 bg-red-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  const algorithmDetails = {
    huffman: {
      howItWorks: [
        "Analyzes character frequency in the input data",
        "Builds a binary tree with most frequent characters closer to the root",
        "Assigns shorter codes to frequent characters and longer codes to rare ones",
        "Encodes the data using the generated variable-length codes"
      ],
      advantages: [
        "Optimal compression for known character frequencies",
        "No loss of information (lossless compression)",
        "Widely supported and standardized"
      ],
      disadvantages: [
        "Requires two passes through the data",
        "Need to store the code table with compressed data",
        "Not effective for uniformly distributed data"
      ],
      useCases: [
        "Text file compression",
        "JPEG image compression (part of)",
        "ZIP file format"
      ]
    },
    rle: {
      howItWorks: [
        "Scans the input data sequentially",
        "Identifies consecutive identical characters or bytes",
        "Replaces runs with count-value pairs",
        "Maintains original characters for single occurrences"
      ],
      advantages: [
        "Very simple to implement",
        "Fast processing (linear time)",
        "Works well with repetitive data"
      ],
      disadvantages: [
        "Can increase file size for non-repetitive data",
        "Not suitable for text with high entropy",
        "Limited compression ratio for complex data"
      ],
      useCases: [
        "Simple image compression (BMP, PCX)",
        "Fax transmission",
        "Screen recording compression"
      ]
    },
    lz77: {
      howItWorks: [
        "Uses a sliding window approach with search and lookahead buffers",
        "Searches for the longest match in the search window",
        "Encodes matches as (distance, length, next character) tuples",
        "Outputs literal characters when no good match is found"
      ],
      advantages: [
        "Good compression ratios for most data types",
        "No need to store dictionary separately",
        "Adaptive to data patterns"
      ],
      disadvantages: [
        "More complex than simpler algorithms",
        "Can be slower due to search operations",
        "Window size affects both compression and speed"
      ],
      useCases: [
        "PNG image compression",
        "ZIP file compression",
        "General-purpose compression libraries"
      ]
    }
  };

  const details = algorithmDetails[algorithm];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getAlgorithmIcon(algorithm)}</span>
          <div>
            <h2 className="text-xl font-semibold">{algorithmData.name}</h2>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(algorithmData.complexity)}`}>
              {algorithmData.complexity}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </button>
      </div>

      <p className="text-gray-700 mb-4">{algorithmData.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-1">Best For</h4>
          <p className="text-sm text-green-700">{algorithmData.bestFor}</p>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-1">Worst Case</h4>
          <p className="text-sm text-red-700">{algorithmData.worstCase}</p>
        </div>
      </div>

      {isExpanded && details && (
        <div className="border-t pt-4 mt-4 space-y-4">
          {/* How It Works */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              {details.howItWorks.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Advantages */}
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Advantages</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {details.advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
            </div>

            {/* Disadvantages */}
            <div>
              <h4 className="font-semibold text-red-800 mb-2">❌ Disadvantages</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {details.disadvantages.map((disadvantage, index) => (
                  <li key={index}>{disadvantage}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">💡 Common Use Cases</h4>
            <div className="flex flex-wrap gap-2">
              {details.useCases.map((useCase, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Performance Tips</h4>
            <div className="text-sm text-blue-700">
              {algorithm === 'huffman' && (
                <p>Works best with text files that have non-uniform character distribution. Large files with varied content typically achieve better compression ratios.</p>
              )}
              {algorithm === 'rle' && (
                <p>Ideal for files with long sequences of repeated data. Test with simple images, logos, or files with repetitive patterns for best results.</p>
              )}
              {algorithm === 'lz77' && (
                <p>Most effective with files containing repeated patterns or sequences. Works well as a general-purpose compressor for various file types.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmInfo;
