import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set resolution
      const ratio = Math.ceil(window.devicePixelRatio);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).nativeEvent.offsetX;
      y = (e as React.MouseEvent).nativeEvent.offsetY;
    }

    ctx.strokeStyle = '#d946ef'; // Neon Pink signature
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    // Prevent scrolling on touch
    if('touches' in e) {
        // e.preventDefault(); // Sometimes causes issues in React passive listeners, handle with CSS touch-action
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = (e as React.MouseEvent).nativeEvent.offsetX;
        y = (e as React.MouseEvent).nativeEvent.offsetY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleSave = () => {
    if (canvasRef.current && hasSignature) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-lg overflow-hidden relative touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-48 block touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-zinc-600 text-sm">Signez ici avec votre doigt ou la souris</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={clear}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm"
        >
          <Eraser size={16} /> Effacer
        </button>
        <button
          onClick={handleSave}
          disabled={!hasSignature}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${hasSignature ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'bg-zinc-700 opacity-50 cursor-not-allowed'}`}
        >
          <Check size={16} /> Valider la signature
        </button>
      </div>
    </div>
  );
};
