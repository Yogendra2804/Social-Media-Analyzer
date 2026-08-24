import google.generativeai as genai
from core.config import settings

def analyze_content(text: str) -> dict:
    if settings.GEMINI_API_KEY:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            prompt = f"""
            You are an expert Social Media Manager and Content Strategist.
            Analyze the following social media post or document content and provide:
            1. Overall Assessment (tone, clarity, hook strength, call-to-action)
            2. Engagement Suggestions (actionable ways to improve it)
            3. Suggested Rewrite (an improved version)
            4. Hashtags (3-5 relevant hashtags)

            Format the response clearly using Markdown.

            Content to analyze:
            {text}
            """
            
            response = model.generate_content(prompt)
            return {
                "method": "ai",
                "result": response.text
            }
        except Exception as e:
            print(f"AI Analysis failed, falling back to heuristics. Error: {e}")
            return fallback_analysis(text)
    else:
        return fallback_analysis(text)

def fallback_analysis(text: str) -> dict:
    word_count = len(text.split())
    has_question = "?" in text
    has_exclamation = "!" in text
    has_hashtags = "#" in text
    has_link = "http" in text or "www." in text
    
    suggestions = []
    
    if word_count > 100:
        suggestions.append("This post is quite long. Consider breaking it down into smaller, punchier sentences or bullet points.")
    elif word_count < 10:
        suggestions.append("This post is very short. Ensure it provides enough context or value to the reader.")
        
    if not has_question:
        suggestions.append("Consider adding a question to the end of your post to encourage comments and engagement.")
        
    if not has_hashtags:
        suggestions.append("Add 3-5 relevant hashtags to increase discoverability.")
        
    if not has_link:
        suggestions.append("Consider adding a Call-To-Action (CTA) link if you want to drive traffic somewhere.")
        
    if not has_exclamation:
        suggestions.append("Consider injecting some enthusiasm with an exclamation mark, where appropriate.")
        
    if not suggestions:
        suggestions.append("Your content structure looks decent! Keep testing different formats with your audience.")
        
    markdown_result = f"""
### Overall Assessment
- **Word count**: {word_count}
- **Tone check**: Heuristics indicate a standard informative tone.
- **Link presence**: {'Yes' if has_link else 'No'}

### Engagement Suggestions
{chr(10).join(f"- {s}" for s in suggestions)}

### Note
*This is a fallback automated heuristic analysis because the AI service is currently unavailable.*
"""

    return {
        "method": "heuristic",
        "result": markdown_result.strip()
    }
