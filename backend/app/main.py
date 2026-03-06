from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth_owner, auth_reviewer, reviewers, preferences
from .database import Base, engine

from . import models

app = FastAPI(title="Tastlytics")

# Frontend is on http://localhost:3006
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    # Keeps backend minimal: auto-creates tables if missing
    Base.metadata.create_all(bind=engine)

app.include_router(auth_owner.router)
app.include_router(auth_reviewer.router)
app.include_router(reviewers.router)

@app.get("/")
def health():
    return {"status": "ok"}