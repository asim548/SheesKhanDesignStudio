import { NextResponse } from "next/server";

export async function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842">
  <rect width="595" height="842" fill="#FAF7F2"/>
  <text x="297" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#3D2B22" letter-spacing="4">SHEES KHAN</text>
  <text x="297" y="110" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#3D2B22" opacity="0.5" letter-spacing="3">MEASUREMENT CHART</text>
  <line x1="80" y1="140" x2="515" y2="140" stroke="#E8D5D0" stroke-width="1"/>
  
  <text x="80" y="180" font-family="sans-serif" font-size="10" fill="#3D2B22" opacity="0.5" letter-spacing="2">CLIENT NAME</text>
  <line x1="80" y1="200" x2="515" y2="200" stroke="#3D2B22" stroke-width="0.5" opacity="0.3"/>
  
  <text x="80" y="240" font-family="sans-serif" font-size="10" fill="#3D2B22" opacity="0.5" letter-spacing="2">DATE</text>
  <line x1="80" y1="260" x2="300" y2="260" stroke="#3D2B22" stroke-width="0.5" opacity="0.3"/>
  
  <text x="80" y="320" font-family="Georgia, serif" font-size="16" fill="#3D2B22">Measurements (inches)</text>
  
  ${["Bust", "Waist", "Hips", "Shoulder", "Sleeve Length", "Shirt Length", "Trouser Length", "Neck", "Armhole"]
    .map(
      (label, i) => `
  <text x="80" y="${370 + i * 40}" font-family="sans-serif" font-size="13" fill="#3D2B22">${label}</text>
  <line x1="220" y1="${370 + i * 40}" x2="515" y2="${370 + i * 40}" stroke="#3D2B22" stroke-width="0.5" opacity="0.25"/>`
    )
    .join("")}
  
  <text x="297" y="780" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#3D2B22" opacity="0.4">Shees Khan Design Studio  ·  Made to Order</text>
  <text x="297" y="800" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#3D2B22" opacity="0.4">Sheeskhandesignstudio786@gmail.com  ·  +92 318 5088200</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition":
        'attachment; filename="shees-khan-measurement-chart.svg"',
    },
  });
}
