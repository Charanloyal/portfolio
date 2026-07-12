import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events startup/shutdown."""
    print("Portfolio Service Live.")
    yield
    print("Portfolio Service Offline.")

app = FastAPI(
    title="Charan Kumar Reddy - Developer Portfolio Hub",
    description="Unified senior portfolio showcasing advanced systems, AI/ML, and Fintech engineering.",
    version="1.0.0",
    lifespan=lifespan
)

from pydantic import BaseModel, Field

# Mount static and templates folders
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/fraud-detector", StaticFiles(directory="app/static/realtime-fraud-detector", html=True), name="fraud-detector")
app.mount("/ab-testing", StaticFiles(directory="app/static/ab-testing-platform", html=True), name="ab-testing")
templates = Jinja2Templates(directory="app/templates")

# Contact Form Schema
class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="Sender Name")
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", description="Sender Email Address")
    message: str = Field(..., min_length=10, max_length=1000, description="Message content")

@app.get("/", response_class=HTMLResponse)
async def serve_portfolio(request: Request):
    """Renders the main developer portfolio hub."""
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/api/v1/contact")
async def handle_contact_message(payload: ContactMessage):
    """
    Handles recruiter and collaborator contact requests.
    Validates payload and simulates email dispatching.
    """
    try:
        # Simulate background task to send email
        print(f"SENDING CONTACT EMAIL: From={payload.name} ({payload.email}) Message={payload.message}")
        return JSONResponse(
            content={
                "status": "success",
                "message": "Thank you for reaching out, Charan Kumar Reddy will get back to you shortly!"
            },
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch contact request: {str(e)}"
        )
