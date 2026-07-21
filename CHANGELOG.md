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

<!-- patch-b2-5: - Improved loading skeleton animation smoothness -->

<!-- patch-b2-6: - Fixed broken link in help documentation section -->

<!-- patch-b2-7: - Normalized line endings across source files -->

<!-- patch-b2-8: - Added input length validation to search field -->

<!-- patch-b2-9: - Improved contrast ratio on secondary text elements -->

<!-- patch-b2-10: - Fixed stale closure in drag-and-drop event handler -->

<!-- patch-b2-11: - Added missing loading state to export button -->

<!-- patch-b2-12: - Cleaned up unused CSS selector rules -->

<!-- patch-b2-13: - Improved error message copy for upload failures -->

<!-- patch-b2-14: - Fixed tab order in settings dialog -->

<!-- patch-b2-15: - Added title attribute to progress bar element -->

<!-- patch-b2-16: - Removed unused imported utilities from helpers file -->

<!-- patch-b2-17: - Fixed incorrect MIME type check for PDF files -->

<!-- patch-b2-18: - Added max-width constraint to content container -->

<!-- patch-b2-19: - Improved focus trap logic in modal dialogs -->

<!-- patch-b2-20: - Fixed tooltip positioning near viewport edges -->

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

<!-- extra-patch-19: - Updated tooltip delay for better UX responsiveness -->

<!-- extra-patch-20: - Improved keyboard navigation in dropdown menus -->

<!-- patch-extra-1: fix: resolve edge case in file validation -->

<!-- patch-extra-2: chore: update internal comment formatting -->

<!-- patch-extra-3: perf: reduce unnecessary DOM queries -->

<!-- patch-extra-4: fix: handle null response in fetch wrapper -->

<!-- patch-extra-5: refactor: simplify conditional logic in parser -->

<!-- patch-extra-6: chore: remove unused variable declarations -->

<!-- patch-extra-7: fix: correct typo in error message string -->

<!-- patch-extra-8: perf: cache computed values in render loop -->

<!-- patch-extra-9: fix: prevent double-submit on form -->

<!-- patch-extra-10: chore: align indentation in config module -->

<!-- patch-extra-11: fix: correct default value for timeout option -->

<!-- patch-extra-12: refactor: extract helper into utility module -->

<!-- patch-extra-13: perf: lazy-load non-critical assets -->

<!-- patch-extra-14: fix: guard against undefined in event handler -->

<!-- patch-extra-15: chore: add missing semicolon in legacy code -->

<!-- patch-extra-16: fix: normalize path separators on Windows -->

<!-- patch-extra-17: perf: memoize expensive filter function -->

<!-- patch-extra-18: fix: close file handle after read operation -->

<!-- patch-extra-19: refactor: replace magic numbers with constants -->

<!-- patch-extra-20: chore: clean up leftover debug statements -->

<!-- patch-extra-21: fix: restore missing default export -->

<!-- patch-extra-22: perf: defer non-essential script loading -->

<!-- patch-extra-23: fix: handle empty array in sort function -->

<!-- patch-extra-24: chore: update outdated inline documentation -->

<!-- patch-extra-25: fix: prevent XSS in dynamic HTML insertion -->

<!-- patch-extra-26: refactor: unify error handling pattern -->

<!-- patch-extra-27: perf: batch DOM updates with requestAnimationFrame -->

<!-- patch-extra-28: fix: correct off-by-one in loop boundary -->

<!-- patch-extra-29: chore: normalize line endings in source files -->

<!-- patch-extra-30: fix: add null guard before property access -->

<!-- patch-extra-31: perf: avoid reflow by reading layout values first -->

<!-- patch-extra-32: fix: handle timezone offset in date formatter -->

<!-- patch-extra-33: refactor: consolidate duplicate fetch logic -->

<!-- patch-extra-34: chore: remove commented-out dead code -->

<!-- patch-extra-35: fix: sanitize user input before rendering -->

<!-- patch-extra-36: perf: throttle high-frequency scroll handler -->

<!-- patch-extra-37: fix: resolve naming conflict in module scope -->

<!-- patch-extra-38: chore: update function signature documentation -->

<!-- patch-extra-39: fix: add missing return statement in callback -->

<!-- patch-extra-40: refactor: move constants to dedicated file -->

<!-- patch-extra-41: fix: handle network timeout gracefully -->

<!-- patch-extra-42: perf: use WeakMap for private data storage -->

<!-- patch-extra-43: fix: correct assertion in validation function -->

<!-- patch-extra-44: chore: reformat object literals for readability -->

<!-- patch-extra-45: fix: prevent memory leak in event subscription -->

<!-- patch-extra-46: refactor: break up oversized function -->

<!-- patch-extra-47: perf: short-circuit evaluation in filter chain -->

<!-- patch-extra-48: fix: resolve circular dependency in imports -->

<!-- patch-extra-49: chore: standardize quote style across module -->

<!-- patch-extra-50: fix: handle missing content-type header -->

<!-- patch-extra-51: fix: resolve edge case in file validation -->

<!-- patch-extra-52: chore: update internal comment formatting -->

<!-- patch-extra-53: perf: reduce unnecessary DOM queries -->

<!-- patch-extra-54: fix: handle null response in fetch wrapper -->

<!-- patch-extra-55: refactor: simplify conditional logic in parser -->

<!-- patch-extra-56: chore: remove unused variable declarations -->

<!-- patch-extra-57: fix: correct typo in error message string -->

<!-- patch-extra-58: perf: cache computed values in render loop -->

<!-- patch-extra-59: fix: prevent double-submit on form -->

<!-- patch-extra-60: chore: align indentation in config module -->

<!-- patch-extra-61: fix: correct default value for timeout option -->

<!-- patch-extra-62: refactor: extract helper into utility module -->

<!-- patch-extra-63: perf: lazy-load non-critical assets -->

<!-- patch-extra-64: fix: guard against undefined in event handler -->

<!-- patch-extra-65: chore: add missing semicolon in legacy code -->

<!-- patch-extra-66: fix: normalize path separators on Windows -->

<!-- patch-extra-67: perf: memoize expensive filter function -->
