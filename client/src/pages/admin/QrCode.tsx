import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';

export default function QrCodePage() {
  const defaultUrl = `${window.location.origin}/menu`;
  const [url, setUrl] = useState(defaultUrl);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadSVG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'menu-qr.svg';
    link.click();
  };

  const downloadPNG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(svgUrl);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'menu-qr.png';
      link.click();
    };
    img.src = svgUrl;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C1A0E' }}>QR Kod</h2>

      <div className="max-w-lg">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#2C1A0E' }}>
            Menü URL'si
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none font-mono"
          />
          <p className="text-xs mt-2" style={{ color: '#9B7B6B' }}>
            Canlıya alındığında gerçek domain adresinizi girin.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center">
          <div ref={qrRef} className="p-4 rounded-xl" style={{ backgroundColor: '#FAF3E0' }}>
            <QRCode
              value={url || defaultUrl}
              size={220}
              bgColor="#FAF3E0"
              fgColor="#2C1A0E"
              level="H"
            />
          </div>

          <p className="text-xs mt-4 text-center break-all max-w-xs" style={{ color: '#9B7B6B' }}>
            {url || defaultUrl}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={downloadSVG}
              className="px-5 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#D2622A', color: '#D2622A' }}
            >
              SVG İndir
            </button>
            <button
              onClick={downloadPNG}
              className="px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#D2622A' }}
            >
              PNG İndir
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm mt-4">
          <h3 className="font-semibold text-sm mb-2" style={{ color: '#2C1A0E' }}>Nasıl kullanılır?</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: '#9B7B6B' }}>
            <li>QR kodu PNG veya SVG olarak indirin</li>
            <li>Baskı dükkanında yazdırın</li>
            <li>Masa üstlerine yerleştirin</li>
            <li>Müşteriler tarayınca menü açılır</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
