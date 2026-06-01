import { describe, it, expect } from 'vitest'
import {
  listToTree,
  treeToList,
  findNode,
  getNodePath,
  filterTree,
  getLeafNodes,
  type TreeNode,
} from './tree'

// ============ 测试数据 ============

const flatList: TreeNode[] = [
  { id: 1, parentId: null, name: '根1' },
  { id: 2, parentId: 1, name: '子1-1' },
  { id: 3, parentId: 1, name: '子1-2' },
  { id: 4, parentId: 2, name: '孙1-1-1' },
  { id: 5, parentId: null, name: '根2' },
  { id: 6, parentId: 5, name: '子2-1' },
]

function buildTree() {
  return listToTree(flatList)
}

// ============ listToTree ============

describe('listToTree', () => {
  it('将扁平数组转为树形结构', () => {
    const tree = buildTree()
    expect(tree).toHaveLength(2) // 两个根节点
    expect(tree[0].children).toHaveLength(2) // 根1 有两个子节点
    expect(tree[0].children![0].children).toHaveLength(1) // 子1-1 有一个子节点
  })

  it('空数组返回空树', () => {
    expect(listToTree([])).toEqual([])
  })

  it('自定义 rootId', () => {
    const list = [
      { id: 1, parentId: 0, name: '根' },
      { id: 2, parentId: 1, name: '子' },
    ]
    const tree = listToTree(list, 0)
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('根')
  })

  it('找不到父节点的项作为根节点', () => {
    const list = [
      { id: 1, parentId: 999, name: '孤儿' },
      { id: 2, parentId: 1, name: '子' },
    ]
    const tree = listToTree(list)
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('孤儿')
  })

  it('所有节点都是根节点', () => {
    const list = [
      { id: 1, parentId: null },
      { id: 2, parentId: null },
      { id: 3, parentId: null },
    ]
    expect(listToTree(list)).toHaveLength(3)
  })

  it('parentId 为 0 视为根节点', () => {
    const list = [
      { id: 1, parentId: 0, name: '根' },
      { id: 2, parentId: 1, name: '子' },
    ]
    const tree = listToTree(list)
    expect(tree).toHaveLength(1)
  })

  it('parentId 为空字符串视为根节点', () => {
    const list = [
      { id: 1, parentId: '', name: '根' },
      { id: 2, parentId: 1, name: '子' },
    ]
    const tree = listToTree(list)
    expect(tree).toHaveLength(1)
  })
})

// ============ treeToList ============

describe('treeToList', () => {
  it('将树形结构转为扁平数组', () => {
    const tree = buildTree()
    const list = treeToList(tree)
    expect(list).toHaveLength(6)
    // 不应包含 children 属性
    list.forEach((item) => {
      expect(item).not.toHaveProperty('children')
    })
  })

  it('空树返回空数组', () => {
    expect(treeToList([])).toEqual([])
  })

  it('单层树（无子节点）', () => {
    const tree = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    expect(treeToList(tree)).toHaveLength(2)
  })

  it('深层嵌套正确展开', () => {
    const tree = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [{ id: 3, children: [] }],
          },
        ],
      },
    ]
    const list = treeToList(tree)
    expect(list).toHaveLength(3)
    expect(list.map((n) => n.id)).toEqual([1, 2, 3])
  })
})

// ============ findNode ============

describe('findNode', () => {
  it('找到顶层节点', () => {
    const tree = buildTree()
    const node = findNode(tree, (n) => n.id === 1)
    expect(node).not.toBeNull()
    expect(node!.name).toBe('根1')
  })

  it('找到深层嵌套节点', () => {
    const tree = buildTree()
    const node = findNode(tree, (n) => n.id === 4)
    expect(node).not.toBeNull()
    expect(node!.name).toBe('孙1-1-1')
  })

  it('找不到返回 null', () => {
    const tree = buildTree()
    expect(findNode(tree, (n) => n.id === 999)).toBeNull()
  })

  it('空树返回 null', () => {
    expect(findNode([], () => true)).toBeNull()
  })

  it('按自定义条件查找', () => {
    const tree = buildTree()
    const node = findNode(tree, (n) => n.name === '子2-1')
    expect(node).not.toBeNull()
    expect(node!.id).toBe(6)
  })
})

// ============ getNodePath ============

describe('getNodePath', () => {
  it('获取根节点路径（只有自身）', () => {
    const tree = buildTree()
    const path = getNodePath(tree, 1)
    expect(path).toHaveLength(1)
    expect(path[0].id).toBe(1)
  })

  it('获取深层节点路径', () => {
    const tree = buildTree()
    const path = getNodePath(tree, 4)
    expect(path.map((n) => n.id)).toEqual([1, 2, 4])
  })

  it('不存在的节点返回空数组', () => {
    const tree = buildTree()
    expect(getNodePath(tree, 999)).toEqual([])
  })

  it('空树返回空数组', () => {
    expect(getNodePath([], 1)).toEqual([])
  })
})

// ============ filterTree ============

describe('filterTree', () => {
  it('保留满足条件的节点及其祖先', () => {
    const tree = buildTree()
    const filtered = filterTree(tree, (n) => n.id === 4)
    // 根1 -> 子1-1 -> 孙1-1-1
    expect(filtered).toHaveLength(1) // 只有根1
    expect(filtered[0].children).toHaveLength(1) // 只有子1-1
    expect(filtered[0].children![0].children).toHaveLength(1) // 孙1-1-1
  })

  it('无匹配返回空数组', () => {
    const tree = buildTree()
    expect(filterTree(tree, () => false)).toEqual([])
  })

  it('全部匹配返回完整树', () => {
    const tree = buildTree()
    const filtered = filterTree(tree, () => true)
    expect(filtered).toHaveLength(2)
  })

  it('空树返回空数组', () => {
    expect(filterTree([], () => true)).toEqual([])
  })

  it('按名称过滤', () => {
    const tree = buildTree()
    const filtered = filterTree(tree, (n) => n.name === '子2-1')
    expect(filtered).toHaveLength(1) // 根2
    expect(filtered[0].children).toHaveLength(1)
    expect(filtered[0].children![0].name).toBe('子2-1')
  })
})

// ============ getLeafNodes ============

describe('getLeafNodes', () => {
  it('获取所有叶子节点', () => {
    const tree = buildTree()
    const leaves = getLeafNodes(tree)
    const leafIds = leaves.map((n) => n.id).sort()
    // 叶子节点: 3(子1-2), 4(孙1-1-1), 6(子2-1)
    expect(leafIds).toEqual([3, 4, 6])
  })

  it('空树返回空数组', () => {
    expect(getLeafNodes([])).toEqual([])
  })

  it('全是叶子节点', () => {
    const tree = [
      { id: 1, children: [] },
      { id: 2, children: [] },
    ]
    expect(getLeafNodes(tree)).toHaveLength(2)
  })

  it('单节点树', () => {
    expect(getLeafNodes([{ id: 1 }])).toHaveLength(1)
  })

  it('深层嵌套的叶子', () => {
    const tree = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [{ id: 3 }],
          },
        ],
      },
    ]
    const leaves = getLeafNodes(tree)
    expect(leaves).toHaveLength(1)
    expect(leaves[0].id).toBe(3)
  })
})
