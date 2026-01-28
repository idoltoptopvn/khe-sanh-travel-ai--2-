
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

export class GeminiService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined") {
      console.error("API Key is missing in environment variables!");
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey });
  }

  async chat(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
    try {
      const ai = this.getAI();
      
      // Quy tắc của Gemini: Contents phải bắt đầu bằng lượt của 'user'.
      // Lời chào mặc định của model ở index 0 trong history cần bị loại bỏ khi gửi lên API.
      const filteredHistory = history.filter((msg, index) => {
        if (index === 0 && msg.role === 'model') return false;
        return true;
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...filteredHistory, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          temperature: 0.7,
        },
      });

      return response;
    } catch (error: any) {
      console.error("Gemini AI Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
