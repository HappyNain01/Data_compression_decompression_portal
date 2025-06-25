function compress(data) {
  const text = typeof data === 'string' ? data : data.toString();

  if (text.length === 0) {
    return '';
  }

  let compressed = '';
  let count = 1;
  let currentChar = text[0];

  for (let i = 1; i < text.length; i++) {
    if (text[i] === currentChar && count < 255) {
      count++;
    } else {
      // Encode the run
      if (count === 1) {
        // Single character - check if it needs escaping
        if (currentChar === '\\') {
          compressed += '\\\\'; // Escape backslash
        } else if (/^\d+$/.test(currentChar)) {
          compressed += '\\' + currentChar; // Escape numbers
        } else {
          compressed += currentChar;
        }
      } else {
        // Multiple characters
        compressed += count + currentChar;
      }

      currentChar = text[i];
      count = 1;
    }
  }

  // Handle the last run
  if (count === 1) {
    if (currentChar === '\\') {
      compressed += '\\\\';
    } else if (/^\d+$/.test(currentChar)) {
      compressed += '\\' + currentChar;
    } else {
      compressed += currentChar;
    }
  } else {
    compressed += count + currentChar;
  }

  return compressed;
}

function decompress(compressedData) {
  if (typeof compressedData !== 'string' || compressedData.length === 0) {
    return '';
  }

  let decompressed = '';
  let i = 0;

  while (i < compressedData.length) {
    let currentChar = compressedData[i];

    // Handle escape sequences
    if (currentChar === '\\' && i + 1 < compressedData.length) {
      if (compressedData[i + 1] === '\\') {
        // Escaped backslash
        decompressed += '\\';
        i += 2;
        continue;
      } else {
        // Escaped character
        decompressed += compressedData[i + 1];
        i += 2;
        continue;
      }
    }

    // Check if current character is a digit (start of count)
    if (/\d/.test(currentChar)) {
      let countStr = '';
      let j = i;

      // Read the full number
      while (j < compressedData.length && /\d/.test(compressedData[j])) {
        countStr += compressedData[j];
        j++;
      }

      if (j < compressedData.length) {
        const count = parseInt(countStr);
        const char = compressedData[j];

        // Add repeated character
        decompressed += char.repeat(count);
        i = j + 1;
      } else {
        // No character after count - treat as literal
        decompressed += countStr;
        i = j;
      }
    } else {
      // Single character
      decompressed += currentChar;
      i++;
    }
  }

  return decompressed;
}

// Alternative binary RLE for better compression of binary data
function compressBinary(data) {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const compressed = [];

  if (buffer.length === 0) {
    return Buffer.alloc(0);
  }

  let count = 1;
  let currentByte = buffer[0];

  for (let i = 1; i < buffer.length; i++) {
    if (buffer[i] === currentByte && count < 255) {
      count++;
    } else {
      // Store count and byte
      compressed.push(count, currentByte);
      currentByte = buffer[i];
      count = 1;
    }
  }

  // Handle the last run
  compressed.push(count, currentByte);

  return Buffer.from(compressed);
}

function decompressBinary(compressedData) {
  const buffer = Buffer.isBuffer(compressedData) ? compressedData : Buffer.from(compressedData);
  const decompressed = [];

  for (let i = 0; i < buffer.length; i += 2) {
    if (i + 1 < buffer.length) {
      const count = buffer[i];
      const byte = buffer[i + 1];

      for (let j = 0; j < count; j++) {
        decompressed.push(byte);
      }
    }
  }

  return Buffer.from(decompressed);
}

module.exports = {
  compress,
  decompress,
  compressBinary,
  decompressBinary
};
