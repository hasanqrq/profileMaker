
export interface Slide {
  id: string;
  title: string;
  text: string;
  image_description: string;
}

export interface FormData {
  companyName: string;
  tagline: string;
  industry: string;
  targetAudience: string;
  tone: 'formal' | 'friendly' | 'bold' | 'luxury' | 'minimalist';
  brandColors: {
    primary: string;
    secondary: string;
  };
  brandFonts: {
    heading: string;
    body: string;
  };
  logoImage: string | null; // base64 encoded string
  slides: Slide[];
  contactInfo: string;
  locale: 'en' | 'ar' | 'tr' | 'es' | 'fr';
}

export interface ApiResponse {
  pdf_base64: string;
  html_fallback: string;
  meta: {
    pages: number;
    company_name: string;
    brand_colors: {
      primary: string;
      secondary: string;
    };
    locale: string;
    notes: string;
  };
}
