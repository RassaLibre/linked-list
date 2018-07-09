# Linked list
A possible replacement for tree structures. Lets say you have a structure like this:

	[
		{ id: 'a', name: 'A', children: [
			{id: 'd', name: 'D', children: [
				{id: 'g', name: 'G', children: [
					{id: 'h', name: 'H', children: []}
				]},
				{id: 'i', name: 'I', children: []}
			]}
		]},
		{ id: 'b', name: 'B', children: [
			{id: 'e', name: 'E', children: []}
		]},
		{ id: 'c', name: 'C', children: [
			{id: 'f', name: 'F', children: []}
		]},
	]
	
This data structure comes with a lot of drawbacks, for example editing a property on a deeply nested node (like the node with id 8) might be an absolute nightmare. Not only that, just reading from the node requires quite an effort. Consider this instead:

	{
		'a' : { id: 'a', name: 'A', parent: null, nextSibling: 'b' },
		'b' : { id: 'b', name: 'B', parent: null, nextSibling: 'c' },
		'c' : { id: 'c', name: 'C', parent: null, nextSibling: null },
		'd' : { id: 'd', name: 'D', parent: 'a', nextSibling: null },
		'e' : { id: 'e', name: 'E', parent: 'b', nextSibling: null },
		'f' : { id: 'f', name: 'F', parent: 'c', nextSibling: null },
		'g' : { id: 'g', name: 'G', parent: 'd', nextSibling: 'i' },
		'h' : { id: 'h', name: 'H', parent: 'g', nextSibling: null },
		'i' : { id: 'i', name: 'I', parent: 'd', nextSibling: null }
	}
	
This data structure allows you to access any node from the structure. Each node has a reference to its parent and to its sibling on its "right" side. This means that the sibling with a reference `.nextSibling` equal to `null` is the last one.

## API

### Get the entire document
	getDocument()
	
### Get a specific node
	
	/**
	*	@param id... ID of the node
	*/
	getNode(id)
	
### Get top level nodes
Nodes which have their `.parent` set to `null`.

	getTopLevelNodes()
	
### Get children of a node

	/**
	*	@param id... ID of the parent
	*/
	getChildrenOf(id)
	
### Get siblings of a node
Including the node itself.
	
	/**
	*	@param id... ID of the node
	*/
	getSiblingsOf(id)
	
### Get last child of a parent

	/**
	*	@param id... parent id
	*/
	getLastChildOfParent(id)
	
### Get first child of a parent

	/**
	*	@param id... parent id
	*/
	getFirstChildOfParent(id)
	
### Get a previous sibling
It is the sibling that has `.nextSibling` set to the id you are passing to this function. In case you want to limit the scope, you can pass an array of nodes to as siblings. If no scope is defined, the function will search in the entire document.
	
	/**
	*	@param nodeId... id of the node the sibling refers to as nextSibling
	* 	@param Array<Number, Node>... scope
	*/
	getPreviousNode(nodeId, siblings = Object.values(this.document))
	
### Add a node to the end of children

	/**
	*	@param node... node to add
	* 	@param parent... id of the parental node
	*/	
	addNodeAtTheEnd(node, parent)
	
### Add a node to the beginning of children
	
	/**
	*	@param node... node to add
	* 	@param parent... id of the parental node
	*/	
	addNodeAtTheBeginning(node, parent)
	
### Add a node before node
	
	/**
	*	@param node... node to add
	*	@param nextNodeId... the node that shall go as next
	*/
	addNodeBefore(node, nextNodeId)
	
### Add a node after node
	
	/**
	*	@param node... node to add
	*	@param nextNodeId... the node that shall be before the passed node
	*/
	addNodeAfter(node, prevNodeId)
	
### Get a branch of parental nodes
Branch is an array of nodes linked via `.parent`. This allows you to get all the parent node all the way to the top of the document.
	
	/**
	*	@param id... id of the node you want a parental branch from
	*/
	getParentalBranch(id)
	
### Copy branch at the end of the chain
This function allows you to take a branch and attach the top to a node. 
	
	/**
	*	@param branch... array of linked nodes
	*	@param parentId... ID of the parent node
	*/
	copyBranchAtTheEndOf(branch, parentId)
	
### Remove node
Removes a node and all its children.
	
	/**
	*	@param id... id of the node
	*/
	removeNode(id)
	
### Get the good old array structure with children as props
If no nodes are passed, the function returns the entire document.

	toArrayStructure(nodes)

