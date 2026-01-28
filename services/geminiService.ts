
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  // Tạo instance mới mỗi lần gọi để đảm bảo sử dụng API Key mới nhất từ môi trường
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async chat(message: string, history: { role: string; parts: { text: string }[] }[]) {
    try {
      const ai = this.getAI();
      // Sử dụng gemini-3-flash-preview cho tốc độ và khả năng search tốt
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          temperature: 0.8, // Tăng nhẹ độ sáng tạo cho tư vấn du lịch
        },
      });

      // Truy cập trực tiếp thuộc tính .text theo hướng dẫn SDK mới
      return response;
    } catch (error: any) {
      console.error("Gemini AI Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
