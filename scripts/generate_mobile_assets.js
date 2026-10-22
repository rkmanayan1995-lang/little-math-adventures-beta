import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Generates PNG images directly in Node.js using standard zlib compression.
 * Creates compliant 192x192 and 512x512 app icons, apple-touch-icon, and splash screens.
 */

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodeRGBAtoPNG(width, height, pixelFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth = 8
  ihdr.writeUInt8(6, 9); // color type = RGBA
  ihdr.writeUInt8(0, 10); // compression method 0
  ihdr.writeUInt8(0, 11); // filter method 0
  ihdr.writeUInt8(0, 12); // interlace method 0

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image scanlines: filter byte (0) + width * 4 bytes per scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Compress with deflate
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Pixel generator for cheerful Little Math Adventures Icon
function iconPixelGenerator(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.44;

  // Squircle rounded background with warm gradient
  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);
  const cornerR = w * 0.22;
  const inSquircle = (dx < cx - cornerR || dy < cy - cornerR) ||
    Math.hypot(dx - (cx - cornerR), dy - (cy - cornerR)) <= cornerR;

  if (!inSquircle) {
    return [0, 0, 0, 0]; // Transparent background outside squircle
  }

  // Gradient: Top-left warm amber/gold (#FBBF24) to bottom-right coral/pink (#F43F5E)
  const gradT = (x + y) / (w + h);
  const bgR = Math.round(251 * (1 - gradT) + 244 * gradT);
  const bgG = Math.round(191 * (1 - gradT) + 63 * gradT);
  const bgB = Math.round(36 * (1 - gradT) + 94 * gradT);

  // Draw a bright white circular badge in center
  const distFromCenter = Math.hypot(x - cx, y - cy);
  if (distFromCenter < w * 0.30) {
    // White emblem inside
    // Small gold star in the upper portion
    if (distFromCenter < w * 0.12 && y < cy) {
      return [245, 158, 11, 255]; // Amber star center
    }
    return [255, 255, 255, 255];
  }

  // Gentle white border rim
  if (distFromCenter >= w * 0.30 && distFromCenter < w * 0.33) {
    return [254, 243, 199, 220]; // Light amber halo
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating mobile icon assets...');

// 1. icon-192.png
const png192 = encodeRGBAtoPNG(192, 192, iconPixelGenerator);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
console.log('  ✓ Generated public/icon-192.png');

// 2. icon-512.png
const png512 = encodeRGBAtoPNG(512, 512, iconPixelGenerator);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
console.log('  ✓ Generated public/icon-512.png');

// 3. apple-touch-icon.png (180x180)
const png180 = encodeRGBAtoPNG(180, 180, iconPixelGenerator);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
console.log('  ✓ Generated public/apple-touch-icon.png');

// 4. Vector SVG Icon
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- App Icon Base -->
  <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#bgGrad)" filter="url(#softShadow)" />
  <rect x="36" y="36" width="440" height="440" rx="108" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="6" />

  <!-- Center Shield / Emblem -->
  <circle cx="256" cy="256" r="148" fill="#FFFFFF" opacity="0.96" />
  <circle cx="256" cy="256" r="140" fill="none" stroke="#FEF3C7" stroke-width="6" />

  <!-- Playful "M" & Star -->
  <path d="M 180 320 L 180 200 L 256 265 L 332 200 L 332 320" fill="none" stroke="#F59E0B" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Golden Crown Star -->
  <path d="M 256 140 L 265 166 L 292 166 L 270 182 L 278 208 L 256 192 L 234 208 L 242 182 L 220 166 L 247 166 Z" fill="#FBBF24" stroke="#D97706" stroke-width="2" />
</svg>
`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon, 'utf8');
console.log('  ✓ Generated public/icon.svg');

// 5. Splash Screen SVG
const splashSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="splashBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="60%" stop-color="#FDFCF7" />
      <stop offset="100%" stop-color="#E0E7FF" />
    </linearGradient>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#splashBg)" />

  <!-- Center Floating Emblem -->
  <g transform="translate(540, 850)">
    <!-- App Emblem Badge -->
    <rect x="-160" y="-160" width="320" height="320" rx="80" fill="url(#btnGrad)" />
    <circle cx="0" cy="0" r="105" fill="#FFFFFF" />
    <path d="M -55 45 L -55 -40 L 0 5 L 55 -40 L 55 45" fill="none" stroke="#F59E0B" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 0 -85 L 8 -65 L 28 -65 L 12 -53 L 18 -33 L 0 -45 L -18 -33 L -12 -53 L -28 -65 L -8 -65 Z" fill="#FBBF24" />
  </g>

  <!-- Typography -->
  <text x="540" y="1120" font-family="Fredoka, system-ui, sans-serif" font-size="52" font-weight="900" fill="#0F172A" text-anchor="middle">
    Little Math Adventures
  </text>
  <text x="540" y="1175" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="28" font-weight="700" fill="#92400E" text-anchor="middle">
    Preschool Numbers &amp; Story Adventure
  </text>

  <!-- Friendly characters tagline -->
  <text x="540" y="1230" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="22" font-weight="600" fill="#64748B" text-anchor="middle">
    With Andy, Sancho &amp; Osi 🐶
  </text>
</svg>
`;
fs.writeFileSync(path.join(publicDir, 'splash.svg'), splashSvg, 'utf8');
console.log('  ✓ Generated public/splash.svg');
