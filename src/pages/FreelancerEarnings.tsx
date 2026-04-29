import { DollarSign, Inbox } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const FreelancerEarnings = () => {
  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
        <h1 className="text-lg font-heading font-bold text-foreground text-center">Earnings</h1>
      </header>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        {/* Earnings Card */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground card-shadow">
          <p className="text-sm opacity-80">Total Earnings</p>
          <p className="text-3xl font-bold mt-1">₹0</p>
        </div>

        {/* Payments List */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
            <Inbox size={18} /> Payments Received
          </h2>
          <p className="text-sm text-muted-foreground text-center py-6">No payments received yet</p>
        </div>
      </div>
      <BottomNav role="freelancer" />
    </div>
  );
};

export default FreelancerEarnings;
