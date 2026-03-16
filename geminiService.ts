import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "./constants";

export class GeminiService {
  private getAI() {
    // Sử dụng VITE_API_KEY để bảo mật và tương thích với các nền tảng web
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[]) {
    try {
      const genAI = this.getAI();
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Hoặc "gemini-2.0-flash-exp"
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      const filteredHistory = history.filter((msg, index) => {
        if (index === 0 && msg.role === 'model') return false;
        return true;
      });

      const chatSession = model.startChat({
        history: filteredHistory,
        generationConfig: { temperature: 0.7 }
      });

      const result = await chatSession.sendMessage(message);
      return {
        text: result.response.text(),
        candidates: [{ groundingMetadata: (result.response as any).groundingMetadata }]
      };
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
