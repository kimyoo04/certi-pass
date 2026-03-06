import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    // shadcn/ui 컴포넌트는 라이브러리 패턴으로 일부 export가 현재 미사용이어도 유지
    'src/components/ui/**',
  ],
  ignoreDependencies: [
    // pnpm vitest run --coverage 에서 사용
    '@vitest/coverage-v8',
  ],
}

export default config
