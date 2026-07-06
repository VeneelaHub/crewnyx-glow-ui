import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/crewnyx-logo.png";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"client" | "freelancer">("client");
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff < -60) setActiveTab("freelancer");
    if (diff > 60) setActiveTab("client");
  };

  const handleLogin = () => navigate(activeTab === "client" ? "/client" : "/freelancer");
  const handleSignup = () => navigate(`/signup?role=${activeTab}`);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen auth-bg px-4 py-8"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src={logoImage} alt="CREWNYX Logo" className="w-28 h-auto mb-3 drop-shadow-lg" />
      <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">Welcome back</h1>
      <p className="text-xs text-muted-foreground mb-6 mt-1">
        {activeTab === "client" ? "Swipe right for Freelancer →" : "← Swipe left for Client"}
      </p>

      {/* Segmented control */}
      <div className="relative bg-card/70 backdrop-blur border border-border rounded-full p-1 mb-6 flex w-64 card-shadow">
        <span
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] gradient-primary rounded-full transition-all duration-300 ease-out shadow-md"
          style={{ left: activeTab === "client" ? 4 : "calc(50% + 0px)" }}
        />
        {(["client", "freelancer"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`relative z-10 flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === t ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t === "client" ? "Client" : "Freelancer"}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: activeTab === "freelancer" ? "translateX(-100%)" : "translateX(0)" }}
        >
          <div className="min-w-full px-1">
            <LoginCard title="Client Login" subtitle="Hire top freelancers" onLogin={handleLogin} onSignup={handleSignup} />
          </div>
          <div className="min-w-full px-1">
            <LoginCard title="Freelancer Login" subtitle="Find your next gig" onLogin={handleLogin} onSignup={handleSignup} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginCard = ({
  title,
  subtitle,
  onLogin,
  onSignup,
}: {
  title: string;
  subtitle: string;
  onLogin: () => void;
  onSignup: () => void;
}) => (
  <div className="bg-card/90 backdrop-blur rounded-3xl p-7 card-shadow border border-border animate-fade-in">
    <h2 className="text-xl font-heading font-semibold text-foreground">{title}</h2>
    <p className="text-xs text-muted-foreground mb-5 mt-0.5">{subtitle}</p>
    <div className="space-y-3.5">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">EMAIL</label>
        <Input type="email" placeholder="you@email.com" className="rounded-xl h-12 bg-background" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">PASSWORD</label>
        <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-background" />
      </div>
      <Button
        onClick={onLogin}
        className="w-full h-12 rounded-xl text-base font-semibold gradient-primary border-0 hover:opacity-95 btn-press shadow-md"
      >
        Login
      </Button>
    </div>
    <p className="text-sm text-muted-foreground text-center mt-5">
      Don't have an account?{" "}
      <span onClick={onSignup} className="text-primary font-semibold cursor-pointer">Sign up</span>
    </p>
  </div>
);
export default LoginScreen;
