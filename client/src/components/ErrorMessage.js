import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="text-red-500 text-xl">⚠️</div>
          <div>
            <h3 className="font-medium text-red-800">Processing Error</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>

            {/* Common error suggestions */}
            <div className="mt-3 text-xs text-red-600">
              <p className="font-medium mb-1">Common solutions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure file size is under 10MB</li>
                <li>Check if the file format is supported</li>
                <li>For decompression, make sure the file was compressed with the same algorithm</li>
                <li>Try a different compression algorithm</li>
              </ul>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 text-lg font-bold"
            title="Close error message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
