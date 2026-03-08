import { useState, useRef } from "react";
import { Upload, Video, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishMediaUploadProps {
  onFileSelect: (file: File, type: "photo" | "video") => void;
  onClear: () => void;
  selectedFile: File | null;
  mediaType: "photo" | "video" | null;
  accentColor: string;
}

const WishMediaUpload = ({ onFileSelect, onClear, selectedFile, mediaType, accentColor }: WishMediaUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) onFileSelect(file, "photo");
    else if (file.type.startsWith("video/")) onFileSelect(file, "video");
  };

  if (selectedFile) {
    const previewUrl = URL.createObjectURL(selectedFile);
    return (
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        {mediaType === "photo" ? (
          <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
        ) : (
          <video src={previewUrl} className="w-full h-48 object-cover" controls />
        )}
        <button
          onClick={onClear}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/60 text-xs text-white">
          {mediaType === "photo" ? "📸 Photo" : "🎬 Video (30s max)"}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "rounded-xl border-2 border-dashed p-8 text-center transition-all",
        dragOver ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ background: accentColor, color: "#080E24" }}
          >
            <Camera className="w-4 h-4" />
            Upload Photo
          </button>
          <button
            type="button"
            onClick={() => videoRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm font-medium text-white/80 hover:bg-white/5 transition-all hover:scale-105"
          >
            <Video className="w-4 h-4" />
            Upload Video
          </button>
        </div>
        <p className="text-xs text-white/40">or drag & drop a file here</p>
      </div>

      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file, "photo");
        }}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file, "video");
        }}
      />
    </div>
  );
};

export default WishMediaUpload;
