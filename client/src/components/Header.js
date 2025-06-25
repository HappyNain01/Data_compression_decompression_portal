import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🗜️</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Compression Portal</h1>
              <p className="text-xs text-gray-500">Data Compression & Decompression</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#algorithms" 
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Algorithms
            </a>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              About
            </a>
            <a 
              href="https://github.com/yourusername/compression-portal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center space-x-1"
            >
              <span>GitHub</span>
              <span className="text-sm">↗</span>
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
