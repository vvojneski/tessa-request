import { Link } from "wouter";
import { ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background flex flex-col relative overflow-hidden">
      {/* Advanced Futuristic Scanner Line */}
      <motion.div
        className="fixed left-0 right-0 z-50 pointer-events-none"
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Main scanner glow */}
        <div className="h-[2px] w-full bg-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.9)]" />
        
        {/* Trailing digital "ghost" effect */}
        <div className="h-40 w-full bg-gradient-to-b from-cyan-500/20 to-transparent opacity-50" />
        
        {/* Subtle data pulse nodes */}
        <div className="absolute top-0 left-0 w-full flex justify-around opacity-40">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-[1px] h-8 bg-cyan-400 blur-[0.5px]" />
          ))}
        </div>
      </motion.div>
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              SecOps<span className="text-primary">PenTest</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Lock className="w-3 h-3" />
              SECURE CONNECTION
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SecOps PenTest. All data is encrypted at rest and in transit.</p>
        </div>
      </footer>
    </div>
  );
}
