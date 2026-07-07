import { PDFTool, FAQItem, Testimonial, PricingPlan } from './types';

export const TRUSTED_COMPANIES = [
  { name: 'Stripe', logoType: 'stripe' },
  { name: 'Linear', logoType: 'linear' },
  { name: 'Vercel', logoType: 'vercel' },
  { name: 'Framer', logoType: 'framer' },
  { name: 'Dropbox', logoType: 'dropbox' },
  { name: 'Raycast', logoType: 'raycast' }
];

export const STATISTICS_CARDS = [
  {
    value: '45M+',
    label: 'Files Processed',
    description: 'Secured conversions around the globe.',
    icon: 'FileCheck2',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    value: '99.99%',
    label: 'OCR Accuracy',
    description: 'Advanced machine learning layout recognition.',
    icon: 'Cpu',
    gradient: 'from-blue-600 to-cyan-500'
  },
  {
    value: '< 1.8s',
    label: 'Avg. Convert Time',
    description: 'Powered by native multi-threaded clusters.',
    icon: 'Zap',
    gradient: 'from-cyan-500 to-emerald-500'
  },
  {
    value: 'Zero',
    label: 'Data Retention',
    description: 'Automatic server purge within 60 minutes.',
    icon: 'ShieldAlert',
    gradient: 'from-purple-500 to-indigo-600'
  }
];

export const PDF_TOOLS: PDFTool[] = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Microsoft Word DOCX documents with perfect layout preservation.',
    icon: 'FileText',
    category: 'convert-from',
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-500/10'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Transform Microsoft Word documents into standard high-fidelity PDF format in one click.',
    icon: 'FileDown',
    category: 'convert-to',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-500/10'
  },
  {
    id: 'ocr-scanner',
    name: 'OCR Scanner',
    description: 'Extract editable text from scanned PDF documents and image files in over 180 languages.',
    icon: 'ScanLine',
    category: 'edit',
    badge: 'AI Powered',
    colorClass: 'text-cyan-600',
    bgClass: 'bg-cyan-500/10'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF documents into a single, cohesive file in any order you choose.',
    icon: 'Combine',
    category: 'organize',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-500/10'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract specific pages or ranges from a PDF, or split each page into a separate document.',
    icon: 'Scissors',
    category: 'organize',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-500/10'
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Add text, shapes, annotations, or whiteouts to existing PDF files directly in your browser.',
    icon: 'FileEdit',
    category: 'edit',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-500/10'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Render every page of your PDF into high-quality JPEG images for presentations and sharing.',
    icon: 'Image',
    category: 'convert-from',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-500/10'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Shrink your PDF file size by up to 90% while maintaining crisp typography and high resolution.',
    icon: 'Minimize2',
    category: 'organize',
    badge: 'Optimized',
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-500/10'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Secure your confidential files with 256-bit AES passwords and restrict printing/copying.',
    icon: 'Lock',
    category: 'security',
    colorClass: 'text-slate-800',
    bgClass: 'bg-slate-500/10'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection, restrictive copying, and printing permissions from authorized PDFs.',
    icon: 'Unlock',
    category: 'security',
    colorClass: 'text-fuchsia-600',
    bgClass: 'bg-fuchsia-500/10'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Spin individual pages or the entire document to fix portrait or landscape orientations.',
    icon: 'RotateCw',
    category: 'organize',
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-500/10'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    description: 'Stamp professional custom text, company logo images, or page numbers onto your documents.',
    icon: 'Stamp',
    category: 'edit',
    colorClass: 'text-pink-600',
    bgClass: 'bg-pink-500/10'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Draw, type, or upload your secure electronic signature to sign documents on the go.',
    icon: 'Signature',
    category: 'edit',
    badge: 'Legal Ready',
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-500/10'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Microsoft Excel spreadsheets into print-ready PDF reports with neat page margins.',
    icon: 'Table',
    category: 'convert-to',
    colorClass: 'text-green-600',
    bgClass: 'bg-green-500/10'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert PowerPoint slides into sleek portable documents perfect for viewing on any device.',
    icon: 'Presentation',
    category: 'convert-to',
    colorClass: 'text-violet-600',
    bgClass: 'bg-violet-500/10'
  },
  {
    id: 'extract-text',
    name: 'Extract Text',
    description: 'Instantly pull all plain text characters out of complex multi-column PDFs without formatting noise.',
    icon: 'FileUp',
    category: 'convert-from',
    colorClass: 'text-neutral-700',
    bgClass: 'bg-neutral-500/10'
  }
];

