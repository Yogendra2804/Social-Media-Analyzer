import fitz  # PyMuPDF
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF file using PyMuPDF.
    Preserves basic formatting such as paragraphs.
    """
    try:
        # Open the PDF from bytes
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        text_content = []
        
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            # Use 'text' to extract plain text but keep some layout structure
            page_text = page.get_text("text")
            if page_text:
                text_content.append(page_text)
                
        return "\n\n".join(text_content)
    except Exception as e:
        raise RuntimeError(f"Failed to extract text from PDF: {str(e)}")
