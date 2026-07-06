import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Send, User, Paperclip, FileIcon, Mic, Square, Loader2, Trash2, Play,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatPageProps {
  role: "client" | "freelancer";
}

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
};

type Attachment = {
  url: string;
  name: string;
  size: number;
  kind: "image" | "video" | "file" | "audio";
  durationSec?: number;
};

type Msg = {
  id: string;
  fromMe: boolean;
  text?: string;
  time: string;
  attachment?: Attachment;
};

const clientConversations: Conversation[] = [
  { id: "1", name: "Person 1", preview: "Sure, I can deliver the design by Friday.", time: "2m", unread: 2, online: true },
  { id: "2", name: "Person 2", preview: "Thanks for the update!", time: "1h", online: true },
  { id: "3", name: "Person 3", preview: "Sending over the revised proposal.", time: "3h" },
  { id: "4", name: "Person 4", preview: "Let's hop on a quick call tomorrow.", time: "1d" },
];

const freelancerConversations: Conversation[] = [
  { id: "1", name: "Client 1", preview: "Can you start on Monday?", time: "5m", unread: 1, online: true },
  { id: "2", name: "Client 2", preview: "Looks great, approved!", time: "2h" },
  { id: "3", name: "Client 3", preview: "Sharing the brief shortly.", time: "6h", online: true },
  { id: "4", name: "Client 4", preview: "Invoice received, thanks.", time: "2d" },
];

const kindOf = (file: File): Attachment["kind"] =>
  file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";

