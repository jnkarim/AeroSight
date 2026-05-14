from pydantic import BaseModel
from typing import List


class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: List[float]


class ImagePredictionResponse(BaseModel):
    human_count: int
    car_count: int
    inference_time_ms: float
    detections: List[Detection]
    annotated_image_base64: str