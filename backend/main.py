from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import joblib
import numpy as np
import random
import datetime
import json

# Initialize FastAPI app
app = FastAPI(title="Air Quality Prediction API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your ML model
try:
    model = joblib.load("./model/svr_rbf_sample.pkl")
    print("✅ ML Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# AQI labels
AQI_LABELS = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor"
}

# Cities data
CITIES = [
    {"id": "manila", "name": "Manila", "lat": 14.5995, "lon": 120.9842},
    {"id": "cebu", "name": "Cebu City", "lat": 10.3157, "lon": 123.8854},
    {"id": "davao", "name": "Davao City", "lat": 7.1907, "lon": 125.4553},
    {"id": "baguio", "name": "Baguio City", "lat": 16.4023, "lon": 120.5960},
    {"id": "iloilo", "name": "Iloilo City", "lat": 10.7202, "lon": 122.5621}
]

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Air Quality API",
        "model_loaded": model is not None,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# Cities endpoint (from cities.py)
@app.get("/api/cities")
async def get_cities():
    return {"data": CITIES, "count": len(CITIES)}

# City data endpoint (from city_data.py)
@app.get("/api/city_data")
async def get_city_data(cityId: str):
    # Generate time-series for last 48 hours
    now = datetime.datetime.utcnow()
    hours = [now - datetime.timedelta(hours=i) for i in range(48)]
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

# Prediction endpoint (from predict.py)
@app.get("/api/predict")
async def predict_aqi(cityId: str, cityName: str = None):
    if model is None:
        return {
            "error": "Model not loaded",
            "cityId": cityId,
            "cityName": cityName
        }
    
    # Get actual city name if not provided
    if cityName is None:
        city = next((c for c in CITIES if c["id"] == cityId), None)
        cityName = city["name"] if city else "Unknown City"
    
    # Fake sensor input (you'll replace this with real data)
    sample = np.array([[0.4, 5, 18, 30, 3, 20, 40, 1]])
    
    try:
        prediction = model.predict(sample)[0]
        aqi_class = int(round(prediction))
        
        return {
            "cityId": cityId,
            "cityName": cityName,
            "aqi_value": float(prediction),
            "aqi_class": aqi_class,
            "status": AQI_LABELS.get(aqi_class, "Unknown"),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "error": str(e),
            "cityId": cityId,
            "cityName": cityName
        }

# New endpoint for making predictions with custom data
@app.post("/api/predict/custom")
async def predict_custom(data: dict):
    if model is None:
        return {"error": "Model not loaded"}
    
    try:
        # Extract features from request
        # Adjust this based on your model's input requirements
        features = data.get("features", [0.4, 5, 18, 30, 3, 20, 40, 1])
        
        # Convert to numpy array and reshape
        sample = np.array([features])
        
        # Make prediction
        prediction = model.predict(sample)[0]
        aqi_class = int(round(prediction))
        
        return {
            "success": True,
            "prediction": float(prediction),
            "aqi_class": aqi_class,
            "status": AQI_LABELS.get(aqi_class, "Unknown"),
            "input_features": features
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# Get model info
@app.get("/api/model/info")
async def get_model_info():
    if model is None:
        return {"loaded": False}
    
    return {
        "loaded": True,
        "type": str(type(model)),
        "features_required": 8,  # Update based on your model
        "description": "SVR RBF Model for AQI Prediction"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)