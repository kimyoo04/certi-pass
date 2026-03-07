import { readFileSync } from 'fs'
import { resolve } from 'path'

const DATA_DIR = resolve(__dirname, '../../../public/data/realtor')

function loadJson(relativePath: string) {
  const fullPath = resolve(DATA_DIR, relativePath)
  return JSON.parse(readFileSync(fullPath, 'utf-8'))
}

const SUBJECTS = ['s1', 's2', 's3', 's4', 's5', 's6']
const YEARS_2019 = { s1: 40, s2: 40, s3: 40, s4: 20, s5: 40, s6: 20 }

describe('Quiz data integrity', () => {
  describe('curriculum.json', () => {
    const curriculum = loadJson('curriculum.json')

    it('has all 6 subjects', () => {
      const ids = curriculum.subjects.map((s: { id: string }) => s.id)
      expect(ids).toEqual(SUBJECTS)
    })

    it('each subject has 2019 year chapter', () => {
      for (const subj of curriculum.subjects) {
        const chapterIds = subj.chapters.map((c: { id: string }) => c.id)
        expect(chapterIds).toContain('y2019')
      }
    })

    it("each subject has 'all' chapter as first entry", () => {
      for (const subj of curriculum.subjects) {
        expect(subj.chapters[0].id).toBe('all')
      }
    })

    it('year chapters are in descending order', () => {
      for (const subj of curriculum.subjects) {
        const yearChapters = subj.chapters
          .filter((c: { id: string }) => c.id.startsWith('y'))
          .map((c: { id: string }) => parseInt(c.id.slice(1)))
        const sorted = [...yearChapters].sort((a, b) => b - a)
        expect(yearChapters).toEqual(sorted)
      }
    })
  })

  describe('2019 quiz files', () => {
    for (const sid of SUBJECTS) {
      describe(`${sid}/y2019_quiz.json`, () => {
        const questions = loadJson(`${sid}/y2019_quiz.json`)
        const expectedCount = YEARS_2019[sid as keyof typeof YEARS_2019]

        it(`has ${expectedCount} questions`, () => {
          expect(questions).toHaveLength(expectedCount)
        })

        it('all questions have year 2019', () => {
          for (const q of questions) {
            expect(q.year).toBe(2019)
          }
        })

        it('all questions have required fields', () => {
          for (const q of questions) {
            expect(q).toHaveProperty('id')
            expect(q).toHaveProperty('type', 'multiple_choice')
            expect(q).toHaveProperty('content')
            expect(q).toHaveProperty('options')
            expect(q).toHaveProperty('correctIndex')
            expect(typeof q.content).toBe('string')
            expect(q.content.length).toBeGreaterThan(0)
          }
        })

        it('all questions have exactly 5 options', () => {
          for (const q of questions) {
            expect(q.options).toHaveLength(5)
          }
        })

        it('correctIndex is within valid range (0-4)', () => {
          for (const q of questions) {
            expect(q.correctIndex).toBeGreaterThanOrEqual(0)
            expect(q.correctIndex).toBeLessThanOrEqual(4)
          }
        })

        it('all question IDs are unique', () => {
          const ids = questions.map((q: { id: string }) => q.id)
          expect(new Set(ids).size).toBe(ids.length)
        })

        it('no empty options', () => {
          for (const q of questions) {
            for (const opt of q.options) {
              expect(typeof opt).toBe('string')
              expect(opt.length).toBeGreaterThan(0)
            }
          }
        })
      })
    }
  })

  describe('all_quiz.json files include 2019', () => {
    for (const sid of SUBJECTS) {
      it(`${sid}/all_quiz.json contains 2019 questions`, () => {
        const allQuestions = loadJson(`${sid}/all_quiz.json`)
        const q2019 = allQuestions.filter((q: { year: number }) => q.year === 2019)
        const expectedCount = YEARS_2019[sid as keyof typeof YEARS_2019]
        expect(q2019).toHaveLength(expectedCount)
      })
    }
  })

  describe('all_quiz.json data consistency', () => {
    for (const sid of SUBJECTS) {
      it(`${sid}/all_quiz.json questions are sorted by year descending`, () => {
        const allQuestions = loadJson(`${sid}/all_quiz.json`)
        const mcQuestions = allQuestions.filter(
          (q: { type: string }) => q.type === 'multiple_choice',
        )
        for (let i = 1; i < mcQuestions.length; i++) {
          expect(mcQuestions[i - 1].year).toBeGreaterThanOrEqual(mcQuestions[i].year)
        }
      })
    }
  })
})
