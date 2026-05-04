-- ============================================================
-- PostgreSQL용 jobfit 스키마
-- ============================================================

-- 직무 테이블
CREATE TABLE Job (
    id          SERIAL PRIMARY KEY,
    job_name    VARCHAR(30) NOT NULL,
    job_desc    TEXT NOT NULL
);

-- 기술 테이블
CREATE TABLE Skill (
    id           SERIAL PRIMARY KEY,
    skill_name   VARCHAR(30) NOT NULL,
    skill_desc   TEXT NOT NULL,
    skill_level  VARCHAR(10) NOT NULL
);

-- 로드맵 테이블 (job - skill 연결 및 트리 구조 학습)
CREATE TABLE Roadmap (
    id                SERIAL PRIMARY KEY,
    job_id            INT NOT NULL,
    skill_id          INT NOT NULL,
    parent_roadmap_id INT,          -- 트리 구조를 위한 상위 노드 (선행 단계), NULL이면 시작점(루트)

    FOREIGN KEY (job_id) REFERENCES Job(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skill(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_roadmap_id) REFERENCES Roadmap(id) ON DELETE SET NULL
);

-- 커리큘럼
CREATE TABLE Curriculum (
    id               SERIAL PRIMARY KEY,
    skill_id         INT NOT NULL,
    curriculum_step  VARCHAR(30) NOT NULL,  -- {skill_name}_{step}
    topic            TEXT NOT NULL,
    objectives       TEXT NOT NULL,
    key_contents     TEXT NOT NULL,

    FOREIGN KEY (skill_id) REFERENCES Skill(id) ON DELETE CASCADE
);

-- 문제
CREATE TABLE QuizQuestion (
    id              SERIAL PRIMARY KEY,
    curriculum_id   INT NOT NULL,
    difficulty      VARCHAR(10) NOT NULL,
    question        TEXT NOT NULL,

    FOREIGN KEY (curriculum_id) REFERENCES Curriculum(id) ON DELETE CASCADE
);

-- 선택지
CREATE TABLE QuizChoice (
    id           SERIAL PRIMARY KEY,
    question_id  INT NOT NULL,
    choice_no    SMALLINT NOT NULL,
    choice_text  TEXT NOT NULL,
    is_correct   BOOLEAN NOT NULL,
    explanation  TEXT,

    FOREIGN KEY (question_id) REFERENCES QuizQuestion(id) ON DELETE CASCADE
);