const formatSize = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(1)} KB` : b < 1024 ** 3 ? `${(b / 1024 ** 2).toFixed(1)} MB` : `${(b / 1024 ** 3).toFixed(2)} GB`;

const ChatPage = ({ role }: ChatPageProps) => {
  const navigate = useNavigate();
  const [active, setActive] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const conversations = role === "client" ? clientConversations : freelancerConversations;

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const openChat = (c: Conversation) => {
    setActive(c);
    setMessages([
      { id: "m1", fromMe: false, text: "Hi! Thanks for reaching out.", time: "10:24 AM" },
      { id: "m2", fromMe: true, text: "Hey, can we discuss the project scope?", time: "10:25 AM" },
      { id: "m3", fromMe: false, text: c.preview, time: "10:27 AM" },
    ]);
  };

  const sendText = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), fromMe: true, text: draft.trim(), time: "Now" }]);
    setDraft("");
  };

  const handleAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `chat/${role}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("deliveries").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("deliveries").getPublicUrl(path);
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          fromMe: true,
          time: "Now",
          attachment: { url: data.publicUrl, name: file.name, size: file.size, kind: kindOf(file) },
        },
      ]);
      toast.success("Attachment sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      cancelledRef.current = false;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const duration = recordSec;
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecording(false);
        setRecordSec(0);
        if (cancelledRef.current) return;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size === 0) return;
        await uploadVoice(blob, duration, recorder.mimeType || "audio/webm");
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setRecordSec(0);
      timerRef.current = window.setInterval(() => setRecordSec((s) => s + 1), 1000);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (!recording) return;
    cancelledRef.current = false;
    recorderRef.current?.stop();
  };

  const cancelRecording = () => {
    if (!recording) return;
    cancelledRef.current = true;
    recorderRef.current?.stop();
  };

  const uploadVoice = async (blob: Blob, durationSec: number, mime: string) => {
    setUploading(true);
    try {
      const ext = mime.includes("mp4") ? "m4a" : "webm";
      const path = `chat/${role}/voice-${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("deliveries").upload(path, blob, {
        contentType: mime,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("deliveries").getPublicUrl(path);
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          fromMe: true,
          time: "Now",
          attachment: {
            url: data.publicUrl,
            name: `Voice message (${durationSec}s)`,
            size: blob.size,
            kind: "audio",
            durationSec,
          },
        },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Voice upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (active) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col">
        <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40 flex items-center gap-3">
          <button onClick={() => setActive(null)} className="text-foreground btn-press">
            <ArrowLeft size={20} />
          </button>
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <User size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-foreground text-sm leading-tight truncate">{active.name}</p>
            {active.online && <p className="text-[11px] text-primary">Online</p>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg w-full mx-auto">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-3 py-2.5 max-w-[78%] ${
                  m.fromMe
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card text-foreground rounded-tl-sm card-shadow"
                }`}
              >
                {m.attachment ? (
                  m.attachment.kind === "audio" ? (
                    <div className="min-w-[200px]">
                      <audio src={m.attachment.url} controls className="w-full h-9" />
                      <p className={`text-[10px] mt-1 ${m.fromMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        🎤 {m.attachment.durationSec ? fmtTime(m.attachment.durationSec) : ""} · {m.time}
                      </p>
                    </div>
                  ) : (
                    <a href={m.attachment.url} target="_blank" rel="noreferrer" className="block">
                      {m.attachment.kind === "image" ? (
                        <img src={m.attachment.url} alt={m.attachment.name} className="rounded-lg max-h-60 object-cover" />
                      ) : m.attachment.kind === "video" ? (
                        <video src={m.attachment.url} controls className="rounded-lg max-h-60 max-w-full" />
                      ) : (
                        <div className="flex items-center gap-2 py-1">
                          <FileIcon size={20} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{m.attachment.name}</p>
                            <p className={`text-[10px] ${m.fromMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {formatSize(m.attachment.size)}
                            </p>
                          </div>
                        </div>
                      )}
                      <p className={`text-[10px] mt-1 ${m.fromMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {m.time}
                      </p>
                    </a>
                  )
                ) : (
                  <>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.fromMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {m.time}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border-t border-border px-3 py-3 sticky bottom-0">
          <div className="max-w-lg mx-auto flex items-center gap-2">
            <input ref={fileRef} type="file" className="hidden" onChange={handleAttach} />
            {recording ? (
              <div className="flex-1 flex items-center gap-3 bg-destructive/10 rounded-full px-4 h-11 border border-destructive/30">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive recording-pulse" />
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {fmtTime(recordSec)}
                </span>
                <span className="flex-1 text-xs text-muted-foreground truncate">Recording…</span>
                <button
                  onClick={cancelRecording}
                  className="text-muted-foreground btn-press"
                  aria-label="Cancel recording"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={stopRecording}
                  className="w-9 h-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center btn-press"
                  aria-label="Stop and send"
                >
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-11 w-11 rounded-full btn-press flex-shrink-0"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  aria-label="Attach"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                </Button>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendText()}
                  placeholder="Type a message..."
                  className="rounded-full h-11 bg-secondary border-0"
                />
                {draft.trim() ? (
                  <Button
                    size="icon"
                    className="h-11 w-11 rounded-full btn-press flex-shrink-0 gradient-primary border-0"
                    onClick={sendText}
                    aria-label="Send"
                  >
                    <Send size={18} />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    className="h-11 w-11 rounded-full btn-press flex-shrink-0 gradient-primary border-0"
                    onClick={startRecording}
                    disabled={uploading}
                    aria-label="Record voice message"
                  >
                    <Mic size={18} />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
        <h1 className="text-lg font-heading font-bold text-foreground text-center">Messages</h1>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search conversations" className="pl-9 rounded-xl h-11 bg-card border-border" />
        </div>

        <div className="bg-card rounded-2xl card-shadow overflow-hidden">
          {conversations.map((c, i) => (
            <button
              key={c.id}
              onClick={() => openChat(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary ${
                i !== conversations.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <User size={20} className="text-muted-foreground" />
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading font-semibold text-foreground text-sm truncate">{c.name}</p>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">{c.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                  {c.unread && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1.5 flex items-center justify-center flex-shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav role={role} />
    </div>
  );
};

export default ChatPage;
