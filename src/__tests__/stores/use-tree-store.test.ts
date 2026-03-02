import { beforeEach, describe, expect, it, vi } from 'vitest'

// Import the store AFTER the mock is registered
import { useTreeStore } from '@/stores/use-tree-store'
import { allSubjects } from '@/data/exam-tree'
import type { TreeNode } from '@/types/tree'

// ---------------------------------------------------------------------------
// Mock allSubjects so the store's getDefaultTree returns a known fixture.
// vi.mock is hoisted, so the factory must NOT reference outer variables.
// ---------------------------------------------------------------------------
vi.mock('@/data/exam-tree', () => ({
  allSubjects: [
    {
      id: 'sub-1',
      name: 'Mock Subject',
      examType: 'first',
      questionCount: 40,
      tree: [
        {
          id: 'root-1',
          label: 'Root Node',
          level: 'major',
          importance: 3,
          examFrequency: 'every time',
          children: [
            {
              id: 'child-1',
              label: 'Child Node',
              level: 'middle',
              children: [{ id: 'leaf-1', label: 'Leaf Node', level: 'minor' }],
            },
            {
              id: 'child-2',
              label: 'Child Node 2',
              level: 'middle',
            },
          ],
        },
      ],
    },
  ],
}))

// Derive mockTree from the mocked module so assertions stay in sync
const mockTree = allSubjects[0].tree

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useTreeStore', () => {
  beforeEach(() => {
    useTreeStore.setState({ customTrees: {} })
  })

  // -----------------------------------------------------------------------
  // getTree
  // -----------------------------------------------------------------------
  describe('getTree', () => {
    it('returns the default tree when no custom tree exists', () => {
      const tree = useTreeStore.getState().getTree('sub-1')
      expect(tree).toEqual(mockTree)
    })

    it('returns an empty array for an unknown subject', () => {
      const tree = useTreeStore.getState().getTree('unknown-subject')
      expect(tree).toEqual([])
    })

    it('returns the custom tree when one exists', () => {
      const customNode: TreeNode[] = [{ id: 'custom-root', label: 'Custom', level: 'major' }]
      useTreeStore.setState({ customTrees: { 'sub-1': customNode } })

      const tree = useTreeStore.getState().getTree('sub-1')
      expect(tree).toBe(customNode)
      expect(tree[0].label).toBe('Custom')
    })
  })

  // -----------------------------------------------------------------------
  // ensureMutable
  // -----------------------------------------------------------------------
  describe('ensureMutable', () => {
    it('creates a deep clone of the default tree and stores it', () => {
      const mutable = useTreeStore.getState().ensureMutable('sub-1')

      // Should be structurally equal but a distinct object (deep clone)
      expect(mutable).toEqual(mockTree)
      expect(mutable).not.toBe(mockTree)

      // Should be persisted in customTrees
      const stored = useTreeStore.getState().customTrees['sub-1']
      expect(stored).toBe(mutable)
    })

    it('returns existing custom tree without cloning again', () => {
      const first = useTreeStore.getState().ensureMutable('sub-1')
      const second = useTreeStore.getState().ensureMutable('sub-1')

      // Same reference -- no new clone was created
      expect(second).toBe(first)
    })

    it('deeply clones children so mutations do not affect the default tree', () => {
      const mutable = useTreeStore.getState().ensureMutable('sub-1')
      const clonedChild = findNode(mutable, 'child-1')
      const originalChild = findNode(mockTree, 'child-1')

      expect(clonedChild).not.toBe(originalChild)
      expect(clonedChild).toEqual(originalChild)
    })
  })

  // -----------------------------------------------------------------------
  // addNode
  // -----------------------------------------------------------------------
  describe('addNode', () => {
    it('adds a child node under the correct parent', () => {
      const newChild: TreeNode = {
        id: 'new-child',
        label: 'New Child',
        level: 'minor',
      }

      useTreeStore.getState().addNode('sub-1', 'child-1', newChild)

      const tree = useTreeStore.getState().getTree('sub-1')
      const parent = findNode(tree, 'child-1')
      expect(parent).not.toBeNull()
      expect(parent!.children).toBeDefined()

      const added = parent!.children!.find((c) => c.id === 'new-child')
      expect(added).toBeDefined()
      expect(added!.label).toBe('New Child')
      expect(added!.level).toBe('minor')
    })

    it('adds a child to a node that had no prior children', () => {
      const newChild: TreeNode = {
        id: 'leaf-child',
        label: 'Leaf Child',
        level: 'minor',
      }

      useTreeStore.getState().addNode('sub-1', 'child-2', newChild)

      const tree = useTreeStore.getState().getTree('sub-1')
      const parent = findNode(tree, 'child-2')
      expect(parent!.children).toHaveLength(1)
      expect(parent!.children![0].id).toBe('leaf-child')
    })

    it('does not mutate the previous custom tree reference (immutable update)', () => {
      useTreeStore.getState().ensureMutable('sub-1')
      const before = useTreeStore.getState().customTrees['sub-1']

      const child: TreeNode = { id: 'x', label: 'X', level: 'minor' }
      useTreeStore.getState().addNode('sub-1', 'root-1', child)

      const after = useTreeStore.getState().customTrees['sub-1']
      expect(after).not.toBe(before)
    })
  })

  // -----------------------------------------------------------------------
  // updateNode
  // -----------------------------------------------------------------------
  describe('updateNode', () => {
    it('updates a node label', () => {
      useTreeStore.getState().updateNode('sub-1', 'child-1', {
        label: 'Updated Label',
      })

      const tree = useTreeStore.getState().getTree('sub-1')
      const node = findNode(tree, 'child-1')
      expect(node!.label).toBe('Updated Label')
    })

    it('updates a node importance', () => {
      useTreeStore.getState().updateNode('sub-1', 'root-1', {
        importance: 5,
      })

      const tree = useTreeStore.getState().getTree('sub-1')
      const node = findNode(tree, 'root-1')
      expect(node!.importance).toBe(5)
    })

    it('updates multiple properties at once', () => {
      useTreeStore.getState().updateNode('sub-1', 'root-1', {
        label: 'New Label',
        importance: 1,
        examFrequency: 'rarely',
      })

      const tree = useTreeStore.getState().getTree('sub-1')
      const node = findNode(tree, 'root-1')
      expect(node!.label).toBe('New Label')
      expect(node!.importance).toBe(1)
      expect(node!.examFrequency).toBe('rarely')
    })

    it('preserves existing children after update', () => {
      useTreeStore.getState().updateNode('sub-1', 'child-1', {
        label: 'Changed',
      })

      const tree = useTreeStore.getState().getTree('sub-1')
      const node = findNode(tree, 'child-1')
      expect(node!.children).toBeDefined()
      expect(node!.children!.length).toBeGreaterThan(0)
      expect(node!.children![0].id).toBe('leaf-1')
    })

    it('does not mutate the previous custom tree reference', () => {
      useTreeStore.getState().ensureMutable('sub-1')
      const before = useTreeStore.getState().customTrees['sub-1']

      useTreeStore.getState().updateNode('sub-1', 'root-1', { label: 'X' })

      const after = useTreeStore.getState().customTrees['sub-1']
      expect(after).not.toBe(before)
    })
  })

  // -----------------------------------------------------------------------
  // deleteNode
  // -----------------------------------------------------------------------
  describe('deleteNode', () => {
    it('removes a leaf node', () => {
      useTreeStore.getState().deleteNode('sub-1', 'leaf-1')

      const tree = useTreeStore.getState().getTree('sub-1')
      const node = findNode(tree, 'leaf-1')
      expect(node).toBeNull()
    })

    it('removes a node with children (entire subtree)', () => {
      useTreeStore.getState().deleteNode('sub-1', 'child-1')

      const tree = useTreeStore.getState().getTree('sub-1')
      expect(findNode(tree, 'child-1')).toBeNull()
      expect(findNode(tree, 'leaf-1')).toBeNull()
    })

    it('preserves sibling nodes after deletion', () => {
      useTreeStore.getState().deleteNode('sub-1', 'child-1')

      const tree = useTreeStore.getState().getTree('sub-1')
      const root = findNode(tree, 'root-1')
      expect(root!.children).toHaveLength(1)
      expect(root!.children![0].id).toBe('child-2')
    })

    it('does not mutate the previous custom tree reference', () => {
      useTreeStore.getState().ensureMutable('sub-1')
      const before = useTreeStore.getState().customTrees['sub-1']

      useTreeStore.getState().deleteNode('sub-1', 'leaf-1')

      const after = useTreeStore.getState().customTrees['sub-1']
      expect(after).not.toBe(before)
    })
  })

  // -----------------------------------------------------------------------
  // resetSubject
  // -----------------------------------------------------------------------
  describe('resetSubject', () => {
    it('removes the custom tree for a subject', () => {
      useTreeStore.getState().ensureMutable('sub-1')
      expect(useTreeStore.getState().customTrees['sub-1']).toBeDefined()

      useTreeStore.getState().resetSubject('sub-1')
      expect(useTreeStore.getState().customTrees['sub-1']).toBeUndefined()
    })

    it('after reset, getTree falls back to the default tree', () => {
      useTreeStore.getState().updateNode('sub-1', 'root-1', {
        label: 'Modified',
      })

      useTreeStore.getState().resetSubject('sub-1')

      const tree = useTreeStore.getState().getTree('sub-1')
      expect(tree[0].label).toBe('Root Node')
    })

    it('does not affect custom trees for other subjects', () => {
      useTreeStore.getState().ensureMutable('sub-1')
      useTreeStore.setState((state) => ({
        customTrees: {
          ...state.customTrees,
          'sub-2': [{ id: 'other', label: 'Other', level: 'major' as const }],
        },
      }))

      useTreeStore.getState().resetSubject('sub-1')

      expect(useTreeStore.getState().customTrees['sub-1']).toBeUndefined()
      expect(useTreeStore.getState().customTrees['sub-2']).toBeDefined()
    })

    it('is a no-op for a subject that has no custom tree', () => {
      const before = { ...useTreeStore.getState().customTrees }
      useTreeStore.getState().resetSubject('nonexistent')
      const after = useTreeStore.getState().customTrees

      expect(after).toEqual(before)
    })
  })

  // -----------------------------------------------------------------------
  // resetAll
  // -----------------------------------------------------------------------
  describe('resetAll', () => {
    it('clears all custom trees', () => {
      useTreeStore.getState().ensureMutable('sub-1')
      useTreeStore.setState((state) => ({
        customTrees: {
          ...state.customTrees,
          'sub-2': [{ id: 's2', label: 'S2', level: 'major' as const }],
        },
      }))

      expect(Object.keys(useTreeStore.getState().customTrees).length).toBe(2)

      useTreeStore.getState().resetAll()

      expect(useTreeStore.getState().customTrees).toEqual({})
    })

    it('after resetAll, getTree falls back to default for all subjects', () => {
      useTreeStore.getState().updateNode('sub-1', 'root-1', {
        label: 'Custom Label',
      })

      useTreeStore.getState().resetAll()

      const tree = useTreeStore.getState().getTree('sub-1')
      expect(tree[0].label).toBe('Root Node')
    })
  })
})
