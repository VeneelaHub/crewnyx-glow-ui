import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AvatarUpload from "@/components/AvatarUpload";
import LocationPicker from "@/components/LocationPicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STORAGE_KEY = "client_profile";

interface ClientProfileData {
  name: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
}

const defaults: ClientProfileData = {
  name: "Your Name",
  bio: "Tell freelancers about your business and what you typically hire for.",
  email: "you@example.com",
  phone: "+91 ",
  location: "City, Country",
};

const load = (): ClientProfileData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
};

const ClientProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ClientProfileData>(load);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ClientProfileData>(data);

  const startEdit = () => {
    setDraft(data);
    setEditing(true);
  };
  const save = () => {
    setData(draft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setEditing(false);
    toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center btn-press" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">My Profile</h1>
        <button
          onClick={editing ? save : startEdit}
          className="text-sm font-semibold text-primary btn-press px-2"
        >
          {editing ? "Save" : "Edit"}
        </button>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div className="bg-card rounded-2xl p-6 card-shadow flex flex-col items-center">
          <AvatarUpload
            value={editing ? draft.avatarUrl : data.avatarUrl}
            onChange={(url) =>
              editing ? setDraft({ ...draft, avatarUrl: url }) : (() => {
                const next = { ...data, avatarUrl: url };
                setData(next);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
              })()
            }
          />

          {editing ? (
            <div className="w-full mt-4 space-y-3">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" />
              <Textarea
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="Short bio"
                rows={3}
              />
              <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email" />
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Phone" />
              <LocationPicker
                value={draft.location}
                onChange={(v) => setDraft({ ...draft, location: v })}
                placeholder="Pick city, country"
              />
            </div>
          ) : (
            <>
              <h2 className="font-heading font-semibold text-lg text-foreground mt-4">{data.name}</h2>
              <p className="text-sm text-muted-foreground text-center mt-2 leading-relaxed">{data.bio}</p>
              <div className="w-full mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={16} /> <span className="text-foreground">{data.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={16} /> <span className="text-foreground">{data.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={16} /> <span className="text-foreground">{data.location}</span>
                </div>
              </div>
            </>
          )}

          {editing && (
            <Button variant="outline" className="mt-4 w-full" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <BottomNav role="client" />
    </div>
  );
};

export default ClientProfile;
