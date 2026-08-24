from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Any
import os
from services.pdf_extractor import extract_text_from_pdf
from services.ocr_extractor import extract_text_from_image
from services.ai_analyzer import analyze_content

router = APIRouter()

@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...)) -> Any:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    content_type = file.content_type
    extracted_text = ""
    
    file_bytes = await file.read()
    
    try:
        if content_type == "application/pdf":
            extracted_text = extract_text_from_pdf(file_bytes)
        elif content_type in ["image/jpeg", "image/png", "image/jpg"]:
            extracted_text = extract_text_from_image(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or Image (PNG/JPG).")
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the document.")
            
        # Analyze the extracted text
        analysis_result = analyze_content(extracted_text)
        
        return {
            "status": "success",
            "extracted_text": extracted_text,
            "analysis": analysis_result
        }
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))
