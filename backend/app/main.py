from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from contextlib import asynccontextmanager  # 👈 صح
from app.services.preprocessing import preprocess_input

class PredictionRequest(BaseModel):
    location: str
    carpet_area_sqft: float
    floor_num: int
    bathroom: int
    balcony: int
    furnishing: str
    transaction: str
    ownership: str
    facing: str

@asynccontextmanager  # 👈 صح
async def lifespan(app: FastAPI):
    app.state.model = joblib.load("models/house_price.pkl")
    print("✅ Model loaded!")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "House Price API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(request: PredictionRequest):
    df = preprocess_input(request.dict())
    prediction = app.state.model.predict(df)
    return {"predicted_price": float(prediction[0])}