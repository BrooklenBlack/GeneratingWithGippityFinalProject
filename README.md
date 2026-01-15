# GeneratingWithGippityFinalProject

# Code Assistant

AI code generator that uses RAG (Retrieval-Augmented Generation) to create Python code.

## Technology Stack

**Frontend:**
- React with TypeScript
- Axios for API requests

**Backend:**
- FastAPI (Python)
- OpenAI GPT-4o-mini
- BeautifulSoup4 for web scraping
- Python-dotenv for environment management

**Architecture:**
- Retrieval-Augmented Generation (RAG)
- REST API
- Web scraping from Python documentation sites

## What You Need to Download

1. **Python 3.11 or newer**
   - Download from: https://python.org/downloads/
   - Check "Add Python to PATH" when installing

2. **Node.js 18 or newer**
   - Download from: https://nodejs.org/
   - Install with default settings

3. **Git** (if you don't have it)
   - Download from: https://git-scm.com/download/

4. **VS Code** (recommended)
   - Download from: https://code.visualstudio.com/

5. **OpenAI API Key**
   - Go to https://platform.openai.com/signup
   - Create account
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with sk-proj-)

## Setup Instructions

### Step 1: Clone the Project

Open PowerShell and run:
```powershell
git clone https://github.com/BrooklenBlack/GeneratingWithGippityFinalProject.git
cd GeneratingWithGippityFinalProject
```

### Step 2: Set Up Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a file called `.env` in the backend folder (use VS Code):
- Right-click backend folder → New File → name it `.env`
- Add this line (replace with YOUR key):
```
OPENAI_API_KEY=sk-proj-your-key-here
```
- Save the file

### Step 3: Set Up Frontend

Open a NEW PowerShell window:
```powershell
cd GeneratingWithGippityFinalProject/frontend
npm install
```

### Step 4: Run Everything

**Terminal 1 (Backend):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm start
```

Browser should open to http://localhost:3000

## How to Use

1. Type what Python code you want in the text box
2. Click "Generate"
3. Wait a few seconds
4. Your code appears below

## Team

- Brooklen Black - s550697@nwmissouri.edu
- Wyatt Ingraham - s540693@nwmissouri.edu
- Wyatt Morgan - s540549@nwmissouri.edu
