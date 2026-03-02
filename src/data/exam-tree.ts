import type { ExamStructure, ExamSubject } from '../types/tree'

// ============================================================
// 1차 시험 과목
// ============================================================

/** 부동산학개론 (1차) */
const realEstateIntro: ExamSubject = {
  id: 's1',
  name: '부동산학개론',
  examType: 'first',
  questionCount: 40,
  tree: [
    {
      id: 's1-m1',
      label: '부동산학 총론',
      level: 'major',
      importance: 3,
      examFrequency: '매회 4-6문제',
      children: [
        {
          id: 's1-m1-c1',
          label: '부동산의 개념',
          level: 'middle',
          children: [
            { id: 's1-m1-c1-t1', label: '토지의 개념과 분류', level: 'minor' },
            { id: 's1-m1-c1-t2', label: '건물의 개념과 분류', level: 'minor' },
            { id: 's1-m1-c1-t3', label: '부동산의 복합개념 (토지+건물)', level: 'minor' },
          ],
        },
        {
          id: 's1-m1-c2',
          label: '부동산의 특성',
          level: 'middle',
          children: [
            {
              id: 's1-m1-c2-t1',
              label: '토지의 자연적 특성 (부동성, 영속성, 부증성, 개별성)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's1-m1-c2-t2',
              label:
                '토지의 인문적 특성 (용도의 다양성, 병합·분할 가능성, 사회적·경제적·행정적 위치의 가변성)',
              level: 'minor',
              importance: 4,
            },
          ],
        },
        {
          id: 's1-m1-c3',
          label: '부동산의 분류',
          level: 'middle',
          children: [
            { id: 's1-m1-c3-t1', label: '지목에 의한 분류', level: 'minor' },
            {
              id: 's1-m1-c3-t2',
              label: '용도에 의한 분류 (주거용, 상업용, 공업용, 농업용)',
              level: 'minor',
            },
            { id: 's1-m1-c3-t3', label: '소유형태에 의한 분류', level: 'minor' },
          ],
        },
        {
          id: 's1-m1-c4',
          label: '부동산활동과 부동산현상',
          level: 'middle',
          children: [
            { id: 's1-m1-c4-t1', label: '부동산활동의 유형', level: 'minor' },
            { id: 's1-m1-c4-t2', label: '부동산현상의 이해', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's1-m2',
      label: '부동산 경제론',
      level: 'major',
      importance: 5,
      examFrequency: '매회 8-10문제',
      children: [
        {
          id: 's1-m2-c1',
          label: '부동산 수요·공급이론',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's1-m2-c1-t1', label: '부동산 수요와 수요의 결정요인', level: 'minor' },
            { id: 's1-m2-c1-t2', label: '부동산 공급과 공급의 결정요인', level: 'minor' },
            { id: 's1-m2-c1-t3', label: '수요·공급의 탄력성', level: 'minor', importance: 5 },
            { id: 's1-m2-c1-t4', label: '균형가격의 결정과 변동', level: 'minor' },
          ],
        },
        {
          id: 's1-m2-c2',
          label: '부동산 시장론',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's1-m2-c2-t1', label: '부동산시장의 특성과 기능', level: 'minor' },
            { id: 's1-m2-c2-t2', label: '효율적 시장가설', level: 'minor', importance: 4 },
            {
              id: 's1-m2-c2-t3',
              label: '부동산시장의 유형 (완전경쟁, 독점, 과점)',
              level: 'minor',
            },
            {
              id: 's1-m2-c2-t4',
              label: '거미집이론 (수렴형, 발산형, 순환형)',
              level: 'minor',
              importance: 5,
            },
          ],
        },
        {
          id: 's1-m2-c3',
          label: '부동산 가격이론',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's1-m2-c3-t1',
              label: '지대이론 (리카도, 튀넨, 마르크스, 마샬)',
              level: 'minor',
              importance: 5,
            },
            { id: 's1-m2-c3-t2', label: '지가이론', level: 'minor' },
            { id: 's1-m2-c3-t3', label: '임대료이론', level: 'minor' },
          ],
        },
        {
          id: 's1-m2-c4',
          label: '부동산 경기변동',
          level: 'middle',
          children: [
            { id: 's1-m2-c4-t1', label: '부동산 경기변동의 특성', level: 'minor' },
            { id: 's1-m2-c4-t2', label: '경기순환의 국면', level: 'minor' },
            { id: 's1-m2-c4-t3', label: '부동산 경기지표', level: 'minor' },
          ],
        },
        {
          id: 's1-m2-c5',
          label: '입지이론과 도시공간구조이론',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's1-m2-c5-t1',
              label: '입지이론 (베버, 크리스탈러, 뢰쉬, 호텔링)',
              level: 'minor',
              importance: 4,
            },
            { id: 's1-m2-c5-t2', label: '동심원이론 (버제스)', level: 'minor', importance: 5 },
            { id: 's1-m2-c5-t3', label: '선형이론 (호이트)', level: 'minor', importance: 5 },
            { id: 's1-m2-c5-t4', label: '다핵심이론 (해리스·울만)', level: 'minor', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 's1-m3',
      label: '부동산 정책론',
      level: 'major',
      importance: 4,
      examFrequency: '매회 5-7문제',
      children: [
        {
          id: 's1-m3-c1',
          label: '부동산 정책 총론',
          level: 'middle',
          children: [
            {
              id: 's1-m3-c1-t1',
              label: '시장실패와 정부개입의 근거',
              level: 'minor',
              importance: 4,
            },
            { id: 's1-m3-c1-t2', label: '정부실패', level: 'minor' },
            {
              id: 's1-m3-c1-t3',
              label: '외부효과 (외부경제, 외부불경제)',
              level: 'minor',
              importance: 4,
            },
          ],
        },
        {
          id: 's1-m3-c2',
          label: '토지정책',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's1-m3-c2-t1', label: '토지이용규제', level: 'minor' },
            {
              id: 's1-m3-c2-t2',
              label: '토지공개념 (개발이익환수, 토지초과이득세)',
              level: 'minor',
              importance: 4,
            },
            { id: 's1-m3-c2-t3', label: '개발권양도제 (TDR)', level: 'minor' },
          ],
        },
        {
          id: 's1-m3-c3',
          label: '주택정책',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's1-m3-c3-t1', label: '주택문제와 주거복지', level: 'minor' },
            { id: 's1-m3-c3-t2', label: '주택수요·공급 정책', level: 'minor' },
            {
              id: 's1-m3-c3-t3',
              label: '임대차 규제 (임대료규제, 전월세 상한제)',
              level: 'minor',
              importance: 5,
            },
            { id: 's1-m3-c3-t4', label: '주택필터링이론', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's1-m3-c4',
          label: '부동산 조세정책',
          level: 'middle',
          children: [
            { id: 's1-m3-c4-t1', label: '조세의 전가와 귀착', level: 'minor', importance: 4 },
            { id: 's1-m3-c4-t2', label: '부동산 조세의 유형과 효과', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's1-m4',
      label: '부동산 투자론',
      level: 'major',
      importance: 5,
      examFrequency: '매회 6-8문제',
      children: [
        {
          id: 's1-m4-c1',
          label: '부동산 투자 기초',
          level: 'middle',
          children: [
            { id: 's1-m4-c1-t1', label: '투자의 개념과 특성', level: 'minor' },
            { id: 's1-m4-c1-t2', label: '위험과 수익의 관계', level: 'minor', importance: 5 },
            { id: 's1-m4-c1-t3', label: '포트폴리오 이론', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's1-m4-c2',
          label: '화폐의 시간가치',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's1-m4-c2-t1', label: '현재가치와 미래가치', level: 'minor', importance: 5 },
            {
              id: 's1-m4-c2-t2',
              label: '연금의 현재가치와 미래가치',
              level: 'minor',
              importance: 5,
            },
            { id: 's1-m4-c2-t3', label: '저당상수와 연부금상환', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's1-m4-c3',
          label: '투자분석 기법',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's1-m4-c3-t1', label: '순현재가치법 (NPV)', level: 'minor', importance: 5 },
            { id: 's1-m4-c3-t2', label: '내부수익률법 (IRR)', level: 'minor', importance: 5 },
            { id: 's1-m4-c3-t3', label: '수익성지수법 (PI)', level: 'minor' },
            { id: 's1-m4-c3-t4', label: '회수기간법', level: 'minor' },
            { id: 's1-m4-c3-t5', label: '현금수지분석 (세전·세후)', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's1-m4-c4',
          label: '부동산 금융',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's1-m4-c4-t1', label: '저당대출의 유형', level: 'minor' },
            { id: 's1-m4-c4-t2', label: '부동산투자회사 (REITs)', level: 'minor', importance: 4 },
            { id: 's1-m4-c4-t3', label: '주택저당증권 (MBS, MBB)', level: 'minor', importance: 4 },
            { id: 's1-m4-c4-t4', label: '프로젝트 파이낸싱 (PF)', level: 'minor' },
            { id: 's1-m4-c4-t5', label: '부동산 증권화와 유동화', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's1-m5',
      label: '부동산 개발·관리론',
      level: 'major',
      importance: 3,
      examFrequency: '매회 3-5문제',
      children: [
        {
          id: 's1-m5-c1',
          label: '부동산 개발',
          level: 'middle',
          children: [
            { id: 's1-m5-c1-t1', label: '개발의 개념과 과정', level: 'minor' },
            {
              id: 's1-m5-c1-t2',
              label: '타당성 분석 (시장분석, 재무분석)',
              level: 'minor',
              importance: 4,
            },
            { id: 's1-m5-c1-t3', label: '개발방식 (자력개발, 위탁개발, 합동개발)', level: 'minor' },
          ],
        },
        {
          id: 's1-m5-c2',
          label: '부동산 관리',
          level: 'middle',
          children: [
            {
              id: 's1-m5-c2-t1',
              label: '부동산관리의 유형 (자산관리, 재산관리, 시설관리)',
              level: 'minor',
            },
            { id: 's1-m5-c2-t2', label: '부동산 마케팅', level: 'minor' },
            { id: 's1-m5-c2-t3', label: '리모델링과 용도전환', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's1-m6',
      label: '부동산 감정평가론',
      level: 'major',
      importance: 5,
      examFrequency: '매회 8-10문제',
      children: [
        {
          id: 's1-m6-c1',
          label: '감정평가 기초이론',
          level: 'middle',
          children: [
            { id: 's1-m6-c1-t1', label: '감정평가의 개념과 목적', level: 'minor' },
            {
              id: 's1-m6-c1-t2',
              label: '가치의 유형 (시장가치, 투자가치, 사용가치 등)',
              level: 'minor',
            },
            { id: 's1-m6-c1-t3', label: '가치발생요인과 가격원칙', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's1-m6-c2',
          label: '감정평가 3방식',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's1-m6-c2-t1',
              label: '비교방식 (거래사례비교법)',
              level: 'minor',
              importance: 5,
            },
            { id: 's1-m6-c2-t2', label: '원가방식 (원가법)', level: 'minor', importance: 5 },
            { id: 's1-m6-c2-t3', label: '수익방식 (수익환원법)', level: 'minor', importance: 5 },
            {
              id: 's1-m6-c2-t4',
              label: '환원이율(자본환원율)과 할인율',
              level: 'minor',
              importance: 5,
            },
          ],
        },
        {
          id: 's1-m6-c3',
          label: '물건별 감정평가',
          level: 'middle',
          children: [
            { id: 's1-m6-c3-t1', label: '토지의 감정평가', level: 'minor' },
            { id: 's1-m6-c3-t2', label: '건물의 감정평가', level: 'minor' },
            { id: 's1-m6-c3-t3', label: '구분소유권·임대차 감정평가', level: 'minor' },
          ],
        },
      ],
    },
  ],
}

/** 민법 및 민사특별법 (1차) */
const civilLaw: ExamSubject = {
  id: 's2',
  name: '민법 및 민사특별법',
  examType: 'first',
  questionCount: 40,
  tree: [
    {
      id: 's2-m1',
      label: '민법총칙',
      level: 'major',
      importance: 4,
      examFrequency: '매회 8-10문제',
      children: [
        {
          id: 's2-m1-c1',
          label: '총칙 일반',
          level: 'middle',
          children: [
            { id: 's2-m1-c1-t1', label: '민법의 기본원리', level: 'minor' },
            {
              id: 's2-m1-c1-t2',
              label: '신의성실의 원칙과 권리남용 금지',
              level: 'minor',
              importance: 4,
            },
          ],
        },
        {
          id: 's2-m1-c2',
          label: '권리의 주체',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's2-m1-c2-t1',
              label: '자연인 (권리능력, 행위능력, 의사능력)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's2-m1-c2-t2',
              label: '제한능력자 (미성년자, 피성년후견인, 피한정후견인)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m1-c2-t3', label: '부재와 실종', level: 'minor' },
            { id: 's2-m1-c2-t4', label: '법인 (설립, 기관, 해산)', level: 'minor', importance: 3 },
          ],
        },
        {
          id: 's2-m1-c3',
          label: '권리의 객체',
          level: 'middle',
          children: [
            { id: 's2-m1-c3-t1', label: '물건의 개념과 종류', level: 'minor' },
            { id: 's2-m1-c3-t2', label: '주물과 종물', level: 'minor' },
            { id: 's2-m1-c3-t3', label: '원물과 과실', level: 'minor' },
          ],
        },
        {
          id: 's2-m1-c4',
          label: '법률행위',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m1-c4-t1', label: '법률행위의 종류', level: 'minor' },
            {
              id: 's2-m1-c4-t2',
              label: '의사표시 (비진의표시, 허위표시, 착오, 사기·강박)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's2-m1-c4-t3',
              label: '대리 (유권대리, 무권대리, 표현대리)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m1-c4-t4', label: '법률행위의 무효와 취소', level: 'minor', importance: 5 },
            { id: 's2-m1-c4-t5', label: '조건과 기한', level: 'minor' },
          ],
        },
        {
          id: 's2-m1-c5',
          label: '기간과 소멸시효',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's2-m1-c5-t1', label: '기간의 계산', level: 'minor' },
            { id: 's2-m1-c5-t2', label: '소멸시효의 기간과 기산점', level: 'minor', importance: 5 },
            {
              id: 's2-m1-c5-t3',
              label: '소멸시효의 중단사유와 정지',
              level: 'minor',
              importance: 5,
            },
          ],
        },
      ],
    },
    {
      id: 's2-m2',
      label: '물권법',
      level: 'major',
      importance: 5,
      examFrequency: '매회 15-18문제',
      children: [
        {
          id: 's2-m2-c1',
          label: '물권법 총론',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m2-c1-t1', label: '물권의 종류와 효력', level: 'minor' },
            {
              id: 's2-m2-c1-t2',
              label: '물권변동 (의사주의 vs 형식주의)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m2-c1-t3', label: '부동산 물권변동 (등기)', level: 'minor', importance: 5 },
            { id: 's2-m2-c1-t4', label: '동산 물권변동 (인도)', level: 'minor' },
          ],
        },
        {
          id: 's2-m2-c2',
          label: '점유권',
          level: 'middle',
          children: [
            { id: 's2-m2-c2-t1', label: '점유의 종류와 태양', level: 'minor' },
            { id: 's2-m2-c2-t2', label: '점유권의 효력 (점유보호청구권)', level: 'minor' },
            { id: 's2-m2-c2-t3', label: '점유와 본권의 관계', level: 'minor' },
          ],
        },
        {
          id: 's2-m2-c3',
          label: '소유권',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m2-c3-t1', label: '소유권의 내용과 제한', level: 'minor' },
            { id: 's2-m2-c3-t2', label: '상린관계', level: 'minor', importance: 4 },
            {
              id: 's2-m2-c3-t3',
              label: '소유권의 취득 (선점, 습득, 첨부, 시효취득)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's2-m2-c3-t4',
              label: '공동소유 (공유, 합유, 총유)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m2-c3-t5', label: '구분소유', level: 'minor' },
          ],
        },
        {
          id: 's2-m2-c4',
          label: '용익물권',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m2-c4-t1', label: '지상권', level: 'minor', importance: 5 },
            { id: 's2-m2-c4-t2', label: '지역권', level: 'minor', importance: 3 },
            { id: 's2-m2-c4-t3', label: '전세권', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's2-m2-c5',
          label: '담보물권',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m2-c5-t1', label: '유치권', level: 'minor', importance: 5 },
            { id: 's2-m2-c5-t2', label: '질권', level: 'minor', importance: 2 },
            { id: 's2-m2-c5-t3', label: '저당권', level: 'minor', importance: 5 },
            { id: 's2-m2-c5-t4', label: '근저당권', level: 'minor', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 's2-m3',
      label: '채권법',
      level: 'major',
      importance: 4,
      examFrequency: '매회 6-8문제',
      children: [
        {
          id: 's2-m3-c1',
          label: '채권총론',
          level: 'middle',
          children: [
            { id: 's2-m3-c1-t1', label: '채권의 목적 (종류채권, 선택채권)', level: 'minor' },
            {
              id: 's2-m3-c1-t2',
              label: '채무불이행 (이행지체, 이행불능, 불완전이행)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m3-c1-t3', label: '손해배상', level: 'minor' },
            {
              id: 's2-m3-c1-t4',
              label: '채권자대위권과 채권자취소권',
              level: 'minor',
              importance: 4,
            },
            {
              id: 's2-m3-c1-t5',
              label: '다수당사자의 채권관계 (연대채무, 보증채무)',
              level: 'minor',
              importance: 4,
            },
            { id: 's2-m3-c1-t6', label: '채권양도와 채무인수', level: 'minor' },
          ],
        },
        {
          id: 's2-m3-c2',
          label: '채권각론 (계약)',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's2-m3-c2-t1',
              label: '계약총론 (성립, 효력, 해제·해지)',
              level: 'minor',
              importance: 4,
            },
            { id: 's2-m3-c2-t2', label: '매매 (계약금, 담보책임)', level: 'minor', importance: 5 },
            { id: 's2-m3-c2-t3', label: '임대차', level: 'minor', importance: 5 },
            { id: 's2-m3-c2-t4', label: '도급', level: 'minor', importance: 3 },
            { id: 's2-m3-c2-t5', label: '위임·사무관리', level: 'minor' },
          ],
        },
        {
          id: 's2-m3-c3',
          label: '법정채권관계',
          level: 'middle',
          children: [
            { id: 's2-m3-c3-t1', label: '부당이득', level: 'minor', importance: 3 },
            { id: 's2-m3-c3-t2', label: '불법행위', level: 'minor', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 's2-m4',
      label: '민사특별법',
      level: 'major',
      importance: 5,
      examFrequency: '매회 8-10문제',
      children: [
        {
          id: 's2-m4-c1',
          label: '주택임대차보호법',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m4-c1-t1', label: '적용범위와 대항력', level: 'minor', importance: 5 },
            { id: 's2-m4-c1-t2', label: '보증금의 우선변제권', level: 'minor', importance: 5 },
            {
              id: 's2-m4-c1-t3',
              label: '최우선변제권 (소액임차인)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m4-c1-t4', label: '임대차기간과 계약갱신', level: 'minor', importance: 5 },
            { id: 's2-m4-c1-t5', label: '임대차보증금 회수 절차', level: 'minor' },
          ],
        },
        {
          id: 's2-m4-c2',
          label: '상가건물 임대차보호법',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's2-m4-c2-t1', label: '적용범위 (환산보증금)', level: 'minor', importance: 5 },
            { id: 's2-m4-c2-t2', label: '대항력과 우선변제권', level: 'minor', importance: 5 },
            { id: 's2-m4-c2-t3', label: '계약갱신요구권 (10년)', level: 'minor', importance: 5 },
            { id: 's2-m4-c2-t4', label: '권리금 보호', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's2-m4-c3',
          label: '가등기담보법',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's2-m4-c3-t1', label: '가등기담보의 의의와 성질', level: 'minor' },
            {
              id: 's2-m4-c3-t2',
              label: '담보가등기권리자의 권리실행',
              level: 'minor',
              importance: 4,
            },
            { id: 's2-m4-c3-t3', label: '청산절차와 청산금', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's2-m4-c4',
          label: '집합건물의 소유 및 관리에 관한 법률',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's2-m4-c4-t1', label: '구분소유의 성립요건', level: 'minor' },
            { id: 's2-m4-c4-t2', label: '전유부분과 공용부분', level: 'minor', importance: 4 },
            {
              id: 's2-m4-c4-t3',
              label: '대지사용권과 분리처분 금지',
              level: 'minor',
              importance: 4,
            },
            { id: 's2-m4-c4-t4', label: '관리단과 관리인', level: 'minor' },
            { id: 's2-m4-c4-t5', label: '규약과 집회', level: 'minor' },
          ],
        },
        {
          id: 's2-m4-c5',
          label: '부동산 실권리자명의 등기에 관한 법률',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's2-m4-c5-t1',
              label: '명의신탁의 유형 (3자간, 계약명의신탁, 중간생략 등기형)',
              level: 'minor',
              importance: 5,
            },
            { id: 's2-m4-c5-t2', label: '명의신탁의 효력', level: 'minor', importance: 5 },
            { id: 's2-m4-c5-t3', label: '제재 (과징금, 이행강제금, 벌칙)', level: 'minor' },
          ],
        },
      ],
    },
  ],
}

// ============================================================
// 2차 시험 과목
// ============================================================

/** 부동산공법 (2차) - 국토계획법, 도시개발법 등 */
const publicLaw: ExamSubject = {
  id: 's3',
  name: '부동산공법',
  examType: 'second',
  questionCount: 40,
  tree: [
    {
      id: 's3-m1',
      label: '국토의 계획 및 이용에 관한 법률',
      level: 'major',
      importance: 5,
      examFrequency: '매회 12-15문제',
      children: [
        {
          id: 's3-m1-c1',
          label: '국토이용체계',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's3-m1-c1-t1',
              label: '용도지역 (도시·관리·농림·자연환경보전)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's3-m1-c1-t2',
              label: '용도지구 (경관, 고도, 방화, 보호, 취락 등)',
              level: 'minor',
              importance: 4,
            },
            {
              id: 's3-m1-c1-t3',
              label: '용도구역 (시가화조정, 수산자원보호, 도시자연공원)',
              level: 'minor',
              importance: 3,
            },
          ],
        },
        {
          id: 's3-m1-c2',
          label: '도시·군관리계획',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's3-m1-c2-t1', label: '광역도시계획', level: 'minor' },
            { id: 's3-m1-c2-t2', label: '도시·군기본계획', level: 'minor', importance: 4 },
            {
              id: 's3-m1-c2-t3',
              label: '도시·군관리계획의 입안과 결정',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's3-m1-c2-t4',
              label: '기반시설과 도시·군계획시설',
              level: 'minor',
              importance: 4,
            },
          ],
        },
        {
          id: 's3-m1-c3',
          label: '개발행위 허가',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's3-m1-c3-t1',
              label: '개발행위 허가의 대상과 기준',
              level: 'minor',
              importance: 5,
            },
            { id: 's3-m1-c3-t2', label: '개발행위 허가의 절차', level: 'minor' },
            { id: 's3-m1-c3-t3', label: '개발행위 허가의 제한', level: 'minor' },
            { id: 's3-m1-c3-t4', label: '개발밀도관리구역과 기반시설부담구역', level: 'minor' },
          ],
        },
        {
          id: 's3-m1-c4',
          label: '지구단위계획',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's3-m1-c4-t1', label: '지구단위계획의 의의와 유형', level: 'minor' },
            { id: 's3-m1-c4-t2', label: '지구단위계획의 내용', level: 'minor' },
            { id: 's3-m1-c4-t3', label: '건축허가 제한과 매수청구', level: 'minor' },
          ],
        },
        {
          id: 's3-m1-c5',
          label: '용도지역별 행위제한',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's3-m1-c5-t1',
              label: '도시지역 내 행위제한 (주거, 상업, 공업, 녹지)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's3-m1-c5-t2',
              label: '관리지역 내 행위제한 (보전관리, 생산관리, 계획관리)',
              level: 'minor',
              importance: 5,
            },
            { id: 's3-m1-c5-t3', label: '농림·자연환경보전지역 내 행위제한', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's3-m2',
      label: '도시개발법',
      level: 'major',
      importance: 3,
      examFrequency: '매회 4-5문제',
      children: [
        {
          id: 's3-m2-c1',
          label: '도시개발사업 총론',
          level: 'middle',
          children: [
            { id: 's3-m2-c1-t1', label: '도시개발구역의 지정', level: 'minor', importance: 4 },
            { id: 's3-m2-c1-t2', label: '시행자의 지정', level: 'minor', importance: 4 },
            { id: 's3-m2-c1-t3', label: '실시계획의 작성과 인가', level: 'minor' },
          ],
        },
        {
          id: 's3-m2-c2',
          label: '사업시행 방식',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's3-m2-c2-t1', label: '수용 또는 사용방식', level: 'minor' },
            { id: 's3-m2-c2-t2', label: '환지방식', level: 'minor', importance: 4 },
            { id: 's3-m2-c2-t3', label: '혼용방식', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's3-m3',
      label: '도시 및 주거환경정비법',
      level: 'major',
      importance: 4,
      examFrequency: '매회 5-6문제',
      children: [
        {
          id: 's3-m3-c1',
          label: '정비사업 총론',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's3-m3-c1-t1',
              label: '정비사업의 종류 (재개발, 재건축, 주거환경개선)',
              level: 'minor',
              importance: 5,
            },
            { id: 's3-m3-c1-t2', label: '정비기본계획과 정비구역', level: 'minor' },
          ],
        },
        {
          id: 's3-m3-c2',
          label: '정비사업 시행',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's3-m3-c2-t1',
              label: '조합설립 (동의요건, 인가)',
              level: 'minor',
              importance: 5,
            },
            { id: 's3-m3-c2-t2', label: '사업시행계획', level: 'minor' },
            { id: 's3-m3-c2-t3', label: '관리처분계획', level: 'minor', importance: 5 },
            { id: 's3-m3-c2-t4', label: '분양과 청산', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's3-m4',
      label: '건축법',
      level: 'major',
      importance: 4,
      examFrequency: '매회 6-8문제',
      children: [
        {
          id: 's3-m4-c1',
          label: '건축법 총론',
          level: 'middle',
          children: [
            {
              id: 's3-m4-c1-t1',
              label: '용어의 정의 (건축물, 건축, 대수선, 리모델링)',
              level: 'minor',
              importance: 4,
            },
            { id: 's3-m4-c1-t2', label: '적용 제외 건축물', level: 'minor' },
          ],
        },
        {
          id: 's3-m4-c2',
          label: '건축허가·신고',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's3-m4-c2-t1', label: '건축허가 대상과 절차', level: 'minor', importance: 5 },
            { id: 's3-m4-c2-t2', label: '건축신고 대상', level: 'minor', importance: 4 },
            { id: 's3-m4-c2-t3', label: '용도변경', level: 'minor', importance: 4 },
            { id: 's3-m4-c2-t4', label: '가설건축물', level: 'minor' },
          ],
        },
        {
          id: 's3-m4-c3',
          label: '건축물의 기준',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's3-m4-c3-t1', label: '대지와 도로의 관계', level: 'minor', importance: 4 },
            { id: 's3-m4-c3-t2', label: '건폐율과 용적률', level: 'minor', importance: 5 },
            { id: 's3-m4-c3-t3', label: '높이 제한과 일조권', level: 'minor' },
            { id: 's3-m4-c3-t4', label: '건축선 지정과 건축협정', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's3-m5',
      label: '주택법',
      level: 'major',
      importance: 3,
      examFrequency: '매회 4-5문제',
      children: [
        {
          id: 's3-m5-c1',
          label: '주택의 건설',
          level: 'middle',
          children: [
            { id: 's3-m5-c1-t1', label: '주택건설사업 승인', level: 'minor', importance: 4 },
            { id: 's3-m5-c1-t2', label: '사업주체와 등록', level: 'minor' },
            { id: 's3-m5-c1-t3', label: '주택의 감리와 사용검사', level: 'minor' },
          ],
        },
        {
          id: 's3-m5-c2',
          label: '주택의 공급',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's3-m5-c2-t1', label: '입주자 모집과 공급질서', level: 'minor', importance: 4 },
            {
              id: 's3-m5-c2-t2',
              label: '투기과열지구와 분양가상한제',
              level: 'minor',
              importance: 4,
            },
            { id: 's3-m5-c2-t3', label: '전매제한', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's3-m6',
      label: '농지법',
      level: 'major',
      importance: 3,
      examFrequency: '매회 3-4문제',
      children: [
        {
          id: 's3-m6-c1',
          label: '농지의 소유',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's3-m6-c1-t1',
              label: '농지 소유 제한 (자경 원칙)',
              level: 'minor',
              importance: 4,
            },
            { id: 's3-m6-c1-t2', label: '농지취득자격증명', level: 'minor', importance: 5 },
            { id: 's3-m6-c1-t3', label: '농지의 위탁경영', level: 'minor' },
          ],
        },
        {
          id: 's3-m6-c2',
          label: '농지의 이용과 전용',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's3-m6-c2-t1', label: '농지의 임대차와 사용대차', level: 'minor' },
            { id: 's3-m6-c2-t2', label: '농지전용 허가·신고', level: 'minor', importance: 5 },
            { id: 's3-m6-c2-t3', label: '농지보전부담금', level: 'minor' },
          ],
        },
      ],
    },
  ],
}

