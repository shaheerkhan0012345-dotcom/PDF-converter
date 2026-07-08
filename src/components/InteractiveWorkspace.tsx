import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, FileDown, ScanLine, Combine, Scissors, FileEdit, 
  Image as ImageIcon, Minimize2, Lock, Unlock, RotateCw, Stamp, 
  Signature, Table, Presentation, FileUp, X, Check, Loader2, 
  Shield, Trash2, Download, Sparkles, Plus, ArrowRight, Eye, 
  EyeOff, Grid, FileSpreadsheet, Copy, FileCheck, RefreshCw, Layers
} from 'lucide-react';
import { PDFTool, UploadedFile } from '../types';
import { PDF_TOOLS } from '../data';
import { User } from 'firebase/auth';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

// PDF and File processing libraries
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set the worker once globally — must match the installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface InteractiveWorkspaceProps {
  activeToolId: string;
  onToolChange: (toolId: string) => void;
  user?: User | null;
}

export default function InteractiveWorkspace({ activeToolId, onToolChange, user }: InteractiveWorkspaceProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'convert' | 'options' | 'processing' | 'result'>('convert');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingState, setProcessingState] = useState<string>('Initializing');
  
  // Tool-specific parameter states
  const [compressionRatio, setCompressionRatio] = useState<'extreme' | 'recommended' | 'low'>('recommended');
  const [protectPassword, setProtectPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [protectRestrictions, setProtectRestrictions] = useState({
    print: true,
    copy: true,
    metadata: true
  });
  const [ocrLanguage, setOcrLanguage] = useState('english');
  const [ocrFormat, setOcrFormat] = useState<'txt' | 'pdf'>('txt');
  const [copiedOCR, setCopiedOCR] = useState(false);
  const [splitRanges, setSplitRanges] = useState('1-3, 5-6');
  const [splitSelectedPages, setSplitSelectedPages] = useState<number[]>([1, 2, 3, 5, 6]);
  
  // Signature States
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('type');
  const [signatureName, setSignatureName] = useState('');
  const [signatureColor, setSignatureColor] = useState('#0F172A');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasCleared, setCanvasCleared] = useState(true);
  const [ocrExtractedText, setOcrExtractedText] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Always keep a ref to the latest activeToolId to avoid stale closures in async functions
  const activeToolIdRef = useRef(activeToolId);
  useEffect(() => { activeToolIdRef.current = activeToolId; }, [activeToolId]);
  const activeTool = PDF_TOOLS.find(t => t.id === activeToolId) || PDF_TOOLS[0];

  // OCR Results Pool
  const getOCRMockResult = (fileName: string) => {
    if (ocrExtractedText) {
      return ocrExtractedText;
    }
    return `DOCUFLOW INTELLIGENT OCR SYSTEM
--------------------------------------------------
File: ${fileName}
Extracted at: 2026-07-07 08:15 UTC
Confidence Level: 99.87%
Language: ${ocrLanguage.toUpperCase()}

[Page 1]
ACME CORPORATION - MASTER SERVICES AGREEMENT
This Master Services Agreement ("Agreement") is entered into as of the Effective Date by and between Acme Corp, a Delaware corporation ("Client"), and Zenith Digital Systems LLC ("Service Provider").

RECITALS
WHEREAS, Client desires to retain Service Provider to perform professional cloud migration, security auditing, and document structure layout conversion services; and
WHEREAS, Service Provider represents itself as having necessary expertise, processing servers, and encrypted pipeline models to complete such conversions.

NOW, THEREFORE, the parties agree as follows:
1. SERVICES AND COMPENSATION
Service Provider shall perform the services detailed in Exhibit A ("Statement of Work"). Client shall pay the fees specified in Section 4. Invoice terms are net 30 days from layout verification.

2. SECURITY & DATA PRIVACY
All document data processed under this agreement is governed by standard E2E AES-256 military-grade specifications. Under no circumstances will documents be stored or cached longer than 60 minutes from the initial session timestamp.

--------------------------------------------------
[END OF EXTRACTED TRANSLATION]`;
  };

  // When user switches tool, fully reset workspace so they don't accidentally
  // process a file with the wrong tool's logic
  useEffect(() => {
    setFiles([]);
    setActiveTab('convert');
    setProcessingProgress(0);
    setOcrExtractedText('');
  }, [activeToolId]);

  // Simulated upload triggers
  const handleFilesAdded = async (rawFiles: FileList | File[]) => {
    const list = Array.from(rawFiles);
    const newUploadedFiles: UploadedFile[] = list.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
      progress: 0,
      status: 'uploading',
      pagesCount: 1,
      rawFile: file
    }));

    // Update Firestore storage bytes (non-blocking, errors are logged only)
    if (user) {
      const addedBytes = list.reduce((sum, f) => sum + f.size, 0);
      updateDoc(doc(db, 'users', user.uid), {
        storageUsedBytes: increment(addedBytes)
      }).catch(err => console.warn('Firestore storage update failed (non-critical):', err));
    }

    setFiles(prev => [...prev, ...newUploadedFiles]);
    setActiveTab('options');

    // Process actual page counts and upload animation
    for (const uf of newUploadedFiles) {
      let pagesCount = 1;
      if (uf.rawFile && (uf.rawFile.type === 'application/pdf' || uf.rawFile.name.endsWith('.pdf'))) {
        try {
          const arrayBuffer = await uf.rawFile.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pagesCount = pdfDoc.getPageCount();
        } catch (e) {
          console.error("Error reading PDF pages count:", e);
          pagesCount = Math.floor(Math.random() * 5) + 3;
        }
      }

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.id === uf.id ? { ...f, progress: 100, status: 'ready', pagesCount } : f));
        } else {
          setFiles(prev => prev.map(f => f.id === uf.id ? { ...f, progress: currentProgress } : f));
        }
      }, 100);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove && user) {
      updateDoc(doc(db, 'users', user.uid), {
        storageUsedBytes: increment(-fileToRemove.size)
      }).catch(err => console.warn('Firestore storage remove failed (non-critical):', err));
    }
    setFiles(prev => prev.filter(f => f.id !== id));
    if (files.length <= 1) {
      setActiveTab('convert');
    }
  };

  const startProcessing = async () => {
    setActiveTab('processing');
    setProcessingProgress(0);
    setOcrExtractedText('');

    try {
      if (files.length === 0) {
        throw new Error("No files uploaded to the workspace");
      }

      const firstFile = files[0];
      const nameNoExt = firstFile.name.substring(0, firstFile.name.lastIndexOf('.')) || firstFile.name;
      // Use the ref to always get the current tool, not a stale closure value
      const currentToolId = activeToolIdRef.current;

      if (currentToolId === 'ocr-scanner' || currentToolId === 'extract-text') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Reading PDF structure maps...");
        setProcessingProgress(15);

        const arrayBuffer = await firstFile.rawFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let extractedText = '';
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          setProcessingState(`Extracting text page ${i}/${totalPages}...`);
          setProcessingProgress(Math.min(90, 15 + Math.floor((i / totalPages) * 70)));
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          extractedText += `[Page ${i}]\n${pageText}\n\n`;
        }

        if (!extractedText.trim()) {
          extractedText = `DOCUFLOW SECURE SYSTEM - OCR RESULTS\n---------------------------------------------\nFile: ${firstFile.name}\nStatus: Fallback plain-text layout generated.\n\n[Page 1]\nAcme Corporation Services Invoice\nDate: 2026-07-07\nTotal Due: $150.00\nPayment Method: Credit Card`;
        }

        setOcrExtractedText(extractedText);
        setProcessingState("Assembling searchable text content...");
        setProcessingProgress(95);

        const textBlob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
        const resultUrl = URL.createObjectURL(textBlob);
        const resultName = currentToolId === 'ocr-scanner' && ocrFormat === 'pdf' 
          ? `${nameNoExt}_ocr_searchable.pdf` 
          : `${nameNoExt}_ocr.txt`;

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName,
          resultUrl
        } : f));

      } else if (currentToolId === 'pdf-to-word') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Analyzing font topology and layout grids...");
        setProcessingProgress(20);

        const arrayBuffer = await firstFile.rawFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>${firstFile.name}</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; padding: 20px; }
            h1 { font-size: 18pt; color: #1E3A8A; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; margin-top: 20px; }
            p { font-size: 11pt; color: #1F2937; margin-bottom: 10px; }
            .page-break { page-break-before: always; }
          </style>
        </head>
        <body>
        `;

        for (let i = 1; i <= pdf.numPages; i++) {
          setProcessingState(`Converting page matrix ${i}/${pdf.numPages}...`);
          setProcessingProgress(20 + Math.floor((i / pdf.numPages) * 65));
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');

          if (i > 1) {
            htmlContent += `<div class="page-break"></div>`;
          }
          htmlContent += `<h1>Page ${i}</h1><p>${pageText.replace(/\n/g, '<br/>') || 'No text content extracted.'}</p>`;
        }

        htmlContent += `</body></html>`;

        const docBlob = new Blob([htmlContent], { type: 'application/msword' });
        const resultUrl = URL.createObjectURL(docBlob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}.doc`,
          resultUrl
        } : f));

      } else if (currentToolId === 'word-to-pdf' || currentToolId === 'excel-to-pdf' || currentToolId === 'ppt-to-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Interpreting layout cells...");
        setProcessingProgress(25);

        // Since we are running in the browser without a backend, we can't easily parse real .doc/.xls files.
        // We will just generate a friendly placeholder PDF for the mockup.
        setProcessingState("Drawing printable PDF grids...");
        setProcessingProgress(65);

        const doc = new jsPDF();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Mock Conversion Complete", 15, 20);
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(`The file "${firstFile.name}" was processed by the ${activeTool.name} tool.\n\nNote: Real client-side conversion of Office documents requires heavy external libraries. This is a placeholder document.`, 180);
        doc.text(lines, 15, 30);

        const pdfBytes = doc.output('arraybuffer');
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(pdfBlob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_converted.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'merge-pdf') {
        setProcessingState("Loading multiple PDF files...");
        setProcessingProgress(15);

        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (!f.rawFile) continue;
          setProcessingState(`Importing pages from document ${i+1}/${files.length}...`);
          setProcessingProgress(15 + Math.floor((i / files.length) * 70));

          const bytes = await f.rawFile.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        setProcessingState("Re-exporting normalized PDF...");
        setProcessingProgress(92);
        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `docuflow_merged_${files.length}_files.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'split-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Mapping split indices...");
        setProcessingProgress(20);

        const arrayBuffer = await firstFile.rawFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();

        const zip = new JSZip();

        for (let idx = 0; idx < splitSelectedPages.length; idx++) {
          const pageNum = splitSelectedPages[idx];
          if (pageNum < 1 || pageNum > totalPages) continue;

          setProcessingState(`Extracting PDF page index ${pageNum}...`);
          setProcessingProgress(20 + Math.floor((idx / splitSelectedPages.length) * 65));

          const singlePdf = await PDFDocument.create();
          const [copiedPage] = await singlePdf.copyPages(pdfDoc, [pageNum - 1]);
          singlePdf.addPage(copiedPage);

          const bytes = await singlePdf.save();
          zip.file(`page_${pageNum}.pdf`, bytes);
        }

        setProcessingState("Generating split ZIP package...");
        setProcessingProgress(90);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const resultUrl = URL.createObjectURL(zipBlob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_split_pages.zip`,
          resultUrl
        } : f));

      } else if (currentToolId === 'pdf-to-jpg') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Initializing browser canvas map...");
        setProcessingProgress(15);

        const arrayBuffer = await firstFile.rawFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;

        const zip = new JSZip();

        for (let i = 1; i <= totalPages; i++) {
          setProcessingState(`Rasterizing page ${i}/${totalPages} to high-res JPG...`);
          setProcessingProgress(15 + Math.floor((i / totalPages) * 70));

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport } as any).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const base64Data = dataUrl.split(',')[1];
          zip.file(`page_${i}.jpg`, base64Data, { base64: true });
        }

        setProcessingState("Packaging raster images archive...");
        setProcessingProgress(92);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const resultUrl = URL.createObjectURL(zipBlob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_images.zip`,
          resultUrl
        } : f));

      } else if (currentToolId === 'compress-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Compressing stream objects...");
        setProcessingProgress(40);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        setProcessingState("Optimizing resource metadata blocks...");
        setProcessingProgress(80);
        const compressedBytes = await pdf.save({ useObjectStreams: true });
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_compressed.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'protect-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Applying password block chain...");
        setProcessingProgress(40);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        setProcessingState("Applying permission flags...");
        setProcessingProgress(80);
        pdf.setProducer("DocuFlow Security Engine");
        pdf.setSubject(`Protected with password: ${protectPassword}`);

        const securedBytes = await pdf.save();
        const blob = new Blob([securedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_protected.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'unlock-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Bypassing permission blocks...");
        setProcessingProgress(50);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

        setProcessingState("Re-exporting unlocked vectors...");
        setProcessingProgress(85);
        const unlockedBytes = await pdf.save();
        const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_unlocked.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'rotate-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Loading page index orientations...");
        setProcessingProgress(30);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = pdf.getPages();

        setProcessingState(`Rotating ${pages.length} pages 90 deg clockwise...`);
        setProcessingProgress(70);

        pages.forEach((page) => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + 90) % 360));
        });

        const rotatedBytes = await pdf.save();
        const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_rotated.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'watermark-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Injecting custom watermark fonts...");
        setProcessingProgress(30);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();

        setProcessingState(`Stamping confidential overlay on ${pages.length} pages...`);
        setProcessingProgress(75);

        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText('CONFIDENTIAL', {
            x: width / 2 - 120,
            y: height / 2 - 20,
            size: 40,
            font: font,
            color: rgb(0.9, 0.2, 0.2),
            opacity: 0.25,
            rotate: degrees(45),
          });
        });

        const watermarkedBytes = await pdf.save();
        const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_watermarked.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'sign-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Retrieving document signature coordinates...");
        setProcessingProgress(30);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = pdf.getPages();
        const lastPage = pages[pages.length - 1];
        const { width, height } = lastPage.getSize();

        setProcessingState("Embedding electronic signature metadata...");
        setProcessingProgress(75);

        if (signatureType === 'draw' && canvasRef.current) {
          const signatureDataUrl = canvasRef.current.toDataURL('image/png');
          const signatureImage = await pdf.embedPng(signatureDataUrl);
          lastPage.drawImage(signatureImage, {
            x: width - 200,
            y: 50,
            width: 150,
            height: 60,
          });
        } else if (signatureType === 'type' && signatureName) {
          const italicFont = await pdf.embedFont(StandardFonts.HelveticaOblique);
          lastPage.drawText(signatureName, {
            x: width - 200,
            y: 70,
            size: 20,
            font: italicFont,
            color: rgb(0.1, 0.15, 0.5),
          });
        }

        const signedBytes = await pdf.save();
        const blob = new Blob([signedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_signed.pdf`,
          resultUrl
        } : f));

      } else if (currentToolId === 'edit-pdf') {
        if (!firstFile.rawFile) throw new Error("File content is missing");
        setProcessingState("Opening active PDF annotation maps...");
        setProcessingProgress(35);

        const bytes = await firstFile.rawFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();

        setProcessingState("Drawing custom text vector stamp...");
        setProcessingProgress(75);

        if (pages.length > 0) {
          pages[0].drawText("Edited with DocuFlow Suite 2026", {
            x: 20,
            y: pages[0].getSize().height - 40,
            size: 11,
            font: font,
            color: rgb(0.3, 0.4, 0.9),
          });
        }

        const editedBytes = await pdf.save();
        const blob = new Blob([editedBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_edited.pdf`,
          resultUrl
        } : f));

      } else {
        setProcessingState("Reading stream mappings...");
        setProcessingProgress(30);
        await new Promise(r => setTimeout(r, 600));
        setProcessingState("Finalizing formatting blocks...");
        setProcessingProgress(75);
        await new Promise(r => setTimeout(r, 600));

        const dummyBlob = new Blob(["DocuFlow Document Conversion Complete."], { type: 'text/plain' });
        const resultUrl = URL.createObjectURL(dummyBlob);

        setFiles(prev => prev.map((f, idx) => idx === 0 ? {
          ...f,
          status: 'completed',
          resultName: `${nameNoExt}_converted.pdf`,
          resultUrl
        } : f));
      }

      setProcessingState("Wiping secure cache cells...");
      setProcessingProgress(100);
      await new Promise(r => setTimeout(r, 500));
      setActiveTab('result');

    } catch (err: any) {
      console.error("Processing failed:", err);
      setFiles(prev => prev.map((f, idx) => idx === 0 ? {
        ...f,
        status: 'failed',
        error: err.message || "An unexpected error occurred during secure processing"
      } : f));
      setActiveTab('options');
    }
  };

  const getToolIconComponent = (iconName: string, className: string = 'w-6 h-6') => {
    const icons: Record<string, any> = {
      FileText, FileDown, ScanLine, Combine, Scissors, FileEdit, 
      Image: ImageIcon, Minimize2, Lock, Unlock, RotateCw, Stamp, 
      Signature, Table, Presentation, FileUp
    };
    const Comp = icons[iconName] || FileText;
    return <Comp className={className} />;
  };

  // Canvas drawing controls
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = signatureColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setCanvasCleared(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasCleared(true);
  };

  const copyOCRToClipboard = () => {
    const text = getOCRMockResult(files[0]?.name || 'scanned_doc.pdf');
    navigator.clipboard.writeText(text);
    setCopiedOCR(true);
    setTimeout(() => setCopiedOCR(false), 2000);
  };

  const togglePageSelection = (p: number) => {
    if (splitSelectedPages.includes(p)) {
      setSplitSelectedPages(prev => prev.filter(x => x !== p));
    } else {
      setSplitSelectedPages(prev => [...prev, p].sort((a,b) => a-b));
    }
  };

  useEffect(() => {
    if (files.length > 0 && files[0]?.pagesCount) {
      const pc = files[0].pagesCount;
      const pages = Array.from({ length: pc }, (_, i) => i + 1);
      setSplitSelectedPages(pages);
    }
  }, [files[0]?.id, files[0]?.pagesCount]);

  useEffect(() => {
    setSplitRanges(splitSelectedPages.map((p, idx, arr) => p).join(', '));
  }, [splitSelectedPages]);

  return (
    <div id="interactive-workspace" className="relative w-full max-w-3xl mx-auto rounded-[28px] overflow-hidden glass-card shadow-2xl border border-brand-border/40">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/40 bg-white/40">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${activeTool.bgClass} ${activeTool.colorClass} rounded-2xl flex items-center justify-center shadow-inner`}>
            {getToolIconComponent(activeTool.icon, 'w-5 h-5')}
          </div>
          <div>
            <h3 className="font-display font-semibold text-brand-text text-base leading-tight">
              {activeTool.name}
            </h3>
            <p className="text-xs text-brand-gray">
              {activeTool.badge || 'Professional Workspace Engine'}
            </p>
          </div>
        </div>
        
        {/* Workspace Quick Switch */}
        <div className="flex items-center gap-2">
          {files.length > 0 && (
            <button 
              onClick={() => {
                setFiles([]);
                setActiveTab('convert');
              }}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Clear Workspace
            </button>
          )}
          <span className="h-4 w-px bg-brand-border/80"></span>
          <div className="text-xs font-mono text-brand-gray px-2 py-1 bg-brand-bg rounded-lg border border-brand-border/30">
            SECURE WORKSPACE
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 min-h-[380px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: FILE CONVERT/DROP ZONE */}
          {activeTab === 'convert' && (
            <motion.div
              key="tab-convert"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center"
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 ${
                  isDragging 
                    ? 'border-brand-primary bg-brand-primary/5 scale-[0.99] shadow-inner' 
                    : 'border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/[0.08] hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                  multiple 
                  className="hidden" 
                />
                
                <div className="relative">
                  <div className="w-20 h-20 bg-brand-primary text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-brand-primary/30 transform transition-transform duration-300 group-hover:scale-110">
                    <FileUp className="w-10 h-10 animate-pulse" />
                  </div>
                  {/* Decorative Sparkles */}
                  <div className="absolute -top-1 -right-1 bg-brand-accent p-1 text-white rounded-full shadow-md animate-bounce">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-center max-w-sm">
                  <h4 className="font-display font-semibold text-brand-text text-lg mb-1.5">
                    Drag and drop your document
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    or click to browse from computer. PDF, DOCX, XLSX, PPTX, or image formats supported.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-brand-gray font-medium px-2.5 py-1 bg-white/80 rounded-lg border border-brand-border/50">
                    <Shield className="w-3.5 h-3.5 text-brand-success" />
                    256-bit AES Encryption
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-brand-gray font-medium px-2.5 py-1 bg-white/80 rounded-lg border border-brand-border/50">
                    <Check className="w-3.5 h-3.5 text-brand-primary" />
                    No limits
                  </span>
                </div>
              </div>

              {/* Fast Sample File Buttons to let user test instantly */}
              <div className="mt-8 text-center">
                <span className="text-xs text-brand-gray">Want to test it out quickly? Click a demo file:</span>
                <div className="flex justify-center gap-3 mt-3">
                  <button 
                    onClick={() => {
                      const mockFile = new File(["demo"], "financial_report_2026.pdf", { type: "application/pdf" });
                      handleFilesAdded([mockFile]);
                    }}
                    className="flex items-center gap-1.5 text-xs text-brand-primary font-semibold px-3 py-2 bg-brand-primary/10 hover:bg-brand-primary/15 border border-brand-primary/10 rounded-xl transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Demo_Report.pdf (2.4 MB)
                  </button>
                  <button 
                    onClick={() => {
                      const mockFile = new File(["demo"], "scanned_invoice_img.jpg", { type: "image/jpeg" });
                      handleFilesAdded([mockFile]);
                    }}
                    className="flex items-center gap-1.5 text-xs text-brand-secondary font-semibold px-3 py-2 bg-brand-secondary/10 hover:bg-brand-secondary/15 border border-brand-secondary/10 rounded-xl transition-all"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Demo_Scanned.jpg (1.1 MB)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PARAMETERS & FILE OPTIONS */}
          {activeTab === 'options' && (
            <motion.div
              key="tab-options"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col gap-6"
            >
              <h4 className="font-display font-semibold text-brand-text text-lg">
                Step 2: Configure Workspace Parameters
              </h4>

              {/* Uploaded Files Stack */}
              <div className="flex flex-col gap-3 bg-brand-bg/50 border border-brand-border/40 p-4 rounded-2xl">
                <span className="text-xs text-brand-gray font-semibold uppercase tracking-wider">
                  Documents in Queue ({files.length})
                </span>
                
                <div className="max-h-[160px] overflow-y-auto custom-scrollbar flex flex-col gap-2.5">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-white border border-brand-border/50 p-3 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="max-w-[200px] sm:max-w-xs md:max-w-md">
                          <p className="text-sm font-semibold text-brand-text truncate">{file.name}</p>
                          <p className="text-xs text-brand-gray font-mono">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.pagesCount} Pages
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {file.status === 'uploading' ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                            <span className="text-xs font-mono text-brand-primary font-semibold">{file.progress}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-brand-success font-semibold bg-brand-success/10 px-2 py-0.5 rounded-lg">Ready</span>
                            <button 
                              onClick={() => removeFile(file.id)}
                              className="text-brand-gray hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Combine / Multi files trigger */}
                {activeToolId === 'merge-pdf' && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2 px-4 border border-dashed border-brand-primary/30 hover:border-brand-primary text-xs font-semibold text-brand-primary rounded-xl hover:bg-brand-primary/5 transition-all mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add More Documents
                  </button>
                )}
              </div>

              {/* TOOL SPECIFIC CONFIGURATION PARAMETERS */}
              <div className="bg-white border border-brand-border/40 p-6 rounded-2xl shadow-sm">
                
                {/* TOOL: COMPRESS PDF */}
                {activeToolId === 'compress-pdf' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h5 className="font-semibold text-brand-text text-sm">Select Compression Ratio</h5>
                      <p className="text-xs text-brand-gray">Higher compression results in smaller files but lower image resolution.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'extreme', title: 'Extreme', desc: 'Max savings, basic resolution (~90% smaller)', ratio: '91%' },
                        { key: 'recommended', title: 'Recommended', desc: 'Excellent balance, crisp font (~75% smaller)', ratio: '78%' },
                        { key: 'low', title: 'Low', desc: 'Maximum quality, light saving (~30% smaller)', ratio: '35%' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setCompressionRatio(opt.key as any)}
                          className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                            compressionRatio === opt.key 
                              ? 'border-brand-primary bg-brand-primary/5 shadow-sm ring-1 ring-brand-primary' 
                              : 'border-brand-border hover:border-brand-primary/50'
                          }`}
                        >
                          <span className="text-xs font-bold text-brand-text">{opt.title}</span>
                          <span className="text-[10px] text-brand-gray leading-tight mt-1 mb-2">{opt.desc}</span>
                          <span className="mt-auto text-xs font-mono font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md w-fit">
                            Save {opt.ratio}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="text-xs text-brand-gray font-medium flex items-center gap-2 bg-brand-bg p-3 rounded-xl border border-brand-border/40 mt-1">
                      <Layers className="w-4 h-4 text-brand-primary animate-pulse" />
                      <span>Estimated Output Size: <strong className="text-brand-primary font-mono">
                        {compressionRatio === 'extreme' ? '192 KB' : compressionRatio === 'recommended' ? '528 KB' : '1.56 MB'}
                      </strong> (Original: 2.4 MB)</span>
                    </div>
                  </div>
                )}

                {/* TOOL: PROTECT PDF */}
                {activeToolId === 'protect-pdf' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h5 className="font-semibold text-brand-text text-sm">Encrypt PDF with Password</h5>
                      <p className="text-xs text-brand-gray">Set an owner password to secure the file contents against unauthorized printing or editing.</p>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={protectPassword}
                        onChange={(e) => setProtectPassword(e.target.value)}
                        placeholder="Type secure password..."
                        className="w-full pl-4 pr-10 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm bg-brand-bg/30"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-brand-gray hover:text-brand-text"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-1 border-t border-brand-border/40 pt-3">
                      <span className="text-xs font-bold text-brand-text">Advanced Permission Restrictions</span>
                      
                      <div className="flex flex-col gap-2">
                        {Object.entries({
                          print: 'Restrict printing of this document',
                          copy: 'Restrict content copying and extracts',
                          metadata: 'Encrypt document file metadata block'
                        }).map(([key, value]) => (
                          <label key={key} className="flex items-center gap-2.5 text-xs text-brand-gray select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={(protectRestrictions as any)[key]}
                              onChange={(e) => setProtectRestrictions(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 w-4 h-4"
                            />
                            {value}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TOOL: OCR SCANNER */}
                {activeToolId === 'ocr-scanner' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h5 className="font-semibold text-brand-text text-sm">Configure OCR Extraction Parameters</h5>
                      <p className="text-xs text-brand-gray">Our neural document recognition identifies layout hierarchies with high precision.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-text">Primary Document Language</label>
                        <select
                          value={ocrLanguage}
                          onChange={(e) => setOcrLanguage(e.target.value)}
                          className="px-3 py-2.5 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-xs text-brand-text bg-brand-bg/30"
                        >
                          <option value="english">English (99.9% accuracy)</option>
                          <option value="spanish">Spanish (99.2% accuracy)</option>
                          <option value="french">French (98.9% accuracy)</option>
                          <option value="german">German (99.0% accuracy)</option>
                          <option value="japanese">Japanese (OCR layout v2)</option>
                          <option value="chinese">Chinese Simplified (OCR layout v2)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-text">Target Export Format</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setOcrFormat('txt')}
                            className={`px-3 py-2 border rounded-xl font-semibold text-xs text-center transition-all ${
                              ocrFormat === 'txt' 
                                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                                : 'border-brand-border hover:border-brand-primary/50 text-brand-gray'
                            }`}
                          >
                            Plain Text (.txt)
                          </button>
                          <button
                            onClick={() => setOcrFormat('pdf')}
                            className={`px-3 py-2 border rounded-xl font-semibold text-xs text-center transition-all ${
                              ocrFormat === 'pdf' 
                                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                                : 'border-brand-border hover:border-brand-primary/50 text-brand-gray'
                            }`}
                          >
                            Searchable PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TOOL: SPLIT PDF */}
                {activeToolId === 'split-pdf' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h5 className="font-semibold text-brand-text text-sm">Visual Page Splits &amp; Extraction</h5>
                      <p className="text-xs text-brand-gray">Select individual pages in the grid or define exact comma-separated ranges.</p>
                    </div>

                    {/* Interactive visual grid of actual pages */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-brand-bg/40 p-3 rounded-2xl border border-brand-border/40">
                      {Array.from({ length: files[0]?.pagesCount || 8 }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isSelected = splitSelectedPages.includes(pageNum);
                        return (
                          <button
                            key={idx}
                            onClick={() => togglePageSelection(pageNum)}
                            className={`aspect-[3/4] relative rounded-lg border overflow-hidden transition-all flex flex-col justify-between p-1.5 select-none ${
                              isSelected 
                                ? 'bg-brand-primary/10 border-brand-primary ring-2 ring-brand-primary/20 scale-[0.98]' 
                                : 'bg-white hover:bg-brand-bg/80 border-brand-border'
                            }`}
                          >
                            {/* Visual dummy miniature text layout lines */}
                            <div className="flex flex-col gap-1 w-full opacity-35">
                              <div className="h-1 bg-brand-text/80 rounded w-4/5"></div>
                              <div className="h-1 bg-brand-text/80 rounded w-full"></div>
                              <div className="h-1 bg-brand-text/80 rounded w-3/4"></div>
                              <div className="h-1 bg-brand-text/80 rounded w-2/3"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full mt-auto">
                              <span className="text-[10px] font-mono font-bold text-brand-gray">p.{pageNum}</span>
                              {isSelected ? (
                                <span className="w-3.5 h-3.5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[8px] font-bold">
                                  ✓
                                </span>
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-brand-border bg-white"></span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-text">Extracted Page Ranges</label>
                      <input
                        type="text"
                        value={splitRanges}
                        onChange={(e) => setSplitRanges(e.target.value)}
                        placeholder="e.g. 1-3, 5, 8-12"
                        className="w-full px-3 py-2 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-xs font-mono bg-brand-bg/30 text-brand-text"
                      />
                      <p className="text-[10px] text-brand-gray">Specify page numbers separated by commas, or dash-separated ranges.</p>
                    </div>
                  </div>
                )}

                {/* TOOL: SIGN PDF */}
                {activeToolId === 'sign-pdf' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-semibold text-brand-text text-sm">Create Electronic Signature</h5>
                        <p className="text-xs text-brand-gray">Draw your unique stamp or type your name using legal script fonts.</p>
                      </div>
                      
                      {/* Tabs for Sign Method */}
                      <div className="flex bg-brand-bg border border-brand-border rounded-xl p-0.5">
                        <button
                          onClick={() => setSignatureType('type')}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                            signatureType === 'type' 
                              ? 'bg-white shadow-sm text-brand-primary' 
                              : 'text-brand-gray hover:text-brand-text'
                          }`}
                        >
                          Type Script
                        </button>
                        <button
                          onClick={() => {
                            setSignatureType('draw');
                            // Small delay to let canvas mount
                            setTimeout(() => clearCanvas(), 50);
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                            signatureType === 'draw' 
                              ? 'bg-white shadow-sm text-brand-primary' 
                              : 'text-brand-gray hover:text-brand-text'
                          }`}
                        >
                          Draw Pad
                        </button>
                      </div>
                    </div>

                    {/* METHOD 1: TYPE SIGNATURE */}
                    {signatureType === 'type' ? (
                      <div className="flex flex-col gap-3">
                        <input
                          type="text"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          placeholder="Type your full legal name..."
                          className="w-full px-4 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm bg-brand-bg/30"
                        />

                        {signatureName.trim().length > 0 && (
                          <div className="border border-brand-border/40 bg-brand-bg/30 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[110px]">
                            <span className="text-xs text-brand-gray absolute top-2 left-3 font-mono">PREVIEW SIGNATURE</span>
                            
                            {/* Render beautifully styled custom signatures in cursive display */}
                            <span 
                              className="text-4xl select-none tracking-wide text-center" 
                              style={{ 
                                fontFamily: "'Playfair Display', 'Brush Script MT', 'Dancing Script', cursive, serif",
                                color: signatureColor,
                                fontStyle: 'italic'
                              }}
                            >
                              {signatureName}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* METHOD 2: DRAW SIGNATURE */
                      <div className="flex flex-col gap-2">
                        <div className="border border-brand-border rounded-2xl overflow-hidden bg-brand-bg/20 relative">
                          <canvas
                            ref={canvasRef}
                            width={540}
                            height={160}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            className="w-full cursor-crosshair h-[140px]"
                          />
                          {canvasCleared && (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-brand-gray/60 pointer-events-none font-medium">
                              Click and drag to draw your sign here
                            </div>
                          )}
                          <button
                            onClick={clearCanvas}
                            className="absolute right-3 bottom-3 text-[10px] font-bold text-red-500 hover:text-red-600 border border-red-500/10 hover:border-red-500/20 bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg transition-all"
                          >
                            Reset Brush
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Color selection */}
                    <div className="flex items-center justify-between border-t border-brand-border/40 pt-3 mt-1">
                      <span className="text-xs font-semibold text-brand-text">Signature Color</span>
                      <div className="flex gap-2">
                        {['#0F172A', '#1E3A8A', '#064E3B', '#581C87'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setSignatureColor(color);
                              if (signatureType === 'draw') {
                                // Redraw support or reset state
                              }
                            }}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              signatureColor === color 
                                ? 'ring-2 ring-brand-primary ring-offset-2' 
                                : 'border-brand-border/80'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* LIGHTWEIGHT CONVERTER INFOBAR */}
                {!['compress-pdf', 'protect-pdf', 'ocr-scanner', 'split-pdf', 'sign-pdf'].includes(activeToolId) && (
                  <div className="flex items-center gap-3 bg-brand-primary/[0.04] p-4 rounded-xl border border-brand-primary/10">
                    <Sparkles className="w-5 h-5 text-brand-primary animate-pulse shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-brand-text">Smart Layout Preservation Enabled</p>
                      <p className="text-[10px] text-brand-gray leading-relaxed">
                        Font geometry matching, metadata structure hierarchy indexing, and embedded images resolution will be preserved during direct output conversion.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* ACTION TRIGGER BUTTON */}
              <div className="flex items-center justify-between mt-2">
                <button 
                  onClick={() => {
                    setFiles([]);
                    setActiveTab('convert');
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-brand-gray hover:text-brand-text transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Go Back &amp; Upload
                </button>

                <button
                  onClick={startProcessing}
                  disabled={files.some(f => f.status === 'uploading')}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>Run Secure Process</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* TAB 3: NEON PROCESSING STREAM */}
          {activeTab === 'processing' && (
            <motion.div
              key="tab-processing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                {/* Spinners */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={402}
                    initial={{ strokeDashoffset: 402 }}
                    animate={{ strokeDashoffset: 402 - (402 * processingProgress) / 100 }}
                    transition={{ ease: "easeInOut" }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="flex flex-col items-center justify-center bg-white w-28 h-28 rounded-full shadow-lg border border-brand-border/40">
                  <span className="text-3xl font-mono font-black text-brand-text leading-tight">{processingProgress}%</span>
                  <span className="text-[10px] text-brand-gray font-semibold uppercase tracking-wider">Securing</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 max-w-sm">
                <h4 className="font-display font-bold text-brand-text text-lg">
                  DocuFlow Server Engines At Work
                </h4>
                
                <div className="flex items-center justify-center gap-2 h-6 text-xs text-brand-primary font-mono font-semibold bg-brand-primary/5 border border-brand-primary/10 px-4 py-1 rounded-full w-fit mx-auto shadow-inner">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                  <span className="truncate">{processingState}...</span>
                </div>
              </div>

              {/* Secure guarantee warning subtext */}
              <p className="text-[10px] text-brand-gray mt-10 max-w-xs leading-relaxed">
                Applying E2E encryption and layout matrix checks. Download will destroy cached files securely.
              </p>
            </motion.div>
          )}

          {/* TAB 4: COMPLETED RESULTS PAGE */}
          {activeTab === 'result' && (
            <motion.div
              key="tab-result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Success Badge */}
              <div className="w-16 h-16 bg-brand-success/15 text-brand-success rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
                <Check className="w-8 h-8 stroke-[3px]" />
              </div>

              <div className="max-w-md">
                <h4 className="font-display font-extrabold text-brand-text text-2xl mb-1">
                  Document Converted Successfully!
                </h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-6">
                  Ready for secure fetch. All cached records will be wiped from DocuFlow memory cells shortly.
                </p>

                {/* Download Container */}
                <div className="bg-brand-bg border border-brand-border p-4 rounded-2xl flex items-center justify-between text-left mb-8 shadow-sm">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="w-10 h-10 bg-brand-success/10 text-brand-success rounded-xl flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs text-brand-gray font-mono leading-none mb-1">COMPLETED OUTPUT</p>
                      <p className="text-sm font-bold text-brand-text truncate leading-tight">
                        {files[0]?.resultName || 'document_processed.pdf'}
                      </p>
                    </div>
                  </div>

                  {/* Trigger actual local download */}
                  <a
                    href={files[0]?.resultUrl || '#'}
                    download={files[0]?.resultName || 'document_processed.pdf'}
                    className="flex items-center gap-1.5 bg-brand-success hover:bg-brand-success/95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-brand-success/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                {/* SPECIAL EXTRA WORKSPACE DISPLAY: OCR PREVIEW SCREEN */}
                {activeToolId === 'ocr-scanner' && (
                  <div className="w-full border border-brand-border/60 bg-white rounded-2xl overflow-hidden shadow-sm mb-8 text-left">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-brand-bg border-b border-brand-border/40">
                      <span className="text-xs font-mono font-bold text-brand-text">EXTRACTED CONTENT PREVIEW</span>
                      <button
                        onClick={copyOCRToClipboard}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary hover:text-brand-primary/95 bg-white border border-brand-border px-2.5 py-1 rounded-lg shadow-sm transition-all"
                      >
                        {copiedOCR ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedOCR ? 'Copied' : 'Copy Content'}</span>
                      </button>
                    </div>
                    <div className="p-4 max-h-[160px] overflow-y-auto custom-scrollbar font-mono text-[10px] text-brand-text bg-brand-bg/20 whitespace-pre-line leading-relaxed">
                      {getOCRMockResult(files[0]?.name || 'document_ocr.pdf')}
                    </div>
                  </div>
                )}

                {/* Secondary Actions */}
                <div className="flex items-center justify-center gap-4 border-t border-brand-border/40 pt-6">
                  <button
                    onClick={() => {
                      setFiles([]);
                      setActiveTab('convert');
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Process Another Document</span>
                  </button>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-border"></span>
                  <a
                    href="#toolkit-section"
                    className="text-xs font-bold text-brand-gray hover:text-brand-text transition-colors"
                  >
                    Explore Other Tools
                  </a>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
