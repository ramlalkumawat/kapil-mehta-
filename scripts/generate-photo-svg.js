import fs from 'fs';
import path from 'path';

function createSvgFromJpg(jpgPath, outSvgPath, isRect = false) {
  if (!fs.existsSync(jpgPath)) {
    console.error('File not found:', jpgPath);
    return;
  }
  const photoBuf = fs.readFileSync(jpgPath);
  const base64Photo = photoBuf.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64Photo}`;

  let svgContent = '';
  if (isRect) {
    // For portrait / profile rectangular photo
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 520" width="100%" height="100%">
  <defs>
    <linearGradient id="goldGradRect" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="maroonGradRect" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9f1239"/>
      <stop offset="50%" stop-color="#800020"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
    <clipPath id="rectPhotoClip">
      <rect x="12" y="12" width="376" height="496" rx="18" ry="18"/>
    </clipPath>
  </defs>

  <!-- Border & Frame -->
  <rect x="4" y="4" width="392" height="512" rx="22" ry="22" fill="url(#maroonGradRect)"/>
  <rect x="8" y="8" width="384" height="504" rx="20" ry="20" fill="url(#goldGradRect)"/>
  <rect x="10" y="10" width="380" height="500" rx="19" ry="19" fill="#ffffff"/>

  <!-- Candidate Photograph -->
  <g clip-path="url(#rectPhotoClip)">
    <image href="${dataUri}" x="12" y="12" width="376" height="496" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Inner Stroke Accent -->
  <rect x="12" y="12" width="376" height="496" rx="18" ry="18" fill="none" stroke="url(#goldGradRect)" stroke-width="3" opacity="0.85"/>
</svg>`;
  } else {
    // Circular candidate portrait
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="maroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9f1239"/>
      <stop offset="50%" stop-color="#800020"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.2" flood-color="#4c0519"/>
    </filter>
    <clipPath id="candidatePhotoClip">
      <circle cx="250" cy="250" r="230"/>
    </clipPath>
  </defs>

  <!-- Outer Theme Ring & Shadow -->
  <circle cx="250" cy="250" r="244" fill="url(#maroonGrad)" filter="url(#cardShadow)"/>
  <circle cx="250" cy="250" r="238" fill="url(#goldGrad)"/>
  <circle cx="250" cy="250" r="232" fill="#ffffff"/>

  <!-- Embedded High-Resolution Candidate Photo -->
  <g clip-path="url(#candidatePhotoClip)">
    <image href="${dataUri}" x="16" y="16" width="468" height="468" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Inner Golden Ring Accent -->
  <circle cx="250" cy="250" r="230" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.9"/>
</svg>`;
  }

  fs.writeFileSync(outSvgPath, svgContent, 'utf8');
  console.log(`Generated ${outSvgPath} (${fs.statSync(outSvgPath).size} bytes)`);
}

createSvgFromJpg('public/kapil-mehta.jpg', 'public/kapil-mehta.svg', false);
createSvgFromJpg('public/kapil-mehta-namaste.jpg', 'public/kapil-mehta-namaste.svg', true);
createSvgFromJpg('public/kapil-mehta.jpg', 'public/candidate-avatar.svg', false);
