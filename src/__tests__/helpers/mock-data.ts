import type {
  ChapterProgress,
  Curriculum,
  FillInTheBlankQuestion,
  MultipleChoiceQuestion,
  Question,
} from '@/types'

export const BLANK_QUESTIONS: FillInTheBlankQuestion[] = [
  {
    id: 'q_001',
    type: 'fill_in_the_blank',
    content: '부동산의 자연적 특성 중 [BLANK]성으로 인해 토지의 물리적 공급은 불가능하다.',
    answer: '부증',
    explanation: '부증성: 토지는 인간의 힘으로 그 물리적 양을 늘릴 수 없다는 특성이다.',
  },
  {
    id: 'q_002',
    type: 'fill_in_the_blank',
    content: '토지는 다른 재화와 달리 같은 것이 없다는 특성을 [BLANK]성이라 한다.',
    answer: '개별',
    explanation: '개별성(비동질성): 세상에 완전히 동일한 토지는 존재하지 않는다.',
  },
  {
    id: 'q_003',
    type: 'fill_in_the_blank',
    content:
      '부동산의 인문적 특성 중 용도의 [BLANK]성이란 하나의 토지가 여러 용도로 사용될 수 있음을 의미한다.',
    answer: '다양',
    explanation: '용도의 다양성: 토지는 주거, 상업, 공업, 농업 등 다양한 용도로 사용이 가능하다.',
  },
]

export const MC_QUESTIONS: MultipleChoiceQuestion[] = [
  {
    id: 'q_004',
    type: 'multiple_choice',
    year: 2023,
    content: '부동산의 자연적 특성에 해당하지 않는 것은?',
    options: [
      '부동성(위치의 고정성)',
      '영속성(불변성)',
      '부증성(비생산성)',
      '개별성(비동질성)',
      '병합·분할의 가능성',
    ],
    correctIndex: 4,
    explanation: '병합·분할의 가능성은 부동산의 인문적 특성에 해당한다.',
  },
  {
    id: 'q_005',
    type: 'multiple_choice',
    year: 2022,
    content: '부동산의 특성에 관한 설명으로 옳은 것은?',
    options: [
      '부동성으로 인해 부동산 활동이 지역화된다.',
      '영속성은 인문적 특성에 해당한다.',
      '부증성은 경제적 공급도 불가능하게 한다.',
      '개별성은 부동산의 인문적 특성이다.',
      '토지의 자연적 특성은 인간의 노력으로 변경 가능하다.',
    ],
    correctIndex: 0,
    explanation: '부동성으로 인해 부동산 활동은 지역성을 가지게 된다.',
  },
  {
    id: 'q_006',
    type: 'multiple_choice',
    year: 2023,
    content: '부동산의 개념에 관한 설명으로 틀린 것은?',
    options: [
      '물리적 개념의 부동산은 공간, 자연, 위치, 환경을 의미한다.',
      '민법상 부동산은 토지 및 그 정착물이다.',
      '경제적 개념의 부동산은 생산, 소비, 분배, 투자의 대상이다.',
      '법률적 개념의 부동산에서 미등기 건물도 부동산에 포함된다.',
      '복합부동산이란 토지만을 의미한다.',
    ],
    correctIndex: 4,
    explanation: '복합부동산은 토지와 건물 등이 결합된 상태의 부동산을 의미한다.',
  },
]

export const ALL_QUESTIONS: Question[] = [...BLANK_QUESTIONS, ...MC_QUESTIONS]

export const PROGRESS_ALL_CORRECT: ChapterProgress = {
  correctIds: ['q_004', 'q_005', 'q_006'],
  wrongIds: [],
  revealedIds: ['q_001'],
  totalMc: 3,
  totalBlank: 3,
}

export const PROGRESS_MIXED: ChapterProgress = {
  correctIds: ['q_004'],
  wrongIds: ['q_005', 'q_006'],
  revealedIds: [],
  totalMc: 3,
  totalBlank: 3,
}

export const PROGRESS_EMPTY: ChapterProgress = {
  correctIds: [],
  wrongIds: [],
  revealedIds: [],
  totalMc: 0,
  totalBlank: 0,
}

export const MOCK_CURRICULUM: Curriculum = {
  examId: 'realtor',
  subjects: [
    {
      id: 's1',
      name: '부동산학개론',
      chapters: [
        { id: 'ch1', name: '부동산의 개념' },
        { id: 'ch2', name: '부동산의 특성' },
      ],
    },
    {
      id: 's2',
      name: '민법 및 민사특별법',
      chapters: [{ id: 'ch1', name: '총칙' }],
    },
  ],
}

export function mockFetch(data: unknown = ALL_QUESTIONS) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: () => Promise.resolve(data),
  } as Response)
}

export function mockFetchMultiple(responses: Record<string, unknown>) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
    const urlStr = typeof url === 'string' ? url : url.toString()
    for (const [pattern, data] of Object.entries(responses)) {
      if (urlStr.includes(pattern)) {
        return Promise.resolve({
          json: () => Promise.resolve(data),
        } as Response)
      }
    }
    return Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response)
  })
}
