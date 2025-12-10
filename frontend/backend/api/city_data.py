from fastapi import FastAPI, Query
import random
import datetime

app = FastAPI()

@app.get("/api/city_data")
def get_city_data(cityId: str = Query(...)):
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
