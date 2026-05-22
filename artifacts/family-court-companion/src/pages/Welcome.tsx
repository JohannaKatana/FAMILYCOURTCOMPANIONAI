import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";

export default function Welcome() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 mx-auto"
        >
          <ShieldCheck className="w-12 h-12 text-primary" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          Organize family-court evidence in one place
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          A secure workspace to collect evidence, analyze communications, and prepare for your family court case.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex flex-col gap-3 mb-10"
        >
          <Link href="/sign-up">
            <Button className="w-full h-12 text-lg">Create Account</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="w-full h-12 text-lg">Sign In</Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex flex-col items-center gap-1">
            <Lock className="w-5 h-5" />
            <span>Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5" />
            <span>Private</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <EyeOff className="w-5 h-5" />
            <span>Never Shared</span>
          </div>
        </motion.div>
      </main>

      <footer className="p-4 mt-auto">
        <DisclaimerBanner />
      </footer>
    </div>
  );
}