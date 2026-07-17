# 📄 Naughty PDF: All-in-One PDF & Office Productivity Suite

**Naughty PDF** is a premium, secure, and blazing-fast offline-first document processor and conversion engine. Designed with a high-contrast, modern slate visual aesthetic and utilizing client-side WebAssembly and GPU-accelerated canvas pipelines, Naughty PDF runs complex PDF operations and document parsing securely in the browser.

---

## ✨ Primary Capabilities & Features

Naughty PDF houses over **25+ professional tools** categorized into high-performance suites:

### 🔄 1. High-Fidelity Office Converters
*   **PDF to Word (`.docx`)**: Decompiles embedded structures, margins, and text flow patterns directly into standard editable formats.
*   **PDF to Excel (`.xlsx`)**: Analyzes grid geometries and column coordinates to reconstruct raw tabular structures perfectly.
*   **PDF to PowerPoint (`.pptx`)**: Generates pristine widescreen presentation slides complete with titles, structural bullet outlines, and accent headers using our fail-safe multi-strategy exporter.
*   **PDF to HTML**: Generates fully responsive, styled HTML layouts from standard PDF page layers.
*   **Text & Image Converters**: Seamless bidirectional conversions (`Text to PDF`, `HTML to PDF`, `JPG/PNG to PDF`, and rasterizing `PDF to JPG/PNG` zip archives).

### 🛡️ 2. Security, Compliance & Signatures
*   **Protect PDF**: Appends robust, user-restricted passwords and enterprise-grade 128-bit/256-bit encryption keys.
*   **Unlock PDF**: Decrypts user-restricted PDF files on-the-fly when authorized.
*   **Digital Signatures**: Sign documents with stylized cursive typed signatures or draw custom signatures using a precise drawing canvas with real-time vector path tracking.
*   **Watermarks & Page Numbers**: Add custom watermarks or dynamic page numbering grids to compiled documents.

### ✂️ 3. Document Refinement & Surgery
*   **Merge & Split PDF**: Drag-and-drop file organizer to concatenate multiple sheets or slice custom page ranges into a zipped package.
*   **Rotate, Crop & Repair**: Rotate individual pages, crop viewport dimensions, or fix corrupted/malformed metadata trees.
*   **Compare PDF**: Run a structural layout comparison to highlight diffs and structural changes.

### 🧠 4. Cognitive AI & OCR Engine
*   **AI PDF Assistant**: Powered by the **Gemini 2.5 Flash** model to analyze layout vectors, summarize findings, and synthesize actionable checklists.
*   **OCR Scanner**: Runs client-side character recognition on scanned PDFs or raw camera images using a custom **Tesseract.js** neural engine.

---

## 🛠️ Architecture & Core Dependencies

Naughty PDF is built using **React 19**, **TypeScript 5.8**, and **Vite**, relying entirely on robust sandboxed client-side processing:

| Dependency | Purpose | Key Usage |
| :--- | :--- | :--- |
| `pdf-lib` | PDF Surgery | Page merging, splitting, rotating, watermarking, and signature embedding |
| `pdfjs-dist` | PDF Compilation | Raw page rendering, text extraction, layout mapping, and OCR rasterization |
| `pptxgenjs` | PowerPoint Engine | Generates premium widescreen presentations directly from PDF layout lines |
| `jspdf` | PDF Assembly | Client-side creation of PDF files from scanned inputs |
| `xlsx` | Excel Processing | Reconstructing structured tables and grids into spreadsheets |
| `tesseract.js` | Optical Character Recognition | Running fast, accurate neural network OCR directly in the browser thread |
| `motion` | Motion & UI Transitions | Powering fluid transitions, slide-ins, drawer states, and interactive panels |

---

## 🏗️ Getting Started & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
The application will boot a local development environment accessible at `http://localhost:3000`.

### 3. Build & Compile for Production
```bash
npm run build
```
Generates a highly-optimized, single-page bundle in the `dist/` folder, ready for direct static hosting or container deployment.

---

## 🔒 Security & Privacy First
Naughty PDF prioritizes user privacy. Because **all document parsing, text extraction, rendering, and conversion occurs directly in your browser**, your sensitive financial, medical, or corporate documents never leave your machine. The optional **Gemini AI Assistant** and **Firestore cloud storage sync** are integrated securely with standard SSL and end-to-end user-authorized cloud pipelines.
