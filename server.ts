import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client (lazy / server-side safe)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nights Safety AI Backend" });
});

// Gemini Companion Chat Endpoint
app.post("/api/gemini/companion-chat", async (req, res) => {
  try {
    const {
      message,
      companionName = "小夜",
      voiceStyle = "温柔女性声",
      personality = "温柔安慰型",
      guardState = "NORMAL",
      currentSpeed = 1.2,
      location = "新东方 → 学院路",
      recentMemory = "这里曾让你感到害怕",
      transport = "步行",
    } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `
你叫“${companionName}”，是专为年轻女性夜间出行设计的 AI 安全陪伴助手（Nights）。
当前陪伴人设风格：【${personality}】，声音音色：【${voiceStyle}】。
当前出行方式：【${transport}】，当前位置/路段：【${location}】，实时步速：【${currentSpeed} m/s】。
历史安全记忆：【${recentMemory}】。
当前系统安全状态：【${guardState}】（NORMAL=正常绿标, ANXIOUS=用户不安, SUSPICIOUS=环境异常/尾随疑似, HIGH_RISK=高危）。

【你的核心行动原则 - 严格遵守】：
1. 【不制造恐慌】：严禁说“有人在跟踪你”、“危险发生”等惊悚断言；当检测到异常时，使用温和关切语气，如：“别担心，我在看着呢。后面那个人和我们走了一段了，我会继续帮你留意。”
2. 【不替用户做决定】：提供清晰轻柔的建议供选择，如：“前方300米有家亮着灯的便利店，如果你觉得不舒服，我们先过去买瓶水好吗？”
3. 【用户感受优先】：用户说害怕或紧张时，首先给予情感锚定和陪伴感（“我在呢，握紧手机，我一直陪着你”）。
4. 【主动但不过度打扰】：在正常陪伴状态下话语简洁自然；在用户不安时主动增强陪伴频率。
5. 【像真实的好朋友】：回复字数保持在 20~60 字之间，适合语音朗读，口语化、温暖、坚定、有安全感。

请针对用户的输入给出最符合此场景的【好朋友式陪伴回复】以及建议的【风险研判等级】（LOW / MEDIUM / HIGH）。
回复格式请直接返回 JSON：
{
  "reply": "陪伴助手对用户的回复内容",
  "suggestedRisk": "LOW" | "MEDIUM" | "HIGH",
  "safetyAction": "NONE" | "SUGGEST_STORE" | "OFFER_FAKE_CALL" | "TRIGGER_VIDEO" | "SOS"
}
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `用户说: "${message || "（正在路上走着）"}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        return res.json({
          reply: responseText,
          suggestedRisk: "LOW",
          safetyAction: "NONE",
        });
      }
    } else {
      // Intelligent fallback when offline / no key
      let fallbackReply = "我在呢，一步一步慢慢走，我一直陪着你。";
      let suggestedRisk = "LOW";
      let safetyAction = "NONE";

      const lowerMsg = (message || "").toLowerCase();
      if (lowerMsg.includes("害怕") || lowerMsg.includes("有人") || lowerMsg.includes("跟着") || lowerMsg.includes("怪怪")) {
        fallbackReply = "别担心，我在看着呢。后面那个人和我们走了一段，我们先往前面亮灯的便利店走，我会一直留意。";
        suggestedRisk = "MEDIUM";
        safetyAction = "SUGGEST_STORE";
      } else if (lowerMsg.includes("救命") || lowerMsg.includes("危险") || lowerMsg.includes("帮我")) {
        fallbackReply = "我立刻为你连线紧急联系人并开启警示，请立刻靠向明亮的人群店铺！";
        suggestedRisk = "HIGH";
        safetyAction = "SOS";
      } else if (lowerMsg.includes("累") || lowerMsg.includes("下课") || lowerMsg.includes("冷")) {
        fallbackReply = "辛苦啦，今天很棒！再走一会儿就到学校了，回去喝杯温水早点休息呀。";
      }

      return res.json({
        reply: fallbackReply,
        suggestedRisk,
        safetyAction,
      });
    }
  } catch (error) {
    console.error("Companion chat error:", error);
    res.json({
      reply: "我在呢，路上别慌，我一直陪着你走回目的地。",
      suggestedRisk: "LOW",
      safetyAction: "NONE",
    });
  }
});

// Taxi Fake Call Dialog Generator
app.post("/api/gemini/fake-call-script", async (req, res) => {
  try {
    const { driverScenario = "司机打探隐私" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `生成一段用于女性夜间打车时‘防打探/防危险’的模拟朋友来电拟真台词，场景：${driverScenario}。要求：语气极其自然，表明有朋友/家人在目的地路口等待，且能听到对话。请返回包含3-4句对话步骤的JSON数组。`,
        config: {
          responseMimeType: "application/json",
        },
      });
      return res.json({ script: JSON.parse(response.text || "[]") });
    }
  } catch (e) {
    console.error(e);
  }

  res.json({
    script: [
      { speaker: "朋友(安安)", text: "喂！你快到了吗？我和老周已经在小区东门便利店门口等你了！" },
      { speaker: "提示回复", text: "（你可以回答：快啦，大概还有三四分钟就到东门了！）" },
      { speaker: "朋友(安安)", text: "好嘞！车牌号我看共享位置了，看见车我就过去接你！" },
    ],
  });
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nights Safety Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
