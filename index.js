const data = [1, 7, 4, 23, 8, 9, 4, 3, 32, 5, 7, 9, 67, 6345, 89, 324];
// data.filter((value, index, array) => array.indexOf(value) === index);

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        let sortedArray = [...new Set(array)].sort((a, b) => a - b);
        return this.treeBuild(0, sortedArray.length - 1, sortedArray);
    }

    treeBuild(start, end, array) {
        if (start > end) return null;

        let mid = Math.floor((start + end) / 2);
        let head = new Node(array[mid]);

        head.leftNode = this.treeBuild(start, mid - 1, array);
        head.rightNode = this.treeBuild(mid + 1, end, array);

        return head;
    }

    prettyPrint(node = this.root, prefix = '', isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.rightNode !== null) {
            this.prettyPrint(
                node.rightNode,
                `${prefix}${isLeft ? '│   ' : '    '}`,
                false
            );
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        if (node.leftNode !== null) {
            this.prettyPrint(
                node.leftNode,
                `${prefix}${isLeft ? '    ' : '│   '}`,
                true
            );
        }
    }

    insert(value) {
        let currentNode = this.root;
        if (!(value instanceof Node)) {
            value = new Node(value);
        }

        function addNode(currentNode) {
            if (!currentNode) {
                return value;
            }
            if (currentNode.value === value.value) return currentNode;

            if (currentNode.value > value.value) {
                currentNode.leftNode = addNode(currentNode.leftNode);
            } else {
                currentNode.rightNode = addNode(currentNode.rightNode);
            }

            return currentNode;
        }
        this.root = addNode(currentNode);
    }

    delete(value) {
        this.root = this.removeNode(this.root, value);
    }

    removeNode(currentNode, value) {
        if (!currentNode) {
            return currentNode;
        }

        if (currentNode.value > value) {
            currentNode.leftNode = this.removeNode(currentNode.leftNode, value);
        } else if (currentNode.value < value) {
            currentNode.rightNode = this.removeNode(
                currentNode.rightNode,
                value
            );
        }

        if (currentNode.value === value) {
            if (!currentNode.rightNode && !currentNode.leftNode) {
                return null;
            } else if (!currentNode.rightNode) {
                return currentNode.leftNode;
            } else if (!currentNode.leftNode) {
                return currentNode.rightNode;
            } else {
                let temp = this.findMinValue(currentNode.rightNode);
                currentNode.value = temp;
                currentNode.rightNode = this.removeNode(
                    currentNode.rightNode,
                    temp
                );
                return currentNode;
            }
        }
        return currentNode;
    }

    findMinValue(node) {
        let minValue = node.value;
        while (node.leftNode) {
            minValue = node.leftNode.value;
            node = node.leftNode;
        }
        return minValue;
    }

    find(value) {
        return this.nodeSearch(this.root, value);
    }

    nodeSearch(currentNode, value) {
        if (!currentNode) return null;
        if (currentNode.value === value) return currentNode;

        if (currentNode.value > value) {
            return this.nodeSearch(currentNode.leftNode, value);
        } else if (currentNode.value < value) {
            return this.nodeSearch(currentNode.rightNode, value);
        }
    }

    levelOrder(cb = null) {
        let traversed = [];
        let yetToBeTraversed = [];

        if (this.root) yetToBeTraversed.push(this.root);

        while (yetToBeTraversed.length > 0) {
            let currentNode = yetToBeTraversed.shift();

            traversed.push(currentNode.value);
            if (currentNode.leftNode)
                yetToBeTraversed.push(currentNode.leftNode);
            if (currentNode.rightNode)
                yetToBeTraversed.push(currentNode.rightNode);

            if (cb) {
                cb(currentNode);
            }
        }

        return traversed;
    }

    levelOrderRecursive(cb = null) {
        const traverse = (nodes, result = []) => {
            if (nodes.length === 0) {
                return result;
            }

            const nextNodes = [];
            for (const node of nodes) {
                if (cb) {
                    cb(node);
                }

                result.push(node.value);

                if (node.leftNode) {
                    nextNodes.push(node.leftNode);
                }
                if (node.rightNode) {
                    nextNodes.push(node.rightNode);
                }
            }

            return traverse(nextNodes, result);
        };

        if (this.root) {
            return traverse([this.root]);
        }
    }

    inOrder(cb = null) {
        let traversed = [];
        function traverse(node) {
            if (node) {
                traverse(node.leftNode);
                traversed.push(node.value);
                if (cb) cb(node);
                traverse(node.rightNode);
            }
        }
        traverse(this.root);
        return traversed;
    }

    preOrder(cb = null) {
        let traversed = [];
        function traverse(node) {
            if (node) {
                traversed.push(node.value);
                if (cb) cb(node);
                traverse(node.leftNode);
                traverse(node.rightNode);
            }
        }
        traverse(this.root);
        return traversed;
    }

    postOrder(cb = null) {
        let traversed = [];
        function traverse(node) {
            if (node) {
                traverse(node.leftNode);
                traverse(node.rightNode);
                traversed.push(node.value);
                if (cb) cb(node);
            }
        }
        traverse(this.root);
        return traversed;
    }

    height(value) {
        let node = this.find(value);
        return this.findHeight(node);
    }

    findHeight(node) {
        if (!node) return -1;

        let left = this.findHeight(node.leftNode);
        let right = this.findHeight(node.rightNode);

        return left > right ? left + 1 : right + 1;
    }

    depth(value) {
        let node = this.find(value);
        return this.findDepth(this.root, node);
    }

    findDepth(root, node, depth = 0) {
        if (!root || !node) return -1;

        if (root.value === node.value) return depth;

        let left = this.findDepth(root.leftNode, node, depth + 1);
        let right = this.findDepth(root.rightNode, node, depth + 1);

        if (left !== -1) {
            return left;
        } else if (right !== -1) {
            return right;
        } else {
            return -1;
        }
    }

    isBst() {
        return this.bstCheck(this.root, -Infinity, Infinity);
    }

    bstCheck(currentNode, minValue, maxValue) {
        if (!currentNode) return true;

        if (
            currentNode.value > minValue &&
            currentNode.value < maxValue &&
            this.bstCheck(currentNode.leftNode, minValue, currentNode.value) &&
            this.bstCheck(currentNode.rightNode, currentNode.value, maxValue)
        ) {
            return true;
        }

        return false;
    }

    isBalanced() {
        return this.balancedCheck(this.root) !== -1;
    }

    balancedCheck(node) {
        if (!node) return 0;

        let left = this.balancedCheck(node.leftNode);
        let right = this.balancedCheck(node.rightNode);

        if (left == -1 || right == -1 || Math.abs(left - right) > 1) {
            return -1;
        }

        return Math.max(left, right) + 1;
    }

    rebalance() {
        let values = this.inOrder();
        return (this.root = this.buildTree(values));
    }
}

class Node {
    constructor(value) {
        this.value = value;
        this.leftNode = null;
        this.rightNode = null;
    }
}

let firstTree = new Tree(data);
firstTree.insert(89);
firstTree.insert(34);
firstTree.insert(894);
console.log(firstTree.isBalanced());
console.log(firstTree.prettyPrint());

console.log(firstTree.rebalance());
console.log(firstTree.isBalanced());
console.log(firstTree.prettyPrint());