/** 부동산공시법령 (2차) */
const publicNoticeLaw: ExamSubject = {
  id: 's4',
  name: '부동산공시법령',
  examType: 'second',
  questionCount: 40,
  tree: [
    {
      id: 's4-m1',
      label: '부동산등기법',
      level: 'major',
      importance: 5,
      examFrequency: '매회 18-22문제',
      children: [
        {
          id: 's4-m1-c1',
          label: '등기 총론',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's4-m1-c1-t1', label: '등기의 개념과 종류', level: 'minor' },
            {
              id: 's4-m1-c1-t2',
              label: '등기의 효력 (공신력, 대항력, 순위확정력)',
              level: 'minor',
              importance: 5,
            },
            { id: 's4-m1-c1-t3', label: '등기소와 등기관', level: 'minor' },
            {
              id: 's4-m1-c1-t4',
              label: '등기부의 구성 (표제부, 갑구, 을구)',
              level: 'minor',
              importance: 5,
            },
          ],
        },
        {
          id: 's4-m1-c2',
          label: '등기절차 총론',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's4-m1-c2-t1', label: '신청주의와 직권등기', level: 'minor', importance: 4 },
            { id: 's4-m1-c2-t2', label: '공동신청주의와 단독신청', level: 'minor', importance: 5 },
            { id: 's4-m1-c2-t3', label: '등기의 신청방법 (전자신청, 서면신청)', level: 'minor' },
            { id: 's4-m1-c2-t4', label: '등기신청의 각하사유', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's4-m1-c3',
          label: '소유권 등기',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's4-m1-c3-t1', label: '소유권보존등기', level: 'minor', importance: 5 },
            { id: 's4-m1-c3-t2', label: '소유권이전등기', level: 'minor', importance: 5 },
            { id: 's4-m1-c3-t3', label: '상속에 의한 소유권이전등기', level: 'minor' },
          ],
        },
        {
          id: 's4-m1-c4',
          label: '기타 권리의 등기',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's4-m1-c4-t1', label: '용익권(지상권, 지역권, 전세권) 등기', level: 'minor' },
            {
              id: 's4-m1-c4-t2',
              label: '담보권(저당권, 근저당권, 권리질권) 등기',
              level: 'minor',
              importance: 5,
            },
            { id: 's4-m1-c4-t3', label: '임차권 등기', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's4-m1-c5',
          label: '가등기와 예고등기',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's4-m1-c5-t1', label: '가등기의 의의와 효력', level: 'minor', importance: 5 },
            { id: 's4-m1-c5-t2', label: '가등기에 의한 본등기', level: 'minor', importance: 5 },
            { id: 's4-m1-c5-t3', label: '예고등기', level: 'minor' },
          ],
        },
        {
          id: 's4-m1-c6',
          label: '특수등기',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's4-m1-c6-t1',
              label: '경매에 의한 등기 (촉탁등기)',
              level: 'minor',
              importance: 4,
            },
            { id: 's4-m1-c6-t2', label: '구분건물의 등기', level: 'minor', importance: 4 },
            { id: 's4-m1-c6-t3', label: '신탁등기', level: 'minor' },
            { id: 's4-m1-c6-t4', label: '가처분등기', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's4-m2',
      label: '공간정보의 구축 및 관리 등에 관한 법률',
      level: 'major',
      importance: 4,
      examFrequency: '매회 10-12문제',
      children: [
        {
          id: 's4-m2-c1',
          label: '토지의 등록',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's4-m2-c1-t1', label: '토지의 등록단위 (필지)', level: 'minor' },
            { id: 's4-m2-c1-t2', label: '지번·지목·경계의 설정', level: 'minor', importance: 5 },
            { id: 's4-m2-c1-t3', label: '지목의 종류 (28개)', level: 'minor', importance: 5 },
            { id: 's4-m2-c1-t4', label: '면적의 결정과 단위', level: 'minor' },
          ],
        },
        {
          id: 's4-m2-c2',
          label: '지적공부',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's4-m2-c2-t1',
              label: '지적공부의 종류 (토지대장, 지적도, 임야대장 등)',
              level: 'minor',
              importance: 5,
            },
            { id: 's4-m2-c2-t2', label: '지적공부의 복구', level: 'minor' },
            { id: 's4-m2-c2-t3', label: '부동산종합공부', level: 'minor' },
          ],
        },
        {
          id: 's4-m2-c3',
          label: '토지이동',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's4-m2-c3-t1',
              label: '토지이동의 종류 (신규등록, 등록전환, 분할, 합병, 지목변경)',
              level: 'minor',
              importance: 5,
            },
            { id: 's4-m2-c3-t2', label: '토지이동 신청 절차', level: 'minor' },
            { id: 's4-m2-c3-t3', label: '직권에 의한 토지이동', level: 'minor' },
            { id: 's4-m2-c3-t4', label: '축척변경', level: 'minor' },
          ],
        },
        {
          id: 's4-m2-c4',
          label: '지적측량',
          level: 'middle',
          importance: 3,
          children: [
            { id: 's4-m2-c4-t1', label: '지적측량의 종류', level: 'minor' },
            { id: 's4-m2-c4-t2', label: '지적측량 적부심사', level: 'minor' },
            { id: 's4-m2-c4-t3', label: '지적재조사', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's4-m3',
      label: '부동산 가격공시에 관한 법률',
      level: 'major',
      importance: 4,
      examFrequency: '매회 5-7문제',
      children: [
        {
          id: 's4-m3-c1',
          label: '표준지공시지가',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's4-m3-c1-t1',
              label: '표준지의 선정과 조사·평가',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's4-m3-c1-t2',
              label: '표준지공시지가의 공시와 효력',
              level: 'minor',
              importance: 5,
            },
            { id: 's4-m3-c1-t3', label: '이의신청 절차', level: 'minor' },
          ],
        },
        {
          id: 's4-m3-c2',
          label: '개별공시지가',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's4-m3-c2-t1', label: '개별공시지가의 결정·공시', level: 'minor', importance: 5 },
            { id: 's4-m3-c2-t2', label: '개별공시지가의 활용 (과세, 부담금 산정)', level: 'minor' },
            { id: 's4-m3-c2-t3', label: '이의신청과 정정', level: 'minor' },
          ],
        },
        {
          id: 's4-m3-c3',
          label: '주택가격 공시',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's4-m3-c3-t1',
              label: '표준주택가격과 공동주택가격',
              level: 'minor',
              importance: 4,
            },
            { id: 's4-m3-c3-t2', label: '개별주택가격의 결정·공시', level: 'minor' },
            { id: 's4-m3-c3-t3', label: '비주거용 표준·개별 부동산가격', level: 'minor' },
          ],
        },
        {
          id: 's4-m3-c4',
          label: '부동산가격공시위원회',
          level: 'middle',
          children: [
            { id: 's4-m3-c4-t1', label: '중앙부동산가격공시위원회', level: 'minor' },
            { id: 's4-m3-c4-t2', label: '시·군·구부동산가격공시위원회', level: 'minor' },
          ],
        },
      ],
    },
  ],
}

