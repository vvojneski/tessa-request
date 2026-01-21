import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WizardStepsProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function WizardSteps({ currentStep, totalSteps, steps }: WizardStepsProps) {
  return (
    <div className="mb-10">
      {/* Desktop Steps */}
      <div className="hidden md:flex justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 font-mono font-bold text-sm
                  transition-colors duration-300
                  ${isActive 
                    ? "bg-background border-primary text-primary shadow-[0_0_15px_rgba(45,212,191,0.5)] scale-110" 
                    : isCompleted 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-background border-muted text-muted-foreground"
                  }
                `}
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </motion.div>
              <span className={`text-xs font-medium uppercase tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Steps */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-bold text-primary">{steps[currentStep - 1]}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
