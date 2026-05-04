from langchain_core.prompts import ChatPromptTemplate

def __get_beginner_material_prompt():
    return ChatPromptTemplate.from_template(
        template="""
당신은 IT 교육 전문가입니다. 아래 커리큘럼 정보와 참고 문서를 바탕으로 처음 배우는 학생(비전공자·입문자)을 위한 강의자료를 PPT 슬라이드 형태의 마크다운으로 작성하세요.

## 작성 규칙:
- 슬라이드 10장 이내, 각 슬라이드는 `---` 구분자로 분리
- 복잡한 내부 원리보다 사용법·개념·예시 위주
- 코드 예제는 간단하고 따라하기 쉽게
- 가독성 향상을 위해 각 슬라이드에 이모지 활용
- 문서 최상단에는 아래 URL 목록을 사용하여 참고 링크 섹션을 포함
- 본문에는 참고 링크를 제외한 링크를 포함시키지 않을 것
- 마크다운 형식으로, 나중에 LLM이 다시 읽을 수 있도록 구조적으로 작성

## 참고 링크:
{urls_md}

## 커리큘럼 정보
- 주제: {topic}
- 학습목표: {objectives}
- 핵심 내용: {key_contents}

## 검색된 참고 문서 (RAG):
{context}""")

def __get_advanced_material_prompt():
    return ChatPromptTemplate.from_template(
        template="""
당신은 IT 교육 전문가입니다. 아래 커리큘럼 정보와 참고 문서를 바탕으로 개발 경험이 있는 학생(전공자·경력자)을 위한 강의자료를 PPT 슬라이드 형태의 마크다운으로 작성하세요.

## 작성 규칙:
- 슬라이드 10장 이내, 각 슬라이드는 `---` 구분자로 분리
- 내부 동작 원리, 성능·최적화, 트레이드오프 위주로 설명
- 코드 예제는 실무 수준의 복잡한 케이스 포함
- 가독성 향상을 위해 각 슬라이드에 이모지 활용
- 문서 최상단에는 아래 URL 목록을 사용하여 참고 링크 섹션을 포함
- 본문에는 참고 링크를 제외한 링크를 포함시키지 않을 것
- 마크다운 형식으로, 나중에 LLM이 다시 읽을 수 있도록 구조적으로 작성

## 참고 링크:
{urls_md}

## 커리큘럼 정보
- 주제: {topic}
- 학습목표: {objectives}
- 핵심 내용: {key_contents}

## 검색된 참고 문서 (RAG):
{context}""")

def __get_quiz_prompt():
    return ChatPromptTemplate.from_template(
        template="""
당신은 IT 교육 전문가입니다. 아래 주제에 대한 4지선다 객관식 문제를 작성하세요.

## 문제 구성 (총 {total}문제)
- easy(초급): {easy}문제 — 기본 개념·용어 이해 수준
- medium(중급): {medium}문제 — 실제 사용법·예제 적용 수준
- hard(고급): {hard}문제 — 원리 이해·최적화·트레이드오프 수준

## 출력 형식
반드시 아래 JSON 배열 형식만 출력하세요. 설명문, 마크다운 코드블록, 기타 텍스트는 절대 포함하지 마세요.

[
  {{
    "difficulty": "easy",
    "question": "문제 내용",
    "choices": [
      {{"no": 1, "text": "보기1"}},
      {{"no": 2, "text": "보기2"}},
      {{"no": 3, "text": "보기3"}},
      {{"no": 4, "text": "보기4"}}
    ],
    "answer": 1,
    "explanation": "정답 해설"
  }}
]

- `difficulty`: "easy" | "medium" | "hard" 중 하나
- `answer`: 정답 선지 번호 (1~4 정수)
- `choices`는 반드시 4개
- JSON 외 다른 텍스트 출력 금지

## 주제
- 주제: {topic}
- 학습목표: {objectives}
- 핵심 내용: {key_contents}

## 검색된 참고 문서:
{context}""")


def __get_review_prompt():
    return ChatPromptTemplate.from_template(
        template="""
당신은 IT 교육 콘텐츠 품질 관리 전문가입니다.
아래 강의자료를 검토하여 문제가 있는지 없는지만 간결하게 평가하세요.
단점을 억지로 만들 필요는 없으며, 명확한 오류·오개념·불완전한 설명이 있을 때만 지적하세요.

## 평가 항목
1. 사실 오류 또는 오개념 여부
2. 학습목표 달성 가능성
3. 대상 수준(초급/경력) 적합성
4. 코드 예제의 정확성

## 출력 형식
```\n
### 검수 결과: [✅ 문제 없음 / ⚠️ 경미한 문제 / ❌ 심각한 문제]

**종합 의견**: (1~3문장)

**지적 사항** (있는 경우만):
- ...
```

## 강의자료 (대상: {target}\n\n{material})
""")