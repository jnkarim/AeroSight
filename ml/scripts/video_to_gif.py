import argparse
from pathlib import Path
import imageio.v2 as imageio
import cv2


def video_to_gif(
    video_path: str,
    output_gif: str,
    max_frames: int = 80,
    resize_width: int = 720,
    fps: int = 10,
):
    video_path = Path(video_path)
    output_gif = Path(output_gif)

    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    output_gif.parent.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(str(video_path))
    frames = []

    frame_id = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        if frame_id >= max_frames:
            break

        h, w = frame.shape[:2]
        scale = resize_width / w
        new_h = int(h * scale)

        frame = cv2.resize(frame, (resize_width, new_h))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        frames.append(frame)
        frame_id += 1

    cap.release()

    imageio.mimsave(str(output_gif), frames, fps=fps)

    print(f"GIF saved to: {output_gif}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert tracking video to GIF.")

    parser.add_argument("--video", type=str, required=True)
    parser.add_argument("--output", type=str, default="assets/tracking_output.gif")
    parser.add_argument("--max-frames", type=int, default=80)
    parser.add_argument("--width", type=int, default=720)
    parser.add_argument("--fps", type=int, default=10)

    args = parser.parse_args()

    video_to_gif(
        video_path=args.video,
        output_gif=args.output,
        max_frames=args.max_frames,
        resize_width=args.width,
        fps=args.fps,
    )