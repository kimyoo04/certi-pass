# CertiPass - 공인중개사 기출문제 학습 앱

[![Deploy](https://github.com/kimyoo04/certi-pass/actions/workflows/deploy.yml/badge.svg)](https://github.com/kimyoo04/certi-pass/actions/workflows/deploy.yml)

공인중개사 시험 대비를 위한 모바일 최적화 웹 학습 앱입니다. 연도별 기출문제 풀이, 빈칸 뚫기, 모의고사, 개념 트리 등 다양한 학습 기능을 제공합니다.

> **Live**: [https://kimyoo04.github.io/certi-pass/](https://kimyoo04.github.io/certi-pass/)

## 주요 기능

### 학습
- **기출문제 풀이** — 과목별/연도별 객관식 문제 풀이 (2016~2024년)
- **빈칸 뚫기** — 핵심 개념을 빈칸 채우기 형식으로 복습
- **오답 복습** — 틀린 문제만 모아서 재학습
- **북마크** — 중요 문제를 북마크하여 별도로 관리
- **문제 셔플** — Fisher-Yates 알고리즘 기반 무작위 출제

### 시험
- **모의고사** — 실전과 동일한 타이머 기반 모의시험 (과목별 문제 수/시간 설정)
- **대시보드** — 과목별 학습 진행률, 정답률, 취약 영역 분석, 모의고사 이력

### 개념 정리
- **개념 트리** — 과목별 계층 구조로 정리된 출제 범위 (대단원 > 중단원 > 소단원)
- **문제 분류** — 기출문제를 개념 트리 노드에 매핑
- **트리 편집** — 노드 추가/수정/삭제로 개인화된 개념 체계 구성
- **플래시카드** — 과목별 핵심 용어/개념을 카드 뒤집기 방식으로 암기
  - 3D 뒤집기 애니메이션 (앞면: 키워드, 뒷면: 정의)
  - 좌우 스와이프 / 키보드 방향키 네비게이션
  - 카드 직접 추가·수정·삭제 (localStorage 저장)
  - 카테고리 셀렉트 + 새 카테고리 추가
  - JSON 내보내기로 데이터 파일 영구 반영

### 모바일 UX
- **Safe Area 지원** — 노치/홈 인디케이터 영역 자동 대응
- **Sticky 하단 내비게이션** — 퀴즈, 빈칸 뚫기, 모의고사, 결과 페이지에서 버튼 고정
- **접이식 과목 섹션** — 과목 선택 페이지에서 챕터 목록 접기/펼치기
- **터치 피드백** — 카드 터치 시 scale 애니메이션
- **다크 모드** — 시스템 설정 연동 + 수동 전환

### 접근성 (a11y)
- ARIA 속성: `role="timer"`, `aria-live`, `aria-expanded`, `aria-current` 등
- 키보드 내비게이션: 카드 요소에 `tabIndex`, `onKeyDown` 지원
- 시맨틱 HTML: 로딩 스피너 `role="status"`, 알림 `role="alert"`

### Dev Mode (개발 전용)
- **문제 편집** — 퀴즈/빈칸 페이지에서 연필 아이콘으로 문제 내용 직접 수정
- **JSON 파일 동기화** — 트리 편집, 분류 매핑, 문제 수정 사항이 `public/data/` JSON 파일에 자동 저장
- **Production 안전** — 모든 dev 코드는 빌드 시 tree-shaken되어 프로덕션에 포함되지 않음

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | React 19, TypeScript 5.9 |
| Build | Vite 7 |
| Routing | React Router DOM 7 (HashRouter) |
| State | Zustand 5 (+ persist middleware → localStorage) |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui |
| Icons | Lucide React |
| Testing | Vitest + Testing Library + @vitest/coverage-v8 |
| Deploy | GitHub Pages (GitHub Actions CI/CD) |
| Email | EmailJS |

## 프로젝트 구조

```
src/
├── components/          # 공통 컴포넌트
│   ├── ui/              # shadcn/ui 기반 UI 컴포넌트
│   ├── mobile-layout.tsx
│   ├── question-edit-dialog.tsx  # [Dev] 문제 편집 다이얼로그
│   ├── tree-node-*.tsx  # 트리 관련 컴포넌트
│   └── exam-timer.tsx
├── pages/               # 라우트별 페이지
├── stores/              # Zustand 상태 관리
│   ├── use-quiz-store.ts
│   ├── use-tree-store.ts
│   ├── use-classify-store.ts
│   ├── use-mock-exam-store.ts
│   ├── use-flashcard-store.ts      # 커스텀 플래시카드 (localStorage)
│   └── use-question-edit-store.ts  # [Dev] 문제 편집 오버레이
├── utils/               # 유틸리티
│   ├── dev-persist.ts   # [Dev] JSON 파일 쓰기 클라이언트
│   ├── dev-sync.ts      # [Dev] Store → JSON 동기화
│   ├── shuffle.ts
│   └── tree-utils.ts
├── types/               # TypeScript 타입 정의
├── hooks/               # 커스텀 훅
├── data/                # 정적 데이터 (exam-tree 등)
└── __tests__/           # 테스트

public/data/
└── realtor/             # 공인중개사 데이터
    ├── curriculum.json  # 과목/챕터 목록
    └── s{1-6}/          # 과목별 폴더
        ├── all_quiz.json
        ├── y{year}_quiz.json
        ├── question_tree_map.json
        └── flashcards.json         # 과목별 플래시카드 개념 데이터
```

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build

# 테스트 실행
pnpm test:run

# 테스트 커버리지 확인
pnpm vitest run --coverage

# 린트
pnpm lint
```

## 테스트 커버리지

| 영역 | Statements | Functions | Lines |
|------|-----------|-----------|-------|
| stores | 98% | 97% | 98% |
| hooks | 97% | 92% | 100% |
| utils | 100% | 100% | 100% |
| pages | 83% | 69% | 84% |
| **전체** | **81%** | **71%** | **81%** |

- 23개 테스트 파일 / 263개 테스트 케이스
- TypeScript, ESLint 에러 0건

## Dev Mode JSON 동기화

개발 서버(`pnpm dev`)에서는 아래 수정 사항이 자동으로 `public/data/` 하위 JSON 파일에 저장됩니다.

| 수정 대상 | 저장 파일 |
|-----------|-----------|
| 트리 구조 편집 | `realtor/{subjectId}/tree_overrides.json` |
| 분류 매핑 | `realtor/{subjectId}/question_tree_map.json` |
| 문제 내용 편집 | `realtor/{subjectId}/*_quiz.json` |

프로덕션 빌드에서는 기존과 동일하게 localStorage만 사용합니다.

## 과목 목록

| ID | 과목명 |
|----|--------|
| s1 | 부동산학개론 |
| s2 | 민법 및 민사특별법 |
| s3 | 부동산공법 |
| s4 | 부동산공시법령 |
| s5 | 공인중개사법령 및 중개실무 |
| s6 | 부동산세법 |

## 플래시카드 데이터 추가 방법

웹에서 카드를 추가하면 localStorage에 임시 저장됩니다. 영구 반영하려면:

1. 과목 선택 → **개념 플래시카드** → 과목 선택 → **편집** 버튼
2. 카드 추가·수정 후 **JSON 내보내기** 클릭
3. 다운로드된 파일을 `public/data/realtor/s{N}/flashcards.json`으로 교체
4. 커밋 후 push → GitHub Actions가 자동 배포

`flashcards.json` 구조:

```json
{
  "subjectId": "s1",
  "subjectName": "부동산학개론",
  "cards": [
    {
      "id": "s1_fc001",
      "term": "부동성",
      "definition": "토지는 위치가 고정되어 이동이 불가능한 특성.",
      "category": "토지의 특성"
    }
  ]
}
```
