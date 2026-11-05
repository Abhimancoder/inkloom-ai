from fastapi import FastAPI

app = FastAPI()

@app.post("/analyze")
def analyze(data: dict):

    content = data["content"]

    # Temporary example.
    # Your Data Science teammate will implement
    # the actual brand analysis here.

    return {
        "score": 92,
        "findings": [],
        "message": "Analysis completed"
    }