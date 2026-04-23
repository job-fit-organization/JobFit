from pathlib import Path

from common.vectordb.pgvector import create_pgvector_db
from common.utils import load_data

import warnings

warnings.filterwarnings('ignore')

def main():
    data_dir = Path(__file__).parent / "data"
    json_files = data_dir.glob("*.json")

    total_chunks = 0
    total_techs = 0
    for json_file in json_files:
        data = load_data(json_file)
        name = data.get("tech", json_file.stem).lower()
        urls = data.get("urls", [])
        curriculum = data.get("curriculum", [])

        print(f"\n{'─'*65}")
        print(f"📚 [{name.upper()}]  steps={len(curriculum)}, urls={len(urls)}")
        print(f"{'─'*65}")

        n = create_pgvector_db(name, urls)
        total_chunks += n
        total_techs += 1
        print(f"✅ PGVector '{name}' 저장 완료 ({n}청크)")

    print("\n" + "=" * 65)
    print(f"🎉 인덱싱 완료!")
    print(f"   처리 기술  : {total_techs}개")
    print(f"   총 청크 수 : {total_chunks}개")
    print("=" * 65)

if __name__ == "__main__":
    main()