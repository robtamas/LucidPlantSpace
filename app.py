from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# Load YOLO model
model = YOLO("/app/models/best.pt")

@app.post("/detect/")
async def detect_objects(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # Perform YOLO detection
        results = model(image)

        # Process results
        detections = []
        for result in results:
            for box in result.boxes:
                detections.append({
                    "class": model.names[int(box.cls)], 
                    "confidence": float(box.conf),
                    "box": box.xyxy.tolist()
                })

        return {"detections": detections}

    except Exception as e:
        return {"error": str(e)}

