//Branch = an array of nodes which refer to one another via .parent property
export default class FlatDocumentStructure{

  constructor(document = {}){
    this.document = document
  }

  //  null => String
  _getUniqueKey(){
    const S4 = () =>
      (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    const id = `${S4()}${S4()}`
    if(!this.document[id]) return id
    else return this._getUniqueKey()
  }

  // Node, [Node] => Node
  _findPreviousSiblingOf(node, siblings = Object.values(this.document)){
    return siblings.find(s => s.nextSibling === node.id)
  }

  // [Node] => [Node]
  _orderSiblings(siblings){
    if(!siblings.length) return []
    const lastOne = siblings.find(s => !s.nextSibling)
    let orderedSiblings = [lastOne]
    let i = true
    while(i){
      i = this._findPreviousSiblingOf(orderedSiblings[orderedSiblings.length - 1], siblings)
      if(i) orderedSiblings.push(i)
    }
    return orderedSiblings.reverse()
  }

  getDocument(){
    return this.document
  }

  getNode(id){
    return this.document[id]
  }

  // null => [Nodes]
  getTopLevelNodes(){
    return this._orderSiblings(Object.values(this.document).filter(n => !n.parent))
  }

  // String => [Nodes]
  getChildrenOf(id){
    return this._orderSiblings(Object.values(this.document).filter(n => n.parent === id))
  }

  // String => [Nodes]
  getSiblingsOf(id){
    if(!this.document[id]) return null
    const node = this.document[id]
    if(!node.parent) return this.getTopLevelNodes()
    else return this.getChildrenOf(node.parent)
  }

  //  String => ?Node
  getLastChildOfParent(id){
    return Object.values(this.document)
      .find(node => node.parent === id && node.nextSibling === null)
  }

  // String => ?Node
  getFirstChildOfParent(id){
    const children = this.getChildrenOf(id)
    if(!children[0]) return undefined
    else return children[0]
  }

  // String, [Node] => Node
  getPreviousNode(nodeId, siblings = Object.values(this.document)){
    return siblings.find(node => node.nextSibling === nodeId)
  }

  // Node, String => ?Node
  addNodeAtTheEnd(node, parent){
    if(!this.document[parent]) return null
    const lastChild = this.getLastChildOfParent(parent)
    const newNode = { ...node, id: this._getUniqueKey(), parent, nextSibling: null }
    if(lastChild)
      this.document[lastChild.id] = { ...lastChild, nextSibling: newNode.id }
    this.document[newNode.id] = newNode
    return newNode
  }

  //  Node, String => ?Node
  addNodeAtTheBeginning(node, parent){
    if(!this.document[parent]) return null
    const firstChild = this.getFirstChildOfParent(parent)
    const newNode = { ...node, id: this._getUniqueKey(), parent, nextSibling: (firstChild) ? firstChild.id : null }
    this.document[newNode.id] = newNode
    return newNode
  }

  //  Node, String => ?Node
  addNodeBefore(node, nextNodeId){
    if(!this.document[nextNodeId]) return null
    const nextNode = this.document[nextNodeId]
    const previousNode = this.getPreviousNode(nextNodeId)
    const newNode = { ...node, id: this._getUniqueKey(), parent: nextNode.parent, nextSibling: nextNodeId }
    if(previousNode)
      this.document[previousNode.id] = { ...previousNode, nextSibling: newNode.id }
    this.document[newNode.id] = newNode
    return newNode
  }

  //  Node, String => Node
  addNodeAfter(node, prevNodeId){
    if(!this.document[prevNodeId]) return null
    const prevNode = this.document[prevNodeId]
    const newNode = { ...node, id: this._getUniqueKey(), parent: prevNode.parent, nextSibling: prevNode.nextSibling }
    this.document[prevNode.id] = { ...prevNode, nextSibling: newNode.id }
    this.document[newNode.id] = newNode
    return newNode
  }

  // String => ?Branch
  getParentalBranch(id){
    if(!this.document[id]) return null
    if(!this.document[id].parent) return []
    let branch = [], i = true, doc = this.document[id]
    while(i){
      doc = this.document[doc.parent]
      if(!doc) i = false
      else branch.push(doc)
    }
    return branch.reverse()
  }

  // Branch, String => ?Branch
  copyBranchAtTheEndOf(branch, parentId){
    if(!this.document[parentId]) return null
    if(!branch.length) return []
    const lastChildren = this.getLastChildOfParent(parentId)
    return branch.map((node, i) => {
      const newId = this._getUniqueKey()
      if(i === 0 && lastChildren)
        this.document[lastChildren.id] = { ...lastChildren, nextSibling: newId }
      this.document[newId] = { ...node, id: newId, parent: (i === 0) ? parentId : node.parent }
      return this.document[newId]
    })
  }

  removeNode(id){
    if(!this.document[id]) return null
    const node = this.document[id]
    //  if it is a last one, change the prev one to be the last
    if(!node.nextSibling){
      const prev = this.getPreviousNode(id)
      if(prev) this.document[prev.id] = { ...prev, nextSibling: null }
    }
    //  remove children
    const children = this.getChildrenOf(id)
    children.map(child => this.removeNode(id))
    //  remove the actual node
    delete this.document[id]
  }

  toArrayStructure(nodes){
    if(!nodes)
      nodes = this.getTopLevelNodes()
    const fillInChildren = parents => {
      return parents.map(n => ({ ...n, children: [...fillInChildren(this.getChildrenOf(n.id))] }))
    }
    return fillInChildren(nodes)
  }

}
