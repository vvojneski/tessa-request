import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { insertSubmissionSchema, type InsertSubmission } from "@shared/schema";
import { useCreateSubmission } from "@/hooks/use-submissions";
import { Layout } from "@/components/Layout";
import { WizardSteps } from "@/components/WizardSteps";
import { Button } from "@/components/ui/button";
import { TextField, TextAreaField, CheckboxGroup, RadioGroup } from "@/components/FormFields";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// STEPS CONFIG
const STEPS = [
  "Intro & Type",
  "Scope",
  "Target",
  "Details",
  "Schedule",
  "Review"
];

const TOTAL_STEPS = STEPS.length;

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createSubmission = useCreateSubmission();

  const methods = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    mode: "onChange",
    defaultValues: {
      businessRequirement: "",
      testTypes: [],
      ownerAwareness: "false",
      targetType: "",
      schedulingPreferences: "",
      contactName: "",
      contactEmail: "",
      scopeDescription: "",
      inScopeAssets: "",
      targetOther: "",
      schedulingOther: "",
      isProduction: false,
      externalDetails: {
        hostingProvider: "",
        cloudInfrastructure: "",
        webAppCount: 0,
        mobileAppCount: 0,
      },
      internalDetails: {
        internalIpCount: 0,
        desktopAppCount: 0,
        internalWebAppCount: 0,
        wirelessNetworkCount: 0,
        wirelessBoxType: "",
      },
      socialEngineeringDetails: {
        employeeCount: 1,
        campaignTypes: [],
      }
    }
  });

  const { handleSubmit, trigger, control, watch } = methods;
  const formData = watch(); // Watch all data for conditional rendering & review

  // Navigation Logic
  const nextStep = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let fieldsToValidate: (keyof InsertSubmission)[] = [];

    if (step === TOTAL_STEPS) return;

    switch (step) {
      case 1:
        fieldsToValidate = ["businessRequirement", "testTypes"];
        break;
      case 2:
        fieldsToValidate = ["scopeDescription", "ownerAwareness", "inScopeAssets"];
        break;
      case 3:
        fieldsToValidate = ["targetType", "isProduction"];
        if (formData.targetType === "other") fieldsToValidate.push("targetOther" as any);
        break;
      case 4:
        // Conditional validation based on selections
        if (isExternal) fieldsToValidate.push("externalDetails" as any);
        if (isInternal) fieldsToValidate.push("internalDetails" as any);
        if (isSocial) fieldsToValidate.push("socialEngineeringDetails" as any);
        break;
      case 5:
        fieldsToValidate = ["schedulingPreferences", "contactName", "contactEmail"];
        if (formData.schedulingPreferences === "other") fieldsToValidate.push("schedulingOther" as any);
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  const onSubmit = (data: InsertSubmission) => {
    createSubmission.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Request Submitted",
          description: "We have received your penetration testing request.",
        });
        setLocation("/success");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: error.message,
        });
      }
    });
  };

  // Conditionals helpers
  const testTypes = watch("testTypes") || [];
  const targetType = watch("targetType");
  const isExternal = testTypes.some(t => ["black_box", "gray_box"].includes(t)) || ["website", "network"].includes(targetType);
  const isInternal = testTypes.includes("white_box") || targetType === "internal_network";
  const isSocial = testTypes.includes("social_eng") || targetType === "people";
  const isProduction = watch("isProduction");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <WizardSteps currentStep={step} totalSteps={TOTAL_STEPS} steps={STEPS} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="glass-panel p-6 md:p-10 rounded-2xl min-h-[450px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {/* STEP 1: Intro & Type */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl mb-2">Project Classification</h2>
                        <p className="text-muted-foreground">Define the nature and methodology of the required test.</p>
                      </div>

                      <RadioGroup
                        name="businessRequirement"
                        label="Business Requirement"
                        description="What is the primary driver for this test?"
                        options={[
                          { value: "regulatory", label: "Regulatory / Compliance (PCI-DSS, HIPAA, etc.)" },
                          { value: "proactive", label: "Proactive Security Assessment" },
                          { value: "incident", label: "Post-Incident Analysis" },
                        ]}
                      />

                      <CheckboxGroup
                        name="testTypes"
                        label="Testing Methodology"
                        options={[
                          { value: "black_box", label: "Black Box (No Knowledge)" },
                          { value: "gray_box", label: "Gray Box (Partial Knowledge)" },
                          { value: "white_box", label: "White Box (Full Knowledge)" },
                          { value: "social_eng", label: "Social Engineering" },
                          { value: "wireless", label: "Wireless Network Assessment" },
                        ]}
                      />
                    </div>
                  )}

                  {/* STEP 2: Scope */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl mb-2">Scope & Rules of Engagement</h2>
                        <p className="text-muted-foreground">Define the boundaries of the assessment.</p>
                      </div>

                      <TextAreaField
                        name="scopeDescription"
                        label="Scope Description"
                        placeholder="Describe the overall scope..."
                        rows={4}
                      />

                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <RadioGroup
                          name="ownerAwareness"
                          label="Is the system owner aware of this test?"
                          description="Unauthorized testing is illegal. We require explicit consent."
                          options={[
                            { value: "true", label: "Yes, I am the owner or have explicit written authorization" },
                            { value: "false", label: "No / Not sure" },
                          ]}
                        />
                        {watch("ownerAwareness") === "false" && ( // Note: radio returns string "false"
                          <div className="mt-3 flex gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>We cannot proceed without authorization from the system owner.</span>
                          </div>
                        )}
                      </div>

                      <TextAreaField
                        name="inScopeAssets"
                        label="In-Scope Assets"
                        description="List all IP addresses, Domains, or Subnets."
                        placeholder="192.168.1.1&#10;example.com&#10;api.example.com"
                        className="font-mono text-sm"
                        rows={5}
                      />
                    </div>
                  )}

                  {/* STEP 3: Target Definition */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl mb-2">Target Environment</h2>
                        <p className="text-muted-foreground">Characterize the target systems.</p>
                      </div>

                      <RadioGroup
                        name="targetType"
                        label="Primary Target Type"
                        options={[
                          { value: "website", label: "Public Website / Web Application" },
                          { value: "network", label: "External Network Infrastructure" },
                          { value: "internal_network", label: "Internal Corporate Network" },
                          { value: "mobile", label: "Mobile Application (iOS/Android)" },
                          { value: "people", label: "Employees (Social Engineering)" },
                          { value: "other", label: "Other" },
                        ]}
                      />

                      {watch("targetType") === "other" && (
                        <TextField name="targetOther" label="Specify Other Target" />
                      )}

                      <div className="pt-4 border-t border-white/10">
                        <label className="flex items-center space-x-3 p-4 rounded-lg border border-input bg-card hover:bg-accent/50 cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("isProduction")}
                            className="w-5 h-5 rounded border-input bg-transparent text-primary focus:ring-primary/50"
                          />
                          <div>
                            <span className="font-medium text-foreground">Is this a Production Environment?</span>
                            <p className="text-xs text-muted-foreground">Testing in production carries inherent availability risks.</p>
                          </div>
                        </label>
                        
                        {isProduction && (
                          <div className="mt-3 flex gap-2 text-orange-400 text-sm bg-orange-400/10 p-3 rounded border border-orange-400/20">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>Warning: We will require a specific maintenance window for high-risk tests in production.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Specific Details */}
                  {step === 4 && (
                    <div className="space-y-8">
                      <div className="mb-6">
                        <h2 className="text-2xl mb-2">Detailed Specifications</h2>
                        <p className="text-muted-foreground">Provide metrics to help us estimate effort.</p>
                      </div>

                      {!isExternal && !isInternal && !isSocial && (
                        <p className="text-muted-foreground italic">No specific details required based on previous selections.</p>
                      )}

                      {isExternal && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                          <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">External / Web Scope</h3>
                          <TextField name="externalDetails.hostingProvider" label="Hosting Provider (AWS, Azure, On-Prem)" />
                          <div className="grid grid-cols-2 gap-4">
                            <TextField type="number" name="externalDetails.webAppCount" label="Number of Web Apps" min={0} />
                            <TextField type="number" name="externalDetails.mobileAppCount" label="Number of Mobile Apps" min={0} />
                          </div>
                        </div>
                      )}

                      {isInternal && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                          <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">Internal Scope</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <TextField type="number" name="internalDetails.internalIpCount" label="Live Internal IPs" min={0} />
                            <TextField type="number" name="internalDetails.desktopAppCount" label="Desktop Applications" min={0} />
                          </div>
                          <TextField name="internalDetails.wirelessBoxType" label="Wireless Infrastructure (Cisco, Aruba, etc)" />
                        </div>
                      )}

                      {isSocial && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                          <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">Social Engineering Scope</h3>
                          <TextField type="number" name="socialEngineeringDetails.employeeCount" label="Number of Targets (Employees)" min={1} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5: Schedule & Contact */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl mb-2">Logistics</h2>
                        <p className="text-muted-foreground">When should we perform the test?</p>
                      </div>

                      <RadioGroup
                        name="schedulingPreferences"
                        label="Scheduling Preference"
                        options={[
                          { value: "business_hours", label: "Business Hours (M-F, 9-5)" },
                          { value: "after_hours", label: "After Hours / Nights" },
                          { value: "weekend", label: "Weekends" },
                          { value: "other", label: "Custom Schedule" },
                        ]}
                      />
                      
                      {watch("schedulingPreferences") === "other" && (
                        <TextField name="schedulingOther" label="Describe Schedule Needs" />
                      )}

                      <div className="h-px bg-white/10 my-6" />
                      
                      <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField name="contactName" label="Full Name" />
                        <TextField name="contactEmail" label="Email Address" type="email" />
                      </div>
                    </div>
                  )}

                  {/* STEP 6: Review */}
                  {step === 6 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl mb-2">Review Request</h2>
                        <p className="text-muted-foreground">Please verify your information before submitting.</p>
                      </div>

                      <div className="bg-card border border-white/10 rounded-xl p-6 space-y-4 text-sm">
                        <ReviewRow label="Contact" value={`${formData.contactName} (${formData.contactEmail})`} />
                        <ReviewRow label="Business Goal" value={formData.businessRequirement} />
                        <ReviewRow label="Test Types" value={formData.testTypes?.join(", ")} />
                        <ReviewRow label="Target" value={formData.targetType} />
                        <ReviewRow label="Production?" value={formData.isProduction ? "YES" : "No"} />
                        <ReviewRow label="Scope" value={formData.scopeDescription} />
                        <ReviewRow label="Schedule" value={formData.schedulingPreferences} />
                      </div>
                      
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg text-sm text-primary-foreground/80">
                        <p>By submitting this form, you acknowledge that you are authorized to request security testing for the specified assets.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1 || createSubmission.isPending}
                className="w-32"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              {step < TOTAL_STEPS ? (
                <Button type="button" onClick={(e) => nextStep(e)} className="w-32">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={createSubmission.isPending} 
                  className="w-40 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                >
                  {createSubmission.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
}

function ReviewRow({ label, value }: { label: string, value: any }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 last:border-0 pb-2 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value.toString()}</span>
    </div>
  );
}
