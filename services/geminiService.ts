import { GoogleGenAI, Chat } from "@google/genai";
import { AppState } from "../types";

let chatSession: Chat | null = null;

const MOCK_RESPONSE = "I am currently in mock mode because the API key is missing. I would simulate an empathetic response based on your KB here.";

export const initializeChat = async (appState: AppState) => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing. Using Mock Mode.");
    return;
  }

  const kbText = appState.kb.map(k => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');
  const tone = appState.settings.tone;
  const clinic = appState.settings.clinicName;

  const systemInstruction = `
    You are an AI medical receptionist for ${clinic}.
    Your tone should be: ${tone}.
    
    GOALS:
    1. Answer patient questions based strictly on the Knowledge Base below.
    2. Help with scheduling and refills by collecting necessary info (Name, DOB).
    3. If you are unsure or the confidence is low, politely offer to have a human staff member call them back.
    4. Adhere to HIPAA standards (do not reveal private info of other patients).

    KNOWLEDGE BASE:
    ${kbText}

    If the user asks for a refill, ask for their Medication Name and Date of Birth.
    If the user asks for scheduling, offer the next available slot (mock: Tuesday at 2pm or Thursday at 10am).
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Failed to init Gemini:", error);
  }
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!process.env.API_KEY || !chatSession) {
    // Return a sophisticated mock response based on keywords for demo purposes
    await new Promise(r => setTimeout(r, 1000)); // Fake latency
    const lower = message.toLowerCase();
    if (lower.includes('refill')) return "I can certainly help with a refill. Could you please provide your full name and date of birth?";
    if (lower.includes('blue cross')) return "Yes, we accept Blue Cross Blue Shield PPO plans. Do you need to book an appointment?";
    if (lower.includes('schedule') || lower.includes('appointment')) return "I can help you book. We have openings this Tuesday at 2 PM and Thursday at 10 AM. Do either of those work?";
    return "I understand. Let me see if I can help. Could you provide a bit more detail, or would you prefer I have a staff member call you?";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I'm having trouble processing that right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, I'm experiencing a temporary connection issue. Please try again.";
  }
};
