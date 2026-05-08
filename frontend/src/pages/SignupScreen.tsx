import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/crewnyx-logo.png";
import { ArrowLeft } from "lucide-react";

const SignupScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "freelancer" ? "freelancer" : "client";

  const handleSignup = () => navigate(role === "client" ? "/client" : "/freelancer");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen auth-bg px-4 py-8">
      <button
        onClick={() => navigate("/login")}
        className="self-start mb-2 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center btn-press"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </button>

      <img src={logoImage} alt="CREWNYX Logo" className="w-24 h-auto mb-3 drop-shadow-lg" />
      <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">Create account</h1>
      <p className="text-xs text-muted-foreground mb-5 mt-1">
        Sign up as <span className="font-semibold text-primary">{role}</span>
      </p>

      <div className="w-full max-w-sm">
        <div className="bg-card/90 backdrop-blur rounded-3xl p-7 card-shadow border border-border animate-fade-in">
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">FULL NAME</label>
              <Input type="text" placeholder="Your name" className="rounded-xl h-12 bg-background" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">EMAIL</label>
              <Input type="email" placeholder="you@email.com" className="rounded-xl h-12 bg-background" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">PASSWORD</label>
              <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-background" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CONFIRM PASSWORD</label>
              <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-background" />
            </div>
            <Button
              onClick={handleSignup}
              className="w-full h-12 rounded-xl text-base font-semibold gradient-primary border-0 hover:opacity-95 btn-press shadow-md mt-1"
            >
              Sign Up
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-5">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-primary font-semibold cursor-pointer">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
