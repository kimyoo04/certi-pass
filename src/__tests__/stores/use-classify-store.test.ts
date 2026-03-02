import { useClassifyStore } from '@/stores/use-classify-store'

describe('useClassifyStore', () => {
  beforeEach(() => {
    useClassifyStore.setState({
      overrides: {},
      defaults: {},
    })
  })

  describe('loadDefaults', () => {
    it('stores default classification data', () => {
      const defaults = {
        s1_q0001: 's1-m1-c1-t1',
        s1_q0002: 's1-m2-c1-t2',
      }

      useClassifyStore.getState().loadDefaults(defaults)

      expect(useClassifyStore.getState().defaults).toEqual(defaults)
    })

    it('replaces existing defaults', () => {
      useClassifyStore.getState().loadDefaults({ s1_q0001: 's1-m1-c1-t1' })
      useClassifyStore.getState().loadDefaults({ s1_q0003: 's1-m3-c1-t1' })

      expect(useClassifyStore.getState().defaults).toEqual({ s1_q0003: 's1-m3-c1-t1' })
    })
  })

  describe('getNodeId', () => {
    it('returns default classification when no override exists', () => {
      useClassifyStore.getState().loadDefaults({ s1_q0001: 's1-m1-c1-t1' })

      expect(useClassifyStore.getState().getNodeId('s1_q0001')).toBe('s1-m1-c1-t1')
    })

    it('returns override when both override and default exist', () => {
      useClassifyStore.getState().loadDefaults({ s1_q0001: 's1-m1-c1-t1' })
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m2-c2-t3')

      expect(useClassifyStore.getState().getNodeId('s1_q0001')).toBe('s1-m2-c2-t3')
    })

    it('returns undefined for unclassified questions', () => {
      expect(useClassifyStore.getState().getNodeId('s1_q9999')).toBeUndefined()
    })
  })

  describe('setClassification', () => {
    it('adds a manual override', () => {
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m1-c1-t1')

      expect(useClassifyStore.getState().overrides).toEqual({
        s1_q0001: 's1-m1-c1-t1',
      })
    })

    it('updates existing override', () => {
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m1-c1-t1')
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m2-c2-t3')

      expect(useClassifyStore.getState().overrides.s1_q0001).toBe('s1-m2-c2-t3')
    })

    it('does not affect defaults', () => {
      useClassifyStore.getState().loadDefaults({ s1_q0001: 's1-m1-c1-t1' })
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m2-c2-t3')

      expect(useClassifyStore.getState().defaults.s1_q0001).toBe('s1-m1-c1-t1')
    })
  })

  describe('removeOverride', () => {
    it('removes a manual override', () => {
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m1-c1-t1')
      useClassifyStore.getState().removeOverride('s1_q0001')

      expect(useClassifyStore.getState().overrides.s1_q0001).toBeUndefined()
    })

    it('reverts to default after removing override', () => {
      useClassifyStore.getState().loadDefaults({ s1_q0001: 's1-m1-c1-t1' })
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m2-c2-t3')
      useClassifyStore.getState().removeOverride('s1_q0001')

      expect(useClassifyStore.getState().getNodeId('s1_q0001')).toBe('s1-m1-c1-t1')
    })

    it('does nothing for non-existent override', () => {
      useClassifyStore.getState().setClassification('s1_q0001', 's1-m1-c1-t1')
      useClassifyStore.getState().removeOverride('s1_q9999')

      expect(useClassifyStore.getState().overrides).toEqual({
        s1_q0001: 's1-m1-c1-t1',
      })
    })
  })
})
