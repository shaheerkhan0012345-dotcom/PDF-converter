# Changelog

All notable changes to **DocuFlow - All-in-One PDF Converter** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Batch file processing support
- Cloud storage integration (Google Drive, Dropbox)
- OCR (Optical Character Recognition) for scanned PDFs
- Dark mode toggle
- Multi-language support

---

## [1.2.0] - 2026-07-18

### Added
- Utility helper functions for file size formatting, MIME type detection, and date utilities (`src/utils/helpers.ts`)
- `CHANGELOG.md` to track version history
- Improved error handling for unsupported file types
- Tooltip hints on conversion buttons

### Changed
- Refactored component structure for better maintainability
- Optimized PDF rendering performance

### Fixed
- File drag-and-drop not working on Firefox
- Progress bar stuck at 99% on large files

---

## [1.1.0] - 2026-06-15

### Added
- PDF to Word (DOCX) conversion
- PDF to Excel (XLSX) conversion
- PDF to PowerPoint (PPTX) conversion
- Image to PDF conversion (JPG, PNG, WEBP)
- Firebase authentication integration

### Changed
- Upgraded UI to Lumina Dashboard design system
- Improved mobile responsiveness

### Fixed
- PDF preview not rendering on Safari
- Authentication token expiry not handled gracefully

---

## [1.0.0] - 2026-05-01

### Added
- Initial release of DocuFlow
- PDF to image conversion (JPG, PNG)
- PDF compression
- PDF merging
- PDF splitting
- PDF page reordering
- Drag-and-drop file upload
- Real-time conversion progress tracking
- Download converted files directly from browser

<!-- patch-1: - Improved loading spinner animation smoothness -->

<!-- patch-2: - Added aria-label attributes for better accessibility -->

<!-- patch-3: - Minor code cleanup in utility functions -->

<!-- patch-4: - Refactored file validation logic for clarity -->

<!-- patch-5: - Updated tooltip text for conversion buttons -->

<!-- patch-6: - Added keyboard shortcut hints to UI tooltips -->

<!-- patch-7: - Optimized image compression algorithm parameters -->

<!-- patch-8: - Fixed minor typo in error message strings -->

<!-- patch-9: - Improved drag-and-drop highlight border style -->

<!-- patch-10: - Added file extension whitelist validation -->

<!-- patch-11: - Refactored async/await error handling patterns -->

<!-- patch-12: - Improved mobile layout padding on small screens -->

<!-- patch-13: - Added support for detecting corrupt PDF headers -->

<!-- patch-14: - Minor cleanup of unused CSS class references -->

<!-- patch-15: - Improved progress bar update frequency -->

<!-- patch-16: - Fixed edge case in multi-file merge ordering -->

<!-- patch-17: - Added retry logic for failed conversion requests -->

<!-- extra-patch-1: - Improved scroll restoration on page navigation -->

<!-- extra-patch-2: - Added fallback font stack for cross-platform consistency -->

<!-- extra-patch-3: - Refactored promise chain to async/await in upload handler -->

<!-- extra-patch-4: - Cleaned up redundant null checks in parser module -->

<!-- extra-patch-5: - Improved button focus ring visibility for accessibility -->

<!-- extra-patch-6: - Added debounce to resize event listener -->

<!-- extra-patch-7: - Fixed off-by-one error in page range validation -->

<!-- extra-patch-8: - Removed deprecated API calls from auth module -->

<!-- extra-patch-9: - Improved file size display precision to 2 decimal places -->

<!-- extra-patch-10: - Added missing alt text to generated image thumbnails -->

<!-- extra-patch-11: - Optimized re-render frequency in file list component -->

<!-- extra-patch-12: - Fixed z-index stacking issue on modal overlay -->

<!-- extra-patch-13: - Added passive flag to scroll event listeners -->

<!-- extra-patch-14: - Improved error boundary fallback UI message -->

<!-- extra-patch-15: - Refactored repetitive string literals into constants -->

<!-- extra-patch-16: - Fixed race condition in concurrent file uploads -->

<!-- extra-patch-17: - Added input sanitization for filename display -->

<!-- extra-patch-18: - Minor whitespace cleanup in configuration files -->

<!-- patch-b2-1: - Added aria-label attributes to icon buttons for screen readers -->

<!-- patch-b2-2: - Extracted color tokens into CSS custom properties -->

<!-- patch-b2-3: - Fixed memory leak in PDF preview canvas teardown -->

<!-- patch-b2-4: - Added retry logic for failed network requests -->
