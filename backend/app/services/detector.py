import time
import cv2
from ultralytics import YOLO

from app.core.config import MODEL_PATH, CLASS_NAMES, DEFAULT_CONFIDENCE
from app.utils.image_utils import image_to_base64


class DetectorService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        if not MODEL_PATH.exists():
            print(f"Model not found at {MODEL_PATH}")
            self.model = None
            return

        self.model = YOLO(str(MODEL_PATH))
        print("YOLO model loaded successfully")

    def is_model_loaded(self):
        return self.model is not None

    def predict_image(self, image, confidence: float = DEFAULT_CONFIDENCE):
        if self.model is None:
            raise RuntimeError("Model is not loaded. Place best.pt inside backend/models/")

        start_time = time.time()

        results = self.model(image, conf=confidence, imgsz=416, verbose=False)

        result = results[0]

        human_count = 0
        car_count = 0
        detections = []

        annotated = image.copy()

        for box in result.boxes:
            class_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(float, box.xyxy[0])

            class_name = CLASS_NAMES.get(class_id, "unknown")

            if class_id == 0:
                human_count += 1
            elif class_id == 1:
                car_count += 1

            detections.append({
                "class_id": class_id,
                "class_name": class_name,
                "confidence": round(conf, 4),
                "bbox": [round(x1, 2), round(y1, 2), round(x2, 2), round(y2, 2)],
            })

            color = (0, 255, 0) if class_id == 0 else (255, 0, 0)

            cv2.rectangle(
                annotated,
                (int(x1), int(y1)),
                (int(x2), int(y2)),
                color,
                2,
            )

            label = f"{class_name} {conf:.2f}"
            cv2.putText(
                annotated,
                label,
                (int(x1), max(int(y1) - 8, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                2,
            )

        summary = f"Humans: {human_count} | Cars: {car_count}"
        cv2.putText(
            annotated,
            summary,
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            (0, 0, 255),
            2,
        )

        inference_time_ms = (time.time() - start_time) * 1000

        return {
            "human_count": human_count,
            "car_count": car_count,
            "inference_time_ms": round(inference_time_ms, 2),
            "detections": detections,
            "annotated_image_base64": image_to_base64(annotated),
        }


detector_service = DetectorService()