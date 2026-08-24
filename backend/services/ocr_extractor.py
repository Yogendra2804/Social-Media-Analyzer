import pytesseract
from PIL import Image
import io

def extract_text_from_image(file_bytes: bytes) -> str:
    """
    Extracts text from an image using Tesseract OCR.
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        # Optional: pre-processing can be done here if needed (e.g. converting to grayscale)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        raise RuntimeError(f"Failed to extract text from Image (OCR): {str(e)}")
