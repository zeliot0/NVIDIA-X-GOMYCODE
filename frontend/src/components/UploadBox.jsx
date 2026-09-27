import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Mic, X, CheckCircle } from 'lucide-react';

export default function UploadBox({ type = 'image', accept, onFileSelected, selectedFile, onClear }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const configs = {
    image: {
      title: 'Upload Screenshot or Image',
      subtitle: 'Drag and drop or browse fake login screens, popups, or suspicious emails',
      formats: 'PNG, JPEG, WEBP up to 10MB',
      icon: ImageIcon,
      accept: accept || 'image/png,image/jpeg,image/webp',
    },
    document: {
      title: 'Upload Document to Inspect',
      subtitle: 'Upload unexpected invoices, contracts, or attachments for safe analysis',
      formats: 'PDF, DOCX, TXT up to 15MB',
      icon: FileText,
      accept: accept || '.pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    voice: {
      title: 'Upload Voice Message / Audio Call',
      subtitle: 'Inspect scam calls, fake security voicemails, or OTP requests',
      formats: 'WAV, MP3, M4A, OGG up to 25MB',
      icon: Mic,
      accept: accept || 'audio/*,.mp3,.wav,.m4a,.ogg',
    },
  };

  const current = configs[type] || configs.image;
  const Icon = current.icon;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={current.accept}
        onChange={handleChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-lg shadow-cyan-950/20">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Icon className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400 font-mono">
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'file'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium px-2 py-1 bg-emerald-950/40 rounded-lg border border-emerald-900/60">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ready</span>
            </span>
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">{current.title}</h4>
          <p className="text-xs text-slate-400 text-center max-w-sm mt-1">{current.subtitle}</p>
          <span className="text-[11px] font-mono text-cyan-500/80 mt-3 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            {current.formats}
          </span>
        </div>
      )}
    </div>
  );
}
