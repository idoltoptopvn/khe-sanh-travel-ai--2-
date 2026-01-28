
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

export class GeminiService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey });
  }

  async chat(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
    try {
      const ai = this.getAI();
      
      // Gemini yêu cầu contents phải bắt đầu bằng lượt của 'user'.
      // Nếu history có tin nhắn chào mừng của AI ở đầu, ta phải loại bỏ nó khỏi lịch sử gửi đi.
      const validHistory = history.filter((item, index) => {
        if (index === 0 && item.role === 'model') return false;
        return true;
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...validHistory, { role: 'user', parts: [{ text: message }] }],
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

