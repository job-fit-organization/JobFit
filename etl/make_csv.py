import csv
import json
from pathlib import Path

def load_from_json(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        print("파일을 찾을 수 없습니다.")
        return None

def make_csv(rows, filename):
    out = Path(filename)
    with out.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["step", "topic", "objectives", "key_contents", "urls"])
        writer.writeheader()
        writer.writerows(rows)

if __name__ == "__main__":
    make_csv(load_from_json("postgresql_curriculum.json"), "postgresql_curriculum.csv")