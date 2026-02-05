import { GoogleGenAI, Type } from "@google/genai";
import { BeekeeperInput, GeneratedWebProfile } from "../types";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateWebProfile = async (input: BeekeeperInput): Promise<GeneratedWebProfile> => {
  // Intentamos obtener la API Key de varias fuentes para mayor robustez
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') ||
    (typeof process !== 'undefined' ? process.env.API_KEY : '');

  if (!apiKey) {
    throw new Error("Falta la API Key. Configura VITE_GEMINI_API_KEY o GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.0-flash"; // Cambiado a 1.5-flash por ser más estable y evitar 404s comunes en 2.0-exp

  const systemInstruction = `
    Eres un experto estratega de marca para productos alimenticios artesanales premium y un conocedor del ecosistema Web3 (Farcaster, Nouns, Blockchain).
    Tu objetivo es completar el contenido para una PLANTILLA DE SITIO WEB LIMPIA Y MODERNA y proponer una IDENTIDAD DIGITAL DESCENTRALIZADA.
    
    IMPORTANTE: 
    - Genera el contenido principal en ESPAÑOL. 
    - El farcasterHandle debe ser corto y directo (ej: mieldelnorte, beearturo). EVITA sufijos como _cl, _oficial o similares. NO incluyas el símbolo "@" al inicio.
    - El estilo de los textos debe ser PREMIUM, profesional y evocador, resaltando la calidad artesanal de la miel.
    - NO menciones "Blockchain", "Cripto" ni "Trazabilidad Tecnológica" en los textos. Enfócate en el valor del producto y el trabajo del apicultor.
    - Si los desafíos del usuario son muy cortos, ignóralos y crea una estrategia basada en los desafíos comunes de la apicultura artesanal.
  `;

  const userPrompt = `
    Datos del apicultor:
    - Nombre: ${input.name}
    - Nombre del Apiario: ${input.farmName}
    - Ubicación: ${input.location}
    - Problema de Mercado: ${input.painPointMarket}
    - Problema Financiero: ${input.painPointMoney}
    - Interés en Venta Directa Online: ${input.wantsToSellOnline ? 'SÍ' : 'NO AÚN'}

    Instrucciones:
    1. Genera un Hero Title elegante.
    2. Un Tagline que inspire confianza.
    3. Un texto de "Sobre Nosotros" de 2 frases.
    4. 3 propuestas de valor cortas.
    5. Un análisis estratégico de cómo mejorar su rentabilidad vendiendo directo al consumidor y posicionando su marca como producto premium.
    6. Propón un nombre de usuario (handle) para Farcaster que sea corto y directo. SIN EL @.
  `;

  const RETRIES = 2;
  let lastError: any;

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
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
              farcasterHandle: { type: Type.STRING }
            },
            propertyOrdering: ["heroTitle", "tagline", "aboutUsText", "valueProposition", "strategicAnalysis", "farcasterHandle"]
          },
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error("Recibimos una respuesta vacía de la IA.");

      return JSON.parse(text.trim()) as GeneratedWebProfile;

    } catch (error: any) {
      console.error(`Intento ${attempt + 1} fallido:`, error);
      lastError = error;

      // Error 404: A menudo es por el nombre del modelo
      if (error.message?.includes("404") || error.toString().includes("NOT_FOUND")) {
        throw new Error(`Error de API: El modelo '${model}' no fue encontrado. Verifica el acceso en tu consola de Google AI.`);
      }

      // Si es error de autenticación (400/401 chistoso de Google) no reintentamos
      if (error.message?.includes("API key") || error.message?.includes("403") || error.toString().includes("API_KEY")) {
        throw new Error("Error de Configuración: Tu API Key no es válida o no tiene permisos.");
      }

      // Si no es el último intento, esperamos
      if (attempt < RETRIES) {
        await wait(2000); // 2 segundos entre intentos
      }
    }
  }

  // Si llegamos aquí, fallaron todos los intentos
  if (lastError?.message?.includes("429")) {
    throw new Error("La colmena está saturada (Límite de cuota excedido). Intenta en un rato.");
  }

  throw lastError instanceof Error ? lastError : new Error("Error desconocido conectando con la Colmena.");

};
