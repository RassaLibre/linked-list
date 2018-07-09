import FlatDocumentStructure from '../index.js'

let fds

beforeEach(() => {

  fds = new FlatDocumentStructure({
    "dfes" : { id: "dfes", parent: null, nextSibling: "wqsa"},
    "wqsa" : { id: "wqsa", parent: null, nextSibling: "fdwq" },
    "fdwq" : { id: "fdwq", parent: null, nextSibling: null },
    "lfrg" : { id: "lfrg", parent: "wqsa", nextSibling: "ertf" },
    "ertf" : { id: "ertf", parent: "wqsa", nextSibling: null },
    "dfre" : { id: "dfre", parent: "ertf", nextSibling: null }
  })

})

const ID_OF_NODE_WITH_CHILDREN = "wqsa"
const ID_OF_FIRST_CHILD_OF_NODE_WITH_CHILDREN = "lfrg"
const IF_OF_LAST_CHILD_OF_NODE_WITH_CHILDREN = "ertf"
const SAMPLE_OF_ORDERED_SIBLINGS = ["lfrg", "ertf"]
const SAMPLE_OF_PARENT_AND_SIBLINGS = { parentId: "wqsa", childrenIds: ["lfrg", "ertf"] }
const SAMPLE_OF_PARENTAL_BRANCH = { nodeId: 'dfre', branchIds: ["wqsa", "ertf"] }
const TARGET_FOR_SAMPLE_BRANCH = "ertf"
const LAST_CHILD_OF_SAMPLE_BRANCH = "dfre"
const SAMPLE_BRANCH = [
  { id: 'aaaa', parent: null, nextSibling: 'bbbb' },
  { id: 'cccc', parent: 'aaaa', nextSibling: 'dddd' }
]

test('should have defined FDS', () => {
  expect(fds).toBeDefined()
})

describe('getTopLevelNodes', () => {

  test('should return top level nodes', () => {
    const topLevel = fds.getTopLevelNodes()
    topLevel.map(node => expect(node.parent).toBeNull())
  })

  test('should order them from the first to last', () => {
    const topLevel = fds.getTopLevelNodes()
    const correct = topLevel.reduce((prev, cur) => {
      if(prev === null) return cur
      if(prev === false) return false
      if(prev.nextSibling === cur.id) return cur
    }, null)
    expect(correct).not.toBe(false)
    expect(topLevel[topLevel.length - 1].nextSibling).toBeNull()
  })

})

describe('getChildrenOf', () => {

  test('should return children of node', () => {
    const children = fds.getChildrenOf(ID_OF_NODE_WITH_CHILDREN)
    children.map(node => expect(node.parent).toBe(ID_OF_NODE_WITH_CHILDREN))
  })

  test('should order them from the first to last', () => {
    const children = fds.getChildrenOf(ID_OF_NODE_WITH_CHILDREN)
    const correct = children.reduce((prev, cur) => {
      if(prev === null) return cur
      if(prev === false) return false
      if(prev.nextSibling === cur.id) return cur
    }, null)
    expect(correct).not.toBe(false)
    expect(children[children.length - 1].nextSibling).toBeNull()
  })

})

describe('getLastChildOfParent', () => {

  test('should return last child of the parent', () => {
    const child = fds.getLastChildOfParent(ID_OF_NODE_WITH_CHILDREN)
    expect(child.parent).toBe(ID_OF_NODE_WITH_CHILDREN)
    expect(child.id).toBe(IF_OF_LAST_CHILD_OF_NODE_WITH_CHILDREN)
    expect(child.nextSibling).toBeNull()
  })

})

describe('getFirstChildOfParent', () => {

  test('should return first child of the parent', () => {
    const child = fds.getFirstChildOfParent(ID_OF_NODE_WITH_CHILDREN)
    expect(child.parent).toBe(ID_OF_NODE_WITH_CHILDREN)
    expect(child.id).toBe(ID_OF_FIRST_CHILD_OF_NODE_WITH_CHILDREN)
  })

})

