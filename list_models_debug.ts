
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

    const fs = require('fs');
    fs.writeFileSync('models_output.json', JSON.stringify(response, null, 2));
    console.log("Full response written to models_output.json");

    if (Array.isArray(response)) {
      console.log(`Found ${response.length} models.`);
      response.forEach((m: any) => {
        console.log(`- ${m.name}`);
      });
    }

  } catch (error: any) {
    console.error("Error listing:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

listModels();
