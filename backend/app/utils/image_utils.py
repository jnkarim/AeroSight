import base64
import cv2
import numpy as np


def read_image_from_bytes(file_bytes: bytes):
    np_arr = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Invalid image file")

    return image


def image_to_base64(image) -> str:
    success, buffer = cv2.imencode(".jpg", image)

    if not success:
        raise ValueError("Failed to encode image")

    return base64.b64encode(buffer).decode("utf-8")