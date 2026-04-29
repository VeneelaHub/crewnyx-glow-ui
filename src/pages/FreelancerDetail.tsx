import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Star, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FREELANCERS, type Review } from "@/data/freelancers";
import { toast } from "sonner";

const FreelancerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initial = FREELANCERS.find((f) => f.id === id);
  const [freelancer, setFreelancer] = useState(initial);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
        <p className="text-muted-foreground">Freelancer not found</p>
      </div>
    );
  }

  const submitReview = () => {
    if (!text.trim()) {
      toast.error("Write a short review");
      return;
    }
    const newReview: Review = {
      id: crypto.randomUUID(),
      clientName: "You",
      rating: stars,
      text: text.trim(),
      date: "Just now",
    };
    const newCount = freelancer.reviewCount + 1;
    const newRating = (freelancer.rating * freelancer.reviewCount + stars) / newCount;
    setFreelancer({
      ...freelancer,
      reviews: [newReview, ...freelancer.reviews],
      reviewCount: newCount,
      rating: Math.round(newRating * 10) / 10,
      rank: Math.round(newRating * Math.log2(newCount + 1) * 10) / 10,
    });
    setText("");
    setStars(5);
    toast.success("Review posted");
  };

  return (
    <div className="min-h-screen bg-secondary pb-24">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center btn-press" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">Freelancer</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        {/* Info */}
        <div className="bg-card rounded-2xl p-6 card-shadow flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {freelancer.avatarUrl ? (
              <img src={freelancer.avatarUrl} alt={freelancer.name} className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-muted-foreground" />
            )}
          </div>
          <h2 className="font-heading font-semibold text-lg text-foreground mt-3">{freelancer.name}</h2>
          <span className="px-3 py-1 mt-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {freelancer.category}
          </span>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-primary text-primary" />
              <span className="font-semibold text-foreground">{freelancer.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({freelancer.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy size={14} className="text-accent" />
              <span className="font-semibold text-foreground">Rank {freelancer.rank}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-3 leading-relaxed">{freelancer.bio}</p>
          <Button className="w-full mt-5" onClick={() => navigate("/client/chat")}>
            <MessageCircle size={16} /> Message
          </Button>
        </div>

        {/* Projects */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h2 className="font-heading font-semibold text-foreground mb-4">Projects</h2>
          <div className="space-y-3">
            {freelancer.projects.map((p) => (
              <div key={p.id} className="rounded-xl bg-secondary p-3">
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h2 className="font-heading font-semibold text-foreground mb-4">Reviews</h2>

          {/* Add review */}
          <div className="rounded-xl bg-secondary p-3 mb-4">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  className="btn-press"
                  aria-label={`${n} stars`}
                >
                  <Star
                    size={20}
                    className={n <= stars ? "fill-primary text-primary" : "text-border"}
                  />
                </button>
              ))}
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
            <Button size="sm" className="mt-2" onClick={submitReview}>
              Post review
            </Button>
          </div>

          <div className="space-y-3">
            {freelancer.reviews.map((r) => (
              <div key={r.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{r.clientName}</p>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={12}
                      className={n <= r.rating ? "fill-primary text-primary" : "text-border"}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;
