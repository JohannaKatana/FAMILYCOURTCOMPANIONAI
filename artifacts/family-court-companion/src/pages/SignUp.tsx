import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { motion } from "framer-motion";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="h-14 flex items-center px-6 border-b border-border">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="Family Court Companion AI" className="h-7 w-7 rounded" />
            <span className="font-semibold text-sm">Family Court Companion AI</span>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Secure, private case preparation</p>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full h-11 gap-2" data-testid="button-continue-google">
              <SiGoogle className="h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-11 gap-2" data-testid="button-continue-apple">
              <SiApple className="h-4 w-4" />
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or sign up with email</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" data-testid="input-email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="8+ characters"
                  autoComplete="new-password"
                  className="pr-10"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPass(!showPass)}
                  data-testid="button-toggle-password"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(!!v)}
                className="mt-0.5"
                data-testid="checkbox-agree"
              />
              <Label htmlFor="agree" className="text-sm font-normal leading-relaxed text-muted-foreground cursor-pointer">
                I understand this app provides organizational tools and information only, not legal advice. I will consult a licensed attorney for legal decisions.
              </Label>
            </div>

            <Button
              className="w-full h-11"
              disabled={!agreed}
              onClick={() => setLocation("/onboarding/state")}
              data-testid="button-create-account"
            >
              Create Account
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in">
              <span className="text-primary font-medium cursor-pointer hover:underline" data-testid="link-sign-in">Sign in</span>
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
