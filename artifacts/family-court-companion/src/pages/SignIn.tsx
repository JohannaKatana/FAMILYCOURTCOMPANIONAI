import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { motion } from "framer-motion";
import { loginAndStoreToken } from "@/lib/authToken";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

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
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your case workspace</p>
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
              <span className="bg-background px-3 text-xs text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!canSubmit) return;
              setLoading(true);
              setError(null);
              try {
                await loginAndStoreToken(email.trim(), password);
                setLocation("/home");
              } catch {
                setError("Incorrect email or password. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                data-testid="input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="pr-10"
                  data-testid="input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={!canSubmit}
              data-testid="button-sign-in"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <span className="text-primary font-medium cursor-pointer hover:underline" data-testid="link-sign-up">Create account</span>
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
