import pandas as pd
import json

def load_locations():
    try:
        with open("models/locations.json", "r") as f:
            return set(json.load(f))
    except Exception:
        return set()

ALLOWED_LOCATIONS = load_locations()

def preprocess_input(data):
    location = data.get("location", "")
    if location not in ALLOWED_LOCATIONS:
        location = "Other"

    df = pd.DataFrame([{
        # الأعمدة الكابيتال
        "Bathroom": int(data.get("bathroom", 1)),
        "Balcony": int(data.get("balcony", 0)),
        "Ownership": data.get("ownership", "Freehold"),
        "Transaction": data.get("transaction", "Resale"),
        "Furnishing": data.get("furnishing", "Unfurnished"),
        "Facing": data.get("facing", "North"),
        "Title": data.get("title", "Apartment"),
        "Status": data.get("status", "Ready to move"),
        "Index": int(data.get("index", 0)),
        
        # الأعمدة السمول (ضفنا facing سمول هنا للحل النهائي)
        "facing": data.get("facing", "North"),
        "overlooking": data.get("overlooking", "Main Road"),
        "location": location,
        "carpet_area_sqft": float(data.get("carpet_area_sqft", 0)),
        "floor_num": int(data.get("floor_num", 1)),
        "Description": data.get("description", "Apartment for sale")
    }])

    return df