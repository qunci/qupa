# QUPA ROADMAP

Version: 1.0
Owner: Dan
Project: Qupa

---

# Mission

Qupa is a file workspace built to become the first place users think of whenever they need to work with files.

Not just a converter.

Not just a PDF tool.

Not just an image tool.

Qupa aims to become a trusted home for digital file workflows.

Core principles:

- Quality over quantity
- Privacy first
- Local-first processing
- Professional user experience
- Sustainable growth
- Build only what provides real value

---

# Current Reality

Qupa is currently a bootstrap project.

Available budget:

- Infrastructure budget: 0
- Cloud budget: 0
- Team size: Solo developer

Because of this, Qupa follows:

LOCAL-FIRST DEVELOPMENT

If a feature can be implemented reliably inside the browser, it should be implemented inside the browser first.

Backend infrastructure should only be introduced when it becomes truly necessary.

---

# Current Status

Completed:

- Modern Next.js architecture
- Tailwind v4 integration
- Dark mode system
- Responsive layout
- Sidebar navigation
- Image conversion workflow
- Converter workspace structure
- Advanced tools structure
- GitHub repository
- Project documentation

In Progress:

- Image conversion improvements
- Document conversion research
- Advanced tools planning

Planned:

- PDF utilities
- Image utilities
- Workspace expansion

---

# PHASE 1

Foundation & Trust

Goal:

Make existing functionality extremely reliable before adding major new features.

Priority:

HIGH

Tasks:

## 1. Improve Image Converter

Target:

Transform current image converter into a polished production-quality tool.

Features:

- Better error handling
- Better file validation
- Better loading states
- Conversion success feedback
- Improved mobile experience

Status:

Current Focus

---

## 2. Metadata Removal

Goal:

Improve privacy.

Features:

- Strip EXIF metadata
- Privacy notice
- Download clean image

Priority:

High

Reason:

Matches Qupa's privacy-first philosophy.

---

## 3. Batch Conversion

Goal:

Allow multiple image conversion.

Features:

- Multi-file upload
- Queue processing
- Batch download

Priority:

High

Reason:

Very high user value.

---

## 4. Better Format Detection

Goal:

Show only formats that make sense.

Features:

- Smart format filtering
- Better format descriptions
- More transparent limitations

Priority:

Medium

---

# PHASE 2

Workspace Expansion

Goal:

Expand usefulness without requiring backend infrastructure.

Priority:

High

---

## PDF to Image

Possible client-side.

Research:

pdfjs-dist

Status:

Candidate

---

## Image Resize

Possible client-side.

Status:

Candidate

---

## Image Compression

Possible client-side.

Status:

Candidate

---

## Watermark Tool

Possible client-side.

Status:

Candidate

---

## Crop Tool

Possible client-side.

Status:

Candidate

---

# PHASE 3

Advanced Tools

Goal:

Introduce professional document tools.

Condition:

Only after Phase 1 becomes stable.

Possible tools:

- Merge PDF
- Split PDF
- Extract pages
- Reorder pages

Status:

Future

Notes:

Only release when quality is acceptable.

---

# PHASE 4

Backend Era

Goal:

Introduce cloud processing.

Condition:

Revenue or available budget exists.

Potential infrastructure:

- VPS
- Object storage
- Background workers

Possible features:

- DOCX → PDF
- XLSX → PDF
- PPTX → PDF
- Large file processing
- User accounts
- Conversion history

Status:

Future

---

# Features That Must Stay Locked For Now

These features remain locked until quality standards can be met.

Examples:

- Advanced DOCX conversion
- Advanced XLSX conversion
- Advanced PPTX conversion
- Video conversion
- OCR
- AI processing

Reason:

Qupa does not ship low-quality features.

---

# Product Philosophy

A locked feature is better than a broken feature.

A delayed feature is better than a bad feature.

Trust is more important than feature count.

---

# Success Metric

A user should eventually say:

"Qupa is the best place for all my file needs."

If a feature does not move Qupa closer to that statement, it should not be built.

---

# Long-Term Vision

Qupa becomes:

A complete file workspace.

A trusted productivity platform.

A destination users visit whenever they need to work with files.

Built carefully.

Built sustainably.

Built with quality first.

---

Maintained by:

Dan

Founder of Qupa