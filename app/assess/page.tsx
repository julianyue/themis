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

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

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
    }, 2000);

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usecase: formData.usecase,
          users: formData.users,
          industry: formData.industry,
          decisions: formData.decisions,
          data: formData.data.join(", "),
        }),
      });

      if (response.ok) {
        const assessment = await response.json();
        const existingAssessments = JSON.parse(localStorage.getItem("themis-assessments") || "{}");
        existingAssessments[assessment.id] = assessment;
        localStorage.setItem("themis-assessments", JSON.stringify(existingAssessments));
        router.push(`/dashboard?id=${assessment.id}`);
      } else {
        console.error("Assessment failed");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    } finally {
      clearInterval(interval);
    }
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
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center"
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
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
