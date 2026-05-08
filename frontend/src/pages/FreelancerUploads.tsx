import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, Link2, Copy, Trash2, FileIcon, Loader2, Share2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeliveryItem {
  path: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: number;
}

const STORAGE_KEY = "freelancer_deliveries";

const formatSize = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(1)} KB` : b < 1024 ** 3 ? `${(b / 1024 ** 2).toFixed(1)} MB` : `${(b / 1024 ** 3).toFixed(2)} GB`;

const FreelancerUploads = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (list: DeliveryItem[]) => {
    setItems(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const next = [...items];
    for (const file of Array.from(files)) {
      setCurrentName(file.name);
      setProgress(10);
      try {
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;
        setProgress(40);
        const { error } = await supabase.storage.from("deliveries").upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
        if (error) throw error;
        setProgress(85);
        const { data } = supabase.storage.from("deliveries").getPublicUrl(path);
        next.unshift({ path, url: data.publicUrl, name: file.name, size: file.size, uploadedAt: Date.now() });
        setProgress(100);
      } catch (err) {
        toast.error(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
    }
    persist(next);
    setUploading(false);
    setProgress(0);
    setCurrentName("");
    toast.success("Upload complete");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const share = async (item: DeliveryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.name, url: item.url });
      } catch {}
    } else {
      copy(item.url);
    }
  };

  const remove = async (item: DeliveryItem) => {
    await supabase.storage.from("deliveries").remove([item.path]);
    persist(items.filter((i) => i.path !== item.path));
    toast.success("Removed");
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center btn-press" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">Deliver Files</h1>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-5">
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer btn-press card-shadow"
        >
          <div className="w-14 h-14 rounded-full gradient-primary mx-auto flex items-center justify-center text-primary-foreground">
            <UploadCloud size={26} />
          </div>
          <p className="mt-3 font-heading font-semibold text-foreground">Tap to upload or drop files</p>
          <p className="text-xs text-muted-foreground mt-1">Any file — photos, videos, edits, ZIP, RAR — up to 5 GB each</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {uploading && (
          <div className="bg-card rounded-2xl p-4 card-shadow space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span className="text-foreground font-medium truncate">{currentName}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="bg-card rounded-2xl card-shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground text-sm">Your deliveries</h2>
            <span className="text-xs text-muted-foreground">{items.length}</span>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 px-4">
              No uploads yet. Send any size — share the link with your client.
            </p>
          ) : (
            <ul>
              {items.map((it) => (
                <li key={it.path} className="px-4 py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                      <FileIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{it.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatSize(it.size)} · {new Date(it.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(it)}
                      className="w-8 h-8 flex items-center justify-center text-destructive btn-press"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground min-w-0">
                      <Link2 size={12} className="shrink-0" />
                      <span className="truncate">{it.url}</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 px-2.5" onClick={() => copy(it.url)}>
                      <Copy size={14} />
                    </Button>
                    <Button size="sm" className="h-8 px-2.5" onClick={() => share(it)}>
                      <Share2 size={14} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <BottomNav role="freelancer" />
    </div>
  );
};

export default FreelancerUploads;
