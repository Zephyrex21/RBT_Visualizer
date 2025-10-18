// Red-Black Tree Implementation
class RedBlackNode {
    constructor(value, color = 'red') {
        this.value = value;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        this.NIL = new RedBlackNode(null, 'black');
        this.NIL.left = this.NIL;
        this.NIL.right = this.NIL;
        this.NIL.parent = this.NIL;
        this.root = this.NIL;
    }

    insert(value) {
        const steps = [];
        steps.push({ text: `Inserting value ${value}`, type: 'info' });
        
        const newNode = new RedBlackNode(value);
        newNode.left = this.NIL;
        newNode.right = this.NIL;
        newNode.parent = this.NIL;
        
        let parent = this.NIL;
        let current = this.root;
        
        while (current !== this.NIL) {
            parent = current;
            if (newNode.value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        newNode.parent = parent;
        
        if (parent === this.NIL) {
            this.root = newNode;
            steps.push({ text: 'Tree was empty, new node is root', type: 'success' });
        } else if (newNode.value < parent.value) {
            parent.left = newNode;
            steps.push({ text: `Inserted as left child of ${parent.value}`, type: 'info' });
        } else {
            parent.right = newNode;
            steps.push({ text: `Inserted as right child of ${parent.value}`, type: 'info' });
        }
        
        steps.push({ text: 'Fixing violations...', type: 'warning' });
        this.insertFixup(newNode, steps);
        
        return steps;
    }

    insertFixup(node, steps) {
        while (node.parent.color === 'red') {
            if (node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right;
                
                if (uncle.color === 'red') {
                    steps.push({ text: 'Case 1: Uncle is red - Recoloring', type: 'info' });
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        steps.push({ text: 'Case 2: Triangle - Left rotation', type: 'info' });
                        node = node.parent;
                        this.leftRotate(node);
                    }
                    steps.push({ text: 'Case 3: Line - Right rotation', type: 'info' });
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rightRotate(node.parent.parent);
                }
            } else {
                const uncle = node.parent.parent.left;
                
                if (uncle.color === 'red') {
                    steps.push({ text: 'Case 1: Uncle is red - Recoloring', type: 'info' });
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        steps.push({ text: 'Case 2: Triangle - Right rotation', type: 'info' });
                        node = node.parent;
                        this.rightRotate(node);
                    }
                    steps.push({ text: 'Case 3: Line - Left rotation', type: 'info' });
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.leftRotate(node.parent.parent);
                }
            }
            
            if (node === this.root) break;
        }
        this.root.color = 'black';
        steps.push({ text: 'Root colored black - Tree balanced!', type: 'success' });
    }

    leftRotate(x) {
        const y = x.right;
        x.right = y.left;
        
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }
        
        y.parent = x.parent;
        
