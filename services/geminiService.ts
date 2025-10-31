
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, ApiResponse } from '../types';

const buildPrompt = (data: FormData): string => {
  const slidesContent = data.slides.map(slide => 
    `{ "title": "${slide.title}", "text": "${slide.text.replace(/"/g, '\\"')}", "image_description": "${slide.image_description.replace(/"/g, '\\"')}" }`
  ).join(',\n');

  return `
    You are an expert corporate profile designer and copywriter. Your task is to generate a complete, multi-page company profile based on the following JSON data.
    Your output must be a single, valid JSON object that adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.

    **Input Data:**
    {
      "company_name": "${data.companyName}",
      "tagline": "${data.tagline}",
      "industry": "${data.industry}",
      "target_audience": "${data.targetAudience}",
      "tone": "${data.tone}",
      "brand_colors": { "primary": "${data.brandColors.primary}", "secondary": "${data.brandColors.secondary}" },
      "brand_fonts": { "heading": "${data.brandFonts.heading}", "body": "${data.brandFonts.body}" },
      "logo_image_base64": ${data.logoImage ? `"${data.logoImage}"` : "null"},
      "number_of_slides": ${data.slides.length},
      "slides": [
        ${slidesContent}
      ],
      "contact_info": "${data.contactInfo.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
      "locale": "${data.locale}"
    }

    **Content & Design Rules:**
    1.  **Rewrite/Expand Text:** Rewrite and expand the user-provided text for each slide to sound natural, professional, and persuasive. Tailor the language to the specified 'tone' and 'target_audience'. Keep English at a B1-B2 level unless the locale suggests otherwise.
    2.  **HTML Structure:** Generate a complete, self-contained HTML document for the 'html_fallback'. Inline all CSS using a <style> tag. Use the provided brand colors and fonts. If fonts are not standard, use web-safe fallbacks (e.g., 'Inter, sans-serif').
    3.  **Layout & Styling:** Create a visually appealing, professional design. Use clean spacing, strong headings, and readable body text. Ensure high color contrast for accessibility. Implement page breaks for printing using '@media print { .page { page-break-after: always; } }'. Each slide should be a page.
    4.  **Cover Page:** The first page must be a strong cover with the company name, tagline, and a large, abstract background visual created using SVG and brand colors.
    5.  **Images:** For each slide's 'image_description', create an illustrative and tasteful abstract SVG placeholder using the brand colors. Embed these SVGs directly into the HTML using data URLs. Do not use external images or <img> tags with src attributes pointing to external resources.
    6.  **Logo:** If 'logo_image_base64' is provided, embed it on the cover and in the footer. If null, render the company name as a stylized wordmark.
    7.  **Footer & Page Numbers:** Include a small footer on each page (except the cover) with the company website and a page number.
    8.  **RTL Support:** If 'locale' is 'ar', the entire HTML layout must be right-to-left (RTL). Use 'dir="rtl"' on the <html> tag and adjust CSS accordingly (e.g., text-align: right).
    9.  **PDF Output:** Set 'pdf_base64' to an empty string (""). Focus on creating a perfect, print-ready HTML fallback.
    10. **Meta Notes:** In 'meta.notes', briefly mention any key decisions, like font fallbacks or layout choices.

    Generate the JSON output now.
  `;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    pdf_base64: { type: Type.STRING },
    html_fallback: { type: Type.STRING },
    meta: {
      type: Type.OBJECT,
      properties: {
        pages: { type: Type.INTEGER },
        company_name: { type: Type.STRING },
        brand_colors: {
          type: Type.OBJECT,
          properties: {
            primary: { type: Type.STRING },
            secondary: { type: Type.STRING },
          },
        },
        locale: { type: Type.STRING },
        notes: { type: Type.STRING },
      },
    },
  },
};

export const generateProfile = async (data: FormData): Promise<ApiResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';
  
  const prompt = buildPrompt(data);
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as ApiResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate profile. The model may be unavailable or the request was invalid.");
  }
};
