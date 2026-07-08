import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createTestPDFs() {
  const testDir = path.join(process.cwd(), 'test-files');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  // 1. Simple text PDF
  const doc1 = await PDFDocument.create();
  const page1 = doc1.addPage();
  const font = await doc1.embedFont(StandardFonts.Helvetica);
  page1.drawText('This is a sample PDF file for testing DocuFlow!', {
    x: 50,
    y: 700,
    size: 20,
    font,
    color: rgb(0, 0.53, 0.71),
  });
  page1.drawText('You can use this file to test tools like PDF to Word, OCR, and Compress.', {
    x: 50,
    y: 650,
    size: 14,
    font,
  });
  fs.writeFileSync(path.join(testDir, 'sample-1.pdf'), await doc1.save());

  // 2. Another PDF for testing Merge
  const doc2 = await PDFDocument.create();
  const page2 = doc2.addPage();
  page2.drawText('This is the second test PDF file.', {
    x: 50,
    y: 700,
    size: 20,
    font,
    color: rgb(0.8, 0.2, 0.2),
  });
  page2.drawText('Use this to test the Merge PDF tool along with sample-1.pdf.', {
    x: 50,
    y: 650,
    size: 14,
    font,
  });
  fs.writeFileSync(path.join(testDir, 'sample-2.pdf'), await doc2.save());

  // 3. Fake image for testing Image to PDF
  fs.writeFileSync(path.join(testDir, 'sample-image.png'), 'Fake image data just for file type testing');

  // 4. Fake Word doc for testing Word to PDF
  fs.writeFileSync(path.join(testDir, 'sample-word.docx'), 'Fake word doc data');

  console.log('✅ Test files generated successfully in /test-files directory!');
}

createTestPDFs().catch(console.error);
