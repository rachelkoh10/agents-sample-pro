import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Market Analysis Endpoint
  app.post("/api/gemini/market-analysis", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is not configured.",
        });
      }

      const { symbol, name, category, question } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = question
        ? `Analyze the following market query regarding ${symbol} (${name}) in ${category}: "${question}". Provide a concise, professional financial breakdown with bullet points on Key Drivers, Technical Sentiment, Risk Factors, and Outlook.`
        : `Provide a quick institutional market analysis for ${name} (${symbol}), category ${category}. Give a concise summary covering: 1. Recent Market Sentiment & News, 2. Key Technical Levels, 3. Bullish & Bearish Catalysts, 4. Summary Recommendation/Outlook. Keep it formatted with markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert Wall Street financial market analyst providing real-time data insights, market intelligence, and objective technical and fundamental commentary.",
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No analysis generated.";
      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({
        analysis: text,
        groundingSources: groundingChunks,
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({
        error: err.message || "Failed to generate market analysis.",
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Markets Terminal] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
