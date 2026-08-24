# Social Media Content Analyzer

A full-stack application that analyzes social media posts (uploaded as PDFs or Images) and provides AI-powered engagement improvements. Built as a technical assessment for [Company Name].

## Features
- **Document Upload:** Support for PDFs and Images (PNG, JPG) via drag-and-drop or file picker.
- **Text Extraction:** Uses PyMuPDF for PDFs and Tesseract OCR for images.
- **AI Analysis:** Leverages the Gemini API for tone, clarity, and engagement suggestions (with a deterministic heuristic fallback if the API is unavailable).
- **Modern UI:** Clean, responsive, minimal design using React and Tailwind CSS.
- **Error Handling & Loading States:** Robust UX during processing.

## Approach (Brief Write-up)
*Max 200 words*

I built this application prioritizing a clean, functional core flow over unnecessary complexity, making it realistic for an 8-hour assessment. 

**Frontend:** I chose React with Vite and Tailwind CSS. This combination allows for rapid UI development, strong type safety (TypeScript), and a polished, responsive user experience without heavy state-management libraries.

**Backend:** I selected Python with FastAPI because of its built-in async support, automatic validation, and excellent ecosystem for data processing. 

**Extraction & Analysis:** For PDF extraction, I used PyMuPDF because it is fast and reliably preserves paragraph structure. For image OCR, I used Tesseract (via `pytesseract`) as a proven open-source solution. The core analysis uses the Gemini API to provide genuinely useful content suggestions. Recognizing that API quotas can fail, I implemented a deterministic heuristic fallback to ensure the application remains functional.

**Deployment:** The frontend is configured for Vercel, and the backend is containerized via Docker for Render. Docker ensures that systemic dependencies like Tesseract OCR are reliably installed in the production environment.

Overall, the architecture balances implementation speed, reliability, and clear separation of concerns.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Axios, Lucide React
- **Backend:** Python 3.10+, FastAPI, PyMuPDF (fitz), Tesseract OCR, Google Generative AI

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Tesseract OCR installed on your system (Required for image processing locally)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.
6. Run the server: `uvicorn main:app --reload --port 10000`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open the application at `http://localhost:5173`

## Known Limitations
- The OCR functionality locally depends on the host system having Tesseract installed. In production, this is solved via the Docker container.
- Fallback heuristic analysis is basic and relies on word counts and character presence.
