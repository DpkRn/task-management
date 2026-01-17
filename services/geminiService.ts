
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we assume the API key is set.
  console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateSubtasks(taskTitle: string, taskDescription: string): Promise<string[]> {
  try {
    const prompt = `
      Based on the following task, break it down into a list of smaller, actionable subtasks.
      
      Task Title: "${taskTitle}"
      Task Description: "${taskDescription || 'No description provided.'}"
      
      Provide the subtasks as a simple list of strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A single, actionable subtask."
              }
            }
          }
        },
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      throw new Error("Received an empty response from the API.");
    }
    
    // Sometimes the API might wrap the JSON in markdown backticks
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    const result = JSON.parse(cleanedJsonString);
    
    if (result && Array.isArray(result.subtasks)) {
      return result.subtasks;
    }

    return ["Could not parse the suggestions. Please try again."];
  } catch (error) {
    console.error("Error generating subtasks with Gemini:", error);
    throw new Error("Failed to generate subtasks. Please check your API key and network connection.");
  }
}
