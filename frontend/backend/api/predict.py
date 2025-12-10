from fastapi import FastAPI, Query
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

model = joblib.load("./model/svr_rbf_sample.pkl")

AQI_LABELS = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor"
}

@app.get("/api/predict")
def predict(cityId: str = Query(...), cityName: str = Query(...)):
    # Fake sensor input (replace with real later)
    sample = np.array([[0.4, 5, 18, 30, 3, 20, 40, 1]])

    prediction = model.predict(sample)[0]
    aqi_class = int(round(prediction))

    return {
        "cityId": cityId,
        "cityName": cityName,
        "aqi_value": float(prediction),
        "aqi_class": aqi_class,
        "status": AQI_LABELS.get(aqi_class, "Unknown")
    }
