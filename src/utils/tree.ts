/**
 * 树形数据处理工具
 * CMS 菜单、分类、组织架构等树形结构常用操作
 */

/** 通用树节点 */
export interface TreeNode {
  id: string | number
  parentId?: string | number | null
  children?: TreeNode[]
  [key: string]: unknown
}

/**
 * 扁平数组转树形结构
 * @param list 扁平列表，每项需包含 id 和 parentId
 * @param rootId 根节点的 parentId 值，默认 null / 0 / ''
 * @example
 * listToTree([
 *   { id: 1, parentId: null, name: '根' },
 *   { id: 2, parentId: 1, name: '子' },
 * ])
 */
export function listToTree<T extends TreeNode>(
  list: T[],
  rootId: string | number | null = null,
): T[] {
  const map = new Map<string | number, T & { children: T[] }>()
  const roots: T[] = []

  // 先建映射
  list.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  // 组装树
  list.forEach((item) => {
    const node = map.get(item.id)!
    const pid = item.parentId ?? null
    if (pid === rootId || pid === null || pid === undefined || pid === '' || pid === 0) {
      roots.push(node)
    } else {
      const parent = map.get(pid)
      if (parent) {
        parent.children.push(node)
      } else {
        // 找不到父节点，作为根节点
        roots.push(node)
      }
    }
  })

  return roots
}

/**
 * 树形结构转扁平数组
 */
export function treeToList<T extends TreeNode>(tree: T[]): T[] {
  const result: T[] = []

  function traverse(nodes: T[]) {
    nodes.forEach((node) => {
      const { children, ...rest } = node
      result.push(rest as T)
      if (children?.length) traverse(children as T[])
    })
  }

  traverse(tree)
  return result
}

/**
 * 在树中查找节点
 */
export function findNode<T extends TreeNode>(tree: T[], predicate: (node: T) => boolean): T | null {
  for (const node of tree) {
    if (predicate(node)) return node
    if (node.children?.length) {
      const found = findNode(node.children as T[], predicate)
      if (found) return found
    }
  }
  return null
}

/**
 * 获取节点的所有祖先路径（从根到当前节点）
 */
export function getNodePath<T extends TreeNode>(tree: T[], targetId: string | number): T[] {
  const path: T[] = []

  function dfs(nodes: T[]): boolean {
    for (const node of nodes) {
      path.push(node)
      if (node.id === targetId) return true
      if (node.children?.length && dfs(node.children as T[])) return true
      path.pop()
    }
    return false
  }

  dfs(tree)
  return path
}

/**
 * 过滤树（保留满足条件的节点及其祖先）
 * 常用于树形搜索
 */
export function filterTree<T extends TreeNode>(tree: T[], predicate: (node: T) => boolean): T[] {
  return tree.reduce<T[]>((acc, node) => {
    const filteredChildren = node.children?.length
      ? filterTree(node.children as T[], predicate)
      : []

    if (predicate(node) || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren })
    }

    return acc
  }, [])
}

/**
 * 获取所有叶子节点（没有 children 的节点）
 */
export function getLeafNodes<T extends TreeNode>(tree: T[]): T[] {
  const leaves: T[] = []

  function traverse(nodes: T[]) {
    nodes.forEach((node) => {
      if (!node.children?.length) {
        leaves.push(node)
      } else {
        traverse(node.children as T[])
      }
    })
  }

  traverse(tree)
  return leaves
}
