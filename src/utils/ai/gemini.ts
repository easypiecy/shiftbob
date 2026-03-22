import { GoogleGenAI } from "@google/genai";

/** Stabil model til tekst (oversættelser, forklaringer). `gemini-2.0-flash` er ikke længere tilgængelig for nye brugere. */
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";

let cached: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY mangler i miljøvariabler.");
  }
  if (!cached) {
    cached = new GoogleGenAI({ apiKey });
  }
  return cached;
}

/**
 * Oversætter rå vagtplan-data (fx OR-Tools JSON) til en kort, letlæselig leder-rapport på dansk.
 * Kør kun på serveren (Route Handler / Server Action).
 */
export async function generateScheduleExplanation(
  scheduleData: unknown
): Promise<string> {
  const ai = getGeminiClient();

  const systemInstruction =
    "Du er en assistent for vagtplanlægning. Du skriver kort, professionelt og på dansk til en leder. " +
    "Ingen markdown-overskrifter med # hvis ikke nødvendigt; brug korte afsnit og punktopstillinger hvor det hjælper.";

  const userPayload =
    "Her er resultatet af en matematisk vagtplan (JSON). Lav en kort rapport (max ca. 200 ord) der forklarer " +
    "hvem der har hvilke vagter, evt. belastning pr. medarbejder, og eventuelle bemærkninger. " +
    "Hvis data ser ufuldstændige ud, sig det kort.\n\n" +
    JSON.stringify(scheduleData, null, 2);

  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction,
    },
    contents: userPayload,
  });

  const text = response.text;
  if (!text?.trim()) {
    throw new Error("Tomt svar fra Gemini.");
  }
  return text.trim();
}
