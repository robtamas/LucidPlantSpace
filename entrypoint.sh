#!/bin/bash
set -e

echo "Entry point received command: $1"

if [ "$1" = "train" ]; then
    shift
    echo "Starting training..."
    python train.py "$@"

    TRAIN_EXIT_CODE=$?
    if [ $TRAIN_EXIT_CODE -eq 0 ]; then
        echo "Training complete! Saving the model to the local directory."
        
        cp /app/runs/detect/train/weights/best.pt /app/models/best.pt
        cp /app/runs/detect/train/weights/last.pt /app/models/last.pt
    else
        echo "Training failed! Exit code: $TRAIN_EXIT_CODE"
    fi

elif [ "$1" = "serve" ]; then
    shift
    echo "Starting API server..."
    exec uvicorn app:app --host 0.0.0.0 --port 8000
else
    echo "Command not recognized. Use 'train' or 'serve'."
    exit 1
fi
