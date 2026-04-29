import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Plan = {
  id: string;
  name: string;
  price: string;
  perMonth?: string;
  badge?: string;
  highlight?: boolean;
  icon: React.ElementType;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "1m",
    name: "1 Month",
    price: "₹299",
    icon: Zap,
    features: [
      "20 bids per day",
      "Standard visibility",
      "Portfolio uploads (10)",
      "Basic analytics (profile views)",
      "Access to all normal projects",
    ],
  },
  {
    id: "3m",
    name: "3 Months",
    price: "₹799",
    perMonth: "₹266/month",
    badge: "Most Popular",
    highlight: true,
    icon: Sparkles,
    features: [
      "40 bids per day",
      "Featured profile (higher ranking)",
      "Verified badge",
      "Portfolio uploads (25)",
      "Advanced analytics (views + clicks)",
      "Priority support",
      "Access to better-paying projects",
    ],
  },
  {
    id: "1y",
    name: "1 Year",
    price: "₹2499",
    perMonth: "₹208/month",
    badge: "Best Value",
    icon: Crown,
    features: [
      "Unlimited bids",
      "Top search ranking",
      "Verified badge",
      "Unlimited portfolio",
      "Full analytics dashboard",
      "Early access to new projects",
      "Direct client connect",
    ],
  },
];

const PremiumPlans = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary pb-10">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground btn-press">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">Premium Plans</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Upgrade your craft
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Choose a plan that grows with your freelance career.
          </p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all duration-200 card-shadow ${
                  plan.highlight
                    ? "bg-card border-2 border-primary"
                    : "bg-card border border-border"
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlight ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{plan.name}</h3>
                    {plan.perMonth && (
                      <p className="text-xs text-muted-foreground">{plan.perMonth}</p>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {plan.price}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span
                        className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlight ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-11 rounded-xl font-semibold btn-press ${
                    plan.highlight
                      ? ""
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Buy {plan.name}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Cancel anytime. Prices in INR, taxes included.
        </p>
      </div>
    </div>
  );
};

export default PremiumPlans;
