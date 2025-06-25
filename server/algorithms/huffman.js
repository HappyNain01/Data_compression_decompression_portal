class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node) {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  heapifyUp(index) {
    if (index === 0) return;

    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[parentIndex].freq > this.heap[index].freq) {
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      this.heapifyUp(parentIndex);
    }
  }

  heapifyDown(index) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (leftChild < this.heap.length && this.heap[leftChild].freq < this.heap[smallest].freq) {
      smallest = leftChild;
    }

    if (rightChild < this.heap.length && this.heap[rightChild].freq < this.heap[smallest].freq) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.heapifyDown(smallest);
    }
  }

  get size() {
    return this.heap.length;
  }
}

function buildFrequencyTable(data) {
  const freq = {};
  const text = typeof data === 'string' ? data : data.toString();

  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

function buildHuffmanTree(freqTable) {
  const heap = new MinHeap();

  // Create leaf nodes for each character
  for (const char in freqTable) {
    heap.push(new HuffmanNode(char, freqTable[char]));
  }

  // Build tree by combining nodes
  while (heap.size > 1) {
    const left = heap.pop();
    const right = heap.pop();

    const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
    heap.push(merged);
  }

  return heap.pop();
}

function generateCodes(root) {
  if (!root) return {};

  const codes = {};

  function traverse(node, code = '') {
    if (node.char !== null) {
      codes[node.char] = code || '0'; // Handle single character case
    } else {
      if (node.left) traverse(node.left, code + '0');
      if (node.right) traverse(node.right, code + '1');
    }
  }

  traverse(root);
  return codes;
}

function compress(data) {
  const text = typeof data === 'string' ? data : data.toString();

  if (text.length === 0) {
    return JSON.stringify({ compressed: '', tree: null, originalLength: 0 });
  }

  // Build frequency table
  const freqTable = buildFrequencyTable(text);

  // Handle single character case
  if (Object.keys(freqTable).length === 1) {
    const char = Object.keys(freqTable)[0];
    return JSON.stringify({
      compressed: '0'.repeat(text.length),
      tree: { char, freq: freqTable[char] },
      originalLength: text.length
    });
  }

  // Build Huffman tree
  const root = buildHuffmanTree(freqTable);

  // Generate codes
  const codes = generateCodes(root);

  // Encode text
  let compressed = '';
  for (const char of text) {
    compressed += codes[char];
  }

  // Pad to make it byte-aligned
  const padding = 8 - (compressed.length % 8);
  if (padding !== 8) {
    compressed += '0'.repeat(padding);
  }

  return JSON.stringify({
    compressed,
    tree: root,
    originalLength: text.length,
    padding
  });
}

function decompress(compressedData) {
  let parsed;
  try {
    parsed = JSON.parse(compressedData);
  } catch (e) {
    throw new Error('Invalid compressed data format');
  }

  const { compressed, tree, originalLength, padding = 0 } = parsed;

  if (originalLength === 0) return '';

  // Handle single character case
  if (tree.char !== undefined) {
    return tree.char.repeat(originalLength);
  }

  // Remove padding
  const validBits = compressed.length - padding;
  const binaryData = compressed.substring(0, validBits);

  // Decode using tree
  let decoded = '';
  let current = tree;

  for (const bit of binaryData) {
    current = bit === '0' ? current.left : current.right;

    if (current.char !== null) {
      decoded += current.char;
      current = tree;

      if (decoded.length === originalLength) break;
    }
  }

  return decoded;
}

module.exports = {
  compress,
  decompress
};
