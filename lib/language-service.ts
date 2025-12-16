import { franc } from 'franc';

// Free language detection and AI translation service
export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'pl': 'Polish',
  'tr': 'Turkish',
  'th': 'Thai',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Free language detection using franc library
export async function detectLanguage(text: string): Promise<LanguageCode> {
  try {
    // Use franc for free language detection
    const detected = franc(text);
    
    // Map franc codes to our language codes
    const langMap: Record<string, LanguageCode> = {
      'eng': 'en', 'spa': 'es', 'fra': 'fr', 'deu': 'de', 'ita': 'it',
      'por': 'pt', 'rus': 'ru', 'jpn': 'ja', 'kor': 'ko', 'cmn': 'zh',
      'ara': 'ar', 'hin': 'hi', 'nld': 'nl', 'swe': 'sv', 'nor': 'no',
      'dan': 'da', 'fin': 'fi', 'pol': 'pl', 'tur': 'tr', 'tha': 'th'
    };
    
    return langMap[detected] || 'en';
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'en';
  }
}

// Free translation using MyMemory API (no key required)
export async function translateText(
  text: string, 
  targetLang: LanguageCode,
  sourceLang?: LanguageCode
): Promise<string> {
  try {
    const langPair = `${sourceLang || 'auto'}|${targetLang}`;
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
    );
    
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
}

// AI translation fallback using Groq (free tier)
export async function translateWithAI(
  text: string,
  targetLang: LanguageCode
): Promise<string> {
  try {
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    
    const completion = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: `Translate the following text to ${SUPPORTED_LANGUAGES[targetLang]}. Maintain the original formatting and structure:\n\n${text}`
      }],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 2000,
    });
    
    return completion.choices[0].message.content || text;
  } catch (error) {
    console.error('AI translation failed:', error);
    return text;
  }
}

// Multi-provider translation with fallbacks
export async function translateWithFallback(
  text: string,
  targetLang: LanguageCode,
  sourceLang?: LanguageCode
): Promise<string> {
  // Try free MyMemory API first
  try {
    const result = await translateText(text, targetLang, sourceLang);
    if (result !== text) return result;
  } catch (error) {
    console.log('MyMemory translation failed, trying AI...');
  }
  
  // Fallback to AI translation
  return await translateWithAI(text, targetLang);
}