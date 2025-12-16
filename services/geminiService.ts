import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Rule, ClassificationResult, Email } from "../types";

// Initialize the API client
const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, we might handle missing keys gracefully in the UI.
// Here we assume it's available or the call will fail/mock.

const ai = new GoogleGenAI({ apiKey });

export const analyzeEmail = async (
  email: Pick<Email, 'subject' | 'body' | 'sender' | 'isReply'>,
  rules: Rule[]
): Promise<ClassificationResult> => {
  
  // Prepare rule descriptions for the prompt
  const kevinRules = rules
    .filter(r => r.owner === 'Kevin')
    .map(r => `- ${r.keyword} (${r.type})`)
    .join('\n');

  const vyRules = rules
    .filter(r => r.owner === 'Vy')
    .map(r => `- ${r.keyword} (${r.type})`)
    .join('\n');

  const prompt = `
    You are an intelligent email assistant for "Stonehaven Nexus".
    Your job is to classify an email into one of three buckets: 'Kevin', 'Vy', or 'Both'.
    
    Here are the sorting rules:
    
    FOR KEVIN:
    ${kevinRules}
    
    FOR VY:
    ${vyRules}
    
    SPECIAL LOGIC:
    - If the email content matches criteria for both Kevin and Vy, classify as 'Both'.
    - If the email implies a task is finished (e.g., sender says "Done", "Completed", "Handled"), mark isCompleted as true.
    - If the email doesn't match either specifically, default to 'Unassigned'.
    
    EMAIL TO ANALYZE:
    Sender: ${email.sender}
    Subject: ${email.subject}
    Body: ${email.body}
    Is Reply: ${email.isReply}
    
    Return the result in JSON format.
  `;

  try {
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        assignedTo: {
          type: Type.STRING,
          enum: ['Kevin', 'Vy', 'Both', 'Unassigned'],
          description: "Who the email should be assigned to based on the rules."
        },
        isCompleted: {
          type: Type.BOOLEAN,
          description: "Whether the email indicates the task/thread is completed/done."
        },
        reason: {
          type: Type.STRING,
          description: "A short explanation of why it was sorted this way."
        }
      },
      required: ['assignedTo', 'isCompleted', 'reason']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for deterministic classification
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as ClassificationResult;
    }
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini analysis failed", error);
    // Fallback logic if API fails or key is missing
    const bodyLower = email.body.toLowerCase();
    const subjectLower = email.subject.toLowerCase();
    const content = bodyLower + " " + subjectLower;

    const isKevin = rules.some(r => r.owner === 'Kevin' && content.includes(r.keyword.toLowerCase()));
    const isVy = rules.some(r => r.owner === 'Vy' && content.includes(r.keyword.toLowerCase()));
    const isDone = content.includes("done") && content.length < 50; // Naive check

    let assignedTo: any = 'Unassigned';
    if (isKevin && isVy) assignedTo = 'Both';
    else if (isKevin) assignedTo = 'Kevin';
    else if (isVy) assignedTo = 'Vy';

    return {
      assignedTo,
      isCompleted: isDone,
      reason: "Fallback: Keyword matching (Gemini unavailable)"
    };
  }
};
