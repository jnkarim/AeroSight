import cv2
from pathlib import Path

input_path = Path("runs/detect/outputs/tracking/bytetrack_output/demo_video.avi")
output_path = Path("frontend/public/tracking_output.mp4")

if not input_path.exists():
    raise FileNotFoundError(f"Input video not found: {input_path}")

output_path.parent.mkdir(parents=True, exist_ok=True)

cap = cv2.VideoCapture(str(input_path))

if not cap.isOpened():
    raise RuntimeError(f"Could not open video: {input_path}")

fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

if fps <= 0:
    fps = 25

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
writer = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))

frame_count = 0

while True:
    ret, frame = cap.read()

    if not ret:
        break

    writer.write(frame)
    frame_count += 1

cap.release()
writer.release()

print(f"Converted {frame_count} frames")
print(f"Saved to: {output_path}")