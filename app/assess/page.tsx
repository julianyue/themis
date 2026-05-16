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
  const riskLevel = formData.decisions === "fully-automated" ? "HIGH" : formData.decisions === "human-reviews" ? "MEDIUM" : "LOW";
  const riskScore = riskLevel === "HIGH" ? 78 : riskLevel === "MEDIUM" ? 52 : 28;
  
  return {
    id,
    title: formData.usecase.slice(0, 50) + (formData.usecase.length > 50 ? "..." : ""),
    timestamp: new Date().toISOString(),
    input: formData,
    summary: `This ${formData.industry.toLowerCase()} AI deployment targeting ${formData.users} users presents ${riskLevel.toLowerCase()} regulatory exposure. The ${formData.decisions.replace("-", " ")} decision model combined with ${formData.data.join(", ")} data processing triggers several compliance frameworks.`,
    overallRisk: riskLevel as "HIGH" | "MEDIUM" | "LOW",
    riskScore,
    flags: [
      { 
        severity: (formData.decisions === "fully-automated" ? "HIGH" : "MEDIUM") as "HIGH" | "MEDIUM" | "LOW", 
        framework: "EU AI Act", 
        issue: "High-Risk Classification", 
        description: "Article 6 classification based on decision autonomy and sector",
        sections: [
          { id: "art-6", title: "Article 6 - Classification Rules", summary: "Systems that make or substantially influence decisions affecting natural persons in high-risk domains.", implication: "Requires conformity assessment, CE marking, and registration in EU database before deployment.", reference: "https://eur-lex.europa.eu/eli/reg/2024/1689" },
          { id: "art-9", title: "Article 9 - Risk Management System", summary: "Mandatory establishment of a risk management system throughout the AI system lifecycle.", implication: "Must implement continuous risk identification, estimation, evaluation, and mitigation processes.", reference: "https://eur-lex.europa.eu/eli/reg/2024/1689" },
          { id: "art-13", title: "Article 13 - Transparency", summary: "High-risk AI systems must be designed to allow users to interpret and use outputs appropriately.", implication: "Requires clear documentation of system capabilities, limitations, and intended use.", reference: "https://eur-lex.europa.eu/eli/reg/2024/1689" },
          { id: "art-14", title: "Article 14 - Human Oversight", summary: "Systems must allow effective human oversight during use.", implication: "Must enable human operators to understand, monitor, and override AI decisions.", reference: "https://eur-lex.europa.eu/eli/reg/2024/1689" },
        ]
      },
      { 
        severity: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW", 
        framework: "NIST AI RMF", 
        issue: "Risk Management Framework", 
        description: "Voluntary framework for AI risk management recommended",
        sections: [
          { id: "govern", title: "GOVERN Function", summary: "Cultivate a culture of risk management within organizations that design, develop, deploy, or use AI.", implication: "Establish AI governance policies, roles, and accountability structures.", reference: "https://www.nist.gov/itl/ai-risk-management-framework" },
          { id: "map", title: "MAP Function", summary: "Context is recognized and risks related to context are identified.", implication: "Document intended use, user groups, and potential negative impacts systematically.", reference: "https://www.nist.gov/itl/ai-risk-management-framework" },
          { id: "measure", title: "MEASURE Function", summary: "Identified risks are assessed, analyzed, or tracked.", implication: "Implement metrics and monitoring for bias, fairness, reliability, and safety.", reference: "https://www.nist.gov/itl/ai-risk-management-framework" },
          { id: "manage", title: "MANAGE Function", summary: "Risks are prioritized and acted upon based on projected impact.", implication: "Develop response plans and allocate resources for risk treatment.", reference: "https://www.nist.gov/itl/ai-risk-management-framework" },
        ]
      },
      { 
        severity: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW", 
        framework: "Anthropic Guidelines", 
        issue: "Responsible Scaling Policy", 
        description: "Best practices for safe AI deployment and capability assessment",
        sections: [
          { id: "asl", title: "AI Safety Levels (ASL)", summary: "Tiered safety requirements based on model capabilities and potential risks.", implication: "Assess your deployment against capability thresholds and implement corresponding safeguards.", reference: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy" },
          { id: "eval", title: "Capability Evaluations", summary: "Regular assessment of AI capabilities to identify potential dangerous behaviors.", implication: "Implement red-teaming and adversarial testing before and after deployment.", reference: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy" },
          { id: "deploy", title: "Deployment Safeguards", summary: "Graduated deployment with monitoring and rollback capabilities.", implication: "Start with limited deployment, monitor for misuse, and maintain ability to restrict access.", reference: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy" },
          { id: "oversight", title: "Human Oversight Requirements", summary: "Ensure meaningful human control over AI system decisions and actions.", implication: "Design systems that support human review and intervention at critical decision points.", reference: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy" },
        ]
      },
      { 
        severity: "LOW" as "HIGH" | "MEDIUM" | "LOW", 
        framework: "ISO 42001", 
        issue: "Management System Standard", 
        description: "AI management system standard advisory",
        sections: [
          { id: "4-context", title: "Clause 4 - Context of Organization", summary: "Understanding the organization and its context for AI management.", implication: "Document stakeholder needs, scope of AI activities, and external/internal issues.", reference: "https://www.iso.org/standard/81230.html" },
          { id: "5-leadership", title: "Clause 5 - Leadership", summary: "Top management commitment and AI policy establishment.", implication: "Establish AI policy, assign responsibilities, and ensure adequate resources.", reference: "https://www.iso.org/standard/81230.html" },
          { id: "6-planning", title: "Clause 6 - Planning", summary: "Actions to address risks and opportunities, AI objectives.", implication: "Plan risk treatments, set measurable AI objectives, and plan changes systematically.", reference: "https://www.iso.org/standard/81230.html" },
          { id: "9-evaluation", title: "Clause 9 - Performance Evaluation", summary: "Monitoring, measurement, analysis, and evaluation of the AI management system.", implication: "Conduct internal audits and management reviews of AI governance effectiveness.", reference: "https://www.iso.org/standard/81230.html" },
        ]
      },
    ],
    regulations: [
      { name: "EU AI Act", relevance: "European Union", requirement: "Risk assessment and conformity documentation required by August 2025" },
      { name: "State AI Laws", relevance: "United States", requirement: "Disclosure requirements vary by state - ongoing compliance needed" },
      { name: "AI Safety Framework", relevance: "United Kingdom", requirement: "Sector-specific guidance compliance required by 2025" },
    ],
    controlIdeas: [
      { control: "AI Ethics Review Board", description: "Establish governance oversight for AI deployment decisions", priority: "HIGH" as "HIGH" | "MEDIUM" | "LOW" },
      { control: "Model Decision Documentation", description: "Document model decision logic for transparency and auditing", priority: "HIGH" as "HIGH" | "MEDIUM" | "LOW" },
      { control: "Model Monitoring System", description: "Implement model monitoring and drift detection", priority: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW" },
      { control: "Audit Logging", description: "Create audit logging for all AI decisions", priority: "HIGH" as "HIGH" | "MEDIUM" | "LOW" },
      { control: "Human Override Procedures", description: "Define human override procedures for automated decisions", priority: "HIGH" as "HIGH" | "MEDIUM" | "LOW" },
      { control: "Incident Response Plan", description: "Establish incident response plan for AI failures", priority: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW" },
    ],
    engineeringRequirements: [
      { category: "Documentation", requirement: "Model Cards", rationale: "Required for transparency and regulatory compliance" },
      { category: "Documentation", requirement: "Data Sheets", rationale: "Document data sources, processing, and lineage" },
      { category: "Documentation", requirement: "Risk Assessment Report", rationale: "Formal risk documentation for compliance" },
      { category: "Technical", requirement: "Explainability Module", rationale: "Enable interpretation of model decisions" },
      { category: "Technical", requirement: "Bias Testing Pipeline", rationale: "Detect and mitigate algorithmic bias" },
      { category: "Technical", requirement: "Performance Monitoring Dashboard", rationale: "Real-time visibility into model behavior" },
      { category: "Process", requirement: "Human Oversight Workflow", rationale: "Ensure human-in-the-loop for critical decisions" },
      { category: "Process", requirement: "Feedback Collection Mechanism", rationale: "Gather user feedback for continuous improvement" },
    ],
    knowledgeBaseFiles: [
      { filename: "eu-ai-act-guide.md", title: "EU AI Act Compliance Guide", content: "# EU AI Act Compliance Guide\n\nThis document outlines the key requirements for compliance with the EU AI Act...\n\n## Risk Classification\n\nYour deployment has been classified as " + riskLevel + " risk based on the assessment criteria." },
      { filename: "risk-assessment-template.md", title: "Risk Assessment Template", content: "# Risk Assessment Template\n\n## Overview\n\nUse this template to document your AI risk assessment...\n\n## Risk Score: " + riskScore + "/100" },
      { filename: "model-docs-framework.md", title: "Model Documentation Framework", content: "# Model Documentation Framework\n\n## Purpose\n\nThis framework provides guidance for documenting AI models..." },
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

        <button
          onClick={() => {
            if (step > 1) {
              handleBack();
            } else {
              router.push("/");
            }
          }}
          className="absolute top-8 left-8 p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

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
