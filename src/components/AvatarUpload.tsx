import { Camera, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  size?: number;
}

const MAX_BYTES = 30 * 1024 * 1024; // 30 MB

const AvatarUpload = ({ value, onChange, size = 96 }: AvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 30 MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border btn-press"
        aria-label="Upload profile picture"
      >
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User size={size * 0.4} className="text-muted-foreground" />
        )}
      </button>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md btn-press"
        aria-label="Change photo"
      >
        <Camera size={14} />
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

export default AvatarUpload;
