from fastapi import FastAPI
from database import Base, engine
from routers import rules

app = FastAPI()

# Initialize database
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(rules.router, prefix="/api", tags=["rules"])