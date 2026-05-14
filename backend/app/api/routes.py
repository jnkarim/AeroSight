from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.core.config import CLASS_NAMES, DEFAULT_CONFIDENCE
from app.services.detector import detector_service
from app.utils.image_utils import read_image_from_bytes

router = APIRouter()


@router.get("/")
def root():
    return {
        "message": "SkyVision API is running",
        "docs": "/docs",
    }


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": detector_service.is_model_loaded(),
    }


@router.get("/model-info")
def model_info():
    return {
        "model": "YOLO11",
        "task": "human and car detection",
        "classes": CLASS_NAMES,
        "default_confidence": DEFAULT_CONFIDENCE,
    }


@router.post("/predict/image")
async def predict_image(
    file: UploadFile = File(...),
    confidence: float = Form(DEFAULT_CONFIDENCE),
):
    try:
        file_bytes = await file.read()
        image = read_image_from_bytes(file_bytes)

        result = detector_service.predict_image(
            image=image,
            confidence=confidence,
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))