import { useRef } from "react";
import { Camera } from "lucide-react";

interface Props {
  preview: string | null;
  firstName: string;
  onChange: (file: File) => void;
}

export default function AvatarPicker({ preview, firstName, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative group w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden bg-muted flex items-center justify-center"
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground">
            {firstName ? firstName.charAt(0).toUpperCase() : "👤"}
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => { const file = e.target.files?.[0]; if (file) onChange(file); }}
      />
    </div>
  );
}
