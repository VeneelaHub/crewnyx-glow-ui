import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight, Info, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = () => {
    // Clear local profile/session data — without nuking the theme preference.
    const themePref = localStorage.getItem("theme");
    localStorage.clear();
    if (themePref) localStorage.setItem("theme", themePref);
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen premium-bg">
      <header className="bg-card/90 backdrop-blur border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground btn-press" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">Settings</h1>
      </header>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {/* Appearance */}
        <div className="bg-card rounded-2xl p-5 card-shadow">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
            {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />} Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Easier on the eyes in low light
              </p>
            </div>
            <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>
        </div>

        {/* Switch Role */}
        <div className="bg-card rounded-2xl p-5 card-shadow">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
            <ArrowLeftRight size={18} className="text-primary" /> Switch Role
          </h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-11 btn-press"
              onClick={() => navigate("/client")}
            >
              Client
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-11 btn-press"
              onClick={() => navigate("/freelancer")}
            >
              Freelancer
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-2xl p-5 card-shadow">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
            <Info size={18} className="text-primary" /> About App
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Name</span>
              <span className="font-medium text-foreground">CREWNYX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">v1.0.0</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl btn-press border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold"
            >
              <LogOut size={18} className="mr-2" /> Log out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of CREWNYX?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll need to sign in again to access your profile, chats and deliveries.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsPage;
