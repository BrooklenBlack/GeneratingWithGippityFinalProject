from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from pathlib import Path
import json
import re

load_dotenv()

app = FastAPI(title="Code Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
    "https://docs.python.org/3/tutorial/",
    "https://realpython.com/python-basics/",
    "https://www.geeksforgeeks.org/python-programming-language/",
    "https://www.programiz.com/python-programming",
    "https://www.geeksforgeeks.org/java/java",
    "https://www.w3schools.com/java/",
    "https://www.codecademy.com/learn/learn-java",
    "https://www.learnjavaonline.org/#google_vignette",
    "https://learn.oracle.com/ols/learning-path/oracle-java-foundations/88323/79726"
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
    augmented_prompt = f"""Context:\n{KNOWLEDGE_BASE}\n\nQuery: Write {request.language} code to {request.prompt}
    
    Respond ONLY in valid JSON with this exact format:

    {{
        "code": "<generated code here>",
        "explanation": "<explanation of the code here>",
        "output": "<expected output here>"
    }}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a coding assistant tha can write code in {request.language}"},
            {"role": "user", "content": augmented_prompt}
        ],
        temperature=0.3,
        max_tokens=700
    )

    raw_content = response.choices[0].message.content
    print("RAW MODEL OUTPUT:", raw_content) 

    clean_content = re.sub(r"^```json\s*|\s*```$", "", raw_content.strip(), flags=re.MULTILINE)

    try:
        parsed = json.loads(clean_content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response from language model.")
    
    return {
        "code": parsed.get("code", ""),
        "explanation": parsed.get("explanation", ""),
        "output": parsed.get("output", "")
    } 