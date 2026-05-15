from pathlib import Path
from ultralytics import YOLO
import argparse


def summarize_tracks(
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

    human_track_ids = set()
    car_track_ids = set()

    results = model.track(
        source=str(video_path),
        tracker="bytetrack.yaml",
        conf=conf,
        imgsz=imgsz,
        iou=0.5,
        persist=True,
        stream=True,
        verbose=False,
    )

    frame_count = 0

    for result in results:
        frame_count += 1

        if result.boxes is None:
            continue

        boxes = result.boxes

        if boxes.id is None:
            continue

        for cls_id, track_id in zip(boxes.cls, boxes.id):
            cls_id = int(cls_id)
            track_id = int(track_id)

            if cls_id == 0:
                human_track_ids.add(track_id)
            elif cls_id == 1:
                car_track_ids.add(track_id)

    print("Tracking Summary")
    print("----------------")
    print(f"Video: {video_path}")
    print(f"Frames processed: {frame_count}")
    print(f"Unique human tracks: {len(human_track_ids)}")
    print(f"Unique car tracks: {len(car_track_ids)}")

    return {
        "frames_processed": frame_count,
        "unique_human_tracks": len(human_track_ids),
        "unique_car_tracks": len(car_track_ids),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Summarize unique ByteTrack IDs.")

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

    summarize_tracks(
        model_path=args.model,
        video_path=args.video,
        conf=args.conf,
        imgsz=args.imgsz,
    )