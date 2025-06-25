import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🗜️</span>
              <span className="font-bold text-lg text-gray-800">Compression Portal</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              A comprehensive web application for file compression and decompression using 
              multiple algorithms including Huffman Coding, Run-Length Encoding, and LZ77.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/yourusername/compression-portal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Algorithms */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Algorithms</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span>🌳</span>
                <span>Huffman Coding</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🔄</span>
                <span>Run-Length Encoding</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🔍</span>
                <span>LZ77</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• File Upload & Download</li>
              <li>• Compression Statistics</li>
              <li>• Algorithm Explanations</li>
              <li>• Performance Visualization</li>
              <li>• Error Handling</li>
              <li>• Responsive Design</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {currentYear} Compression Portal. Built with React.js and Node.js.
          </div>
          <div className="text-sm text-gray-500 mt-4 md:mt-0">
            Educational project demonstrating data compression algorithms.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
