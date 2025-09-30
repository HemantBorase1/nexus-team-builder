"use client";

import { useCallback, useRef, useState } from "react";

export default function ImageUpload({ onUploaded, accept = "image/*", circular = true, maxSizeMb = 5 }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const onSelect = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setError('Invalid file type'); return; }
    if (f.size > maxSizeMb * 1024 * 1024) { setError(`File too large (max ${maxSizeMb}MB)`); return; }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0]; onSelect(f);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob)=>{
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type:'image/webp' }));
        }, 'image/webp', 0.9);
      };
      img.src = url;
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setProgress(5);
      const optimized = await compressImage(file);
      setProgress(25);
      const form = new FormData();
      form.append('file', optimized);
      const res = await fetch('/api/upload/avatar', { method:'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.description || 'Upload failed');
      setProgress(100);
      onUploaded && onUploaded(json.data);
    } catch (e) {
      setError(e.message);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl p-4 border backdrop-blur ${dragOver? 'border-[rgba(139,92,246,0.7)]' : 'border-[rgba(139,92,246,0.3)]'} bg-[#1A1A2E]`}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/80">Drag & drop an image or</div>
          <button type="button" className="rounded-md px-3 py-2 btn-gradient" onClick={()=>inputRef.current?.click()}>Choose File</button>
          <input ref={inputRef} type="file" accept={accept} hidden onChange={(e)=>onSelect(e.target.files?.[0])} />
        </div>
        {preview && (
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className={circular? 'h-20 w-20 rounded-full object-cover' : 'h-20 w-20 rounded-lg object-cover'} />
            <div className="flex gap-2">
              <button type="button" className="rounded-md px-3 py-2 bg-white/10 hover:bg-white/15" onClick={handleUpload}>Upload</button>
              <button type="button" className="rounded-md px-3 py-2 bg-white/10 hover:bg-white/15" onClick={()=>{setFile(null); setPreview(null);}}>Clear</button>
            </div>
          </div>
        )}
        {progress > 0 && (
          <div className="mt-3 h-2 rounded bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
      </div>
    </div>
  );
}


