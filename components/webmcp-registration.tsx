"use client";

import { useEffect } from "react";

type ToolResult = { content: Array<{ type: "text"; text: string }> };
type ModelContextLike = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: { topic?: string }) => Promise<ToolResult>;
  }) => void | (() => void) | Promise<void | (() => void)>;
};

export default function WebMCPRegistration() {
  useEffect(() => {
    let cleanup: void | (() => void);
    let active = true;
    const navigatorWithModelContext = navigator as Navigator & { modelContext?: ModelContextLike };
    const modelContext = navigatorWithModelContext.modelContext;
    if (!modelContext || typeof modelContext.registerTool !== "function") return;

    Promise.resolve(modelContext.registerTool({
      name: "cosmocareer_get_platform_information",
      description: "Get public information about CosmoCareer, including career discovery, courses, placement resources, creative services and contact details.",
      inputSchema: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Optional topic: career test, courses, placements, services, contact or about."
          }
        },
        additionalProperties: false
      },
      execute: async ({ topic }) => {
        const pages: Record<string, string> = {
          "career test": "https://growmorex.in/career-test — 60-question career self-assessment for educational guidance.",
          "courses": "https://growmorex.in/courses — browse practical learning courses.",
          "placements": "https://growmorex.in/placements — explore placement resources and opportunities.",
          "services": "https://growmorex.in/services — explore creative and digital services.",
          "contact": "https://growmorex.in/contact — contact CosmoCareer at hello@growmorex.in.",
          "about": "https://growmorex.in/about — learn about CosmoCareer."
        };
        const key = (topic || "about").toLowerCase();
        const answer = pages[key] || "CosmoCareer provides career discovery, practical courses, placement resources and creative services. Visit https://growmorex.in/about or https://growmorex.in/contact. Email: hello@growmorex.in.";
        return { content: [{ type: "text", text: answer }] };
      }
    })).then(result => { if (active && typeof result === "function") cleanup = result; });
    return () => { active = false; if (cleanup) cleanup(); };
  }, []);
  return null;
}
