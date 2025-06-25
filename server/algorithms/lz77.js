class LZ77 {
  constructor(windowSize = 4096, lookaheadSize = 18) {
    this.windowSize = windowSize;
    this.lookaheadSize = lookaheadSize;
  }

  findLongestMatch(data, currentPos) {
    const windowStart = Math.max(0, currentPos - this.windowSize);
    const windowEnd = currentPos;
    const lookaheadEnd = Math.min(data.length, currentPos + this.lookaheadSize);

    let bestMatch = { distance: 0, length: 0 };

    // Search for matches in the search window
    for (let i = windowStart; i < windowEnd; i++) {
      let matchLength = 0;

      // Find the length of the match
      while (
        currentPos + matchLength < lookaheadEnd &&
        data[i + matchLength] === data[currentPos + matchLength]
      ) {
        matchLength++;
      }

      // Update best match if this one is longer
      if (matchLength > bestMatch.length) {
        bestMatch = {
          distance: currentPos - i,
          length: matchLength
        };
      }
    }

    return bestMatch;
  }

  compress(data) {
    const input = typeof data === 'string' ? data : data.toString();
    const compressed = [];
    let pos = 0;

    while (pos < input.length) {
      const match = this.findLongestMatch(input, pos);

      if (match.length >= 3) {
        // Found a match of sufficient length
        compressed.push({
          type: 'match',
          distance: match.distance,
          length: match.length,
          nextChar: pos + match.length < input.length ? input[pos + match.length] : null
        });
        pos += match.length + 1;
      } else {
        // No good match found, output literal
        compressed.push({
          type: 'literal',
          char: input[pos]
        });
        pos++;
      }
    }

    return JSON.stringify(compressed);
  }

  decompress(compressedData) {
    let tokens;
    try {
      tokens = JSON.parse(compressedData);
    } catch (e) {
      throw new Error('Invalid LZ77 compressed data format');
    }

    let decompressed = '';

    for (const token of tokens) {
      if (token.type === 'literal') {
        decompressed += token.char;
      } else if (token.type === 'match') {
        const start = decompressed.length - token.distance;

        // Copy characters from the matched position
        for (let i = 0; i < token.length; i++) {
          decompressed += decompressed[start + (i % token.distance)];
        }

        // Add the next character if it exists
        if (token.nextChar !== null) {
          decompressed += token.nextChar;
        }
      }
    }

    return decompressed;
  }
}

// Create default instance
const lz77Instance = new LZ77();

// Optimized version for binary data
class LZ77Binary {
  constructor(windowSize = 4096, lookaheadSize = 18) {
    this.windowSize = windowSize;
    this.lookaheadSize = lookaheadSize;
  }

  findLongestMatch(buffer, currentPos) {
    const windowStart = Math.max(0, currentPos - this.windowSize);
    const windowEnd = currentPos;
    const lookaheadEnd = Math.min(buffer.length, currentPos + this.lookaheadSize);

    let bestMatch = { distance: 0, length: 0 };

    for (let i = windowStart; i < windowEnd; i++) {
      let matchLength = 0;

      while (
        currentPos + matchLength < lookaheadEnd &&
        buffer[i + matchLength] === buffer[currentPos + matchLength]
      ) {
        matchLength++;
      }

      if (matchLength > bestMatch.length) {
        bestMatch = {
          distance: currentPos - i,
          length: matchLength
        };
      }
    }

    return bestMatch;
  }

  compress(data) {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const compressed = [];
    let pos = 0;

    while (pos < buffer.length) {
      const match = this.findLongestMatch(buffer, pos);

      if (match.length >= 3) {
        // Store as: [1, distance_high, distance_low, length, next_byte]
        const distanceHigh = Math.floor(match.distance / 256);
        const distanceLow = match.distance % 256;
        const nextByte = pos + match.length < buffer.length ? buffer[pos + match.length] : 0;

        compressed.push(1, distanceHigh, distanceLow, match.length, nextByte);
        pos += match.length + 1;
      } else {
        // Store as: [0, literal_byte]
        compressed.push(0, buffer[pos]);
        pos++;
      }
    }

    return Buffer.from(compressed);
  }

  decompress(compressedData) {
    const buffer = Buffer.isBuffer(compressedData) ? compressedData : Buffer.from(compressedData);
    const decompressed = [];
    let i = 0;

    while (i < buffer.length) {
      const flag = buffer[i++];

      if (flag === 0) {
        // Literal byte
        if (i < buffer.length) {
          decompressed.push(buffer[i++]);
        }
      } else if (flag === 1) {
        // Match
        if (i + 3 < buffer.length) {
          const distanceHigh = buffer[i++];
          const distanceLow = buffer[i++];
          const length = buffer[i++];
          const nextByte = buffer[i++];

          const distance = distanceHigh * 256 + distanceLow;
          const start = decompressed.length - distance;

          // Copy matched bytes
          for (let j = 0; j < length; j++) {
            decompressed.push(decompressed[start + (j % distance)]);
          }

          // Add next byte if not zero
          if (nextByte !== 0) {
            decompressed.push(nextByte);
          }
        }
      }
    }

    return Buffer.from(decompressed);
  }
}

module.exports = {
  compress: (data) => lz77Instance.compress(data),
  decompress: (data) => lz77Instance.decompress(data),
  LZ77,
  LZ77Binary
};
