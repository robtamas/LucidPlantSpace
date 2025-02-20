from ultralytics import YOLO
import sys
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Train YOLO model")
    parser.add_argument("--data", type=str, default="/app/data/data.yaml", help="Path to data.yaml")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Pretrained model to start with")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Image size")
    return parser.parse_args()

def main():
    args = parse_args()
    try:
        model = YOLO(args.model)
        model.train(data=args.data, epochs=args.epochs, imgsz=args.imgsz)
    except Exception as e:
        print(f"Training failed with error: {e}", file=sys.stderr)
        sys.exit(1)  # Non-zero exit code to indicate failure

if __name__ == "__main__":
    main()
