from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image, ImageOps
from fastapi.responses import StreamingResponse
from datetime import datetime
import io
import base64
import cv2

app = FastAPI()

# Load YOLO model
model = YOLO("/app/models/best.pt")

@app.post("/detect/")
async def detect_objects(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # # Correct image orientation based on EXIF data
        image = ImageOps.exif_transpose(image)

        # Ensure image is in RGB mode (YOLO might not work well with RGBA/other modes)
        if image.mode != "RGB":
            image = image.convert("RGB")


        # Perform YOLO detection
        results = model(image)

        confidence_threshold = 0.5 # Set confidence threshold for detection
        # desired_class = "bowl" # Set desired class for detection
        current_time = datetime.now().isoformat()

        # All detections with confidence above threshold
        result = results[0]

        action = {"title": "All spill response and cleanup actions must adhere to the Occupational Safety and Health regulations", "description": "Containment and Cleanup", "steps": ["Use appropriate personal protective equipment (PPE) before handling any spilled substance.", "Contain the spill using absorbent materials, barriers, or spill containment kits.", "Clean the area using approved methods, ensuring proper disposal of contaminated materials."]}

        # All detections with confidence above threshold
        boxes = []
        details = []
        for box in result.boxes:
            if box.conf >= confidence_threshold:
                details.append({"confidence": box.conf.item(), "type": model.names[int(box.cls)], "date": current_time, "action": action})
                boxes.append(box)

        result.boxes = boxes

        # Plot the results on the image
        annotated_image = result.plot()  # result.plot() should return a NumPy array
        annotated_pil_image = Image.fromarray(cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB))

        # Save the annotated image to a byte stream
        img_byte_arr = io.BytesIO()
        annotated_pil_image.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

        # Encode image to base64
        encoded_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

        # Create JSON response
        response = {
            "details": details,
            "image": encoded_image
        }

        return response

    except Exception as e:
        return {"error": str(e)}

