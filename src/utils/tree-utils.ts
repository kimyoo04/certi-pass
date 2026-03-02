import type { TreeLevel, TreeNode } from '@/types/tree'

/** Human-readable label for each tree level */
export function getLevelLabel(level: TreeLevel): string {
  const labels: Record<TreeLevel, string> = {
    subject: '과목',
    major: '대단원',
    middle: '중단원',
    minor: '소단원',
    category: '분류',
    concept: '개념',
    description: '설명',
  }
  return labels[level]
}

/** Tailwind color classes for each tree level */
export function getLevelColor(level: TreeLevel): string {
  const colors: Record<TreeLevel, string> = {
    subject: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    major: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    middle: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    minor: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    category: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    concept: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    description: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }
  return colors[level]
}

/** Get the expected child level for a given parent level */
export function getChildLevel(parentLevel: TreeLevel): TreeLevel {
  const hierarchy: Record<TreeLevel, TreeLevel> = {
    subject: 'major',
    major: 'middle',
    middle: 'minor',
    minor: 'category',
    category: 'concept',
    concept: 'description',
    description: 'description',
  }
  return hierarchy[parentLevel]
}

/** Find a node by ID in a tree (DFS) */
export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/** Find the parent of a node by child ID */
export function findParentNode(nodes: TreeNode[], childId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.children?.some((c) => c.id === childId)) return node
    if (node.children) {
      const found = findParentNode(node.children, childId)
      if (found) return found
    }
  }
  return null
}

/** Deep clone a tree array */
export function deepCloneTree(nodes: TreeNode[]): TreeNode[] {
  return JSON.parse(JSON.stringify(nodes))
}

/** Remove a node by ID from the tree, returns true if removed */
export function removeNode(nodes: TreeNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children && removeNode(nodes[i].children!, id)) {
      return true
    }
  }
  return false
}

/** Add a child node under a parent (found by ID). Returns true if added. */
export function addChildNode(nodes: TreeNode[], parentId: string, child: TreeNode): boolean {
  for (const node of nodes) {
    if (node.id === parentId) {
      if (!node.children) node.children = []
      node.children.push(child)
      return true
    }
    if (node.children && addChildNode(node.children, parentId, child)) {
      return true
    }
  }
  return false
}

/** Update a node's properties in-place. Returns true if found and updated. */
export function updateNodeInTree(
  nodes: TreeNode[],
  id: string,
  updates: Partial<Omit<TreeNode, 'id' | 'children'>>,
): boolean {
  for (const node of nodes) {
    if (node.id === id) {
      Object.assign(node, updates)
      return true
    }
    if (node.children && updateNodeInTree(node.children, id, updates)) {
      return true
    }
  }
  return false
}

/** Generate a unique node ID */
export function generateNodeId(parentId: string): string {
  return `${parentId}-${Date.now().toString(36)}`
}

/** Count total nodes in a tree */
export function countNodes(nodes: TreeNode[]): number {
  let count = 0
  for (const node of nodes) {
    count += 1
    if (node.children) count += countNodes(node.children)
  }
  return count
}

/** Flatten tree into a single array */
export function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.children) result.push(...flattenTree(node.children))
  }
  return result
}

/** Filter tree nodes by search text (keeps ancestors of matching nodes) */
export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes
  const lower = query.toLowerCase()

  return nodes.reduce<TreeNode[]>((acc, node) => {
    const labelMatch = node.label.toLowerCase().includes(lower)
    const descMatch = node.description?.toLowerCase().includes(lower) ?? false
    const filteredChildren = node.children ? filterTree(node.children, query) : []

    if (labelMatch || descMatch || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      })
    }
    return acc
  }, [])
}
