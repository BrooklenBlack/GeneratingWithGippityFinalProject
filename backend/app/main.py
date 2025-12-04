from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import time

app = FastAPI(title="Code Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_URL = "https://api.huggingface.co/models/Salesforce/codegen-350M-mono"

class CodeRequest(BaseModel):
    prompt: str
    language: str = "python"

@app.get("/")
async def root():
    return {"message": "Code Assistant API is running!"}

@app.post("/api/generate")
async def generate_code(request: CodeRequest):
    try:
        full_prompt = f"# {request.language}\n# {request.prompt}\n"
        
        response = requests.post(
            API_URL,
            headers={"Content-Type": "application/json"},
            json={"inputs": full_prompt, "parameters": {"max_length": 200, "temperature": 0.7}}
        )
        
        if response.status_code == 503:
            time.sleep(20)
            response = requests.post(
                API_URL,
                headers={"Content-Type": "application/json"},
                json={"inputs": full_prompt, "parameters": {"max_length": 200, "temperature": 0.7}}
            )
        
        if response.status_code == 200:
            result = response.json()
            generated_code = result[0]['generated_text'] if isinstance(result, list) else result.get('generated_text', '')
            return {"code": generated_code, "language": request.language}
        else:
            raise HTTPException(status_code=500, detail=f"Hugging Face API error: {response.text}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))