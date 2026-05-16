"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Assessment {
  id: string;
  title: string;
  timestamp: string;
  input: {
    usecase: string;
    users: string;
    industry: string;
    decisions: string;
    data: string;
  };
  overallRisk: "HIGH" | "MEDIUM" | "LOW";
  riskScore: number;
  summary: string;
  flags: Array<{
    severity: "HIGH" | "MEDIUM" | "LOW";
    framework: string;
    issue: string;
    detail: string;
  }>;
  regulations: Array<{
    name: string;
    relevance: string;
    requirement: string;
  }>;
  controlIdeas: Array<{
    control: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  }>;
  engineeringRequirements: Array<{
    category: string;
    requirement: string;
    rationale: string;
  }>;
  knowledgeBaseFiles: Array<{
    filename: string;
    title: string;
    content: string;
  }>;
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function RiskBadge({ risk }: { risk: "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = {
    HIGH: "bg-red-100 text-red-800 border-red-200",
    MEDIUM: "bg-amber-100 text-amber-800 border-amber-200",
    LOW: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[risk]}`}>
      {risk}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = {
    HIGH: "bg-red-50 text-red-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    LOW: "bg-green-50 text-green-700",
  };
  const Icon = severity === "HIGH" ? AlertTriangle : severity === "MEDIUM" ? AlertCircle : CheckCircle;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colors[severity]}`}>
      <Icon className="w-3 h-3" />
      {severity}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = {
    HIGH: "bg-neutral-900 text-white",
    MEDIUM: "bg-neutral-200 text-neutral-800",
    LOW: "bg-neutral-100 text-neutral-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[priority]}`}>
      {priority}
    </span>
  );
}

function FrameworkTag({ framework }: { framework: string }) {
  return (
    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-xs font-mono">
      {framework}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="font-mono text-neutral-400">Loading dashboard...</p>
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assessments, setAssessments] = useState<Record<string, Assessment>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("themis-assessments");
    if (stored) {
      const parsed = JSON.parse(stored);
      setAssessments(parsed);
      
      const urlId = searchParams.get("id");
      if (urlId && parsed[urlId]) {
        setSelectedId(urlId);
      } else {
        const ids = Object.keys(parsed);
        if (ids.length > 0) {
          setSelectedId(ids[ids.length - 1]);
        }
      }
    }
  }, [searchParams]);

  const assessmentList = Object.values(assessments).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const selectedAssessment = selectedId ? assessments[selectedId] : null;

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const groupedRequirements = selectedAssessment?.engineeringRequirements.reduce(
    (acc, req) => {
      if (!acc[req.category]) acc[req.category] = [];
      acc[req.category].push(req);
      return acc;
    },
    {} as Record<string, typeof selectedAssessment.engineeringRequirements>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-neutral-200 transition-all duration-300 z-20 ${
          sidebarCollapsed ? "w-16" : "w-72"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neutral-100">
            {!sidebarCollapsed && (
              <h1 className="font-mono font-bold text-lg text-neutral-900">Themis</h1>
            )}
          </div>

          <div className="p-4">
            <Link href="/assess">
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 border-neutral-200 hover:bg-neutral-50 ${
                  sidebarCollapsed ? "px-3" : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                {!sidebarCollapsed && "New assessment"}
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {assessmentList.map((assessment) => (
              <button
                key={assessment.id}
                onClick={() => setSelectedId(assessment.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  selectedId === assessment.id
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-50"
                }`}
              >
                {!sidebarCollapsed && (
                  <>
                    <p className="font-medium text-neutral-900 truncate text-sm">
                      {assessment.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatRelativeTime(assessment.timestamp)}
                    </p>
                  </>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-4 border-t border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-72"
        }`}
      >
        {assessmentList.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-neutral-500 mb-4">No assessments yet</p>
              <Link href="/assess">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">
                  Run your first assessment
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : selectedAssessment ? (
          <div className="max-w-5xl mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-neutral-900">
                    {selectedAssessment.title}
                  </h1>
                  <RiskBadge risk={selectedAssessment.overallRisk} />
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>{new Date(selectedAssessment.timestamp).toLocaleString()}</span>
                  <span>Risk Score: {selectedAssessment.riskScore}/100</span>
                </div>
              </motion.div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="mb-8 border-neutral-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-neutral-900">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 leading-relaxed">{selectedAssessment.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Framework Flags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Framework Flags</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedAssessment.flags.map((flag, index) => (
                    <Card key={index} className="border-neutral-200">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <SeverityBadge severity={flag.severity} />
                          <FrameworkTag framework={flag.framework} />
                        </div>
                        <h3 className="font-medium text-neutral-900 mb-1">{flag.issue}</h3>
                        <p className="text-sm text-neutral-600">{flag.detail}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Regulations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Applicable Regulations</h2>
                <div className="space-y-4 mb-8">
                  {selectedAssessment.regulations.map((reg, index) => (
                    <div key={index} className="p-4 rounded-lg border border-neutral-200 bg-white">
                      <h3 className="font-medium text-neutral-900 mb-1">{reg.name}</h3>
                      <p className="text-sm text-neutral-500 mb-2">{reg.relevance}</p>
                      <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded">{reg.requirement}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Control Ideas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Control Ideas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedAssessment.controlIdeas.map((control, index) => (
                    <Card key={index} className="border-neutral-200">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-neutral-900">{control.control}</h3>
                          <PriorityBadge priority={control.priority} />
                        </div>
                        <p className="text-sm text-neutral-600">{control.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Engineering Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Engineering Requirements</h2>
                <div className="space-y-6 mb-8">
                  {groupedRequirements &&
                    Object.entries(groupedRequirements).map(([category, reqs]) => (
                      <div key={category}>
                        <h3 className="font-mono text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                          {category}
                        </h3>
                        <div className="space-y-3">
                          {reqs.map((req, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg border border-neutral-200 bg-white"
                            >
                              <p className="font-medium text-neutral-900 mb-1">{req.requirement}</p>
                              <p className="text-sm text-neutral-500">{req.rationale}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Knowledge Base Files */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Knowledge Base Files</h2>
                <div className="space-y-3">
                  {selectedAssessment.knowledgeBaseFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-white"
                    >
                      <div>
                        <p className="font-mono text-sm text-neutral-600">{file.filename}</p>
                        <p className="font-medium text-neutral-900">{file.title}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file.filename, file.content)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
