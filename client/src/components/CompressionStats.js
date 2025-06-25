import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CompressionStats = ({ stats, algorithm, mode }) => {
  if (!stats) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Bar chart data for size comparison
  const barChartData = {
    labels: ['Original Size', 'Processed Size'],
    datasets: [
      {
        label: 'File Size (bytes)',
        data: [stats.originalSize, stats.processedSize],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          mode === 'compress' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          mode === 'compress' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'File Size Comparison',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Size: ${formatFileSize(context.raw)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatFileSize(value);
          },
        },
      },
    },
  };

  // Doughnut chart for compression ratio
  const doughnutData = {
    labels: ['Compressed', 'Space Saved'],
    datasets: [
      {
        data: [
          mode === 'compress' ? stats.processedSize : stats.originalSize,
          mode === 'compress' ? Math.abs(stats.spaceSaved) : Math.abs(stats.spaceSaved),
        ],
        backgroundColor: [
          mode === 'compress' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          mode === 'compress' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: mode === 'compress' ? 'Compression Ratio' : 'Decompression Result',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${formatFileSize(context.raw)}`;
          },
        },
      },
    },
  };

  const getAlgorithmName = (alg) => {
    const names = {
      huffman: 'Huffman Coding',
      rle: 'Run-Length Encoding',
      lz77: 'LZ77'
    };
    return names[alg] || alg;
  };

  const getEfficiencyLevel = (ratio) => {
    const absRatio = Math.abs(ratio);
    if (absRatio >= 50) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (absRatio >= 30) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (absRatio >= 10) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const efficiency = getEfficiencyLevel(stats.compressionRatio);

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">
          {mode === 'compress' ? 'Compression' : 'Decompression'} Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatFileSize(stats.originalSize)}
            </div>
            <div className="text-sm text-blue-800">Original Size</div>
          </div>

          <div className={`text-center p-4 rounded-lg ${
            mode === 'compress' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className={`text-2xl font-bold ${
              mode === 'compress' ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatFileSize(stats.processedSize)}
            </div>
            <div className={`text-sm ${
              mode === 'compress' ? 'text-green-800' : 'text-red-800'
            }`}>
              {mode === 'compress' ? 'Compressed' : 'Decompressed'} Size
            </div>
          </div>

          <div className={`text-center p-4 rounded-lg ${efficiency.bg}`}>
            <div className={`text-2xl font-bold ${efficiency.color}`}>
              {stats.compressionRatio > 0 ? '+' : ''}{stats.compressionRatio}%
            </div>
            <div className={`text-sm ${efficiency.color}`}>
              {mode === 'compress' ? 'Space Saved' : 'Size Change'}
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(stats.processingTime)}
            </div>
            <div className="text-sm text-purple-800">Processing Time</div>
          </div>
        </div>

        {/* Algorithm and Efficiency Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-600">Algorithm: </span>
            <span className="font-medium text-gray-800">{getAlgorithmName(algorithm)}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${efficiency.bg} ${efficiency.color}`}>
            {efficiency.level} Efficiency
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="card">
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="card">
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Analysis</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Algorithm Performance:</strong> {getAlgorithmName(algorithm)} 
            {mode === 'compress' ? ' compressed' : ' decompressed'} your file 
            {mode === 'compress' && stats.compressionRatio > 0 && 
              ` by ${stats.compressionRatio}%, saving ${formatFileSize(Math.abs(stats.spaceSaved))}`
            }
            {mode === 'compress' && stats.compressionRatio <= 0 && 
              ` but the result was ${Math.abs(stats.compressionRatio)}% larger due to algorithm overhead`
            }
            {mode === 'decompress' && 
              ` successfully, restoring the original data structure`
            }.
          </p>

          <p>
            <strong>Processing Speed:</strong> The operation completed in {formatTime(stats.processingTime)}, 
            processing approximately {formatFileSize(stats.originalSize / (stats.processingTime / 1000))} per second.
          </p>

          {mode === 'compress' && (
            <p>
              <strong>Compression Efficiency:</strong> 
              {stats.compressionRatio > 50 && 
                " Excellent compression ratio! This algorithm works very well with your file type."
              }
              {stats.compressionRatio > 20 && stats.compressionRatio <= 50 && 
                " Good compression achieved. The algorithm found patterns in your data to reduce size effectively."
              }
              {stats.compressionRatio > 0 && stats.compressionRatio <= 20 && 
                " Moderate compression. Your file may have limited redundancy for this algorithm."
              }
              {stats.compressionRatio <= 0 && 
                " No compression achieved. The file may already be compressed or have high entropy."
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompressionStats;
