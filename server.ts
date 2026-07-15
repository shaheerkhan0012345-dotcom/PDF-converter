import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API routes go here FIRST
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { pdfText, model, autoSummarizeType, customQuery } = req.body;
    
    if (!pdfText) {
      return res.status(400).json({ error: "No PDF text content provided for summarization" });
    }

    const ai = getGeminiClient();

    let targetModel = "gemini-3.5-flash";
    if (model && (model.includes("Pro") || model.includes("pro"))) {
      targetModel = "gemini-3.1-pro-preview";
    }

    let systemInstruction = `You are an advanced, premium, full-stack document analyzer in DocuFlow.
Your objective is to provide a highly polished, detailed, and structured analytical document summary.`;

    if (customQuery && customQuery.trim().length > 0) {
      systemInstruction += `\nIn addition to general document analysis, the user has a specific focus or question: "${customQuery.trim()}"\nYou MUST prioritize answering this question directly and comprehensively in your response.`;
    }

    systemInstruction += `\nThe user requested summarization style: "${autoSummarizeType || "Structured Outline (Executive Summary)"}".
You must structure your response cleanly with professional markdown headings, bullet points, and key highlights.
Focus on extracting core values, tables, numbers, names, and actionable findings. Keep the tone professional, objective, and authoritative.`;

    const contents = `Analyze and summarize the following document text content based on the requested format style:
---
${pdfText}
---`;

    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.25,
      }
    });

    res.json({ text: response.text || "No response text generated from the Gemini model." });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate content from Gemini API" });
  }
});

// Vite middleware setup
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
