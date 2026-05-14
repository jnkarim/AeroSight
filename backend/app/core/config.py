from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "best.pt"

CLASS_NAMES = {
    0: "human",
    1: "car",
}

DEFAULT_CONFIDENCE = 0.25