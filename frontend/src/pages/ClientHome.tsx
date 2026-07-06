import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Trophy, User, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { FREELANCERS, FREELANCER_CATEGORIES } from "@/data/freelancers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortKey = "rank" | "rating" | "reviews";

const ClientHome = () => {
  const navigate = useNavigate();
  const categories = ["All", ...FREELANCER_CATEGORIES];
  const [catIndex, setCatIndex] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const startX = useRef(0);
  const chipsRef = useRef<HTMLDivElement>(null);

  const category = categories[catIndex];

  const goTo = (idx: number) => {
    if (idx === catIndex) return;
    const next = (idx + categories.length) % categories.length;
    setSlideDir(next > catIndex ? "right" : "left");
    setCatIndex(next);
    // ensure active chip is visible
    requestAnimationFrame(() => {
      const el = chipsRef.current?.querySelector<HTMLButtonElement>(`[data-i="${next}"]`);
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff < -50) goTo(catIndex + 1);
    else if (diff > 50) goTo(catIndex - 1);
  };

  const list = useMemo(() => {
    let arr = [...FREELANCERS];
    if (category !== "All") arr = arr.filter((f) => f.category === category);
    arr.sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "reviews") return b.reviewCount - a.reviewCount;
      return b.rank - a.rank;
    });
    return arr;
  }, [category, sortKey]);

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
        <h1 className="text-lg font-heading font-bold text-foreground text-center">CREWNYX</h1>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Category chips */}
        <div ref={chipsRef} className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((c, i) => {
            const active = i === catIndex;
            return (
              <button
                key={c}
                data-i={i}
                onClick={() => goTo(i)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold btn-press border transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">{list.length} freelancers · swipe ←→</p>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="w-40 h-9 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Top ranked</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="reviews">Most reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Swipeable list */}
        <div
          className="mt-4 space-y-3 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          key={catIndex}
          style={{ animation: `${slideDir === "right" ? "slide-in-right" : "slide-in-left"} 0.32s ease-out` }}
        >
          {list.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 card-shadow text-center">
              <p className="text-sm text-muted-foreground">No freelancers in this category yet</p>
            </div>
          ) : (
            list.map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/client/freelancer/${f.id}`)}
                className="w-full bg-card rounded-2xl p-4 card-shadow flex items-center gap-3 btn-press text-left"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                  {f.avatarUrl ? (
                    <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{f.name}</p>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </div>
                  <span className="inline-block px-2 py-0.5 mt-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                    {f.category}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-primary text-primary" />
                      <span className="font-semibold text-foreground">{f.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({f.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Trophy size={12} className="text-accent" />
                      <span className="font-semibold text-foreground">{f.rank}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <BottomNav role="client" />
    </div>
  );
};

export default ClientHome;