        if (x.parent === this.NIL) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        
        y.left = x;
        x.parent = y;
    }

    rightRotate(x) {
        const y = x.left;
        x.left = y.right;
        
        if (y.right !== this.NIL) {
            y.right.parent = x;
        }
        
        y.parent = x.parent;
        
        if (x.parent === this.NIL) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        
        y.right = x;
        x.parent = y;
    }

    delete(value) {
        const steps = [];
        steps.push({ text: `Deleting value ${value}`, type: 'info' });
        
        let node = this.search(value);
        if (node === this.NIL) {
            steps.push({ text: `Value ${value} not found`, type: 'error' });
            return steps;
        }
        
        let y = node;
        let yOriginalColor = y.color;
        let x = this.NIL;
        
        if (node.left === this.NIL) {
            x = node.right;
            this.transplant(node, node.right);
        } else if (node.right === this.NIL) {
            x = node.left;
            this.transplant(node, node.left);
        } else {
            y = this.minimum(node.right);
            yOriginalColor = y.color;
            x = y.right;
            
            if (y.parent !== node) {
                this.transplant(y, y.right);
                y.right = node.right;
                y.right.parent = y;
            }
            
            this.transplant(node, y);
            y.left = node.left;
            y.left.parent = y;
            y.color = node.color;
        }
        
        if (yOriginalColor === 'black') {
            steps.push({ text: 'Fixing violations after deletion...', type: 'warning' });
            this.deleteFixup(x, steps);
        }
        
        steps.push({ text: 'Deletion complete!', type: 'success' });
        return steps;
    }

    deleteFixup(x, steps) {
        while (x !== this.root && x.color === 'black') {
            if (x === x.parent.left) {
                let w = x.parent.right;
                
                if (w.color === 'red') {
                    steps.push({ text: 'Case 1: Sibling is red', type: 'info' });
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.leftRotate(x.parent);
                    w = x.parent.right;
                }
                
                if (w.left.color === 'black' && w.right.color === 'black') {
                    steps.push({ text: 'Case 2: Both children of sibling are black', type: 'info' });
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.right.color === 'black') {
                        steps.push({ text: 'Case 3: Right child of sibling is black', type: 'info' });
                        w.left.color = 'black';
                        w.color = 'red';
                        this.rightRotate(w);
                        w = x.parent.right;
                    }
                    
                    steps.push({ text: 'Case 4: Right child of sibling is red', type: 'info' });
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.right.color = 'black';
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let w = x.parent.left;
                
                if (w.color === 'red') {
                    steps.push({ text: 'Case 1: Sibling is red', type: 'info' });
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.rightRotate(x.parent);
                    w = x.parent.left;
                }
                
                if (w.right.color === 'black' && w.left.color === 'black') {
                    steps.push({ text: 'Case 2: Both children of sibling are black', type: 'info' });
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.left.color === 'black') {
                        steps.push({ text: 'Case 3: Left child of sibling is black', type: 'info' });
                        w.right.color = 'black';
                        w.color = 'red';
                        this.leftRotate(w);
                        w = x.parent.left;
                    }
                    
                    steps.push({ text: 'Case 4: Left child of sibling is red', type: 'info' });
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.left.color = 'black';
                    this.rightRotate(x.parent);
                    x = this.root;
                }
            }
            
            if (x === this.root) break;
        }
        x.color = 'black';
        steps.push({ text: 'Delete fixup complete!', type: 'success' });
    }

    transplant(u, v) {
        if (u.parent === this.NIL) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        v.parent = u.parent;
    }

    minimum(node) {
        while (node.left !== this.NIL) {
            node = node.left;
        }
        return node;
    }

    search(value) {
        let current = this.root;
        while (current !== this.NIL && current.value !== value) {
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return current;
    }

    getHeight(node = this.root) {
        if (node === this.NIL) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    getBlackHeight(node = this.root) {
        if (node === this.NIL) return 0;
        let leftHeight = this.getBlackHeight(node.left);
        let rightHeight = this.getBlackHeight(node.right);
        return Math.max(leftHeight, rightHeight) + (node.color === 'black' ? 1 : 0);
    }

    countNodes(node = this.root) {
        if (node === this.NIL) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    getInorderValues(node = this.root) {
        if (node === this.NIL) return [];
        return [
            ...this.getInorderValues(node.left),
            node.value,
            ...this.getInorderValues(node.right)
        ];
    }

    getPreorderValues(node = this.root) {
        if (node === this.NIL) return [];
        return [
            node.value,
            ...this.getPreorderValues(node.left),
            ...this.getPreorderValues(node.right)
        ];
    }

    getPostorderValues(node = this.root) {
        if (node === this.NIL) return [];
        return [
            ...this.getPostorderValues(node.left),
            ...this.getPostorderValues(node.right),
            node.value
        ];
    }

    // Helper function to find uncle of a node
    getUncle(node) {
        if (node.parent === this.NIL || node.parent.parent === this.NIL) {
            return this.NIL;
        }
        
        if (node.parent === node.parent.parent.left) {
            return node.parent.parent.right;
        } else {
            return node.parent.parent.left;
        }
    }

    // New method to serialize tree structure
    serialize() {
        return this.serializeNode(this.root);
    }

    serializeNode(node) {
        if (node === this.NIL) {
            return null;
        }
        
        return {
            value: node.value,
            color: node.color,
            left: this.serializeNode(node.left),
            right: this.serializeNode(node.right)
        };
    }

    // New method to deserialize tree structure
    deserialize(data) {
        this.root = this.NIL;
        if (data) {
            this.root = this.deserializeNode(data);
        }
    }

    deserializeNode(data) {
        if (!data) {
            return this.NIL;
        }
        
        const node = new RedBlackNode(data.value, data.color);
        node.left = this.deserializeNode(data.left);
        node.right = this.deserializeNode(data.right);
        
        if (node.left !== this.NIL) {
            node.left.parent = node;
        }
        if (node.right !== this.NIL) {
            node.right.parent = node;
        }
        
        return node;
    }
}

// AVL Tree Implementation
class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const steps = [];
        steps.push({ text: `Inserting value ${value}`, type: 'info' });
        this.root = this.insertNode(this.root, value, steps);
        steps.push({ text: 'AVL insertion complete!', type: 'success' });
        return steps;
    }

    insertNode(node, value, steps) {
        if (node === null) {
            steps.push({ text: `Created new node with value ${value}`, type: 'info' });
            return new AVLNode(value);
        }

        if (value < node.value) {
            steps.push({ text: `Going left from node ${node.value}`, type: 'info' });
            node.left = this.insertNode(node.left, value, steps);
        } else if (value > node.value) {
            steps.push({ text: `Going right from node ${node.value}`, type: 'info' });
            node.right = this.insertNode(node.right, value, steps);
        } else {
            return node; // Duplicate values not allowed
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        
        const balance = this.getBalance(node);
        steps.push({ text: `Node ${node.value} balance factor: ${balance}`, type: 'info' });

        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            steps.push({ text: 'Left-Left case: Right rotation', type: 'warning' });
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            steps.push({ text: 'Right-Right case: Left rotation', type: 'warning' });
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            steps.push({ text: 'Left-Right case: Left-Right rotation', type: 'warning' });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            steps.push({ text: 'Right-Left case: Right-Left rotation', type: 'warning' });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(value) {
        const steps = [];
        steps.push({ text: `Deleting value ${value}`, type: 'info' });
        this.root = this.deleteNode(this.root, value, steps);
        steps.push({ text: 'AVL deletion complete!', type: 'success' });
        return steps;
    }

    deleteNode(node, value, steps) {
        if (node === null) {
            steps.push({ text: `Value ${value} not found`, type: 'error' });
            return null;
        }

        if (value < node.value) {
            steps.push({ text: `Going left from node ${node.value}`, type: 'info' });
            node.left = this.deleteNode(node.left, value, steps);
        } else if (value > node.value) {
            steps.push({ text: `Going right from node ${node.value}`, type: 'info' });
            node.right = this.deleteNode(node.right, value, steps);
        } else {
            // Node with one child or no child
            if (node.left === null || node.right === null) {
                let temp = node.left || node.right;
                
                if (temp === null) {
                    steps.push({ text: `Removing leaf node ${node.value}`, type: 'info' });
                    node = null;
                } else {
                    steps.push({ text: `Replacing node ${node.value} with child`, type: 'info' });
                    node = temp;
                }
            } else {
                // Node with two children
                let temp = this.getMinValueNode(node.right);
                steps.push({ text: `Replacing node ${node.value} with successor ${temp.value}`, type: 'info' });
                node.value = temp.value;
                node.right = this.deleteNode(node.right, temp.value, steps);
            }
        }

        if (node === null) return node;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        
        const balance = this.getBalance(node);
        steps.push({ text: `Node ${node.value} balance factor: ${balance}`, type: 'info' });

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            steps.push({ text: 'Left-Left case: Right rotation', type: 'warning' });
            return this.rightRotate(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            steps.push({ text: 'Left-Right case: Left-Right rotation', type: 'warning' });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            steps.push({ text: 'Right-Right case: Left rotation', type: 'warning' });
            return this.leftRotate(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            steps.push({ text: 'Right-Left case: Right-Left rotation', type: 'warning' });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    leftRotate(z) {
        const y = z.right;
        const T2 = y.left;

        y.left = z;
        z.right = T2;

        z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

        return y;
    }

    rightRotate(z) {
        const y = z.left;
        const T3 = y.right;

        y.right = z;
        z.left = T3;

        z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

        return y;
    }

    getHeight(node) {
        if (node === null) return 0;
        return node.height;
    }

    getBalance(node) {
        if (node === null) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    getMinValueNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    search(value) {
        let current = this.root;
        while (current !== null && current.value !== value) {
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return current;
    }

    countNodes(node = this.root) {
        if (node === null) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    getHeightOfTree(node = this.root) {
        if (node === null) return 0;
        return node.height;
    }

    getInorderValues(node = this.root) {
        if (node === null) return [];
        return [
            ...this.getInorderValues(node.left),
            node.value,
            ...this.getInorderValues(node.right)
        ];
    }

    getPreorderValues(node = this.root) {
        if (node === null) return [];
        return [
            node.value,
            ...this.getPreorderValues(node.left),
            ...this.getPreorderValues(node.right)
        ];
    }

    getPostorderValues(node = this.root) {
        if (node === null) return [];
        return [
            ...this.getPostorderValues(node.left),
            ...this.getPostorderValues(node.right),
            node.value
        ];
    }

    // Helper function to find uncle of a node
    getUncle(node) {
        if (node.parent === null || node.parent.parent === null) {
            return null;
        }
        
        if (node.parent === node.parent.parent.left) {
            return node.parent.parent.right;
        } else {
            return node.parent.parent.left;
        }
    }

    // New method to serialize tree structure
    serialize() {
        return this.serializeNode(this.root);
    }

    serializeNode(node) {
        if (node === null) {
            return null;
        }
        
        return {
            value: node.value,
            left: this.serializeNode(node.left),
            right: this.serializeNode(node.right)
        };
    }

    // New method to deserialize tree structure
    deserialize(data) {
        this.root = this.deserializeNode(data);
    }

    deserializeNode(data) {
        if (!data) {
            return null;
        }
        
        const node = new AVLNode(data.value);
        node.left = this.deserializeNode(data.left);
        node.right = this.deserializeNode(data.right);
        
        // Recalculate height
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        
        return node;
    }
}

// Global variables
let currentTreeType = 'rb';
let rbTree = new RedBlackTree();
let avlTree = new AVLTree();
let showNullLeaves = false;
let operationHistory = [];
let animationTimeout = null;
let operationQueue = [];
let isProcessingQueue = false;
let currentStepInfo = null;
let animationSpeed = 600;
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let undoStack = [];
let isPlaying = true;
let lastOperationSteps = [];

// New variable to store tree states for conversion
let rbTreeState = null;
let avlTreeState = null;

// Tree type rules
const rbRules = [
    {
        number: 1,
        title: "Node Color",
        description: "Every node is red or black."
    },
    {
        number: 2,
        title: "Root Property",
        description: "Root is always black."
    },
    {
        number: 3,
        title: "Leaf Property",
        description: "All NIL leaves are black."
    },
    {
        number: 4,
        title: "Red Node Rule",
        description: "Red nodes have black children."
    },
    {
        number: 5,
        title: "Black Height",
        description: "Equal black nodes per path."
    }
];

const avlRules = [
    {
        number: 1,
        title: "Balance Factor",
        description: "Balance factor must be -1, 0, or 1."
    },
    {
        number: 2,
        title: "Binary Search",
        description: "Left < parent < right."
    },
    {
        number: 3,
        title: "Height Balance",
        description: "Always height-balanced."
    },
    {
        number: 4,
        title: "Rotations",
        description: "Rotations restore balance."
    },
    {
        number: 5,
        title: "Strict Balance",
        description: "More balanced than RB trees."
    }
];

// Algorithm templates
const rbInsertAlgorithm = `RB-Insert(T, k):
1. Insert new node k as RED
2. While parent is RED:
   - If uncle is RED: recolor
   - If uncle is BLACK: rotate
3. Color root BLACK`;

const avlInsertAlgorithm = `AVL-Insert(T, k):
1. Insert new node k
2. Update heights
3. Check balance factor
4. If unbalanced:
   - LL: Right rotate
   - RR: Left rotate
   - LR: Left-Right rotate
   - RL: Right-Left rotate`;

// Add detailed explanations for each operation
const algorithmExplanations = {
    rbInsert: {
        initial: "Starting Red-Black Tree insertion. We'll insert the new node as RED and then fix any violations of the Red-Black properties.",
        step1: "New node inserted as RED. This maintains the black-height property but may violate the rule that red nodes can't have red children.",
        case1: "UNCLE IS RED: Both parent and uncle are red. We recolor them to black and grandparent to red. This fixes the violation at this level but may introduce one higher up.",
        case2: "TRIANGLE FORMATION: Node forms a triangle with its parent and grandparent. We perform a rotation to align them in a straight line before the final rotation.",
        case3: "LINE FORMATION: Node, parent, and grandparent are in a straight line. We rotate the grandparent and recolor to restore all Red-Black properties.",
        complete: "Insertion complete! The tree now satisfies all Red-Black properties: root is black, red nodes have black children, and all paths have equal black height."
    },
    rbDelete: {
        initial: "Starting Red-Black Tree deletion. We'll remove the node and fix any violations of the Red-Black properties.",
        step1: "Node found and removed. If the removed node was black, we may have violated the black-height property.",
        case1: "SIBLING IS RED: Recolor sibling and parent, then rotate. This gives us a black sibling to work with in the next steps.",
        case2: "BOTH NEPHEWS BLACK: Recolor sibling to red. This reduces the black height of the sibling's subtree, matching our side.",
        case3: "FAR NEPHEW BLACK, NEAR NEPHEW RED: Rotate near nephew, recolor, then handle as case 4. This sets up for the final rotation.",
        case4: "FAR NEPHEW RED: Recolor sibling to match parent, far nephew to black, then rotate. This restores the black height.",
        complete: "Deletion complete! The tree now satisfies all Red-Black properties."
    },
    avlInsert: {
        initial: "Starting AVL Tree insertion. We'll insert the node and then check balance factors to ensure the tree remains balanced.",
        step1: "New node inserted. Now checking balance factors from the insertion point up to the root.",
        ll: "LEFT-LEFT CASE: Tree is left-heavy and left child is also left-heavy. A single right rotation will balance this subtree.",
        rr: "RIGHT-RIGHT CASE: Tree is right-heavy and right child is also right-heavy. A single left rotation will balance this subtree.",
        lr: "LEFT-RIGHT CASE: Tree is left-heavy but left child is right-heavy. We need a left rotation on the left child, then a right rotation.",
        rl: "RIGHT-LEFT CASE: Tree is right-heavy but right child is left-heavy. We need a right rotation on the right child, then a left rotation.",
        complete: "Insertion complete! All nodes have balance factors of -1, 0, or 1, ensuring O(log n) height."
    },
    avlDelete: {
        initial: "Starting AVL Tree deletion. We'll remove the node and rebalance the tree if necessary.",
        step1: "Node removed. Now checking balance factors and rebalancing as needed.",
        complete: "Deletion complete! The tree is balanced and maintains AVL properties."
    }
};

// Initialize rules display
function updateRulesDisplay() {
    const rulesList = document.getElementById('rulesList');
    const rulesTitle = document.getElementById('rulesTitleText');
    const rules = currentTreeType === 'rb' ? rbRules : avlRules;
    
    rulesTitle.textContent = currentTreeType === 'rb' ? 'Red-Black Tree Rules' : 'AVL Tree Rules';
    
    rulesList.innerHTML = '';
    rules.forEach(rule => {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
        ruleItem.innerHTML = `
            <div class="rule-header">
                <div class="rule-number">${rule.number}</div>
                <div class="rule-title">${rule.title}</div>
            </div>
            <div class="rule-description">${rule.description}</div>
        `;
        rulesList.appendChild(ruleItem);
    });
}

// Switch tree type
function switchTreeType(type) {
    if (isProcessingQueue) {
        showToast('Please wait for current operations to complete', 'error');
        return;
    }

    if (currentTreeType === type) return;

    // Save current tree state before switching
    if (currentTreeType === 'rb') {
        rbTreeState = rbTree.serialize();
    } else {
        avlTreeState = avlTree.serialize();
    }
    
    currentTreeType = type;
    
    // Update UI
    document.getElementById('rbTreeBtn').classList.toggle('active', type === 'rb');
    document.getElementById('avlTreeBtn').classList.toggle('active', type === 'avl');
    
    // Update legend
    document.getElementById('nilLegend').style.display = type === 'rb' && showNullLeaves ? 'flex' : 'none';
    document.getElementById('balanceLegend').style.display = type === 'avl' ? 'flex' : 'none';
    
    // Update properties
    document.getElementById('prop1').textContent = type === 'rb' ? '5' : '5';
    document.getElementById('prop3').textContent = type === 'rb' ? '2x' : '1.44x';
    
    // Update rules
    updateRulesDisplay();
    
    // Update placeholder content based on tree type
    updatePlaceholderContent(type);
    
    // Restore tree state if available
    if (type === 'rb' && rbTreeState) {
        rbTree.deserialize(rbTreeState);
        addToHistory('Convert', 'Red-Black Tree (restored)', 'convert');
        showToast('Restored Red-Black Tree structure', 'success');
    } else if (type === 'avl' && avlTreeState) {
        avlTree.deserialize(avlTreeState);
        addToHistory('Convert', 'AVL Tree (restored)', 'convert');
        showToast('Restored AVL Tree structure', 'success');
    } else {
        // If no saved state, convert from the other tree
        const values = currentTreeType === 'rb' ? avlTree.getInorderValues() : rbTree.getInorderValues();
        
        if (values.length > 0) {
            if (type === 'rb') {
                rbTree = new RedBlackTree();
                values.forEach(value => rbTree.insert(value));
            } else {
                avlTree = new AVLTree();
                values.forEach(value => avlTree.insert(value));
            }
            addToHistory('Convert', `${type === 'rb' ? 'Red-Black' : 'AVL'} Tree`, 'convert');
            showToast(`Converted to ${type === 'rb' ? 'Red-Black' : 'AVL'} Tree`, 'success');
        }
    }
    
    drawTree();
    updateTraversalResults();
}

// Update placeholder content based on tree type
function updatePlaceholderContent(treeType) {
    const placeholder = document.getElementById('treePlaceholder');
    
    if (treeType === 'rb') {
        placeholder.innerHTML = `
            <div class="placeholder-title">Red-Black Tree</div>
            <div class="placeholder-content">
                <div class="placeholder-section">
                    <div class="placeholder-section-title">Origin & History</div>
                    <p>Red-Black Trees were invented in <span class="placeholder-highlight">1972</span> by <span class="placeholder-highlight">Rudolf Bayer</span>, who originally called them "symmetric binary B-trees". The name "red-black" was later coined by <span class="placeholder-highlight">Leonidas J. Guibas</span> and <span class="placeholder-highlight">Robert Sedgewick</span> in 1978.</p>
                </div>
                <div class="placeholder-section">
                    <div class="placeholder-section-title">Purpose & Applications</div>
                    <p>Red-Black Trees were created to provide a balanced binary search tree with <span class="placeholder-highlight">O(log n)</span> time complexity for search, insert, and delete operations. They are widely used in computer science, including in the Linux kernel's Completely Fair Scheduler and in many programming language standard libraries.</p>
                </div>
                <div class="placeholder-section">
                    <div class="placeholder-section-title">Key Innovation</div>
                    <p>The innovation of Red-Black Trees lies in their use of a simple color property (red or black) and a set of rules to maintain balance. This approach requires fewer rotations than AVL trees, making insertions and deletions faster in practice.</p>
                </div>
            </div>
        `;
    } else {
        placeholder.innerHTML = `
            <div class="placeholder-title">AVL Tree</div>
            <div class="placeholder-content">
                <div class="placeholder-section">
                    <div class="placeholder-section-title">Origin & History</div>
                    <p>AVL Trees were invented in <span class="placeholder-highlight">1962</span> by <span class="placeholder-highlight">Georgy Adelson-Velsky</span> and <span class="placeholder-highlight">Evgenii Landis</span>, after whom the data structure is named. They were the first self-balancing binary search trees to be invented.</p>
                </div>
                <div class="placeholder-section">
                    <div class="placeholder-section-title">Purpose & Applications</div>
                    <p>AVL Trees provide stricter balance than Red-Black Trees, ensuring that the height difference between left and right subtrees is at most 1. This makes them particularly suitable for <span class="placeholder-highlight">read-intensive applications</span> where lookup performance is critical.</p>
                </div>
                <div class="placeholder-section">
                    <div class="placeholder-section-title">Key Innovation</div>
                    <p>The innovation of AVL Trees lies in their balance factor property, which ensures the tree remains more strictly balanced than Red-Black Trees. While this results in faster lookups, it requires more rotations during insertions and deletions.</p>
                </div>
            </div>
        `;
    }
}

// Toggle null leaves
function toggleNullLeaves() {
    showNullLeaves = !showNullLeaves;
    const toggle = document.getElementById('nullToggle');
    const nilLegend = document.getElementById('nilLegend');
    
    if (showNullLeaves && currentTreeType === 'rb') {
        toggle.classList.add('active');
        nilLegend.style.display = 'flex';
    } else {
        toggle.classList.remove('active');
        nilLegend.style.display = 'none';
    }
    
    drawTree();
}

// Tree visualization
function drawTree() {
    const svg = document.getElementById('treeSvg');
    svg.innerHTML = '';
    
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    const root = currentTreeType === 'rb' ? tree.root : tree.root;
    
    // Check if tree is empty and show/hide placeholder accordingly
    const placeholder = document.getElementById('treePlaceholder');
    const isEmpty = (currentTreeType === 'rb' && root === tree.NIL) || 
                    (currentTreeType === 'avl' && root === null);
    
    if (isEmpty) {
        placeholder.classList.remove('hidden');
        return;
    } else {
        placeholder.classList.add('hidden');
    }
    
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    // Adjust node size and spacing based on screen size
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let nodeRadius = 25;
    let verticalSpacing = 80;
    let minHorizontalSpacing = 40;
    
    if (isSmallMobile) {
        nodeRadius = 15;
        verticalSpacing = 50;
        minHorizontalSpacing = 25;
    } else if (isMobile) {
        nodeRadius = 20;
        verticalSpacing = 60;
        minHorizontalSpacing = 30;
    }
    
    const positions = calculateNodePositions(root, width / 2, 50, width / 4, nodeRadius, minHorizontalSpacing);
    
    // Draw edges
    positions.forEach(pos => {
        if (currentTreeType === 'rb') {
            if (pos.node.left !== tree.NIL) {
                const leftPos = positions.find(p => p.node === pos.node.left);
                if (leftPos) {
                    drawEdge(svg, pos.x, pos.y, leftPos.x, leftPos.y);
                }
            } else if (showNullLeaves) {
                const nilX = pos.x - (isSmallMobile ? 20 : 30);
                const nilY = pos.y + (isSmallMobile ? 40 : 60);
                drawEdge(svg, pos.x, pos.y, nilX, nilY, 0.3);
            }
            
            if (pos.node.right !== tree.NIL) {
                const rightPos = positions.find(p => p.node === pos.node.right);
                if (rightPos) {
                    drawEdge(svg, pos.x, pos.y, rightPos.x, rightPos.y);
                }
            } else if (showNullLeaves) {
                const nilX = pos.x + (isSmallMobile ? 20 : 30);
                const nilY = pos.y + (isSmallMobile ? 40 : 60);
                drawEdge(svg, pos.x, pos.y, nilX, nilY, 0.3);
            }
        } else {
            if (pos.node.left !== null) {
                const leftPos = positions.find(p => p.node === pos.node.left);
                if (leftPos) {
                    drawEdge(svg, pos.x, pos.y, leftPos.x, leftPos.y);
                }
            }
            
            if (pos.node.right !== null) {
                const rightPos = positions.find(p => p.node === pos.node.right);
                if (rightPos) {
                    drawEdge(svg, pos.x, pos.y, rightPos.x, rightPos.y);
                }
            }
        }
    });
    
    // Draw NIL nodes if enabled (RB only)
    if (showNullLeaves && currentTreeType === 'rb') {
        positions.forEach(pos => {
            if (pos.node.left === tree.NIL) {
                const nilX = pos.x - (isSmallMobile ? 20 : 30);
                const nilY = pos.y + (isSmallMobile ? 40 : 60);
                drawNilNode(svg, nilX, nilY, isSmallMobile ? 10 : 15);
            }
            
            if (pos.node.right === tree.NIL) {
                const nilX = pos.x + (isSmallMobile ? 20 : 30);
                const nilY = pos.y + (isSmallMobile ? 40 : 60);
                drawNilNode(svg, nilX, nilY, isSmallMobile ? 10 : 15);
            }
        });
    }
    
    // Draw nodes
    positions.forEach(pos => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node');
        g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
        g.setAttribute('data-value', pos.node.value);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', nodeRadius);
        circle.setAttribute('class', 'node-circle');
        
        if (currentTreeType === 'rb') {
            circle.setAttribute('fill', pos.node.color === 'red' ? '#dc2626' : '#1f2937');
            circle.setAttribute('stroke', pos.node.color === 'red' ? '#991b1b' : '#374151');
        } else {
            circle.setAttribute('fill', '#3b82f6');
            circle.setAttribute('stroke', '#2563eb');
        }
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'node-text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', isSmallMobile ? '3' : '5');
        text.textContent = pos.node.value;
        
        // Adjust text size for mobile
        if (isSmallMobile) {
            text.setAttribute('font-size', '10px');
        } else if (isMobile) {
            text.setAttribute('font-size', '12px');
        }
        
        g.appendChild(circle);
        g.appendChild(text);
        
        // Add balance factor for AVL
        if (currentTreeType === 'avl') {
            const balance = tree.getBalance(pos.node);
            const balanceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            balanceText.setAttribute('x', isSmallMobile ? '12' : '20');
            balanceText.setAttribute('y', isSmallMobile ? '-8' : '-10');
            balanceText.setAttribute('fill', '#10b981');
            balanceText.setAttribute('font-size', isSmallMobile ? '8' : '12');
            balanceText.setAttribute('font-weight', 'bold');
            balanceText.textContent = balance;
            g.appendChild(balanceText);
        }
        
        // Add hover effect with tooltip
        g.addEventListener('mouseenter', (e) => {
            highlightPath(pos.node);
            showNodeTooltip(e, pos.node, pos.x, pos.y);
        });
        
        g.addEventListener('mouseleave', () => {
            clearHighlights();
            hideNodeTooltip();
        });
        
        svg.appendChild(g);
    });
    
    updateStats();
}

function drawEdge(svg, x1, y1, x2, y2, opacity = 0.6) {
    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    edge.setAttribute('x1', x1);
    edge.setAttribute('y1', y1);
    edge.setAttribute('x2', x2);
    edge.setAttribute('y2', y2);
    edge.setAttribute('class', 'edge');
    edge.style.opacity = opacity;
    svg.appendChild(edge);
}

function drawNilNode(svg, x, y, radius = 15) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x}, ${y})`);
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', radius);
    circle.setAttribute('class', 'nil-node');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', 'nil-text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', radius < 15 ? '3' : '4');
    text.setAttribute('font-size', radius < 15 ? '8' : '12');
    text.textContent = 'NIL';
    
    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
}

function calculateNodePositions(node, x, y, horizontalSpacing, nodeRadius = 25, minHorizontalSpacing = 40) {
    if (currentTreeType === 'rb' && node === rbTree.NIL) return [];
    if (currentTreeType === 'avl' && node === null) return [];
    
    const positions = [{ node, x, y }];
    
    // Adjust vertical spacing for mobile
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let verticalSpacing = 80;
    if (isSmallMobile) {
        verticalSpacing = 50;
    } else if (isMobile) {
        verticalSpacing = 60;
    }
    
    // Ensure minimum horizontal spacing
    horizontalSpacing = Math.max(horizontalSpacing, minHorizontalSpacing);
    
    if (currentTreeType === 'rb') {
        if (node.left !== rbTree.NIL) {
            const leftPositions = calculateNodePositions(
                node.left,
                x - horizontalSpacing,
                y + verticalSpacing,
                horizontalSpacing / 2,
                nodeRadius,
                minHorizontalSpacing
            );
            positions.push(...leftPositions);
        }
        
        if (node.right !== rbTree.NIL) {
            const rightPositions = calculateNodePositions(
                node.right,
                x + horizontalSpacing,
                y + verticalSpacing,
                horizontalSpacing / 2,
                nodeRadius,
                minHorizontalSpacing
            );
            positions.push(...rightPositions);
        }
    } else {
        if (node.left !== null) {
            const leftPositions = calculateNodePositions(
                node.left,
                x - horizontalSpacing,
                y + verticalSpacing,
                horizontalSpacing / 2,
                nodeRadius,
                minHorizontalSpacing
            );
            positions.push(...leftPositions);
        }
        
        if (node.right !== null) {
            const rightPositions = calculateNodePositions(
                node.right,
                x + horizontalSpacing,
                y + verticalSpacing,
                horizontalSpacing / 2,
                nodeRadius,
                minHorizontalSpacing
            );
            positions.push(...rightPositions);
        }
    }
    
    return positions;
}

function updateStats() {
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    document.getElementById('nodeCount').textContent = tree.countNodes();
    document.getElementById('treeHeight').textContent = tree.getHeightOfTree ? tree.getHeightOfTree() : tree.getHeight();
    
    if (currentTreeType === 'rb') {
        document.getElementById('treeStat').textContent = tree.getBlackHeight();
        document.getElementById('treeStatLabel').textContent = 'Black Height';
    } else {
        document.getElementById('treeStat').textContent = '-';
        document.getElementById('treeStatLabel').textContent = 'Balance Factor';
    }
}

// Update the updateAlgorithmDisplay function
function updateAlgorithmDisplay(step, stepNumber, totalSteps) {
    const display = document.getElementById('algorithmDisplay');
    const detailsContent = document.getElementById('detailsContent');
    const cuesContent = document.getElementById('cuesContent');
    
    let icon = '✨';
    if (step.type === 'success') icon = '✅';
    else if (step.type === 'warning') icon = '⚠️';
    else if (step.type === 'error') icon = '❌';
    else if (step.type === 'info') icon = 'ℹ️';
    
    // Determine which explanation to show
    let explanation = '';
    let visualCue = '';
    
    if (currentTreeType === 'rb') {
        if (step.text.includes('Inserting')) {
            explanation = algorithmExplanations.rbInsert.initial;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">🔴</span><span class="step-visual-text">New node will be inserted as RED</span></div>';
        } else if (step.text.includes('Case 1: Uncle is red')) {
            explanation = algorithmExplanations.rbInsert.case1;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">🎨</span><span class="step-visual-text">Recoloring parent and uncle to BLACK</span></div>';
        } else if (step.text.includes('Case 2: Triangle')) {
            explanation = algorithmExplanations.rbInsert.case2;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">🔄</span><span class="step-visual-text">Rotating to align nodes in a line</span></div>';
        } else if (step.text.includes('Case 3: Line')) {
            explanation = algorithmExplanations.rbInsert.case3;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">⚖️</span><span class="step-visual-text">Final rotation and recoloring</span></div>';
        } else if (step.text.includes('Tree balanced')) {
            explanation = algorithmExplanations.rbInsert.complete;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">✅</span><span class="step-visual-text">All Red-Black properties satisfied</span></div>';
        }
    } else {
        if (step.text.includes('Inserting')) {
            explanation = algorithmExplanations.avlInsert.initial;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">🔵</span><span class="step-visual-text">New node inserted, checking balance</span></div>';
        } else if (step.text.includes('Left-Left case')) {
            explanation = algorithmExplanations.avlInsert.ll;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">↩️</span><span class="step-visual-text">Performing right rotation</span></div>';
        } else if (step.text.includes('Right-Right case')) {
            explanation = algorithmExplanations.avlInsert.rr;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">↪️</span><span class="step-visual-text">Performing left rotation</span></div>';
        } else if (step.text.includes('Left-Right case')) {
            explanation = algorithmExplanations.avlInsert.lr;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">🔄</span><span class="step-visual-text">Performing left-right rotation</span></div>';
        } else if (step.text.includes('Right-Left case')) {
            explanation = algorithmExplanations.avlInsert.rl;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">🔄</span><span class="step-visual-text">Performing right-left rotation</span></div>';
        } else if (step.text.includes('complete')) {
            explanation = algorithmExplanations.avlInsert.complete;
            visualCue = '<div class="step-visual"><span class="step-visual-icon">✅</span><span class="step-visual-text">Tree is balanced</span></div>';
        }
    }
    
    display.innerHTML = `
        <div class="current-step">
            <span>${icon}</span>
            <span>${step.text}</span>
            <span class="step-type ${step.type}">${step.type}</span>
        </div>
        <div class="step-description">Step ${stepNumber + 1} of ${totalSteps}</div>
        ${visualCue}
    `;
    
    // Update detailed explanation
    detailsContent.innerHTML = `
        <p>${explanation}</p>
        <div class="step-explanation">
            <strong>Why this step is necessary:</strong> ${getStepReason(step.text)}
        </div>
    `;
    
    // Update visual cues based on current operation
    updateVisualCues(cuesContent, step);
    
    // Store current step info
    currentStepInfo = { step, stepNumber, totalSteps };
}

// Helper function to provide reasons for each step
function getStepReason(stepText) {
    if (stepText.includes('Inserting')) {
        return "We need to add the new node while maintaining the tree's search property and balance.";
    } else if (stepText.includes('Uncle is red')) {
        return "Having two red nodes in a row violates Red-Black rules. Recoloring pushes the violation up the tree.";
    } else if (stepText.includes('Triangle')) {
        return "The triangle formation prevents a simple rotation. We first need to align the nodes.";
    } else if (stepText.includes('Line')) {
        return "With nodes aligned, a single rotation and recoloring will restore all properties.";
    } else if (stepText.includes('balance factor')) {
        return "AVL trees require balance factors to be -1, 0, or 1 to maintain O(log n) height.";
    } else if (stepText.includes('rotation')) {
        return "Rotations restructure the tree to improve balance while maintaining the search property.";
    }
    return "This step helps maintain the tree's balancing properties.";
}

// Update visual cues based on current operation
function updateVisualCues(cuesContent, step) {
    let cuesHTML = '';
    
    if (currentTreeType === 'rb') {
        cuesHTML = `
            <div class="cue-item">
                <div class="cue-color red"></div>
                <span>Red Node - Newly inserted or needs fixing</span>
            </div>
            <div class="cue-item">
                <div class="cue-color black"></div>
                <span>Black Node - Balanced part of tree</span>
            </div>
            <div class="cue-item">
                <div class="cue-color highlight"></div>
                <span>Highlighted - Currently being processed</span>
            </div>
        `;
        
        if (step.text.includes('uncle')) {
            cuesHTML += `
                <div class="cue-item">
                    <div class="cue-color" style="background: #f59e0b;"></div>
                    <span>Uncle Node - Key to fixing violations</span>
                </div>
            `;
        }
    } else {
        cuesHTML = `
            <div class="cue-item">
                <div class="cue-color" style="background: #3b82f6;"></div>
                <span>Node - Balance factor shown in green</span>
            </div>
            <div class="cue-item">
                <div class="cue-color highlight"></div>
                <span>Highlighted - Currently being processed</span>
            </div>
            <div class="cue-item">
                <div class="cue-color" style="background: #10b981;"></div>
                <span>Balance Factor - Must be -1, 0, or 1</span>
            </div>
        `;
    }
    
    cuesContent.innerHTML = cuesHTML;
}

function resetOperationState() {
    isProcessingQueue = false;
    processQueue();
}

function setButtonsEnabled(enabled) {
    document.getElementById('insertBtn').disabled = !enabled;
    document.getElementById('deleteBtn').disabled = !enabled;
    document.getElementById('randomBtn').disabled = !enabled;
    document.getElementById('clearBtn').disabled = !enabled;
}

function processQueue() {
    if (operationQueue.length === 0) {
        isProcessingQueue = false;
        setButtonsEnabled(true);
        return;
    }
    
    isProcessingQueue = true;
    const operation = operationQueue.shift();
    
    let steps;
    if (operation.type === 'insert') {
        const tree = currentTreeType === 'rb' ? rbTree : avlTree;
        steps = tree.insert(operation.value);
    } else if (operation.type === 'delete') {
        const tree = currentTreeType === 'rb' ? rbTree : avlTree;
        steps = tree.delete(operation.value);
    } else if (operation.type === 'clear') {
        if (currentTreeType === 'rb') {
            rbTree = new RedBlackTree();
        } else {
            avlTree = new AVLTree();
        }
        steps = [{ text: 'Tree cleared', type: 'success' }];
    }
    
    if (operation.skipAnimation) {
        // Skip animation for random generation
        drawTree();
        const display = document.getElementById('algorithmDisplay');
        display.innerHTML = `
            <div class="current-step">
                <span>🎉</span>
                <span>Random tree generated!</span>
                <span class="step-type success">Complete</span>
            </div>
            <div class="step-description">All nodes inserted at once</div>
        `;
        resetOperationState();
    } else {
        // Store the steps for persistence
        lastOperationSteps = steps;
        animateSteps(steps);
    }
}

function animateSteps(steps) {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }
    
    let currentStep = 0;
    
    function showStep() {
        if (currentStep < steps.length && isPlaying) {
            const step = steps[currentStep];
            updateAlgorithmDisplay(step, currentStep, steps.length);
            drawTree();
            currentStep++;
            animationTimeout = setTimeout(showStep, animationSpeed);
        } else if (currentStep >= steps.length) {
            // Keep the last step displayed
            const lastStep = steps[steps.length - 1];
            updateAlgorithmDisplay(lastStep, steps.length - 1, steps.length);
            drawTree();
            
            animationTimeout = setTimeout(() => {
                resetOperationState();
            }, 1000);
        }
    }
    
    showStep();
}

function addToHistory(operation, value, type) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    operationHistory.unshift({
        operation,
        value,
        type,
        time: timeString
    });
    
    if (operationHistory.length > 20) {
        operationHistory.pop();
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (operationHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No operations performed yet</div>';
        return;
    }
    
    historyList.innerHTML = '';
    
    operationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${item.type}`;
        
        historyItem.innerHTML = `
            <div>
                <span class="history-operation">${item.operation}</span>
                ${item.value ? `<span class="history-value">${item.value}</span>` : ''}
            </div>
            <span class="history-time">${item.time}</span>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    operationHistory = [];
    updateHistoryDisplay();
    showToast('History cleared', 'info');
}

function insertNode() {
    const input = document.getElementById('nodeValue');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showToast('Please enter a valid number', 'error');
        return;
    }
    
    // Save state for undo
    saveStateForUndo();
    
    try {
        operationQueue.push({ type: 'insert', value });
        if (!isProcessingQueue) {
            processQueue();
        }
        addToHistory('Insert', value, 'insert');
        input.value = '';
        showToast(`Inserted ${value} successfully`, 'success');
        
        // Update traversal results after insertion
        setTimeout(() => {
            updateTraversalResults();
        }, 1000);
    } catch (error) {
        console.error('Insert error:', error);
        showToast('Error during insertion', 'error');
    }
}

function deleteNode() {
    const input = document.getElementById('deleteValue');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showToast('Please enter a valid number', 'error');
        return;
    }
    
    // Save state for undo
    saveStateForUndo();
    
    try {
        operationQueue.push({ type: 'delete', value });
        if (!isProcessingQueue) {
            processQueue();
        }
        addToHistory('Delete', value, 'delete');
        input.value = '';
        
        // Update traversal results after deletion
        setTimeout(() => {
            updateTraversalResults();
        }, 1000);
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Error during deletion', 'error');
    }
}

function searchNode() {
    const input = document.getElementById('searchValue');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showToast('Please enter a valid number', 'error');
        return;
    }
    
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    const found = tree.search(value);
    
    if (found && (currentTreeType === 'rb' ? found !== tree.NIL : found !== null)) {
        highlightNode(found);
        showToast(`Found node with value ${value}`, 'success');
    } else {
        showToast(`Node with value ${value} not found`, 'error');
    }
}

function visualizeTraversal(type) {
    // Scroll to tree visualization
    document.getElementById('treeContainer').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    let values = [];
    
    switch(type) {
        case 'inorder':
            values = tree.getInorderValues();
            break;
        case 'preorder':
            values = tree.getPreorderValues();
            break;
        case 'postorder':
            values = tree.getPostorderValues();
            break;
    }
    
    animateTraversal(values, type);
}

function updateTraversalResults() {
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    
    const inorderValues = tree.getInorderValues();
    const preorderValues = tree.getPreorderValues();
    const postorderValues = tree.getPostorderValues();
    
    document.getElementById('inorderResult').textContent = 
        inorderValues.length > 0 ? inorderValues.join(', ') : 'Empty';
    document.getElementById('preorderResult').textContent = 
        preorderValues.length > 0 ? preorderValues.join(', ') : 'Empty';
    document.getElementById('postorderResult').textContent = 
        postorderValues.length > 0 ? postorderValues.join(', ') : 'Empty';
}

function animateTraversal(values, type) {
    const display = document.getElementById('algorithmDisplay');
    display.innerHTML = `
        <div class="current-step">
            <span>🔍</span>
            <span>${type.charAt(0).toUpperCase() + type.slice(1)} Traversal</span>
            <span class="step-type info">Traversing</span>
        </div>
        <div class="step-description">Visiting nodes in ${type} order</div>
    `;
    
    let index = 0;
    function visitNext() {
        if (index < values.length) {
            const value = values[index];
            highlightNodeByValue(value);
            display.innerHTML = `
                <div class="current-step">
                    <span>🔍</span>
                    <span>Visiting node: ${value}</span>
                    <span class="step-type info">Step ${index + 1}/${values.length}</span>
                </div>
                <div class="step-description">${type.charAt(0).toUpperCase() + type.slice(1)} traversal in progress</div>
            `;
            index++;
            setTimeout(visitNext, 500);
        } else {
            display.innerHTML = `
                <div class="current-step">
                    <span>✅</span>
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)} traversal complete!</span>
                    <span class="step-type success">Complete</span>
                </div>
                <div class="step-description">Visited nodes: [${values.join(', ')}]</div>
            `;
            clearHighlights();
        }
    }
    visitNext();
}

function highlightNode(node) {
    clearHighlights();
    const nodeElement = document.querySelector(`[data-value="${node.value}"]`);
    if (nodeElement) {
        nodeElement.classList.add('highlighted');
    }
}

function highlightNodeByValue(value) {
    clearHighlights();
    const nodeElement = document.querySelector(`[data-value="${value}"]`);
    if (nodeElement) {
        nodeElement.classList.add('highlighted');
    }
}

function highlightPath(node) {
    clearHighlights();
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    let current = node;
    
    while (current && (currentTreeType === 'rb' ? current !== tree.NIL : current !== null)) {
        const nodeElement = document.querySelector(`[data-value="${current.value}"]`);
        if (nodeElement) {
            nodeElement.classList.add('highlighted');
        }
        current = current.parent;
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
    document.querySelectorAll('.edge.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
}

function generateRandom() {
    clearTree();
    const count = Math.floor(Math.random() * 10) + 5;
    const values = new Set();
    
    while (values.size < count) {
        values.add(Math.floor(Math.random() * 100));
    }
    
    try {
        // Insert all values at once without animation
        const tree = currentTreeType === 'rb' ? rbTree : avlTree;
        values.forEach(value => {
            tree.insert(value);
        });
        
        // Draw the final tree
        drawTree();
        
        // Show completion message
        const display = document.getElementById('algorithmDisplay');
        display.innerHTML = `
            <div class="current-step">
                <span>🎉</span>
                <span>Random tree generated with ${count} nodes!</span>
                <span class="step-type success">Complete</span>
            </div>
            <div class="step-description">All nodes inserted at once</div>
        `;
        
        addToHistory('Generate Random', `${count} nodes`, 'insert');
        showToast(`Generated tree with ${count} nodes`, 'success');
        
        // Update traversal results
        updateTraversalResults();
    } catch (error) {
        console.error('Generate error:', error);
        showToast('Error during generation', 'error');
    }
}

function clearTree() {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }
    
    // Clear the queue first
    operationQueue = [];
    isProcessingQueue = false;
    
    // Clear the tree immediately
    if (currentTreeType === 'rb') {
        rbTree = new RedBlackTree();
    } else {
        avlTree = new AVLTree();
    }
    
    // Clear saved states
    rbTreeState = null;
    avlTreeState = null;
    
    // Update display immediately
    drawTree();
    const display = document.getElementById('algorithmDisplay');
    display.innerHTML = `
        <div class="current-step">
            <span>🧹</span>
            <span>Tree cleared</span>
            <span class="step-type info">Ready</span>
        </div>
        <div class="step-description">Ready to perform new operations</div>
    `;
    
    // Update history
    addToHistory('Clear Tree', null, 'clear');
    showToast('Tree cleared', 'info');
    
    // Update traversal results
    updateTraversalResults();
    
    // Enable buttons
    setButtonsEnabled(true);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Zoom and Pan functionality
function zoomIn() {
    zoomLevel = Math.min(zoomLevel * 1.2, 3);
    updateTransform();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel / 1.2, 0.5);
    updateTransform();
}

function resetZoom() {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateTransform();
}

function updateTransform() {
    const svg = document.getElementById('treeSvg');
    svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
}

// Setup zoom and pan
function setupZoomAndPan() {
    const container = document.getElementById('treeContainer');
    
    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoomLevel *= delta;
        zoomLevel = Math.max(0.5, Math.min(3, zoomLevel));
        updateTransform();
    });
    
    // Mouse drag pan
    container.addEventListener('mousedown', (e) => {
        if (e.target.closest('.zoom-btn')) return;
        isDragging = true;
        dragStartX = e.clientX - panX;
        dragStartY = e.clientY - panY;
        container.classList.add('grabbing');
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
        updateTransform();
    });
    
    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.classList.remove('grabbing');
    });
    
    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.classList.remove('grabbing');
    });
    
    // Touch events for mobile
    let touchStartDistance = 0;
    let touchStartZoom = 1;
    
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            dragStartX = e.touches[0].clientX - panX;
            dragStartY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            touchStartDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            touchStartZoom = zoomLevel;
        }
    });
    
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 1 && isDragging) {
            panX = e.touches[0].clientX - dragStartX;
            panY = e.touches[0].clientY - dragStartY;
            updateTransform();
        } else if (e.touches.length === 2) {
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            
            const scale = currentDistance / touchStartDistance;
            zoomLevel = Math.max(0.5, Math.min(3, touchStartZoom * scale));
            updateTransform();
        }
    });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Save/Load functionality
function saveTreeState() {
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    const state = {
        type: currentTreeType,
        values: tree.getInorderValues(),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('treeState', JSON.stringify(state));
    showToast('Tree state saved', 'success');
}

function loadTreeState() {
    const savedState = localStorage.getItem('treeState');
    if (!savedState) {
        showToast('No saved tree state found', 'error');
        return;
    }
    
    const state = JSON.parse(savedState);
    switchTreeType(state.type);
    clearTree();
    
    state.values.forEach(value => {
        const tree = currentTreeType === 'rb' ? rbTree : avlTree;
        tree.insert(value);
    });
    
    drawTree();
    showToast(`Loaded tree from ${new Date(state.timestamp).toLocaleString()}`, 'success');
}

// Undo functionality
function saveStateForUndo() {
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    undoStack.push({
        type: currentTreeType,
        values: tree.getInorderValues()
    });
    
    if (undoStack.length > 10) {
        undoStack.shift();
    }
}

function undoLastOperation() {
    if (undoStack.length === 0) {
        showToast('No operations to undo', 'error');
        return;
    }
    
    const state = undoStack.pop();
    switchTreeType(state.type);
    clearTree();
    
    state.values.forEach(value => {
        const tree = currentTreeType === 'rb' ? rbTree : avlTree;
        tree.insert(value);
    });
    
    drawTree();
    showToast('Operation undone', 'success');
}

// Node tooltip functionality
function showNodeTooltip(event, node, nodeX, nodeY) {
    const tooltip = document.getElementById('nodeTooltip');
    const tree = currentTreeType === 'rb' ? rbTree : avlTree;
    
    // Get node properties
    const value = node.value;
    const color = currentTreeType === 'rb' ? node.color : 'N/A';
    
    // Get parent
    let parent = 'nil node';
    let parentColor = '';
    if (node.parent && (currentTreeType === 'rb' ? node.parent !== tree.NIL : node.parent !== null)) {
        parent = node.parent.value;
        parentColor = currentTreeType === 'rb' ? node.parent.color : 'N/A';
    }
    
    // Get uncle
    let uncle = 'nil node';
    let uncleColor = '';
    if (currentTreeType === 'rb') {
        const uncleNode = tree.getUncle(node);
        if (uncleNode !== tree.NIL) {
            uncle = uncleNode.value;
            uncleColor = uncleNode.color;
        }
    } else {
        const uncleNode = tree.getUncle(node);
        if (uncleNode !== null) {
            uncle = uncleNode.value;
            uncleColor = 'N/A';
        }
    }
    
    // Get children
    let leftChild = 'nil node';
    let leftChildColor = '';
    if (currentTreeType === 'rb') {
        if (node.left !== tree.NIL) {
            leftChild = node.left.value;
            leftChildColor = node.left.color;
        }
    } else {
        if (node.left !== null) {
            leftChild = node.left.value;
            leftChildColor = 'N/A';
        }
    }
    
    let rightChild = 'nil node';
    let rightChildColor = '';
    if (currentTreeType === 'rb') {
        if (node.right !== tree.NIL) {
            rightChild = node.right.value;
            rightChildColor = node.right.color;
        }
    } else {
        if (node.right !== null) {
            rightChild = node.right.value;
            rightChildColor = 'N/A';
        }
    }
    
    // Update tooltip content
    document.getElementById('tooltipValue').textContent = value;
    
    if (currentTreeType === 'rb') {
        document.getElementById('tooltipColor').innerHTML = 
            `${color} <span class="color-indicator ${color}"></span>`;
    } else {
        document.getElementById('tooltipColor').textContent = color;
    }
    
    if (parent !== 'nil node' && currentTreeType === 'rb') {
        document.getElementById('tooltipParent').innerHTML = 
            `${parent} <span class="color-indicator ${parentColor}"></span>`;
    } else {
        document.getElementById('tooltipParent').textContent = parent;
    }
    
    if (uncle !== 'nil node' && currentTreeType === 'rb') {
        document.getElementById('tooltipUncle').innerHTML = 
            `${uncle} <span class="color-indicator ${uncleColor}"></span>`;
    } else {
        document.getElementById('tooltipUncle').textContent = uncle;
    }
    
    let childrenText = '';
    if (leftChild !== 'nil node') {
        if (currentTreeType === 'rb') {
            childrenText += `L: ${leftChild} <span class="color-indicator ${leftChildColor}"></span>`;
        } else {
            childrenText += `L: ${leftChild}`;
        }
    } else {
        childrenText += 'L: nil node';
    }
    
    if (rightChild !== 'nil node') {
        if (childrenText) childrenText += ', ';
        if (currentTreeType === 'rb') {
            childrenText += `R: ${rightChild} <span class="color-indicator ${rightChildColor}"></span>`;
        } else {
            childrenText += `R: ${rightChild}`;
        }
    } else {
        if (childrenText) childrenText += ', ';
        childrenText += 'R: nil node';
    }
    
    document.getElementById('tooltipChildren').innerHTML = childrenText;
    
    // Position tooltip to the side of the node, not covering it
    const containerRect = document.getElementById('treeContainer').getBoundingClientRect();
    const tooltipWidth = 180; // Approximate width of tooltip
    const tooltipHeight = 150; // Approximate height of tooltip
    
    // Adjust tooltip size for mobile
    const isMobile = window.innerWidth <= 768;
    const adjustedTooltipWidth = isMobile ? 150 : tooltipWidth;
    const adjustedTooltipHeight = isMobile ? 120 : tooltipHeight;
    
    // Determine best position based on available space
    let tooltipX, tooltipY;
    
    // Default position: to the right of the node
    tooltipX = nodeX + 35;
    tooltipY = nodeY - adjustedTooltipHeight / 2;
    
    // Check if tooltip would go outside the container on the right
    if (nodeX + adjustedTooltipWidth + 35 > containerRect.width) {
        // Position to the left instead
        tooltipX = nodeX - adjustedTooltipWidth - 35;
    }
    
    // Check if tooltip would go outside the container on the top
    if (nodeY - adjustedTooltipHeight / 2 < 0) {
        // Position below the node instead
        tooltipY = nodeY + 35;
    }
    
    // Check if tooltip would go outside the container on the bottom
    if (nodeY + adjustedTooltipHeight / 2 > containerRect.height) {
        // Position above the node instead
        tooltipY = nodeY - adjustedTooltipHeight - 35;
    }
    
    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    
    // Show tooltip
    tooltip.classList.add('visible');
}

function hideNodeTooltip() {
    const tooltip = document.getElementById('nodeTooltip');
    tooltip.classList.remove('visible');
}

// Keyboard shortcuts (Enter key only)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const nodeInput = document.getElementById('nodeValue');
        const deleteInput = document.getElementById('deleteValue');
        const searchInput = document.getElementById('searchValue');
        
        if (document.activeElement === nodeInput) {
            insertNode();
        } else if (document.activeElement === deleteInput) {
            deleteNode();
        } else if (document.activeElement === searchInput) {
            searchNode();
        }
    }
});

// Animation speed control
document.getElementById('animSpeed').addEventListener('input', (e) => {
    animationSpeed = parseInt(e.target.value);
    document.getElementById('speedValue').textContent = `${animationSpeed}ms`;
});

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        drawTree();
    }, 250);
});

// Theme toggle functionality
function initThemeToggle() {
    const themeSwitch = document.getElementById('themeSwitch');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.textContent = '☀️';
    }
    
    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
            showToast('Switched to light mode', 'info');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
            showToast('Switched to dark mode', 'info');
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileControlsBtn = document.getElementById('mobileControlsBtn');
    const rightPanel = document.querySelector('.right-panel');
    
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        mobileMenu.classList.add('active');
    });
    
    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
    
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Show controls panel
    function showMobileControls() {
        rightPanel.classList.add('mobile-visible');
        closeMobileMenu();
        
        // Add close button to controls panel
        if (!document.getElementById('mobilePanelClose')) {
            const panelHeader = document.createElement('div');
            panelHeader.className = 'mobile-panel-header';
            panelHeader.innerHTML = `
                <div class="mobile-panel-title">Controls</div>
                <button class="mobile-panel-close" id="mobilePanelClose">×</button>
            `;
            rightPanel.insertBefore(panelHeader, rightPanel.firstChild);
            
            document.getElementById('mobilePanelClose').addEventListener('click', () => {
                rightPanel.classList.remove('mobile-visible');
            });
        }
    }
    
    // Show algorithm panel
    function showMobileAlgorithm() {
        const algorithmPanel = document.querySelector('.algorithm-panel');
        algorithmPanel.classList.add('mobile-visible');
        closeMobileMenu();
        
        // Add close button to algorithm panel
        if (!document.getElementById('mobileAlgorithmClose')) {
            const panelHeader = document.createElement('div');
            panelHeader.className = 'mobile-panel-header';
            panelHeader.innerHTML = `
                <div class="mobile-panel-title">Algorithm Steps</div>
                <button class="mobile-panel-close" id="mobileAlgorithmClose">×</button>
            `;
            algorithmPanel.insertBefore(panelHeader, algorithmPanel.firstChild);
            
            document.getElementById('mobileAlgorithmClose').addEventListener('click', () => {
                algorithmPanel.classList.remove('mobile-visible');
            });
        }
    }
    
    mobileControlsBtn.addEventListener('click', showMobileControls);
    
    // Handle navigation links
    document.querySelectorAll('.mobile-menu-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });
}

// Initialize
function initializeApp() {
    updateRulesDisplay();
    drawTree();
    setupZoomAndPan();
    updateTraversalResults();
    initThemeToggle();
    initMobileMenu();
}

// Call the initialize function
initializeApp();