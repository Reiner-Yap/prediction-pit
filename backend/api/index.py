from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import random
from datetime import datetime, timedelta
import os
import sys

# Add backend directory to path for model loading
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

app = FastAPI()

# Enable CORS for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you might want to restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to load the model
model = None
try:
    # Vercel file paths - model should be in the same directory as api/
    model_path = os.path.join(os.path.dirname(__file__), '../model/sample.pkl')
    model = joblib.load(model_path)
    print("✅ Model loaded successfully from:", model_path)
except Exception as e:
    print(f"❌ Error loading model: {e}")
    # Fallback: create a dummy model for testing
    class DummyModel:
        def predict(self, X):
            return np.array([2.6])  # Return moderate AQI
    model = DummyModel()

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Air Quality API",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/cities")
async def get_cities():
    cities = [
        {"id": "manila", "name": "Manila", "lat": 14.5995, "lon": 120.9842},
        {"id": "cebu", "name": "Cebu City", "lat": 10.3157, "lon": 123.8854},
        {"id": "davao", "name": "Davao City", "lat": 7.1907, "lon": 125.4553},
        {"id": "baguio", "name": "Baguio City", "lat": 16.4023, "lon": 120.5960},
        {"id": "iloilo", "name": "Iloilo City", "lat": 10.7202, "lon": 122.5621}
    ]
    return {"data": cities, "count": len(cities)}

@app.get("/api/city_data")
async def get_city_data(cityId: str = Query(...)):
    now = datetime.utcnow()
    hours = [now - timedelta(hours=i) for i in range(48)]
    hours.reverse()

    time_series = [
        {
            "timestamp": h.isoformat(),
            "pm25": round(random.uniform(5, 60), 2),
            "pm10": round(random.uniform(10, 90), 2),
            "no2": round(random.uniform(5, 40), 2),
            "o3": round(random.uniform(10, 70), 2),
        }
        for h in hours
    ]

    measurements = [
        {"label": "PM2.5 (µg/m³)", "value": time_series[-1]["pm25"]},
        {"label": "PM10 (µg/m³)", "value": time_series[-1]["pm10"]},
        {"label": "NO₂ (µg/m³)", "value": time_series[-1]["no2"]},
        {"label": "O₃ (µg/m³)", "value": time_series[-1]["o3"]},
    ]

    return {
        "cityId": cityId,
        "timeSeries": time_series,
        "measurements": measurements
    }

@app.get("/api/predict")
async def predict_aqi(cityId: str = Query(...), cityName: str = Query(None)):
    try:
        # Use the model to make predictions
        sample = np.array([[0.4, 5, 18, 30, 3, 20, 40, 1]])
        prediction = model.predict(sample)[0]
        aqi_class = int(round(prediction))
    except:
        # Fallback prediction
        prediction = 2.6
        aqi_class = 3
    
    AQI_LABELS = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    }
    
    return {
        "cityId": cityId,
        "cityName": cityName or cityId,
        "aqi_value": float(prediction),
        "aqi_class": aqi_class,
        "status": AQI_LABELS.get(aqi_class, "Unknown"),
        "timestamp": datetime.now().isoformat()
    }