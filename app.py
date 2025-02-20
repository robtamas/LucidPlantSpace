from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
from fastapi.responses import StreamingResponse
from datetime import datetime
import io
import base64

app = FastAPI()

# Load YOLO model
model = YOLO("yolov8n.pt")  # Default YOLOv8 model

@app.post("/detect/")
async def detect_objects(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # Perform YOLO detection
        results = model(image)

        confidence_threshold = 0.5 # Set confidence threshold for detection
        desired_class = "bowl" # Set desired class for detection
        current_time = datetime.now().isoformat()

        # All detections with confidence above threshold
        result = results[0]

        # All detections with confidence above threshold
        boxes = []
        details = []
        for box in result.boxes:
            if box.conf >= confidence_threshold:
                details.append({"confidence": box.conf.item(), "type": model.names[int(box.cls)], "date": current_time, "action": "Clean it up mate!"})
                boxes.append(box)

        result.boxes = boxes

        # Plot the results on the image
        annotated_image = result.plot()  # result.plot() should return a NumPy array
        annotated_pil_image = Image.fromarray(annotated_image)

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

