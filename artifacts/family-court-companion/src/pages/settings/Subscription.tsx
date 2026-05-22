import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

type BillingCycle = "monthly" | "annual";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with basic evidence organization",
    features: [
      "1 active case",
      "Up to 25 evidence entries",
      "5 communication scans / month",
      "Basic factor overview",
      "No PDF export",
    ],
    cta: "Current Plan",
    current: true,
    highlight: false,
  },
  {
    id: "plus",
    name: "Plus",
    monthlyPrice: 9.99,
    annualPrice: 7.99,
    description: "For individuals actively preparing for court",
    features: [
      "1 active case",
      "Unlimited evidence entries",
      "Unlimited communication scans",
      "Full factor dashboard",
      "PDF export",
      "Pattern detection",
      "Communication statistics",
    ],
    cta: "Upgrade to Plus",
    current: false,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 19.99,
    annualPrice: 15.99,
    description: "Full court preparation suite",
    features: [
      "3 active cases",
      "Everything in Plus",
      "Packet builder + PDF",
      "Secure Share",
      "Motion / brief generator",
      "Court simulator",
      "Document templates",
    ],
    cta: "Upgrade to Pro",
    current: false,
    highlight: true,
  },
  {
    id: "attorney",
    name: "Attorney",
    monthlyPrice: 49.99,
    annualPrice: 39.99,
    description: "For legal professionals managing multiple clients",
    features: [
      "Unlimited cases",
      "Everything in Pro",
      "Client access management",
      "White-label branding",
      "Priority support",
      "API access",
      "Bulk export",
    ],
    cta: "Contact Sales",
    current: false,
    highlight: false,
  },
];

export default function Subscription() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose the plan that fits your needs.</p>
      </motion.div>

      <div className="flex items-center justify-center gap-3">
        <button
          className={`text-sm px-4 py-2 rounded-full transition-colors ${billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setBilling("monthly")}
          data-testid="billing-monthly"
        >
          Monthly
        </button>
        <button
          className={`text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${billing === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setBilling("annual")}
          data-testid="billing-annual"
        >
          Annual
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${billing === "annual" ? "bg-primary-foreground/20" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
            Save 20%
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((plan, i) => {
          const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card
                className={`h-full flex flex-col transition-all ${plan.highlight ? "border-primary ring-1 ring-primary shadow-md" : ""} ${plan.current ? "bg-muted/30" : ""}`}
                data-testid={`plan-${plan.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {plan.highlight && (
                      <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Popular</span>
                    )}
                    {plan.current && (
                      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">Current</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    {price === 0 ? (
                      <span className="text-2xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">${price}</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs">
                        <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.current ? "outline" : plan.highlight ? "default" : "outline"}
                    className="w-full"
                    disabled={plan.current}
                    data-testid={`button-${plan.id}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All plans include a 7-day free trial. Cancel anytime. No contracts.
      </p>
    </div>
  );
}
