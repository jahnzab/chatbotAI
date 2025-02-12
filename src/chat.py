from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pyttsx3
import ollama
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize text-to-speech engine
try:
    engine = pyttsx3.init()
    engine.setProperty('rate', 170)
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error initializing pyttsx3: {str(e)}")

# Define Request Model
class ChatRequest(BaseModel):
    question: str

# LLaMA-3 Chatbot Route
@app.post("/generate/")
async def ask_llama(request: ChatRequest):
    try:
        engine.say(f"You asked: {request.question}")
        engine.runAndWait()
        response = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": request.question}]
        )
        if "message" in response and "content" in response["message"]:
            answer = response["message"]["content"]
        else:
            raise HTTPException(status_code=500, detail="Invalid response from LLaMA-3")
        engine.say(f"Jahan's chatbot says: {answer}")
        engine.runAndWait()
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
