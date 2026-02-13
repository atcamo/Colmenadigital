
import { GoogleGenAI, Type } from "@google/genai";
import { BeekeeperInput, GeneratedWebProfile } from "../types";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateWebProfile = async (input: BeekeeperInput, logoBase64?: string, lang: string = 'es'): Promise<GeneratedWebProfile> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Falta la API Key. Configura VITE_GEMINI_API_KEY en tu archivo .env.");
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
    3. GESTIÓN DE IMÁGENES (ESTRICTO): 
       - Siempre debes devolver URLs válidas en 'heroImage' y 'galleryImages'.
       - Si el usuario NO proporciona fotos, selecciona de este catálogo de Unsplash:
         * Abejas/Flores: https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=1000
         * Frascos de Miel: https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1000
         * Apicultor trabajando: https://images.unsplash.com/photo-1459156212016-c81b2da9bf7?q=80&w=1000
         * Panal/Cera: https://images.unsplash.com/photo-1596720426673-e483d74ed701?q=80&w=1000
         * Paisaje Rural: https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000
       - NUNCA devuelvas texto descriptivo en campos de imagen.

    TAREAS DE CONTENIDO:
    - Contenido en el idioma: ${lang.toUpperCase()}. 
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
    - Fotos (Instagram URLs): ${input.instagramPhotos?.length ? input.instagramPhotos.join(', ') : 'No proporcionadas'}

    Instrucciones de Respuesta:
    - Genera Hero Title, Tagline, Sobre Nosotros, 3 Propuestas de Valor y Análisis Estratégico.
    - Define primaryColor, secondaryColor y styleVibe.
    - Selecciona: 1 URL para 'heroImage' y un array de exactamente 3 URLs para 'galleryImages'. 
    - IMPORTANTE: Si no hay fotos del usuario, usa OBLIGATORIAMENTE las URLs de Unsplash proporcionadas arriba. No inventes URLs.
  `;

  const messageParts: any[] = [{ text: userPrompt }];

  if (logoBase64 || input.logo) {
    try {
      let base64Data = '';
      let mimeType = '';
      const source = logoBase64 || input.logo || '';

      if (source.startsWith('data:image')) {
        const parts = source.split(',');
        base64Data = parts[1];
        mimeType = parts[0].split(';')[0].split(':')[1];
      } else if (source.startsWith('http')) {
        // Intentar descargar la imagen y convertirla a base64
        try {
          const response = await fetch(source);
          if (response.ok) {
            const blob = await response.blob();
            mimeType = blob.type;
            const buffer = await blob.arrayBuffer();
            base64Data = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          } else {
            console.warn("No se pudo descargar la imagen del logo:", response.statusText);
            messageParts.push({ text: `Logo de la marca (URL): ${source}` });
          }
        } catch (fetchError) {
          console.warn("Fallo fetch de imagen por CORS o red:", fetchError);
          messageParts.push({ text: `Logo de la marca (URL): ${source}` });
        }
      }

      if (base64Data && mimeType && (mimeType.includes('png') || mimeType.includes('jpeg') || mimeType.includes('webp'))) {
        messageParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
        messageParts.push({ text: "Analiza el logo adjunto para extraer la paleta de colores y el estilo visual." });
      }
    } catch (e) {
      console.warn("Error general procesando imagen para IA:", e);
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
              },
              heroImage: { type: Type.STRING },
              galleryImages: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
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
