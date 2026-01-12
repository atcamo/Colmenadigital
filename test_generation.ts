
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MODELS_TO_TEST = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-2.0-flash-exp"
];

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("FATAL: No API KEY found.");
    return;
  }
  console.log(`API Key found (starts with ${apiKey.substring(0, 4)}...)`);

  const ai = new GoogleGenAI({ apiKey });

  for (const modelName of MODELS_TO_TEST) {
    console.log(`\n--- Testing ${modelName} ---`);
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: "Say 'OK'",
      });

      const text = response.text;
      console.log(`✅ SUCCESS! Response: ${text}`);
    } catch (error: any) {
      console.log(`❌ FAILED`);
      // Safer error logging
      if (error && typeof error === 'object') {
        console.log(`   Message: ${error.message}`);
        if (error.status) console.log(`   Status: ${error.status}`);
      } else {
        console.log(`   Error: ${String(error)}`);
      }
    }
  }
}

testModels();
