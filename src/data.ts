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
    description: 'Convert PDF documents to editable Microsoft Word documents.',
    icon: 'FileText',
    category: 'convert',
    color: 'bg-blue-100 text-blue-600 border-blue-200/40 hover:bg-blue-200/20',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-500/10'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Make Word files easy to read and distribute with PDF format.',
    icon: 'FileDown',
    category: 'convert',
    color: 'bg-blue-50 text-blue-500 border-blue-100/40 hover:bg-blue-100/10',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract PDF data tables into structured Excel spreadsheets.',
    icon: 'Table',
    category: 'convert',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200/40 hover:bg-emerald-200/20',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-500/10'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert spreadsheets to highly portable PDF documents.',
    icon: 'FileSpreadsheet',
    category: 'convert',
    color: 'bg-emerald-50 text-emerald-500 border-emerald-100/40 hover:bg-emerald-100/10',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10'
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    description: 'Turn static PDFs into fully editable slide presentation files.',
    icon: 'Presentation',
    category: 'convert',
    color: 'bg-orange-100 text-orange-600 border-orange-200/40 hover:bg-orange-200/20',
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-500/10'
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Save PowerPoint presentations as clean, portable PDF files.',
    icon: 'Presentation',
    category: 'convert',
    color: 'bg-orange-50 text-orange-500 border-orange-100/40 hover:bg-orange-100/10',
    colorClass: 'text-orange-500',
    bgClass: 'bg-orange-500/10'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF document pages into high-quality JPEG images.',
    icon: 'ImageIcon',
    category: 'convert',
    color: 'bg-pink-100 text-pink-600 border-pink-200/40 hover:bg-pink-200/20',
    colorClass: 'text-pink-600',
    bgClass: 'bg-pink-500/10'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Merge and convert multiple JPG pictures into a structured PDF.',
    icon: 'ImageIcon',
    category: 'convert',
    color: 'bg-pink-50 text-pink-500 border-pink-100/40 hover:bg-pink-100/10',
    colorClass: 'text-pink-500',
    bgClass: 'bg-pink-500/10'
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    description: 'Convert PDF layers into transparent PNG raster files.',
    icon: 'ImageIcon',
    category: 'convert',
    color: 'bg-purple-100 text-purple-600 border-purple-200/40 hover:bg-purple-200/20',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-500/10'
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    description: 'Convert portable PNG graphics to PDF with crisp colors.',
    icon: 'ImageIcon',
    category: 'convert',
    color: 'bg-purple-50 text-purple-500 border-purple-100/40 hover:bg-purple-100/10',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10'
  },
  {
    id: 'pdf-to-html',
    name: 'PDF to HTML',
    description: 'Transform PDF layout segments into responsive HTML files.',
    icon: 'Code',
    category: 'convert',
    color: 'bg-cyan-100 text-cyan-600 border-cyan-200/40 hover:bg-cyan-200/20',
    colorClass: 'text-cyan-600',
    bgClass: 'bg-cyan-500/10'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert webpages or HTML source code directly to standard PDF.',
    icon: 'Globe',
    category: 'convert',
    color: 'bg-cyan-50 text-cyan-500 border-cyan-100/40 hover:bg-cyan-100/10',
    colorClass: 'text-cyan-500',
    bgClass: 'bg-cyan-500/10'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract raw text strings from PDF documents.',
    icon: 'FileText',
    category: 'convert',
    color: 'bg-gray-100 text-gray-600 border-gray-200/40 hover:bg-gray-200/20',
    colorClass: 'text-gray-600',
    bgClass: 'bg-gray-500/10'
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Format plain text documents into clean PDF layouts.',
    icon: 'FileText',
    category: 'convert',
    color: 'bg-gray-50 text-gray-500 border-gray-100/40 hover:bg-gray-100/10',
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-500/10'
  },
  {
    id: 'ocr-scanner',
    name: 'OCR Scanner',
    description: 'Transform images or scanned layouts into editable, searchable PDFs.',
    icon: 'ScanLine',
    category: 'ocr',
    badge: 'AI Powered',
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200/40 hover:bg-indigo-200/20',
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-500/10'
  },
  {
    id: 'extract-text',
    name: 'Extract Text',
    description: 'Use advanced recognition blocks to isolate and pull text strings.',
    icon: 'CheckSquare',
    category: 'ocr',
    color: 'bg-indigo-50 text-indigo-500 border-indigo-100/40 hover:bg-indigo-100/10',
    colorClass: 'text-indigo-500',
    bgClass: 'bg-indigo-500/10'
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Modify text, draw annotations, and add visual elements on PDFs.',
    icon: 'FileEdit',
    category: 'edit',
    color: 'bg-blue-100 text-blue-700 border-blue-200/40 hover:bg-blue-200/20',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-500/10'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Fix standard document orientations page by page.',
    icon: 'RotateCw',
    category: 'organize',
    color: 'bg-blue-50 text-blue-600 border-blue-100/40 hover:bg-blue-100/10',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-500/10'
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    description: 'Adjust crop parameters and trim margins off PDF pages.',
    icon: 'Scissors',
    category: 'edit',
    color: 'bg-amber-100 text-amber-600 border-amber-200/40 hover:bg-amber-200/20',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-500/10'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    description: 'Stamp customized text or company logos onto your PDF files.',
    icon: 'Stamp',
    category: 'security',
    color: 'bg-teal-100 text-teal-600 border-teal-200/40 hover:bg-teal-200/20',
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-500/10'
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    description: 'Add automated header/footer counters with custom numbering style.',
    icon: 'Layers',
    category: 'organize',
    color: 'bg-slate-100 text-slate-600 border-slate-200/40 hover:bg-slate-200/20',
    colorClass: 'text-slate-600',
    bgClass: 'bg-slate-500/10'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Embed secure drawn or typed cursive electronic signatures.',
    icon: 'Signature',
    category: 'security',
    badge: 'Legal Ready',
    color: 'bg-rose-100 text-rose-600 border-rose-200/40 hover:bg-rose-200/20',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-500/10'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple independent PDFs into a single file.',
    icon: 'Combine',
    category: 'organize',
    color: 'bg-sky-100 text-sky-600 border-sky-200/40 hover:bg-sky-200/20',
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-500/10'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Deconstruct document files into isolated custom pages.',
    icon: 'Scissors',
    category: 'organize',
    color: 'bg-sky-50 text-sky-500 border-sky-100/40 hover:bg-sky-100/10',
    colorClass: 'text-sky-500',
    bgClass: 'bg-sky-500/10'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Shrink file sizes while maintaining sharp resolution metrics.',
    icon: 'Minimize2',
    category: 'organize',
    badge: 'Optimized',
    color: 'bg-violet-100 text-violet-600 border-violet-200/40 hover:bg-violet-200/20',
    colorClass: 'text-violet-600',
    bgClass: 'bg-violet-500/10'
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    description: 'Recover streams and structure records of corrupted files.',
    icon: 'Wrench',
    category: 'edit',
    color: 'bg-red-100 text-red-600 border-red-200/40 hover:bg-red-200/20',
    colorClass: 'text-red-600',
    bgClass: 'bg-red-500/10'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Set custom security passwords and disable user copy/print flags.',
    icon: 'Lock',
    category: 'security',
    color: 'bg-stone-100 text-stone-600 border-stone-200/40 hover:bg-stone-200/20',
    colorClass: 'text-stone-600',
    bgClass: 'bg-stone-500/10'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Strip standard reading constraints and password protection blocks.',
    icon: 'Unlock',
    category: 'security',
    color: 'bg-stone-50 text-stone-500 border-stone-100/40 hover:bg-stone-100/10',
    colorClass: 'text-stone-500',
    bgClass: 'bg-stone-500/10'
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF',
    description: 'Isolate differences and visual layout changes between two documents.',
    icon: 'Copy',
    category: 'edit',
    color: 'bg-lime-100 text-lime-600 border-lime-200/40 hover:bg-lime-200/20',
    colorClass: 'text-lime-600',
    bgClass: 'bg-lime-500/10'
  },
  {
    id: 'scan-to-pdf',
    name: 'Scan to PDF',
    description: 'Transform physical documents into clear PDF formats.',
    icon: 'ScanLine',
    category: 'ocr',
    color: 'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200/40 hover:bg-fuchsia-200/20',
    colorClass: 'text-fuchsia-600',
    bgClass: 'bg-fuchsia-500/10'
  },
  {
    id: 'ai-pdf-assistant',
    name: 'AI PDF Assistant',
    description: 'Engage with Gemini intelligence models to query and summarize reports.',
    icon: 'Sparkles',
    category: 'ai',
    badge: 'Pro Model',
    color: 'bg-indigo-600 text-white border-indigo-700/40 hover:bg-indigo-700/90',
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-500/10'
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
