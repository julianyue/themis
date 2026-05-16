"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userOptions = [
  { value: "internal", label: "Internal team", description: "Used by employees within your organization" },
  { value: "customers", label: "Customers", description: "Deployed to paying customers or users" },
  { value: "automated", label: "Automated decision-making", description: "Makes decisions without human input" },
  { value: "public", label: "General public", description: "Accessible to anyone" },
];

const industryOptions = [
  "Healthcare",
  "Finance & banking",
  "Hiring & HR",
  "Legal",
  "Education",
  "Government",
  "Technology",
  "Other",
];

const decisionOptions = [
  { value: "fully-automated", label: "Fully automated", description: "AI makes all decisions independently" },
  { value: "human-reviews", label: "Human reviews AI output", description: "AI suggests, human approves" },
  { value: "ai-assists", label: "AI assists human", description: "Human decides with AI support" },
  { value: "advisory", label: "Advisory only", description: "AI provides information, no decisions" },
];

const dataOptions = [
  { value: "personal", label: "Personal data", description: "Names, emails, identifiers" },
  { value: "biometric", label: "Biometric data", description: "Face, voice, fingerprints" },
  { value: "financial", label: "Financial data", description: "Income, transactions, credit" },
  { value: "health", label: "Health data", description: "Medical records, conditions" },
  { value: "behavioral", label: "Behavioral data", description: "Usage patterns, preferences" },
  { value: "none", label: "No personal data", description: "Anonymized or non-personal only" },
];

const loadingMessages = [
  "Mapping to frameworks...",
  "Analyzing risk vectors...",
  "Generating requirements...",
  "Compiling output...",
];

function generateSampleAssessment(formData: {
  usecase: string;
  users: string;
  industry: string;
  decisions: string;
  data: string[];
}) {
  const id = `assessment-${Date.now()}`;
  return {
    id,
    timestamp: new Date().toISOString(),
    input: formData,
    summary: `This ${formData.industry.toLowerCase()} AI deployment targeting ${formData.users} users presents moderate regulatory exposure. The ${formData.decisions.replace("-", " ")} decision model combined with ${formData.data.join(", ")} data processing triggers several compliance frameworks.`,
    riskScore: formData.decisions === "fully-automated" ? "High" : formData.decisions === "human-reviews" ? "Medium" : "Low",
    frameworkFlags: [
      { name: "EU AI Act", status: formData.decisions === "fully-automated" ? "High-Risk" : "Limited Risk", description: "Article 6 classification based on decision autonomy and sector" },
      { name: "GDPR", status: formData.data.includes("personal") || formData.data.includes("biometric") ? "Applicable" : "Limited", description: "Data processing requirements for personal data" },
      { name: "NIST AI RMF", status: "Recommended", description: "Voluntary framework for AI risk management" },
      { name: "ISO 42001", status: "Advisory", description: "AI management system standard" },
    ],
    regulations: [
      { jurisdiction: "European Union", regulation: "EU AI Act", requirement: "Risk assessment and conformity documentation required", deadline: "August 2025" },
      { jurisdiction: "United States", regulation: "State AI Laws", requirement: "Disclosure requirements vary by state", deadline: "Ongoing" },
      { jurisdiction: "United Kingdom", regulation: "AI Safety Framework", requirement: "Sector-specific guidance compliance", deadline: "2025" },
    ],
    controls: [
      { category: "Governance", control: "Establish AI ethics review board", priority: "High" },
      { category: "Governance", control: "Document model decision logic", priority: "High" },
      { category: "Technical", control: "Implement model monitoring and drift detection", priority: "Medium" },
      { category: "Technical", control: "Create audit logging for all AI decisions", priority: "High" },
      { category: "Operational", control: "Define human override procedures", priority: "High" },
      { category: "Operational", control: "Establish incident response plan", priority: "Medium" },
    ],
    requirements: [
      { category: "Documentation", items: ["Model cards", "Data sheets", "Risk assessment report", "Conformity declaration"] },
      { category: "Technical Implementation", items: ["Explainability module", "Bias testing pipeline", "Performance monitoring dashboard"] },
      { category: "Process", items: ["Human oversight workflow", "Feedback collection mechanism", "Regular model revalidation schedule"] },
    ],
    knowledgeBase: [
      { title: "EU AI Act Compliance Guide", filename: "eu-ai-act-guide.pdf", size: "2.4 MB" },
      { title: "Risk Assessment Template", filename: "risk-assessment-template.xlsx", size: "156 KB" },
      { title: "Model Documentation Framework", filename: "model-docs-framework.pdf", size: "1.1 MB" },
    ],
  };
}

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const [formData, setFormData] = useState({
    usecase: "",
    users: "",
    industry: "",
    decisions: "",
    data: [] as string[],
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    const assessment = generateSampleAssessment(formData);
    const existingAssessments = JSON.parse(localStorage.getItem("themis-assessments") || "{}");
    existingAssessments[assessment.id] = assessment;
    localStorage.setItem("themis-assessments", JSON.stringify(existingAssessments));
    
    clearInterval(interval);
    router.push(`/dashboard?id=${assessment.id}`);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.usecase.trim().length > 0;
      case 2: return formData.users.length > 0;
      case 3: return formData.industry.length > 0;
      case 4: return formData.decisions.length > 0;
      case 5: return formData.data.length > 0;
      default: return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.p
            key={loadingMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="font-mono text-lg text-neutral-600"
          >
            {loadingMessages[loadingMessageIndex]}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">

      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <p className="font-mono text-sm text-neutral-400">
            {String(step).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </p>
        </div>

        {step > 1 && (
          <button
            onClick={handleBack}
            className="absolute top-8 left-8 p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 text-center">
                  What are you building?
                </h2>
                <Textarea
                  placeholder="Describe your AI deployment in plain language..."
                  value={formData.usecase}
                  onChange={(e) => setFormData({ ...formData, usecase: e.target.value })}
                  className="min-h-[200px] text-lg border-neutral-200 focus:border-neutral-400 bg-white/80 backdrop-blur-sm"
                />
                <div className="flex justify-center">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    Continue
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 text-center">
                  Who is it for?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, users: option.value })}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.users === option.value
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 bg-white/80 hover:border-neutral-300"
                      }`}
                    >
                      <p className="font-semibold text-neutral-900">{option.label}</p>
                      <p className="text-sm text-neutral-500 mt-1">{option.description}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    Continue
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 text-center">
                  What industry are you in?
                </h2>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="w-full h-14 text-lg border-neutral-200 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-center">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    Continue
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 text-center">
                  How are decisions made?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decisionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, decisions: option.value })}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.decisions === option.value
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 bg-white/80 hover:border-neutral-300"
                      }`}
                    >
                      <p className="font-semibold text-neutral-900">{option.label}</p>
                      <p className="text-sm text-neutral-500 mt-1">{option.description}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    Continue
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 text-center">
                  What data does it use?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const newData = formData.data.includes(option.value)
                          ? formData.data.filter((d) => d !== option.value)
                          : [...formData.data, option.value];
                        setFormData({ ...formData, data: newData });
                      }}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.data.includes(option.value)
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 bg-white/80 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          formData.data.includes(option.value)
                            ? "border-neutral-900 bg-neutral-900"
                            : "border-neutral-300"
                        }`}>
                          {formData.data.includes(option.value) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{option.label}</p>
                          <p className="text-sm text-neutral-500 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    Run assessment
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
