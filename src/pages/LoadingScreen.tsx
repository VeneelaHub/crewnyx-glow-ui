import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrewnyxLogo from "@/components/CrewnyxLogo";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [logoClick, setLogoClick] = useState(false);

  useEffect(() => {
    const clickTimer = setTimeout(() => setLogoClick(true), 1400);
    const navTimer = setTimeout(() => navigate("/login"), 3200);
    return () => {
      clearTimeout(clickTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div
        className="transition-transform duration-200"
        style={{
          animation: logoClick ? "logo-pulse 0.4s ease-in-out" : undefined,
        }}
      >
        <CrewnyxLogo size={96} animated />
      </div>
      <h1 className="text-2xl font-heading font-bold text-foreground mt-6 tracking-tight">
        CREWNYX
      </h1>
      <p className="text-sm text-muted-foreground mt-4" style={{ animation: "fade-up 0.6s 0.5s ease-out both" }}>
        Initializing CREWNYX…
      </p>
    </div>
  );
};

export default LoadingScreen;