describe('getPreviousNode', () => {

  test('should return previous sibling', () => {
    const previousSibling = fds.getPreviousNode(SAMPLE_OF_ORDERED_SIBLINGS[1])
    expect(previousSibling.id).toBe(SAMPLE_OF_ORDERED_SIBLINGS[0])
  })

})

describe('addNodeAtTheEnd', () => {

  let node

  beforeEach(() => {
    node = fds.addNodeAtTheEnd({}, SAMPLE_OF_PARENT_AND_SIBLINGS.parentId)
  })

  test('should not refer to any sibling', () => {
    expect(node.nextSibling)
      .toBeNull()
  })

  test('should have a correct parent', () => {
    expect(node.parent)
      .toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.parentId)
  })

  test('should set a reference of next sibling to the previously last node', () => {
    expect(fds.getNode(SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[1]).nextSibling)
      .toBe(node.id)
  })

})

describe('addNodeAtTheBeginning', () => {

  let node

  beforeEach(() => {
    node = fds.addNodeAtTheBeginning({}, SAMPLE_OF_PARENT_AND_SIBLINGS.parentId)
  })

  test('should add sibling at the beginning', () => {
    expect(node.nextSibling)
      .toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[0])
  })

  test('should set the correct parent to the node', () => {
    expect(node.parent)
      .toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.parentId)
  })

})

describe('addNodeBefore', () => {

  let node

  beforeEach(() => {
    node = fds.addNodeBefore({}, SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[1])
  })

  test('shoud have the next sibling set', () => {
    expect(node.nextSibling).toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[1])
  })

  test('should have the correct parent', () => {
    expect(node.parent).toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.parentId)
  })

  test('should be referred by previous node', () => {
    expect(fds.getNode(SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[0]).nextSibling)
      .toBe(node.id)
  })

})

describe('addNodeAfter', () => {

  let node

  beforeEach(() => {
    node = fds.addNodeAfter({}, SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[0])
  })

  test('should have the next sibling set', () => {
    expect(node.nextSibling).toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[1])
  })

  test('should have the correct parent', () => {
    expect(node.parent).toBe(SAMPLE_OF_PARENT_AND_SIBLINGS.parentId)
  })

  test('should be referred by previous node', () => {
    expect(fds.getNode(SAMPLE_OF_PARENT_AND_SIBLINGS.childrenIds[0]).nextSibling)
      .toBe(node.id)
  })

})

describe('getParentalBranch', () => {

  let branch

  beforeEach(() => {
    branch = fds.getParentalBranch(SAMPLE_OF_PARENTAL_BRANCH.nodeId)
  })

  test('should have the same number of levels', () => {
    expect(branch.length).toBe(SAMPLE_OF_PARENTAL_BRANCH.branchIds.length)
  })

  test('should have the branch correctly ordered', () => {
    branch.map((node, index) => {
      expect(node.id).toBe(SAMPLE_OF_PARENTAL_BRANCH.branchIds[index])
    })
  })

})

//  TODO: might want to cover this one a bit more
describe('copyBranchAtTheEndOf', () => {

  let branch

  beforeEach(() => {
    branch = fds.copyBranchAtTheEndOf(SAMPLE_BRANCH, TARGET_FOR_SAMPLE_BRANCH)
  })

  test('should set the parent on the first node in the branch', () => {
    expect(branch[0].parent).toBe(TARGET_FOR_SAMPLE_BRANCH)
  })

  test('should set new id for each node in branch', () => {
    SAMPLE_BRANCH.map((node, index) => {
      expect(node.id).not.toBe(branch[index].id)
    })
  })

  test('should be referred to by the previously last node', () => {
    expect(fds.getNode(LAST_CHILD_OF_SAMPLE_BRANCH).nextSibling).toBe(branch[0].id)
  })

  test('should place the nodes at the end', () => {
    branch.map(node => expect(node.nextSibling).toBeNull())
  })

})

//  TODO: cover this one a bit more
describe('toArrayStructure', () => {

  let arrayStructure

  beforeEach(() => {
    arrayStructure = fds.toArrayStructure()
  })

  test('should return an array', () => {
    expect(Array.isArray(arrayStructure)).toBe(true)
  })

})

