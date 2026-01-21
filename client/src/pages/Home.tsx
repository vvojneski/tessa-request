import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Lock, Activity, FileText } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            SYSTEMS OPERATIONAL
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
            Secure Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent">Digital Assets</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Professional-grade penetration testing and security assessments. 
            Define your scope, choose your methodology, and secure your infrastructure.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Link href="/request">
            <Button size="lg" className="h-16 px-8 text-lg rounded-xl gap-3 shadow-[0_0_40px_rgba(45,212,191,0.3)] hover:shadow-[0_0_60px_rgba(45,212,191,0.5)] transition-all duration-500">
              <Shield className="w-6 h-6" /> Start New Request <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <FeatureCard 
            icon={<Lock className="w-6 h-6 text-primary" />}
            title="Encrypted Communications"
            description="All request details are end-to-end encrypted and stored securely."
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-primary" />}
            title="Comprehensive Testing"
            description="From black-box external attacks to white-box internal audits."
          />
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-primary" />}
            title="Detailed Reporting"
            description="Receive actionable insights and remediation steps."
          />
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl glass-panel text-left hover:bg-white/5 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
