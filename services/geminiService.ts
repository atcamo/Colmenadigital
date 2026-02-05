
import { GoogleGenAI, Type } from "@google/genai";
import { BeekeeperInput, GeneratedWebProfile } from "../types";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateWebProfile = async (input: BeekeeperInput): Promise<GeneratedWebProfile> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') ||
    (typeof process !== 'undefined' ? process.env.API_KEY : '');

  if (!apiKey) {
    throw new Error("Falta la API Key. Configura VITE_GEMINI_API_KEY o GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.0-flash";

  const systemInstruction = `
    Eres un experto estratega de marca y diseñador UI/UX premium.
    Tu objetivo es crear una identidad visual y de contenido para un apicultor artesanal.
    
    TAREAS VISUALES:
    1. Si se proporciona un LOGO o imagen de marca, analízalo detalladamente:
       - Extrae el color dominante (Primary Color) en formato HEX. Busca tonos elegantes (miel profundo, oro viejo, carbón, crema).
       - Extrae un color secundario de contraste (Secondary Color) en formato HEX.
       - Determina el "Style Vibe" (rustic, minimalist, luxury, modern) basándote en el diseño.
    2. Si NO hay logo, propón una paleta basada en el nombre del apiario.
    3. Para la galería de imágenes, propón 3 descripciones de fotos que encajen con la marca.

    TAREAS DE CONTENIDO:
    - Contenido en ESPAÑOL. 
    - Farcaster handle sugerido sin @.
    - Tono PREMIUM y evocador. No menciones tecnología en los textos públicos.
  `;

  const userPrompt = `
    Datos del apicultor:
    - Nombre: ${input.name}
    - Marca/Apiario: ${input.farmName}
    - Ubicación: ${input.location}
    - Desafíos: ${input.painPointMarket}, ${input.painPointMoney}
    - Venta Online: ${input.wantsToSellOnline ? 'Sí' : 'No'}
    - Referencia Social: ${input.socialUrl}

    Instrucciones de Respuesta:
    - Genera Hero Title, Tagline, Sobre Nosotros, 3 Propuestas de Valor y Análisis Estratégico.
    - Define primaryColor, secondaryColor y styleVibe.
  `;

  const messageParts: any[] = [{ text: userPrompt }];

  if (input.logo && input.logo.startsWith('data:image')) {
    try {
      const base64Parts = input.logo.split(',');
      if (base64Parts.length > 1) {
        const base64Data = base64Parts[1];
        const mimeType = input.logo.split(';')[0].split(':')[1];
        messageParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
    } catch (e) {
      console.warn("Error procesando logo para Vision:", e);
    }
  }

  const RETRIES = 2;
  let lastError: any;

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: messageParts }],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              heroTitle: { type: Type.STRING },
              tagline: { type: Type.STRING },
              aboutUsText: { type: Type.STRING },
              valueProposition: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              strategicAnalysis: { type: Type.STRING },
              farcasterHandle: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              styleVibe: {
                type: Type.STRING,
                enum: ['rustic', 'minimalist', 'luxury', 'modern']
              }
            },
            required: ["heroTitle", "tagline", "primaryColor", "secondaryColor", "styleVibe"]
          },
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error("Respuesta vacía de la IA.");

      return JSON.parse(text.trim()) as GeneratedWebProfile;

    } catch (error: any) {
      console.error(`Intento ${attempt + 1} fallido:`, error);
      lastError = error;

      if (error.message?.includes("404") || error.toString().includes("NOT_FOUND")) {
        throw new Error(`Error de API: El modelo '${model}' no fue encontrado.`);
      }

      if (attempt < RETRIES) {
        await wait(2000);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Error final en la colmena.");
};
