import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Social Media Content Analyzer"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    # Add other configuration as needed

settings = Settings()
