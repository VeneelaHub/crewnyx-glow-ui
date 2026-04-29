import { CreditCard, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const ClientPayments = () => {
  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
        <h1 className="text-lg font-heading font-bold text-foreground text-center">Payments</h1>
      </header>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        {/* Wallet */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground card-shadow">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-3xl font-bold mt-1">₹0</p>
        </div>

        {/* Payment Form */}
        <div className="bg-card rounded-2xl p-6 card-shadow space-y-4">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <CreditCard size={18} /> Send Payment
          </h2>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Select Freelancer</label>
            <Input placeholder="No freelancers available" disabled className="rounded-xl h-11" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Amount</label>
            <Input type="number" placeholder="₹0" className="rounded-xl h-11" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Note</label>
            <Input placeholder="Payment note…" className="rounded-xl h-11" />
          </div>
          <Button className="w-full h-11 rounded-xl font-semibold btn-press">Pay Now</Button>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
            <History size={18} /> Transaction History
          </h2>
          <p className="text-sm text-muted-foreground text-center py-6">No transactions yet</p>
        </div>
      </div>
      <BottomNav role="client" />
    </div>
  );
};

export default ClientPayments;
