import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Success() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto p-8 glass-panel rounded-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Request Received
          </h1>
          
          <p className="text-muted-foreground mb-8 text-lg">
            We have securely received your penetration testing request. Our security operations team will review the scope and contact you within 24 hours to schedule the engagement kickoff.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" /> Return Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
