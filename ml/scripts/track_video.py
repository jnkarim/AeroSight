from pathlib import Path
from ultralytics import YOLO
import argparse


def run_tracking(
    model_path: str,
    source_path: str,
    output_project: str = "outputs/tracking",
    output_name: str = "bytetrack_output",
    conf: float = 0.25,
    imgsz: int = 960,
):
    model_path = Path(model_path)
    source_path = Path(source_path)

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    if not source_path.exists():
        raise FileNotFoundError(f"Video source not found: {source_path}")

    model = YOLO(str(model_path))

    results = model.track(
        source=str(source_path),
        tracker="bytetrack.yaml",
        conf=conf,
        imgsz=imgsz,
        iou=0.5,
        persist=True,
        save=True,
        project=output_project,
        name=output_name,
    )

    print("Tracking completed.")
    print(f"Results saved to: {Path(output_project) / output_name}")

    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run ByteTrack tracking with YOLO11 model.")

    parser.add_argument(
        "--model",
        type=str,
        default="backend/models/best.pt",
        help="Path to trained YOLO model",
    )

    parser.add_argument(
        "--source",
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

    run_tracking(
        model_path=args.model,
        source_path=args.source,
        conf=args.conf,
        imgsz=args.imgsz,
    )