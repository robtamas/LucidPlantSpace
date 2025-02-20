# Use an official Python image
FROM python:3.10

WORKDIR /app

# Install system dependencies (for OpenCV and OpenGL support)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

COPY models/best.pt /app/models/best.pt

# Copy entrypoint script and ensure it's executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Expose API port (if needed when serving)
EXPOSE 8000

# Default command: training mode
CMD ["train", "--data=/app/data/data.yaml", "--model=yolov8n.pt", "--epochs=10", "--imgsz=640"]