export const PREMIUM_FEATURES = [
  {
    id: 'feat-1',
    title: 'Lightning Speed Processing',
    description: 'Powered by highly optimized C++ conversion binaries running on specialized cloud instances for sub-second responses.',
    icon: 'Zap'
  },
  {
    id: 'feat-2',
    title: 'Military-Grade Encryption',
    description: 'All files are secured with AES-256 end-to-end encryption. No third-party audits, fully GDPR and HIPAA compliant.',
    icon: 'ShieldCheck'
  },
  {
    id: 'feat-3',
    title: 'Advanced AI OCR Engine',
    description: 'Scan multi-language documents and hand-written files with high accuracy, transforming them into rich, searchable text.',
    icon: 'Sparkles'
  },
  {
    id: 'feat-4',
    title: 'Seamless Cloud Integrations',
    description: 'Synchronize files directly from Google Drive, Dropbox, and Microsoft OneDrive without waiting for standard local downloads.',
    icon: 'Cloud'
  },
  {
    id: 'feat-5',
    title: 'Complete Zero-Data Retention',
    description: 'We prioritize your privacy. All uploaded, processed, and cached documents are fully deleted automatically within 60 minutes.',
    icon: 'Trash2'
  },
  {
    id: 'feat-6',
    title: 'Interactive Desktop Experience',
    description: 'A powerful modern layout engineered in React with keyboard shortcuts, multi-file reordering, and direct page-level control.',
    icon: 'Monitor'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload Your Document',
    description: 'Drag & drop your files into our secure portal or import directly from Google Drive and Dropbox.'
  },
  {
    step: '02',
    title: 'Configure Output Settings',
    description: 'Tailor output formats, select target OCR languages, adjust split pages, or set custom compression ratio.'
  },
  {
    step: '03',
    title: 'AI Processing Engine Runs',
    description: 'Our cloud platform parses, converts, and polishes the files within 1-2 seconds with absolute fidelity.'
  },
  {
    step: '04',
    title: 'Secure Instant Download',
    description: 'Instantly fetch your completed file or let our auto-purge system clear it permanently from our stack.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'InnovateX Solutions',
    text: "DocuFlow has completely replaced our legacy corporate PDF software. The OCR accuracy is leagues ahead of anything we have tried before, and our team processes thousands of documents monthly with zero hiccups.",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    name: 'Marcus Thorne',
    role: 'Creative Director',
    company: 'Studio Thorne',
    text: "The speed of the compression and merge tools is absolutely mind-blowing. Our graphic-heavy design portfolios maintain perfect high-res imagery while reducing in file size by almost 85% with a simple slider.",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Managing Partner',
    company: 'L&R Legal Partners',
    text: "As a legal firm, data security is non-negotiable. DocuFlow's direct commitment to HIPAA-grade compliance and automatic deletion within 60 minutes makes it the only PDF platform we fully trust with client documents.",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How secure is DocuFlow with my sensitive files?',
    answer: 'Extremely secure. All uploads and transfers use premium TLS 1.3 encryption. Files stored in memory are encrypted with AES-256 and are automatically destroyed after 60 minutes. We do not inspect, retain, or train AI models with your content, and our architecture is GDPR, CCPA, and HIPAA compliant.'
  },
  {
    question: 'Are there any hidden costs or page limits on the Free plan?',
    answer: 'No! The Free plan allows you to convert, split, merge, and edit files without registering. You can process up to 10 files per day with a 50MB file size limit. Pro plans unlock unlimited parallel batch file processing, OCR indexing, larger file limits, and premium cloud integrations.'
  },
  {
    question: 'How does the advanced AI-powered OCR work?',
    answer: 'Our OCR scanner utilizes high-performance deep learning layout analysis models to identify paragraphs, structured data tables, signatures, and images. It automatically corrects document tilt and extracts text in over 180 languages, letting you export searchable PDFs or structured documents.'
  },
  {
    question: 'Can I integrate DocuFlow directly into my team\'s existing workflows?',
    answer: 'Absolutely. We offer direct, secure synchronization integrations with Google Drive, OneDrive, and Dropbox. Pro and Enterprise teams can easily import directly from their workspaces, batch-convert documents, and save output back to their cloud drives seamlessly.'
  },
  {
    question: 'Will the original layout of my Word or PPT documents be altered?',
    answer: 'Our layout engine matches font metrics, tables, margin boundaries, and image alignments to guarantee 99% formatting accuracy. Whether you convert standard Word files or custom presentation slides, they will look exactly as you designed them.'
  },
  {
    question: 'Does DocuFlow support offline conversions?',
    answer: 'DocuFlow is a browser-native web platform that processes complex conversions in high-performance cloud servers to maintain maximum speed. However, editing, signing, and lightweight PDF splitting/reordering are executed client-side, minimizing latency and bandwidth usage.'
  },
  {
    question: 'Can I split PDFs into custom page ranges?',
    answer: 'Yes! Our visual Split PDF tool provides an interactive grid layout of every page in your document. You can easily enter custom comma-separated page ranges (e.g., "1-3, 5, 8-12") or click individual page previews to select precisely what you want to extract.'
  },
  {
    question: 'Is registration required to use the platform?',
    answer: 'No registration or credit card is required to use our core conversion and editing tools. Simply drag and drop your file to complete your task instantly. We value speed and user friction reduction above all else.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter Space',
    priceMonthly: 0,
    description: 'No registration, no credit card. Perfect for individuals needing quick document conversions.',
    features: [
      'Up to 10 file conversions per day',
      'Max file size of 50 MB per file',
      'Standard conversion speed',
      'High-fidelity PDF Merge & Split',
      'Light PDF Compression (up to 40%)',
      'Automatic purge within 60 minutes'
    ]
  },
  {
    name: 'Pro Workspace',
    priceMonthly: 12,
    description: 'Designed for professionals who handle client documents and complex batch operations daily.',
    features: [
      'Unlimited conversions & page counts',
      'Up to 2 GB file upload size limit',
      'Ultra-fast cloud processing cluster',
      'Parallel batch-file conversions',
      'Unlimited AI-powered OCR (180+ languages)',
      'Extreme compression ratio (up to 90%)',
      'Direct Google Drive & Dropbox sync',
      'Priority live chat support'
    ],
    isPopular: true
  },
  {
    name: 'Enterprise Cluster',
    priceMonthly: 39,
    description: 'Built for compliance-first legal, finance, and enterprise teams requiring custom parameters.',
    features: [
      'Everything in Pro plan included',
      'Custom security permission presets',
      'Dedicated private cloud infrastructure',
      'HIPAA & SOC2 custom compliance reports',
      'Developer API access & webhook events',
      'SSO/SAML secure login system',
      '99.9% guaranteed service SLA',
      'Dedicated account success manager'
    ]
  }
];
