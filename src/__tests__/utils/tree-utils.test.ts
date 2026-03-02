import { describe, expect, it } from 'vitest'

import {
  addChildNode,
  countNodes,
  deepCloneTree,
  filterTree,
  findNodeById,
  findParentNode,
  flattenTree,
  generateNodeId,
  getChildLevel,
  getLevelColor,
  getLevelLabel,
  removeNode,
  updateNodeInTree,
} from '@/utils/tree-utils'
import type { TreeNode } from '@/types/tree'

const sampleTree: TreeNode[] = [
  {
    id: 'root-1',
    label: '대단원 1',
    level: 'major',
    importance: 3,
    examFrequency: '매회 5문제',
    children: [
      {
        id: 'mid-1',
        label: '중단원 1',
        level: 'middle',
        children: [
          { id: 'min-1', label: '소단원 1', level: 'minor' },
          { id: 'min-2', label: '소단원 2', level: 'minor', description: '설명 텍스트' },
        ],
      },
      {
        id: 'mid-2',
        label: '중단원 2',
        level: 'middle',
        children: [{ id: 'min-3', label: '소단원 3', level: 'minor' }],
      },
    ],
  },
  {
    id: 'root-2',
    label: '대단원 2',
    level: 'major',
  },
]

describe('getLevelLabel', () => {
  it('returns Korean labels for all levels', () => {
    expect(getLevelLabel('subject')).toBe('과목')
    expect(getLevelLabel('major')).toBe('대단원')
    expect(getLevelLabel('middle')).toBe('중단원')
    expect(getLevelLabel('minor')).toBe('소단원')
    expect(getLevelLabel('category')).toBe('분류')
    expect(getLevelLabel('concept')).toBe('개념')
    expect(getLevelLabel('description')).toBe('설명')
  })
})

describe('getLevelColor', () => {
  it('returns tailwind classes for each level', () => {
    expect(getLevelColor('major')).toContain('bg-blue')
    expect(getLevelColor('middle')).toContain('bg-emerald')
    expect(getLevelColor('minor')).toContain('bg-amber')
  })
})

describe('getChildLevel', () => {
  it('returns correct child hierarchy', () => {
    expect(getChildLevel('subject')).toBe('major')
    expect(getChildLevel('major')).toBe('middle')
    expect(getChildLevel('middle')).toBe('minor')
    expect(getChildLevel('minor')).toBe('category')
    expect(getChildLevel('concept')).toBe('description')
  })

  it('description maps to description (leaf)', () => {
    expect(getChildLevel('description')).toBe('description')
  })
})

describe('findNodeById', () => {
  it('finds root node', () => {
    expect(findNodeById(sampleTree, 'root-1')?.label).toBe('대단원 1')
  })

  it('finds deeply nested node', () => {
    expect(findNodeById(sampleTree, 'min-2')?.label).toBe('소단원 2')
  })

  it('returns null for non-existent id', () => {
    expect(findNodeById(sampleTree, 'non-existent')).toBeNull()
  })
})

describe('findParentNode', () => {
  it('finds parent of middle node', () => {
    expect(findParentNode(sampleTree, 'mid-1')?.id).toBe('root-1')
  })

  it('finds parent of leaf node', () => {
    expect(findParentNode(sampleTree, 'min-1')?.id).toBe('mid-1')
  })

  it('returns null for root node', () => {
    expect(findParentNode(sampleTree, 'root-1')).toBeNull()
  })
})

describe('deepCloneTree', () => {
  it('creates a deep copy', () => {
    const cloned = deepCloneTree(sampleTree)
    expect(cloned).toEqual(sampleTree)
    expect(cloned).not.toBe(sampleTree)
    expect(cloned[0]).not.toBe(sampleTree[0])
  })

  it('mutations to clone do not affect original', () => {
    const cloned = deepCloneTree(sampleTree)
    cloned[0].label = 'changed'
    expect(sampleTree[0].label).toBe('대단원 1')
  })
})

describe('removeNode', () => {
  it('removes a leaf node', () => {
    const tree = deepCloneTree(sampleTree)
    expect(removeNode(tree, 'min-1')).toBe(true)
    expect(findNodeById(tree, 'min-1')).toBeNull()
  })

  it('removes a branch with children', () => {
    const tree = deepCloneTree(sampleTree)
    expect(removeNode(tree, 'mid-1')).toBe(true)
    expect(findNodeById(tree, 'mid-1')).toBeNull()
    expect(findNodeById(tree, 'min-1')).toBeNull()
  })

  it('returns false for non-existent id', () => {
    const tree = deepCloneTree(sampleTree)
    expect(removeNode(tree, 'non-existent')).toBe(false)
  })
})

describe('addChildNode', () => {
  it('adds a child to a parent', () => {
    const tree = deepCloneTree(sampleTree)
    const newNode: TreeNode = { id: 'new-1', label: '새 노드', level: 'minor' }
    expect(addChildNode(tree, 'mid-2', newNode)).toBe(true)
    const parent = findNodeById(tree, 'mid-2')
    expect(parent?.children).toHaveLength(2)
  })

  it('creates children array if missing', () => {
    const tree = deepCloneTree(sampleTree)
    const newNode: TreeNode = { id: 'new-2', label: '새 노드', level: 'middle' }
    expect(addChildNode(tree, 'root-2', newNode)).toBe(true)
    expect(findNodeById(tree, 'root-2')?.children).toHaveLength(1)
  })

  it('returns false for non-existent parent', () => {
    const tree = deepCloneTree(sampleTree)
    const newNode: TreeNode = { id: 'new-3', label: '새 노드', level: 'minor' }
    expect(addChildNode(tree, 'non-existent', newNode)).toBe(false)
  })
})

describe('updateNodeInTree', () => {
  it('updates node label and importance', () => {
    const tree = deepCloneTree(sampleTree)
    expect(updateNodeInTree(tree, 'min-1', { label: '수정됨', importance: 5 })).toBe(true)
    const node = findNodeById(tree, 'min-1')
    expect(node?.label).toBe('수정됨')
    expect(node?.importance).toBe(5)
  })

  it('returns false for non-existent id', () => {
    const tree = deepCloneTree(sampleTree)
    expect(updateNodeInTree(tree, 'non-existent', { label: 'x' })).toBe(false)
  })
})

describe('generateNodeId', () => {
  it('generates id with parent prefix', () => {
    const id = generateNodeId('parent-1')
    expect(id).toMatch(/^parent-1-/)
  })
})

describe('countNodes', () => {
  it('counts all nodes including nested', () => {
    expect(countNodes(sampleTree)).toBe(7)
  })

  it('returns 0 for empty array', () => {
    expect(countNodes([])).toBe(0)
  })
})

describe('flattenTree', () => {
  it('returns all nodes in flat array', () => {
    const flat = flattenTree(sampleTree)
    expect(flat).toHaveLength(7)
    expect(flat.map((n) => n.id)).toContain('min-2')
  })
})

describe('filterTree', () => {
  it('returns full tree for empty query', () => {
    expect(filterTree(sampleTree, '')).toEqual(sampleTree)
  })

  it('filters by label match', () => {
    const result = filterTree(sampleTree, '소단원 2')
    expect(result).toHaveLength(1)
    const mid = result[0].children?.[0]
    expect(mid?.children?.some((n) => n.label === '소단원 2')).toBe(true)
  })

  it('filters by description match', () => {
    const result = filterTree(sampleTree, '설명 텍스트')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns empty for no matches', () => {
    expect(filterTree(sampleTree, '존재하지않는검색어')).toHaveLength(0)
  })
})
