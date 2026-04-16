import re
import csv
from pathlib import Path

INPUT_PATH = './README.md'
OUTPUT_PATH = 'products.csv'

def extract_products_section(text: str) -> str:
    """
    README 전체 텍스트에서
    '## Products' ~ 다음 '## ' 헤더 전까지를 추출
    """
    pattern = r"## Products.*?\n(.*?)(?=\n## |\Z)"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        raise ValueError("'## Products' 섹션을 찾을 수 없습니다.")
    return match.group(1)

def is_bullet(line: str) -> bool:
    return re.match(r"^\s*-\s+", line) is not None

def get_indent_space_len(line: str) -> int:
    # 들여쓰기된 길이 리턴
    return len(line) - len(line.lstrip(" "))

def parse_bullet_content(line: str) -> str:
    """
    '- 내용'을 '내용'으로 치환해서 '내용'만 추출
    """
    return re.sub(r"^\s*-\s+", "", line).strip()

def parse_products_to_rows(section_text: str):
    """
    Products 섹션을 [name, url, desc] row 목록으로 변환

    규칙:
    - 최상위 bullet(예: SQL, Docker)를 현재 기술명(name)으로 저장
    - 그보다 더 깊은 들여쓰기의 bullet 중 URL인 항목은 현재 기술명으로 row 생성
    - URL이 아닌 하위 카테고리(Kaggle learn, pandas 등)는 무시하고 이후 더 깊은 URL들도 마지막 상위 기술명에 계속 연결
    """
    rows = []
    current_name = None
    top_level_indent = None

    for raw_line in section_text.splitlines():
        line = raw_line.rstrip()

        # 빈 줄이면 다음 줄로
        if not line.strip():
            continue

        # bullet으로 시작하지 않으면 다음 줄로
        if not is_bullet(line):
            continue

        indent = get_indent_space_len(line)
        content = parse_bullet_content(line)

        # 첫 bullet의 indent를 top-level 기준으로 사용
        if top_level_indent is None:
            top_level_indent = indent

        # 최상위 기술명 설정
        if indent == top_level_indent and not content.startswith('http'):
            current_name = content
            continue

        # 하위 bullet 중 URL이면 row 추가
        if indent > top_level_indent and content.startswith('http'):
            if current_name is None:
                continue
            parts = content.split("->", 1)
            url = parts[0].strip()
            desc = parts[1].strip() if len(parts) > 1 else ""

            rows.append([current_name, url, desc])

    return rows

def save_rows_to_csv(rows, output_path: str):
    with open(output_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["name", "url", "desc"])
        writer.writerows(rows)

if __name__ == '__main__':
    text = Path(INPUT_PATH).read_text(encoding='utf-8')
    section = extract_products_section(text)
    rows = parse_products_to_rows(section)
    save_rows_to_csv(rows, OUTPUT_PATH)