/** 공인중개사법령 및 중개실무 (2차) */
const brokerageLaw: ExamSubject = {
  id: 's5',
  name: '공인중개사법령 및 중개실무',
  examType: 'second',
  questionCount: 40,
  tree: [
    {
      id: 's5-m1',
      label: '공인중개사법',
      level: 'major',
      importance: 5,
      examFrequency: '매회 18-22문제',
      children: [
        {
          id: 's5-m1-c1',
          label: '총칙',
          level: 'middle',
          children: [
            {
              id: 's5-m1-c1-t1',
              label: '용어의 정의 (중개, 중개업, 중개대상물)',
              level: 'minor',
              importance: 5,
            },
            { id: 's5-m1-c1-t2', label: '중개대상물의 범위', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's5-m1-c2',
          label: '공인중개사 자격',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's5-m1-c2-t1', label: '시험의 시행과 합격기준', level: 'minor' },
            { id: 's5-m1-c2-t2', label: '자격증 교부와 결격사유', level: 'minor', importance: 5 },
            { id: 's5-m1-c2-t3', label: '자격취소와 자격정지', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's5-m1-c3',
          label: '중개사무소 개설등록',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's5-m1-c3-t1', label: '개설등록 요건', level: 'minor', importance: 5 },
            { id: 's5-m1-c3-t2', label: '등록의 결격사유', level: 'minor', importance: 5 },
            {
              id: 's5-m1-c3-t3',
              label: '법인인 중개업자 (인력, 자본금, 업무 범위)',
              level: 'minor',
              importance: 4,
            },
            { id: 's5-m1-c3-t4', label: '분사무소 설치', level: 'minor' },
            { id: 's5-m1-c3-t5', label: '겸업 제한과 고용인 신고', level: 'minor' },
          ],
        },
        {
          id: 's5-m1-c4',
          label: '중개업자의 의무',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's5-m1-c4-t1',
              label: '성실·신의의무, 비밀유지의무',
              level: 'minor',
              importance: 4,
            },
            { id: 's5-m1-c4-t2', label: '중개대상물 확인·설명의무', level: 'minor', importance: 5 },
            { id: 's5-m1-c4-t3', label: '거래계약서 작성의무', level: 'minor', importance: 5 },
            { id: 's5-m1-c4-t4', label: '손해배상책임 (업무보증)', level: 'minor', importance: 5 },
            { id: 's5-m1-c4-t5', label: '금지행위', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's5-m1-c5',
          label: '중개보수',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's5-m1-c5-t1',
              label: '중개보수의 한도와 실비 청구',
              level: 'minor',
              importance: 5,
            },
            { id: 's5-m1-c5-t2', label: '거래유형별 보수 요율', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's5-m1-c6',
          label: '행정처분 및 벌칙',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's5-m1-c6-t1', label: '등록취소 사유', level: 'minor', importance: 5 },
            { id: 's5-m1-c6-t2', label: '업무정지 사유', level: 'minor', importance: 4 },
            { id: 's5-m1-c6-t3', label: '과태료·벌금·징역', level: 'minor', importance: 4 },
            { id: 's5-m1-c6-t4', label: '공인중개사협회', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's5-m2',
      label: '중개실무',
      level: 'major',
      importance: 4,
      examFrequency: '매회 10-14문제',
      children: [
        {
          id: 's5-m2-c1',
          label: '중개대상물 확인·설명 실무',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's5-m2-c1-t1', label: '확인·설명서 작성방법', level: 'minor', importance: 5 },
            {
              id: 's5-m2-c1-t2',
              label: '권리관계 확인 (등기부, 토지대장, 건축물대장)',
              level: 'minor',
              importance: 5,
            },
            { id: 's5-m2-c1-t3', label: '공법상 규제사항 확인', level: 'minor' },
          ],
        },
        {
          id: 's5-m2-c2',
          label: '거래계약 실무',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's5-m2-c2-t1', label: '매매계약 실무', level: 'minor', importance: 4 },
            { id: 's5-m2-c2-t2', label: '임대차계약 실무', level: 'minor', importance: 4 },
            { id: 's5-m2-c2-t3', label: '경매·공매 물건의 중개', level: 'minor' },
          ],
        },
        {
          id: 's5-m2-c3',
          label: '부동산 권리분석',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's5-m2-c3-t1', label: '등기부 분석 실무', level: 'minor', importance: 5 },
            { id: 's5-m2-c3-t2', label: '권리의 순위 판단', level: 'minor', importance: 5 },
            { id: 's5-m2-c3-t3', label: '선순위·후순위 권리관계', level: 'minor' },
            { id: 's5-m2-c3-t4', label: '임차인 보호 분석', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's5-m2-c4',
          label: '부동산 경매실무',
          level: 'middle',
          importance: 3,
          children: [
            { id: 's5-m2-c4-t1', label: '경매의 절차', level: 'minor' },
            { id: 's5-m2-c4-t2', label: '배당순서와 배당금 계산', level: 'minor', importance: 4 },
            { id: 's5-m2-c4-t3', label: '말소기준권리', level: 'minor', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 's5-m3',
      label: '부동산 거래신고 등에 관한 법률',
      level: 'major',
      importance: 3,
      examFrequency: '매회 3-4문제',
      children: [
        {
          id: 's5-m3-c1',
          label: '부동산 거래신고',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's5-m3-c1-t1', label: '신고의무자와 신고기한', level: 'minor', importance: 5 },
            { id: 's5-m3-c1-t2', label: '신고대상 거래', level: 'minor', importance: 4 },
            {
              id: 's5-m3-c1-t3',
              label: '외국인 등의 부동산 취득 신고',
              level: 'minor',
              importance: 3,
            },
          ],
        },
        {
          id: 's5-m3-c2',
          label: '허가구역 제도',
          level: 'middle',
          children: [
            { id: 's5-m3-c2-t1', label: '토지거래허가구역 지정', level: 'minor', importance: 4 },
            {
              id: 's5-m3-c2-t2',
              label: '허가 대상 면적과 이용의무',
              level: 'minor',
              importance: 4,
            },
            { id: 's5-m3-c2-t3', label: '위반 시 제재', level: 'minor' },
          ],
        },
      ],
    },
  ],
}

