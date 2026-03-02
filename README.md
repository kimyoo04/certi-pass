# CertiPass - 공인중개사 기출문제 학습 앱

공인중개사 시험 대비를 위한 모바일 최적화 웹 학습 앱입니다. 연도별 기출문제 풀이, 빈칸 뚫기, 모의고사, 개념 트리 등 다양한 학습 기능을 제공합니다.

## 주요 기능

### 학습
- **기출문제 풀이** — 과목별/연도별 객관식 문제 풀이 (2016~2024년)
- **빈칸 뚫기** — 핵심 개념을 빈칸 채우기 형식으로 복습
- **오답 복습** — 틀린 문제만 모아서 재학습
- **문제 셔플** — Fisher-Yates 알고리즘 기반 무작위 출제

### 시험
- **모의고사** — 실전과 동일한 타이머 기반 모의시험
- **대시보드** — 과목별 학습 진행률 및 모의고사 성적 통계

### 개념 정리
- **개념 트리** — 과목별 계층 구조로 정리된 출제 범위 (대단원 > 중단원 > 소단원)
- **문제 분류** — 기출문제를 개념 트리 노드에 매핑
- **트리 편집** — 노드 추가/수정/삭제로 개인화된 개념 체계 구성

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
| Testing | Vitest + Testing Library |
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
        └── question_tree_map.json
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

# 린트
pnpm lint
```

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
| s3 | 공인중개사법령 및 실무 |
| s4 | 부동산공법 |
| s5 | 부동산공시법 |
| s6 | 부동산세법 |
