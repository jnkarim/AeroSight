import time
import argparse
from pathlib import Path

import cv2
from ultralytics import YOLO


def measure_fps(
    model_path: str,
    video_path: str,
    conf: float = 0.25,
    imgsz: int = 960,
):
    model_path = Path(model_path)
    video_path = Path(video_path)

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    model = YOLO(str(model_path))
    cap = cv2.VideoCapture(str(video_path))

    frame_count = 0
    start_time = time.time()

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        model(frame, conf=conf, imgsz=imgsz, verbose=False)
        frame_count += 1

    cap.release()

    total_time = time.time() - start_time
    fps = frame_count / total_time if total_time > 0 else 0

    print("FPS Evaluation")
    print("----------------")
    print(f"Video: {video_path}")
    print(f"Frames processed: {frame_count}")
    print(f"Total time: {total_time:.2f} seconds")
    print(f"Average FPS: {fps:.2f}")

    return fps


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Measure YOLO inference FPS on a video.")

    parser.add_argument(
        "--model",
        type=str,
        default="backend/models/best.pt",
        help="Path to trained YOLO model",
    )

    parser.add_argument(
        "--video",
        type=str,
        required=True,
        help="Path to input video",
    )

    parser.add_argument(
        "--conf",
        type=float,
        default=0.25,
        help="Confidence threshold",
    )

    parser.add_argument(
        "--imgsz",
        type=int,
        default=960,
        help="Inference image size",
    )

    args = parser.parse_args()

    measure_fps(
        model_path=args.model,
        video_path=args.video,
        conf=args.conf,
        imgsz=args.imgsz,
    )