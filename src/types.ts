export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: 'convert' | 'edit' | 'organize' | 'security' | 'ocr' | 'ai' | string;
  badge?: string;
  colorClass?: string;
  bgClass?: string;
  color?: string; // Dashboard style color string
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'idle' | 'uploading' | 'ready' | 'processing' | 'completed' | 'failed';
  error?: string;
  previewUrl?: string;
  pagesCount?: number;
  resultUrl?: string;
  resultName?: string;
  rawFile?: File;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarUrl: string;
}

export interface PricingPlan {
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}
