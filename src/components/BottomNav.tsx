import { Home, CreditCard, Settings, MessageCircle, User, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavProps {
  role: "client" | "freelancer";
}

const BottomNav = ({ role }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const clientTabs = [
    { icon: Home, label: "Home", path: "/client" },
    { icon: MessageCircle, label: "Chat", path: "/client/chat" },
    { icon: CreditCard, label: "Pay", path: "/client/payments" },
    { icon: User, label: "Profile", path: "/client/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const freelancerTabs = [
    { icon: Home, label: "Home", path: "/freelancer" },
    { icon: MessageCircle, label: "Chat", path: "/freelancer/chat" },
    { icon: UploadCloud, label: "Deliver", path: "/freelancer/uploads" },
    { icon: User, label: "Profile", path: "/freelancer/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const tabs = role === "client" ? clientTabs : freelancerTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors duration-200 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

