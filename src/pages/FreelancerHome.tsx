import { Briefcase, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const FreelancerHome = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center justify-between">
        <span className="w-9" />
        <h1 className="text-lg font-heading font-bold text-foreground">CREWNYX</h1>
        <button
          onClick={() => navigate("/freelancer/premium")}
          className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center btn-press"
          aria-label="Premium Plans"
        >
          <Crown size={18} />
        </button>
      </header>
      <div className="flex flex-col items-center justify-center px-6 pt-32">
        <div className="bg-card rounded-2xl p-10 card-shadow flex flex-col items-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm text-center">No clients available yet</p>
        </div>
      </div>
      <BottomNav role="freelancer" />
    </div>
  );
};

export default FreelancerHome;
