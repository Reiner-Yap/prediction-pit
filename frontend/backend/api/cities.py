from fastapi import FastAPI
import json

app = FastAPI()

@app.get("/api/cities")
def get_cities():
    cities = [
        {"id": "manila", "name": "Manila", "lat": 14.5995, "lon": 120.9842},
        {"id": "cebu", "name": "Cebu City", "lat": 10.3157, "lon": 123.8854},
        {"id": "davao", "name": "Davao City", "lat": 7.1907, "lon": 125.4553},
        {"id": "baguio", "name": "Baguio City", "lat": 16.4023, "lon": 120.5960},
        {"id": "iloilo", "name": "Iloilo City", "lat": 10.7202, "lon": 122.5621}
    ]

    return {"data": cities, "count": len(cities)}
