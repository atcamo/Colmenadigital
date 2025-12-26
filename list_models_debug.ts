
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("No API KEY found.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.list();

    // Acceso seguro a la lista, dependiendo de la versión
    const models = Array.isArray(response) ? response : (response.models || []);

    console.log("\n--- START MODEL LIST ---");
    models.forEach((m: any) => {
      // Normalizamos el nombre (quitando 'models/' si viene incluido para comparar limpio)
      const name = m.name.replace('models/', '');
      const methods = m.supportedGenerationMethods || [];

      if (methods.includes("generateContent")) {
        console.log(`MODEL: ${name}`);
      }
    });
    console.log("--- END MODEL LIST ---\n");

  } catch (error: any) {
    console.error("Error listing:", error.message);
  }
}

listModels();
