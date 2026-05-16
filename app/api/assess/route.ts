import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

function generateId() {
  return `assess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateTitle(usecase: string): string {
  const words = usecase.split(/\s+/).slice(0, 4);
  if (words.length === 0) return "AI Assessment";
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usecase, users, industry, decisions, data } = body;

    if (!usecase || !users || !industry || !decisions || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("API KEY:", process.env.ANTHROPIC_API_KEY ? "found" : "missing");

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `You are an AI risk and governance expert. Analyze the following AI deployment and return a structured JSON risk assessment.

Deployment: ${usecase}
Users: ${users}
Industry: ${industry}
Decision model: ${decisions}
Data used: ${data}

Return ONLY valid JSON, no markdown, no preamble:
{
  "overallRisk": "HIGH" | "MEDIUM" | "LOW",
  "riskScore": <number 1-100>,
  "summary": "<2-3 sentence plain English summary>",
  "flags": [{ "severity": "HIGH"|"MEDIUM"|"LOW", "framework": "<EU AI Act|NIST AI RMF|Anthropic Guidelines|ISO 42001>", "issue": "<title>", "detail": "<1-2 sentences>" }],
  "regulations": [{ "name": "<regulation>", "relevance": "<why it applies>", "requirement": "<what is required>" }],
  "controlIdeas": [{ "control": "<title>", "description": "<what it does>", "priority": "HIGH"|"MEDIUM"|"LOW" }],
  "engineeringRequirements": [{ "category": "<Logging|Access Control|Human Oversight|Data Governance|Model Monitoring|Explainability|Security>", "requirement": "<specific requirement>", "rationale": "<why>" }],
  "knowledgeBaseFiles": [{ "filename": "<kebab-case.md>", "title": "<title>", "content": "<2-3 paragraph markdown summary ready for RAG>" }]
}

Generate 3-5 flags, 2-3 regulations, 3-5 control ideas, 4-6 engineering requirements, 1-2 knowledge base files. Keep responses concise.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("Raw response:", message.content[0].type === "text" ? message.content[0].text.substring(0, 500) : "no text");

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    let assessment;
    try {
      const cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      assessment = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const result = {
      id: generateId(),
      title: generateTitle(usecase),
      timestamp: new Date().toISOString(),
      input: { usecase, users, industry, decisions, data },
      ...assessment,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Assessment error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Assessment failed" },
      { status: 500 }
    );
  }
}