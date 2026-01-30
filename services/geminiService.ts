import { GoogleGenAI } from "@google/genai";
import { SourceData } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export interface HomeworkResponse {
  text: string;
  sources?: SourceData[];
}

export const solveHomework = async (
  question: string, 
  subjectContext: string,
  fileBase64?: string,
  mimeType: string = 'image/jpeg'
): Promise<HomeworkResponse> => {
  const ai = getAiClient();
  if (!ai) return { text: "Error: API Key missing." };

  try {
    const parts: any[] = [{ text: question }];
    
    // Check if the file is supported for analysis (Image or PDF)
    const isSupportedForAnalysis = mimeType.startsWith('image/') || mimeType === 'application/pdf';

    // If a supported file is provided, add it to the content parts
    if (fileBase64 && isSupportedForAnalysis) {
      // The API expects the base64 string without the "data:mime/type;base64," prefix
      const base64Data = fileBase64.split(',')[1];
      if (base64Data) {
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    } else if (fileBase64 && !isSupportedForAnalysis) {
       parts.push({ text: "\n[User attached a file that is not an image or PDF, so I cannot see it. I will answer based on the text provided.]" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }], // Enable online search
        systemInstruction: `You are an expert homework solver for ${subjectContext}.

        Your job:
        1. Directly solve and provide complete answers to any homework question.
        2. Show your work step-by-step when solving math, science, or logic problems.
        3. For essays or written assignments, provide a full, well-written response ready to submit.
        4. Use Google Search to find accurate, up-to-date information when needed.
        5. If an image or PDF is provided, analyze it and solve whatever is shown.
        6. Format responses with Markdown for clarity.
        7. Be thorough and provide the full answer - don't just hint or guide.`
      }
    });

    const text = response.text || "Sorry, I couldn't generate a response.";
    
    // Extract search sources from grounding metadata
    const sources: SourceData[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I encountered an error while trying to solve that. (Note: Large files or certain formats might not be supported)." };
  }
};