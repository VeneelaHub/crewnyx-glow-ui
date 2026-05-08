import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Star, Trash2, Trophy, ImagePlus, Loader2, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AvatarUpload from "@/components/AvatarUpload";
import LocationPicker from "@/components/LocationPicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FREELANCER_CATEGORIES, type FreelancerCategory } from "@/data/freelancers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "freelancer_profile";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
}

interface PortfolioItem {
  id: string;
  url: string;
  caption?: string;
}

interface FreelancerProfileData {
  name: string;
  category: FreelancerCategory;
  bio: string;
  location: string;
  avatarUrl?: string;
  projects: ProjectItem[];
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
}

const defaults: FreelancerProfileData = {
  name: "Your Name",
  category: "Video Editor",
  bio: "Tell clients what you do best, your tools, and your experience.",
  location: "",
  projects: [],
  portfolio: [],
  rating: 4.8,
  reviewCount: 24,
};

const load = (): FreelancerProfileData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
};

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<FreelancerProfileData>(load);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<FreelancerProfileData>(data);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  const persist = (next: FreelancerProfileData) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const startEdit = () => { setDraft(data); setEditing(true); };
  const save = () => { persist(draft); setEditing(false); toast.success("Profile updated"); };

  const addProject = () =>
    setDraft({ ...draft, projects: [...draft.projects, { id: crypto.randomUUID(), title: "", description: "" }] });
  const removeProject = (id: string) =>
    setDraft({ ...draft, projects: draft.projects.filter((p) => p.id !== id) });
  const updateProject = (id: string, patch: Partial<ProjectItem>) =>
    setDraft({ ...draft, projects: draft.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    e.target.value = "";
    if (!files || files.length === 0) return;
    setUploadingPortfolio(true);
    const newItems: PortfolioItem[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: not an image`);
          continue;
        }
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `portfolio/${Date.now()}-${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("deliveries").upload(path, file, {
          contentType: file.type,
        });
        if (error) throw error;
        const { data: pub } = supabase.storage.from("deliveries").getPublicUrl(path);
        newItems.push({ id: crypto.randomUUID(), url: pub.publicUrl });
      }
      const target = editing ? draft : data;
      const next = { ...target, portfolio: [...newItems, ...target.portfolio] };
      if (editing) setDraft(next);
      else persist(next);
      toast.success(`${newItems.length} image${newItems.length === 1 ? "" : "s"} added`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const removePortfolio = (id: string) => {
    const target = editing ? draft : data;
    const next = { ...target, portfolio: target.portfolio.filter((p) => p.id !== id) };
    if (editing) setDraft(next);
    else persist(next);
  };

  const portfolio = editing ? draft.portfolio : data.portfolio;
  const rank = Math.round(data.rating * Math.log2(data.reviewCount + 1) * 10) / 10;

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center btn-press" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">My Profile</h1>
        <button onClick={editing ? save : startEdit} className="text-sm font-semibold text-primary btn-press px-2">
          {editing ? "Save" : "Edit"}
        </button>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        {/* Header card */}
        <div className="bg-card rounded-2xl p-6 card-shadow flex flex-col items-center">
          <AvatarUpload
            value={editing ? draft.avatarUrl : data.avatarUrl}
            onChange={(url) =>
              editing
                ? setDraft({ ...draft, avatarUrl: url })
                : persist({ ...data, avatarUrl: url })
            }
          />

          {editing ? (
            <div className="w-full mt-4 space-y-3">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" />
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as FreelancerCategory })}
              >
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {FREELANCER_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="Short bio"
                rows={4}
              />
              <LocationPicker
                value={draft.location}
                onChange={(v) => setDraft({ ...draft, location: v })}
                placeholder="Pick city, country"
              />
            </div>
          ) : (
            <>
              <h2 className="font-heading font-semibold text-lg text-foreground mt-4">{data.name}</h2>
              <span className="px-3 py-1 mt-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {data.category}
              </span>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{data.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({data.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Trophy size={14} className="text-accent" />
                  <span className="font-semibold text-foreground">Rank {rank}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-3 leading-relaxed">{data.bio}</p>
              {data.location && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin size={12} className="text-primary" />
                  <span>{data.location}</span>
                </div>
              )}
            </>
          )}

          {editing && (
            <Button variant="outline" className="mt-4 w-full" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          )}
        </div>

        {/* Portfolio */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-semibold text-foreground">Portfolio</h2>
              <p className="text-[11px] text-muted-foreground">Showcase your best visual work</p>
            </div>
            <label className="flex items-center gap-1 text-sm text-primary font-semibold btn-press cursor-pointer px-2 py-1 rounded-lg">
              {uploadingPortfolio ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              Add
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePortfolioUpload}
                disabled={uploadingPortfolio}
              />
            </label>
          </div>
          {portfolio.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
              <ImagePlus size={28} className="mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">No images yet</p>
              <p className="text-[11px] text-muted-foreground">Tap "Add" to upload</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {portfolio.map((p) => (
                <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden bg-secondary group">
                  <img src={p.url} alt="Portfolio" className="w-full h-full object-cover" loading="lazy" />
                  <button
                    onClick={() => removePortfolio(p.id)}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center btn-press opacity-90"
                    aria-label="Remove image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Projects</h2>
            {editing && (
              <button onClick={addProject} className="flex items-center gap-1 text-sm text-primary font-semibold btn-press">
                <Plus size={16} /> Add
              </button>
            )}
          </div>

          {(editing ? draft.projects : data.projects).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {(editing ? draft.projects : data.projects).map((p) => (
                <div key={p.id} className="rounded-xl bg-secondary p-3">
                  {editing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={p.title}
                          onChange={(e) => updateProject(p.id, { title: e.target.value })}
                          placeholder="Project title"
                        />
                        <button
                          onClick={() => removeProject(p.id)}
                          className="w-10 h-10 flex items-center justify-center text-destructive btn-press"
                          aria-label="Remove project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <Textarea
                        value={p.description}
                        onChange={(e) => updateProject(p.id, { description: e.target.value })}
                        placeholder="Description"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground">{p.title || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav role="freelancer" />
    </div>
  );
};

export default FreelancerProfile;
