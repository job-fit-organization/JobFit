import json
from pathlib import Path

def load_data(json_path: Path) -> dict:
    with open(json_path, encoding="utf-8") as f:
        return json.load(f)