/** 부동산세법 (2차) */
const taxLaw: ExamSubject = {
  id: 's6',
  name: '부동산세법',
  examType: 'second',
  questionCount: 40,
  tree: [
    {
      id: 's6-m1',
      label: '조세총론',
      level: 'major',
      importance: 3,
      examFrequency: '매회 2-3문제',
      children: [
        {
          id: 's6-m1-c1',
          label: '조세의 기초',
          level: 'middle',
          children: [
            {
              id: 's6-m1-c1-t1',
              label: '조세의 개념과 분류 (국세/지방세, 보통세/목적세)',
              level: 'minor',
              importance: 4,
            },
            {
              id: 's6-m1-c1-t2',
              label: '납세의무의 성립·확정·소멸',
              level: 'minor',
              importance: 4,
            },
            { id: 's6-m1-c1-t3', label: '가산세', level: 'minor' },
          ],
        },
        {
          id: 's6-m1-c2',
          label: '부동산 조세 체계',
          level: 'middle',
          children: [
            {
              id: 's6-m1-c2-t1',
              label: '취득단계 세목 (취득세, 등록면허세, 부가가치세, 인지세)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's6-m1-c2-t2',
              label: '보유단계 세목 (재산세, 종합부동산세)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's6-m1-c2-t3',
              label: '처분단계 세목 (양도소득세, 법인세)',
              level: 'minor',
              importance: 5,
            },
          ],
        },
      ],
    },
    {
      id: 's6-m2',
      label: '취득세',
      level: 'major',
      importance: 5,
      examFrequency: '매회 8-10문제',
      children: [
        {
          id: 's6-m2-c1',
          label: '취득세 총론',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's6-m2-c1-t1', label: '과세대상과 취득의 개념', level: 'minor', importance: 5 },
            { id: 's6-m2-c1-t2', label: '납세의무자', level: 'minor' },
            {
              id: 's6-m2-c1-t3',
              label: '취득시기 (유상취득, 무상취득, 원시취득)',
              level: 'minor',
              importance: 5,
            },
          ],
        },
        {
          id: 's6-m2-c2',
          label: '과세표준과 세율',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's6-m2-c2-t1',
              label: '과세표준 (신고가액, 시가표준액)',
              level: 'minor',
              importance: 5,
            },
            { id: 's6-m2-c2-t2', label: '표준세율과 중과세율', level: 'minor', importance: 5 },
            { id: 's6-m2-c2-t3', label: '다주택자 중과', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's6-m2-c3',
          label: '비과세와 감면',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's6-m2-c3-t1', label: '비과세 취득', level: 'minor' },
            { id: 's6-m2-c3-t2', label: '지방세특례제한법상 감면', level: 'minor' },
          ],
        },
        {
          id: 's6-m2-c4',
          label: '신고·납부',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's6-m2-c4-t1',
              label: '신고납부 기한 (취득일로부터 60일)',
              level: 'minor',
              importance: 5,
            },
            { id: 's6-m2-c4-t2', label: '특수관계인 간 거래의 취득세', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's6-m3',
      label: '등록면허세',
      level: 'major',
      importance: 3,
      examFrequency: '매회 2-3문제',
      children: [
        {
          id: 's6-m3-c1',
          label: '등록분 등록면허세',
          level: 'middle',
          importance: 3,
          children: [
            { id: 's6-m3-c1-t1', label: '과세대상 (등기·등록)', level: 'minor' },
            { id: 's6-m3-c1-t2', label: '과세표준과 세율', level: 'minor', importance: 4 },
            { id: 's6-m3-c1-t3', label: '중과세 (대도시 내 법인 설립·전입)', level: 'minor' },
          ],
        },
        {
          id: 's6-m3-c2',
          label: '면허분 등록면허세',
          level: 'middle',
          children: [{ id: 's6-m3-c2-t1', label: '종별 세액', level: 'minor' }],
        },
      ],
    },
    {
      id: 's6-m4',
      label: '재산세',
      level: 'major',
      importance: 4,
      examFrequency: '매회 5-6문제',
      children: [
        {
          id: 's6-m4-c1',
          label: '재산세 총론',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's6-m4-c1-t1',
              label: '과세대상 (토지, 건축물, 주택, 선박, 항공기)',
              level: 'minor',
            },
            {
              id: 's6-m4-c1-t2',
              label: '납세의무자와 과세기준일 (6월 1일)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's6-m4-c1-t3',
              label: '토지분류 (종합합산, 별도합산, 분리과세)',
              level: 'minor',
              importance: 5,
            },
          ],
        },
        {
          id: 's6-m4-c2',
          label: '과세표준과 세율',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's6-m4-c2-t1',
              label: '과세표준 (공정시장가액비율)',
              level: 'minor',
              importance: 4,
            },
            { id: 's6-m4-c2-t2', label: '세율 (초과누진, 비례)', level: 'minor', importance: 4 },
            { id: 's6-m4-c2-t3', label: '세부담 상한', level: 'minor' },
          ],
        },
        {
          id: 's6-m4-c3',
          label: '부과·징수',
          level: 'middle',
          children: [
            { id: 's6-m4-c3-t1', label: '납기 (7월, 9월 분납)', level: 'minor', importance: 4 },
            { id: 's6-m4-c3-t2', label: '물납과 분납', level: 'minor' },
            { id: 's6-m4-c3-t3', label: '도시지역분과 지역자원시설세', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's6-m5',
      label: '종합부동산세',
      level: 'major',
      importance: 4,
      examFrequency: '매회 4-5문제',
      children: [
        {
          id: 's6-m5-c1',
          label: '종합부동산세 총론',
          level: 'middle',
          importance: 4,
          children: [
            { id: 's6-m5-c1-t1', label: '과세대상과 납세의무자', level: 'minor', importance: 4 },
            {
              id: 's6-m5-c1-t2',
              label: '과세기준일 (6월 1일)과 합산배제',
              level: 'minor',
              importance: 4,
            },
          ],
        },
        {
          id: 's6-m5-c2',
          label: '과세표준과 세율',
          level: 'middle',
          importance: 4,
          children: [
            {
              id: 's6-m5-c2-t1',
              label: '주택분 (공제금액, 공정시장가액비율, 세율)',
              level: 'minor',
              importance: 5,
            },
            { id: 's6-m5-c2-t2', label: '종합합산토지분', level: 'minor' },
            { id: 's6-m5-c2-t3', label: '별도합산토지분', level: 'minor' },
            { id: 's6-m5-c2-t4', label: '세부담 상한 (150%, 300%)', level: 'minor', importance: 4 },
          ],
        },
        {
          id: 's6-m5-c3',
          label: '신고·납부',
          level: 'middle',
          children: [
            {
              id: 's6-m5-c3-t1',
              label: '신고납부 기한 (12월 1일~15일)',
              level: 'minor',
              importance: 4,
            },
            {
              id: 's6-m5-c3-t2',
              label: '1세대 1주택자 공제와 세액공제',
              level: 'minor',
              importance: 4,
            },
          ],
        },
      ],
    },
    {
      id: 's6-m6',
      label: '양도소득세',
      level: 'major',
      importance: 5,
      examFrequency: '매회 10-12문제',
      children: [
        {
          id: 's6-m6-c1',
          label: '양도소득세 총론',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's6-m6-c1-t1',
              label: '양도의 개념과 양도로 보는 경우',
              level: 'minor',
              importance: 5,
            },
            { id: 's6-m6-c1-t2', label: '과세대상 자산', level: 'minor' },
            { id: 's6-m6-c1-t3', label: '양도시기와 취득시기', level: 'minor', importance: 5 },
          ],
        },
        {
          id: 's6-m6-c2',
          label: '양도차익과 과세표준',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's6-m6-c2-t1',
              label: '양도가액과 취득가액 (실지거래가액 원칙)',
              level: 'minor',
              importance: 5,
            },
            {
              id: 's6-m6-c2-t2',
              label: '필요경비 (자본적 지출, 양도비용)',
              level: 'minor',
              importance: 4,
            },
            { id: 's6-m6-c2-t3', label: '장기보유특별공제', level: 'minor', importance: 5 },
            { id: 's6-m6-c2-t4', label: '양도소득 기본공제 (250만원)', level: 'minor' },
          ],
        },
        {
          id: 's6-m6-c3',
          label: '세율',
          level: 'middle',
          importance: 5,
          children: [
            { id: 's6-m6-c3-t1', label: '기본세율 (6%~45%)', level: 'minor', importance: 5 },
            {
              id: 's6-m6-c3-t2',
              label: '다주택자 중과세율 (기본+20%/30%)',
              level: 'minor',
              importance: 5,
            },
            { id: 's6-m6-c3-t3', label: '비사업용 토지 중과', level: 'minor', importance: 4 },
            { id: 's6-m6-c3-t4', label: '미등기 양도 (70%)', level: 'minor' },
          ],
        },
        {
          id: 's6-m6-c4',
          label: '비과세와 감면',
          level: 'middle',
          importance: 5,
          children: [
            {
              id: 's6-m6-c4-t1',
              label: '1세대 1주택 비과세 (2년 보유, 거주요건)',
              level: 'minor',
              importance: 5,
            },
            { id: 's6-m6-c4-t2', label: '일시적 2주택 비과세', level: 'minor', importance: 5 },
            { id: 's6-m6-c4-t3', label: '8년 자경농지 감면', level: 'minor', importance: 4 },
            { id: 's6-m6-c4-t4', label: '조세특례제한법상 감면', level: 'minor' },
          ],
        },
        {
          id: 's6-m6-c5',
          label: '신고·납부',
          level: 'middle',
          children: [
            {
              id: 's6-m6-c5-t1',
              label: '예정신고 (양도일이 속하는 달의 말일로부터 2개월)',
              level: 'minor',
              importance: 4,
            },
            { id: 's6-m6-c5-t2', label: '확정신고 (다음 해 5월)', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's6-m7',
      label: '부가가치세 (부동산 관련)',
      level: 'major',
      importance: 2,
      examFrequency: '매회 1-2문제',
      children: [
        {
          id: 's6-m7-c1',
          label: '부동산 관련 부가가치세',
          level: 'middle',
          children: [
            { id: 's6-m7-c1-t1', label: '과세대상 (건물 공급, 부동산 임대)', level: 'minor' },
            {
              id: 's6-m7-c1-t2',
              label: '면세 (토지 공급, 국민주택 공급)',
              level: 'minor',
              importance: 3,
            },
            { id: 's6-m7-c1-t3', label: '건물의 공급가액 산정', level: 'minor' },
          ],
        },
      ],
    },
    {
      id: 's6-m8',
      label: '기타 세목',
      level: 'major',
      importance: 1,
      examFrequency: '매회 1-2문제',
      children: [
        {
          id: 's6-m8-c1',
          label: '인지세·증여세 등',
          level: 'middle',
          children: [
            { id: 's6-m8-c1-t1', label: '인지세 (부동산 매매계약서)', level: 'minor' },
            { id: 's6-m8-c1-t2', label: '증여세 (부동산 증여 관련)', level: 'minor' },
            { id: 's6-m8-c1-t3', label: '농어촌특별세와 지방교육세', level: 'minor' },
          ],
        },
      ],
    },
  ],
}

// ============================================================
// 전체 시험 구조
// ============================================================

export const examStructure: ExamStructure = {
  firstExam: [realEstateIntro, civilLaw],
  secondExam: [publicLaw, publicNoticeLaw, brokerageLaw, taxLaw],
}

export const allSubjects: ExamSubject[] = [
  realEstateIntro,
  civilLaw,
  publicLaw,
  publicNoticeLaw,
  brokerageLaw,
  taxLaw,
]
