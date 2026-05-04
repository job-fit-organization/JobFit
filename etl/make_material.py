import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from common.utils import load_data
from common.llm_pipeline.workflow import build_graph

def main():
    etl_dir = Path(__file__).parent
    data_files = sorted(etl_dir.joinpath("data").glob("*.json"))

    graph = build_graph()
    for file_idx, data_file in enumerate(data_files, start=1):
        data = load_data(data_file)
        skill_name = data.get("skill", data_file.stem).lower()
        level = data.get("level", "beginner")  # "beginner" 또는 "advanced"
        curriculum = data.get("curriculum", [])
        all_urls = data.get("urls", [])

        print("=" * 60)
        print(f"🚀 [{file_idx}/{len(data_files)}] 강의자료 생성 파이프라인 시작")
        print(f"   기술명  : {skill_name}")
        print(f"   수준    : {level}")
        print(f"   데이터  : {data_file.name}")
        print(f"   총 Step : {len(curriculum)}")
        print(f"   총 URL  : {len(all_urls)}")
        print(f"   컬렉션  : {skill_name}  (기술 단위)")
        print(f"   생성 LLM: {os.getenv('GENERATE_MODEL', 'gpt-5.4-nano')}")
        print(f"   검수 LLM: {os.getenv('REVIEW_MODEL', 'gpt-5.4-mini')}")
        print("=" * 60)

        for item in curriculum:
            step_num = str(item["step"])

            print(f"\n{'─'*60}")
            print(f"📚 Step {step_num}: {item['topic']}")
            print(f"{'─'*60}")

            initial_state = {
                "skill_name": skill_name,
                "level": level,
                "step": step_num,
                "topic": item["topic"],
                "objectives": item["objectives"],
                "key_contents": item["key_contents"],
                "urls": all_urls,  # 기술 전체 URL (프롬프트의 참고 링크 섹션용)
                "material": "",
                "quiz": [],
                "review": "",
                "skip_review": False
            }

            try:
                graph.invoke(initial_state)
                print(f"✅ Step {step_num} 완료!")
            except Exception as e:
                print(f"❌ Step {step_num} 실패: {e}")
                import traceback
                traceback.print_exc()

        print("\n" + "=" * 60)
        print(f"🎉 [{file_idx}/{len(data_files)}] {skill_name} ({level}) 완료! 결과물 위치: etl/data/{skill_name}/{level}/")
        print("=" * 60)

    if len(data_files) > 1:
        print(f"\n✨ 전체 {len(data_files)}개 파일 처리 완료!")

if __name__ == "__main__":
    main()