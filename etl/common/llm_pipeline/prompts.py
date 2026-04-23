from langchain_core.prompts import ChatPromptTemplate

def __get_beginner_material_prompt():
    return ChatPromptTemplate.from_template(
        template="""
당신은 IT 교육 전문가입니다. 아래 커리큘럼 정보와 참고 문서를 바탕으로 처음 배우는 학생(비전공자·입문자)을 위한 강의자료를 PPT 슬라이드 형태의 마크다운으로 작성하세요.

## 작성 규칙:
- 슬라이드 10장 이내, 각 슬라이드는 `---` 구분자로 분리
- 복잡한 내부 원리보다 **사용법·개념·예시** 위주
- 코드 예제는 간단하고 따라하기 쉽게
- 가독성 향상을 위해 각 슬라이드에 이모지 활용
- 문서 최상단에 참고 링크 섹션 포함 (아래 URL 목록 사용)
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
- 문서 최상단에 참고 링크 섹션 포함 (아래 URL 목록 사용)
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
- 🟢 초급 문제: {easy}문제 — 기본 개념·용어 이해 수준
- 🟡 중급 문제: {medium}문제 — 실제 사용법·예제 적용 수준
- 🔴 고급 문제: {hard}문제 — 원리 이해·최적화·트레이드오프 수준

## 형식 (마크다운)
```
## 🟢 초급 문제

### Q1. 문제 내용
1) 보기1
2) 보기2
3) 보기3
4) 보기4

<details><summary>정답 보기</summary>

정답: X번 — 해설 내용

</details>
```
모든 문제는 위 형식을 따르고, 정답은 `<details>` 태그로 숨겨주세요.
문서 최상단에 다음 안내문을 반드시 포함하세요:
> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 주제
- 주제: {topic}
- 학습목표: {objectives}
- 핵심 내용: {key_contents}

## 검색된 참고 문서 (RAG):
{context}""")

def __get_review_prompt():
    return ChatPromptTemplate.from_template(
        template="""
당신은 IT 교육 콘텐츠 품질 관리 전문가입니다.
아래 강의자료를 검토하여 **문제가 있는지 없는지**만 간결하게 평가하세요.
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