from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()

app = FastAPI(title="Code Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def load_web_content(urls):
    content = ""
    for url in urls:
        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            content += soup.get_text()[:2000] + "\n\n"
        except:
            pass
    return content

URLS = [
    "https://www.w3schools.com/python/",
    "https://www.w3schools.com/js/",
]

KNOWLEDGE_BASE = load_web_content(URLS)

class CodeRequest(BaseModel):
    prompt: str
    language: str = "python"

@app.get("/")
async def root():
    return {"message": "RAG Code Assistant"}

@app.post("/api/generate")
async def generate_code(request: CodeRequest):
    augmented_prompt = f"Context:\n{KNOWLEDGE_BASE}\n\nQuery: Write {request.language} code to {request.prompt}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a coding assistant."},
            {"role": "user", "content": augmented_prompt}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    return {"code": response.choices[0].message.content, "language": request.language}