
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API KEY found.");
    return;
  }
  console.log(`Using API Key: ${apiKey.substring(0, 8)}...`);

  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log("Fetching models...");
    const response = await ai.models.list();
    console.log("Raw response keys:", Object.keys(response));

    // In this specific SDK, response might be a direct array or have a different structure
    const models = response;
    console.log("Is array:", Array.isArray(models));

    if (Array.isArray(models)) {
      console.log(`Found ${models.length} models.`);
      models.forEach((m: any) => {
        console.log(`- ${m.name}`);
      });
    } else {
      console.log("Response is not an array. Value:", JSON.stringify(response, null, 2));
    }

  } catch (error: any) {
    console.error("Error listing:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

listModels();
