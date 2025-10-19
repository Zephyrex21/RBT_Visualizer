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
        steps.push({ code: 'RB_INSERT_START', text: `Inserting value ${value}`, type: 'info' });
        
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
            steps.push({ code: 'RB_INSERT_ROOT', text: 'Tree was empty, new node is root', type: 'success' });
        } else if (newNode.value < parent.value) {
            parent.left = newNode;
            steps.push({ code: 'RB_INSERT_PLACE_LEFT', text: `Inserted as left child of ${parent.value}`, type: 'info' });
        } else {
            parent.right = newNode;
            steps.push({ code: 'RB_INSERT_PLACE_RIGHT', text: `Inserted as right child of ${parent.value}`, type: 'info' });
        }
        
        steps.push({ code: 'RB_INSERT_FIXUP_START', text: 'Fixing violations...', type: 'warning' });
        this.insertFixup(newNode, steps);
        
        return steps;
    }

    insertFixup(node, steps) {
        while (node.parent.color === 'red') {
            if (node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right;
                
                if (uncle.color === 'red') {
                    steps.push({ code: 'RB_INSERT_CASE_1', text: 'Case 1: Uncle is red - Recoloring', type: 'info' });
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        steps.push({ code: 'RB_INSERT_CASE_2', text: 'Case 2: Triangle - Left rotation', type: 'info' });
                        node = node.parent;
                        this.leftRotate(node);
                    }
                    steps.push({ code: 'RB_INSERT_CASE_3', text: 'Case 3: Line - Right rotation', type: 'info' });
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rightRotate(node.parent.parent);
                }
            } else {
                const uncle = node.parent.parent.left;
                
                if (uncle.color === 'red') {
                    steps.push({ code: 'RB_INSERT_CASE_1', text: 'Case 1: Uncle is red - Recoloring', type: 'info' });
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        steps.push({ code: 'RB_INSERT_CASE_2', text: 'Case 2: Triangle - Right rotation', type: 'info' });
                        node = node.parent;
                        this.rightRotate(node);
                    }
                    steps.push({ code: 'RB_INSERT_CASE_3', text: 'Case 3: Line - Left rotation', type: 'info' });
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.leftRotate(node.parent.parent);
                }
            }
            
            if (node === this.root) break;
        }
        this.root.color = 'black';
        steps.push({ code: 'RB_INSERT_COMPLETE', text: 'Root colored black - Tree balanced!', type: 'success' });
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
        steps.push({ code: 'RB_DELETE_START', text: `Deleting value ${value}`, type: 'info' });
        
        let node = this.search(value);
        if (node === this.NIL) {
            steps.push({ code: 'RB_DELETE_NOT_FOUND', text: `Value ${value} not found`, type: 'error' });
            return steps;
        }
        
        let y = node;
        let yOriginalColor = y.color;
        let x = this.NIL;
        
        if (node.left === this.NIL) {
            x = node.right;
            this.transplant(node, node.right);
            steps.push({ code: 'RB_DELETE_NODE_ONE_CHILD', text: `Node has one right child or none. Transplanting.`, type: 'info' });
        } else if (node.right === this.NIL) {
            x = node.left;
            this.transplant(node, node.left);
            steps.push({ code: 'RB_DELETE_NODE_ONE_CHILD', text: `Node has one left child. Transplanting.`, type: 'info' });
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
            steps.push({ code: 'RB_DELETE_NODE_TWO_CHILDREN', text: `Node has two children. Replaced with successor ${y.value}.`, type: 'info' });
        }
        
        if (yOriginalColor === 'black') {
            steps.push({ code: 'RB_DELETE_FIXUP_START', text: 'Fixing violations after deletion...', type: 'warning' });
            this.deleteFixup(x, steps);
        } else {
            steps.push({ code: 'RB_DELETE_NO_FIXUP', text: 'Deleted node was red. No fixup needed.', type: 'success' });
        }
        
        steps.push({ code: 'RB_DELETE_COMPLETE', text: 'Deletion complete!', type: 'success' });
        return steps;
    }

    deleteFixup(x, steps) {
        while (x !== this.root && x.color === 'black') {
            if (x === x.parent.left) {
                let w = x.parent.right;
                
                if (w.color === 'red') {
                    steps.push({ code: 'RB_DELETE_CASE_1', text: 'Case 1: Sibling is red', type: 'info' });
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.leftRotate(x.parent);
                    w = x.parent.right;
                }
                
                if (w.left.color === 'black' && w.right.color === 'black') {
                    steps.push({ code: 'RB_DELETE_CASE_2', text: 'Case 2: Both children of sibling are black', type: 'info' });
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.right.color === 'black') {
                        steps.push({ code: 'RB_DELETE_CASE_3', text: 'Case 3: Right child of sibling is black', type: 'info' });
                        w.left.color = 'black';
                        w.color = 'red';
                        this.rightRotate(w);
                        w = x.parent.right;
                    }
                    
                    steps.push({ code: 'RB_DELETE_CASE_4', text: 'Case 4: Right child of sibling is red', type: 'info' });
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.right.color = 'black';
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let w = x.parent.left;
                
                if (w.color === 'red') {
                    steps.push({ code: 'RB_DELETE_CASE_1', text: 'Case 1: Sibling is red', type: 'info' });
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.rightRotate(x.parent);
                    w = x.parent.left;
                }
                
                if (w.right.color === 'black' && w.left.color === 'black') {
                    steps.push({ code: 'RB_DELETE_CASE_2', text: 'Case 2: Both children of sibling are black', type: 'info' });
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.left.color === 'black') {
                        steps.push({ code: 'RB_DELETE_CASE_3', text: 'Case 3: Left child of sibling is black', type: 'info' });
                        w.right.color = 'black';
                        w.color = 'red';
                        this.leftRotate(w);
                        w = x.parent.left;
                    }
                    
                    steps.push({ code: 'RB_DELETE_CASE_4', text: 'Case 4: Left child of sibling is red', type: 'info' });
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
        steps.push({ code: 'RB_DELETE_FIXUP_COMPLETE', text: 'Delete fixup complete!', type: 'success' });
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
        steps.push({ code: 'AVL_INSERT_START', text: `Inserting value ${value}`, type: 'info' });
        this.root = this.insertNode(this.root, value, steps);
        steps.push({ code: 'AVL_INSERT_COMPLETE', text: 'AVL insertion complete!', type: 'success' });
        return steps;
    }

    insertNode(node, value, steps) {
        if (node === null) {
            steps.push({ code: 'AVL_INSERT_CREATE_NODE', text: `Created new node with value ${value}`, type: 'info' });
            return new AVLNode(value);
        }

        if (value < node.value) {
            steps.push({ code: 'AVL_INSERT_GO_LEFT', text: `Going left from node ${node.value}`, type: 'info' });
            node.left = this.insertNode(node.left, value, steps);
        } else if (value > node.value) {
            steps.push({ code: 'AVL_INSERT_GO_RIGHT', text: `Going right from node ${node.value}`, type: 'info' });
            node.right = this.insertNode(node.right, value, steps);
        } else {
            return node; // Duplicate values not allowed
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        
        const balance = this.getBalance(node);
        steps.push({ code: 'AVL_INSERT_CHECK_BALANCE', text: `Node ${node.value} balance factor: ${balance}`, type: 'info' });

        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            steps.push({ code: 'AVL_INSERT_LL_CASE', text: 'Left-Left case: Right rotation', type: 'warning' });
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            steps.push({ code: 'AVL_INSERT_RR_CASE', text: 'Right-Right case: Left rotation', type: 'warning' });
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            steps.push({ code: 'AVL_INSERT_LR_CASE', text: 'Left-Right case: Left-Right rotation', type: 'warning' });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            steps.push({ code: 'AVL_INSERT_RL_CASE', text: 'Right-Left case: Right-Left rotation', type: 'warning' });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(value) {
        const steps = [];
        steps.push({ code: 'AVL_DELETE_START', text: `Deleting value ${value}`, type: 'info' });
        this.root = this.deleteNode(this.root, value, steps);
        steps.push({ code: 'AVL_DELETE_COMPLETE', text: 'AVL deletion complete!', type: 'success' });
        return steps;
    }

    deleteNode(node, value, steps) {
        if (node === null) {
            steps.push({ code: 'AVL_DELETE_NOT_FOUND', text: `Value ${value} not found`, type: 'error' });
            return null;
        }

        if (value < node.value) {
            steps.push({ code: 'AVL_DELETE_GO_LEFT', text: `Going left from node ${node.value}`, type: 'info' });
            node.left = this.deleteNode(node.left, value, steps);
        } else if (value > node.value) {
            steps.push({ code: 'AVL_DELETE_GO_RIGHT', text: `Going right from node ${node.value}`, type: 'info' });
            node.right = this.deleteNode(node.right, value, steps);
        } else {
            // Node with one child or no child
            if (node.left === null || node.right === null) {
                let temp = node.left || node.right;
                
                if (temp === null) {
                    steps.push({ code: 'AVL_DELETE_REMOVE_LEAF', text: `Removing leaf node ${node.value}`, type: 'info' });
                    node = null;
                } else {
                    steps.push({ code: 'AVL_DELETE_REPLACE_WITH_CHILD', text: `Replacing node ${node.value} with child`, type: 'info' });
                    node = temp;
                }
            } else {
                // Node with two children
                let temp = this.getMinValueNode(node.right);
                steps.push({ code: 'AVL_DELETE_REPLACE_WITH_SUCCESSOR', text: `Replacing node ${node.value} with successor ${temp.value}`, type: 'info' });
                node.value = temp.value;
                node.right = this.deleteNode(node.right, temp.value, steps);
            }
        }

        if (node === null) return node;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        
        const balance = this.getBalance(node);
        steps.push({ code: 'AVL_DELETE_CHECK_BALANCE', text: `Node ${node.value} balance factor: ${balance}`, type: 'info' });

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            steps.push({ code: 'AVL_DELETE_LL_CASE', text: 'Left-Left case: Right rotation', type: 'warning' });
            return this.rightRotate(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            steps.push({ code: 'AVL_DELETE_LR_CASE', text: 'Left-Right case: Left-Right rotation', type: 'warning' });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            steps.push({ code: 'AVL_DELETE_RR_CASE', text: 'Right-Right case: Left rotation', type: 'warning' });
            return this.leftRotate(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            steps.push({ code: 'AVL_DELETE_RL_CASE', text: 'Right-Left case: Right-Left rotation', type: 'warning' });
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
        
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        
        return node;
    }
}

// --- NEW: Comprehensive Operation Details Database ---
const operationDetails = {
    rb_insert: {
        'RB_INSERT_START': {
            explanation: "Starting Red-Black Tree insertion. The new node will be inserted as a RED leaf to maintain the black-height property of the tree. This might violate the rule that a red node cannot have a red child, which we will fix in the next steps.",
            pseudocode: `RB-Insert(T, k)
  z = new Node(k)
  z.color = RED
  BST-Insert(T, z)
  while z.parent.color == RED
    // Fixup cases will be handled here`
        },
        'RB_INSERT_ROOT': {
            explanation: "The tree was empty, so the new node becomes the root. After the fixup process, the root will always be colored black to satisfy the Red-Black Tree properties.",
            pseudocode: `if T.root == NIL
    T.root = z
    z.parent = T.NIL`
        },
        'RB_INSERT_PLACE_LEFT': {
            explanation: "The new node has been placed as the left child of its parent. It is colored RED. We now check if its parent is also RED, which would be a violation.",
            pseudocode: `else if z.key < z.parent.key
    z.parent.left = z`
        },
        'RB_INSERT_PLACE_RIGHT': {
            explanation: "The new node has been placed as the right child of its parent. It is colored RED. We now check if its parent is also RED, which would be a violation.",
            pseudocode: `else
    z.parent.right = z`
        },
        'RB_INSERT_FIXUP_START': {
            explanation: "The insertion is complete, but the tree might violate Red-Black properties. The 'Fixup' algorithm will now iterate up the tree from the inserted node to resolve any violations, primarily the 'red parent, red child' rule.",
            pseudocode: `RB-Insert-Fixup(T, z)
  while z.parent.color == RED
    // Check uncle's color and structure`
        },
        'RB_INSERT_CASE_1': {
            explanation: "The parent and uncle of the newly inserted node are both RED. This is the simplest case to fix. We recolor both the parent and uncle to BLACK and recolor the grandparent to RED. This resolves the violation at this level but might introduce a new violation higher up the tree, so the algorithm continues.",
            pseudocode: `if z.uncle.color == RED
    z.parent.color = BLACK
    z.uncle.color = BLACK
    z.grandparent.color = RED
    z = z.grandparent`
        },
        'RB_INSERT_CASE_2': {
            explanation: "The uncle is BLACK, and the new node forms a 'triangle' with its parent and grandparent (i.e., it's an inner child). A single rotation won't work here. We first perform a rotation on the parent to transform the structure into a 'line' (Case 3).",
            pseudocode: `else if z == z.parent.right
    z = z.parent
    LEFT-ROTATE(T, z)`
        },
        'RB_INSERT_CASE_3': {
            explanation: "The uncle is BLACK, and the nodes form a 'line'. This is the final rotation step. We rotate the grandparent in the opposite direction of the new node and then swap the colors of the (original) parent and grandparent. This restores all Red-Black properties.",
            pseudocode: `z.parent.color = BLACK
z.grandparent.color = RED
RIGHT-ROTATE(T, z.grandparent)`
        },
        'RB_INSERT_COMPLETE': {
            explanation: "The fixup process is finished. The root of the tree is always colored black as the final step to ensure the root property is met. The tree is now a valid Red-Black Tree.",
            pseudocode: `T.root.color = BLACK`
        }
    },
    rb_delete: {
        'RB_DELETE_START': {
            explanation: "Starting Red-Black Tree deletion. We first find the node to delete. The complexity comes from ensuring that if we remove a BLACK node, the 'black-height' property along all paths is maintained.",
            pseudocode: `RB-Delete(T, z)
  y = z
  y-original-color = y.color
  // Find node to splice out (x)`
        },
        'RB_DELETE_NOT_FOUND': {
            explanation: "The value to be deleted was not found in the tree. No changes are made.",
            pseudocode: `if z == T.NIL
    return "Node not found"`
        },
        'RB_DELETE_NODE_ONE_CHILD': {
            explanation: "The node to be deleted has at most one non-NIL child. We can 'transplant' it, meaning we replace the node with its only child. If the deleted node was BLACK, this might violate the black-height property, requiring a fixup.",
            pseudocode: `if z.left == T.NIL
    x = z.right
    TRANSPLANT(T, z, z.right)
else if z.right == T.NIL
    x = z.left
    TRANSPLANT(T, z, z.left)`
        },
        'RB_DELETE_NODE_TWO_CHILDREN': {
            explanation: "The node has two children. We find its in-order successor (the minimum node in its right subtree), which is guaranteed to have at most one child. We replace the deleted node's value with the successor's value and then delete the successor node.",
            pseudocode: `else
    y = TREE-MINIMUM(z.right)
    y-original-color = y.color
    x = y.right
    if y.parent != z
        TRANSPLANT(T, y, y.right)
        y.right = z.right
        y.right.parent = y
    TRANSPLANT(T, z, y)
    y.left = z.left
    y.left.parent = y
    y.color = z.color`
        },
        'RB_DELETE_NO_FIXUP': {
            explanation: "The node that was removed (or the node that was spliced out) was RED. Removing a red node does not affect the black-height of any path, so no further fixes are needed. The tree remains valid.",
            pseudocode: `if y-original-color == BLACK
    RB-Delete-Fixup(T, x)
else
    // Tree is still valid`
        },
        'RB_DELETE_FIXUP_START': {
            explanation: "A BLACK node was removed, which has reduced the black-height of some paths. The 'Double Black' fixup algorithm is now used to resolve this. It works by ensuring that the sibling of the 'double black' node has extra black to transfer up the tree.",
            pseudocode: `RB-Delete-Fixup(T, x)
  while x != T.root && x.color == BLACK
    w = x.sibling
    // Fixup cases will be handled here`
        },
        'RB_DELETE_CASE_1': {
            explanation: "The sibling of the 'double black' node is RED. By recoloring the sibling BLACK and the parent RED, and then rotating, we transform the situation into one where the sibling is BLACK (Cases 2, 3, or 4), which are easier to handle.",
            pseudocode: `if w.color == RED
    w.color = BLACK
    x.parent.color = RED
    LEFT-ROTATE(T, x.parent)
    w = x.parent.right`
        },
        'RB_DELETE_CASE_2': {
            explanation: "The sibling is BLACK, and both of its children are also BLACK. We can simply recolor the sibling RED. This gives both the 'double black' node and its sibling one less black, effectively moving the 'double black' problem up to the parent node.",
            pseudocode: `if w.left.color == BLACK && w.right.color == BLACK
    w.color = RED
    x = x.parent`
        },
        'RB_DELETE_CASE_3': {
            explanation: "The sibling is BLACK, its far child is BLACK, but its near child is RED. We recolor the sibling and its near child, then perform a rotation on the sibling. This sets up the tree for Case 4, which will resolve the issue.",
            pseudocode: `else if w.right.color == BLACK
    w.left.color = BLACK
    w.color = RED
    RIGHT-ROTATE(T, w)
    w = x.parent.right`
        },
        'RB_DELETE_CASE_4': {
            explanation: "The sibling is BLACK, and its far child is RED. This is the final case. We recolor the sibling to match the parent's color, color the parent BLACK, color the far child BLACK, and rotate at the parent. This resolves the 'double black' issue and restores all properties.",
            pseudocode: `w.color = x.parent.color
x.parent.color = BLACK
w.right.color = BLACK
LEFT-ROTATE(T, x.parent)
x = T.root`
        },
        'RB_DELETE_FIXUP_COMPLETE': {
            explanation: "The fixup process is complete. The 'double black' has been resolved, and the tree now satisfies all Red-Black properties. The node x is colored black to ensure the loop terminates correctly.",
            pseudocode: `x.color = BLACK`
        },
        'RB_DELETE_COMPLETE': {
            explanation: "The deletion operation is fully complete. The tree remains a valid Red-Black Tree with all properties intact.",
            pseudocode: `// Tree is now balanced and valid.`
        }
    },
    avl_insert: {
        'AVL_INSERT_START': {
            explanation: "Starting AVL Tree insertion. We first perform a standard Binary Search Tree insertion to place the new node in the correct position. After insertion, we will walk back up the tree to check for and fix any balance violations.",
            pseudocode: `AVL-Insert(T, k)
  // Standard BST Insertion
  // Then, update heights and rebalance`
        },
        'AVL_INSERT_CREATE_NODE': {
            explanation: "A new node has been created at its correct position in the tree. Its height is initialized to 1. Now, we must update the heights of its ancestors and check if any node's balance factor has become unbalanced (i.e., not -1, 0, or 1).",
            pseudocode: `newNode = new Node(k)
newNode.height = 1
newNode.left = newNode.right = NULL`
        },
        'AVL_INSERT_GO_LEFT': {
            explanation: "The value to insert is smaller than the current node's value, so we are traversing to the left subtree to find the correct insertion point.",
            pseudocode: `if k < node.key
    node.left = AVL-Insert(node.left, k)`
        },
        'AVL_INSERT_GO_RIGHT': {
            explanation: "The value to insert is larger than the current node's value, so we are traversing to the right subtree to find the correct insertion point.",
            pseudocode: `else if k > node.key
    node.right = AVL-Insert(node.right, k)`
        },
        'AVL_INSERT_CHECK_BALANCE': {
            explanation: "After inserting the node and returning up the recursion stack, we update the current node's height and calculate its balance factor (height of left subtree - height of right subtree). If this factor is outside the range [-1, 1], the node is unbalanced and requires rotation.",
            pseudocode: `node.height = 1 + max(height(node.left), height(node.right))
balance = getBalance(node)
if balance > 1 || balance < -1
    // Rotation is needed`
        },
        'AVL_INSERT_LL_CASE': {
            explanation: "Left-Left Case: The node is unbalanced because its left subtree is too heavy, and the new node was inserted into the left subtree of that left child. This forms a straight line. A single right rotation on the unbalanced node will restore balance.",
            pseudocode: `if balance > 1 && k < node.left.key
    return rightRotate(node)`
        },
        'AVL_INSERT_RR_CASE': {
            explanation: "Right-Right Case: The node is unbalanced because its right subtree is too heavy, and the new node was inserted into the right subtree of that right child. This forms a straight line. A single left rotation on the unbalanced node will restore balance.",
            pseudocode: `if balance < -1 && k > node.right.key
    return leftRotate(node)`
        },
        'AVL_INSERT_LR_CASE': {
            explanation: "Left-Right Case: The node is unbalanced because its left subtree is too heavy, but the new node was inserted into the right subtree of that left child. This forms a 'triangle' shape. We need two rotations: first, a left rotation on the left child, followed by a right rotation on the original unbalanced node.",
            pseudocode: `if balance > 1 && k > node.left.key
    node.left = leftRotate(node.left)
    return rightRotate(node)`
        },
        'AVL_INSERT_RL_CASE': {
            explanation: "Right-Left Case: The node is unbalanced because its right subtree is too heavy, but the new node was inserted into the left subtree of that right child. This forms a 'triangle' shape. We need two rotations: first, a right rotation on the right child, followed by a left rotation on the original unbalanced node.",
            pseudocode: `if balance < -1 && k < node.right.key
    node.right = rightRotate(node.right)
    return leftRotate(node)`
        },
        'AVL_INSERT_COMPLETE': {
            explanation: "The insertion and any necessary rebalancing are complete. The tree is now a valid AVL Tree, with the balance factor of every node being -1, 0, or 1. This ensures O(log n) search, insertion, and deletion times.",
            pseudocode: `// Tree is balanced and valid.`
        }
    },
    avl_delete: {
        'AVL_DELETE_START': {
            explanation: "Starting AVL Tree deletion. We first find the node to delete and remove it using the standard BST deletion logic. After removal, the tree may be unbalanced, so we must walk back up from the deletion point and rebalance as necessary.",
            pseudocode: `AVL-Delete(T, k)
  // Standard BST Deletion
  // Then, update heights and rebalance`
        },
        'AVL_DELETE_NOT_FOUND': {
            explanation: "The value to be deleted was not found in the tree. No changes are made.",
            pseudocode: `if node == NULL
    return "Node not found"`
        },
        'AVL_DELETE_GO_LEFT': {
            explanation: "The value to delete is smaller than the current node's value, so we are traversing to the left subtree to find the node to delete.",
            pseudocode: `if k < node.key
    node.left = AVL-Delete(node.left, k)`
        },
        'AVL_DELETE_GO_RIGHT': {
            explanation: "The value to delete is larger than the current node's value, so we are traversing to the right subtree to find the node to delete.",
            pseudocode: `else if k > node.key
    node.right = AVL-Delete(node.right, k)`
        },
        'AVL_DELETE_REMOVE_LEAF': {
            explanation: "The node to delete is a leaf (has no children). It can be safely removed. After removal, we will check its parent for balance issues.",
            pseudocode: `if node.left == NULL && node.right == NULL
    node = NULL`
        },
        'AVL_DELETE_REPLACE_WITH_CHILD': {
            explanation: "The node to delete has only one child. We replace the node with its child. After replacement, we will check the new node's position for balance issues.",
            pseudocode: `else if node.left == NULL
    temp = node.right
    node = temp
else if node.right == NULL
    temp = node.left
    node = temp`
        },
        'AVL_DELETE_REPLACE_WITH_SUCCESSOR': {
            explanation: "The node to delete has two children. We find its in-order successor (the smallest node in its right subtree), copy the successor's value to the current node, and then recursively delete the successor node (which is guaranteed to have at most one child).",
            pseudocode: `temp = minValueNode(node.right)
node.key = temp.key
node.right = AVL-Delete(node.right, temp.key)`
        },
        'AVL_DELETE_CHECK_BALANCE': {
            explanation: "After the deletion, we are returning up the recursion stack. We update the current node's height and calculate its balance factor. If it is outside the range [-1, 1], the node is unbalanced and requires rotation to restore the AVL property.",
            pseudocode: `node.height = 1 + max(height(node.left), height(node.right))
balance = getBalance(node)
if balance > 1 || balance < -1
    // Rotation is needed`
        },
        'AVL_DELETE_LL_CASE': {
            explanation: "Left-Left Case: The node is unbalanced after deletion. Its left subtree is heavier than its right. We check the balance of the left child. If the left child is also left-heavy or balanced, a single right rotation on the current node will fix the imbalance.",
            pseudocode: `if balance > 1 && getBalance(node.left) >= 0
    return rightRotate(node)`
        },
        'AVL_DELETE_RR_CASE': {
            explanation: "Right-Right Case: The node is unbalanced after deletion. Its right subtree is heavier than its left. We check the balance of the right child. If the right child is also right-heavy or balanced, a single left rotation on the current node will fix the imbalance.",
            pseudocode: `if balance < -1 && getBalance(node.right) <= 0
    return leftRotate(node)`
        },
        'AVL_DELETE_LR_CASE': {
            explanation: "Left-Right Case: The node is unbalanced because its left subtree is heavy, but the left child itself is right-heavy. A single right rotation would not work. We must first perform a left rotation on the left child, then a right rotation on the current node.",
            pseudocode: `if balance > 1 && getBalance(node.left) < 0
    node.left = leftRotate(node.left)
    return rightRotate(node)`
        },
        'AVL_DELETE_RL_CASE': {
            explanation: "Right-Left Case: The node is unbalanced because its right subtree is heavy, but the right child itself is left-heavy. A single left rotation would not work. We must first perform a right rotation on the right child, then a left rotation on the current node.",
            pseudocode: `if balance < -1 && getBalance(node.right) > 0
    node.right = rightRotate(node.right)
    return leftRotate(node)`
        },
        'AVL_DELETE_COMPLETE': {
            explanation: "The deletion and any necessary rebalancing are complete. The tree is now a valid AVL Tree, with all nodes having a balance factor of -1, 0, or 1.",
            pseudocode: `// Tree is balanced and valid.`
        }
    }
};


// Global variables
let algorithmSpeed = 600; 
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

     // ADD JUST THIS LINE:
    svg.style.overflow = 'visible';
    
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
    
    // Calculate positions
    const positions = calculateNodePositions(root, width / 2, 50, width / 4, nodeRadius, minHorizontalSpacing);

    
    
    // Find the bounds of all positions
    const bounds = calculateBounds(positions, nodeRadius);
    
    // Make SVG larger if needed to contain all nodes
    const svgWidth = Math.max(width, bounds.width + 100);
    const svgHeight = Math.max(height, bounds.height + 100);
    
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    
    // Add glow filter definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glowFilter.setAttribute('id', 'glow');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    glowFilter.appendChild(feGaussianBlur);
    glowFilter.appendChild(feMerge);
    defs.appendChild(glowFilter);
    svg.appendChild(defs);
    
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
        circle.setAttribute('filter', 'url(#glow)');
        
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

// Add this helper function to calculate bounds
function calculateBounds(positions, nodeRadius) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    positions.forEach(pos => {
        minX = Math.min(minX, pos.x - nodeRadius);
        maxX = Math.max(maxX, pos.x + nodeRadius);
        minY = Math.min(minY, pos.y - nodeRadius);
        maxY = Math.max(maxY, pos.y + nodeRadius);
    });
    
    return {
        minX,
        maxX,
        minY,
        maxY,
        width: maxX - minX,
        height: maxY - minY
    };
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
    const cuesContent = document.getElementById('cuesContent');
    
    let icon = '✨';
    if (step.type === 'success') icon = '✅';
    else if (step.type === 'warning') icon = '⚠️';
    else if (step.type === 'error') icon = '❌';
    else if (step.type === 'info') icon = 'ℹ️';
    
    // Update main display
    display.innerHTML = `
        <div class="current-step">
            <span>${icon}</span>
            <span>${step.text}</span>
            <span class="step-type ${step.type}">${step.type}</span>
        </div>
        <div class="step-description">Step ${stepNumber + 1} of ${totalSteps}</div>
    `;
    
    // Update visual cues based on current operation
    updateVisualCues(cuesContent, step);
    
    // Store current step info
    currentStepInfo = { step, stepNumber, totalSteps };
}

// Helper function to provide reasons for each step (can be removed or integrated)
function getStepReason(stepText) {
    // This function is now redundant as explanations are more detailed
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
        
        // Generate pseudocode based on actual steps
        generateOperationPseudocode(operation.type, operation.value, steps);
        
    } else if (operation.type === 'delete') {
        const tree = currentTreeType === 'rb' ? rbTree : avlTree;
        steps = tree.delete(operation.value);
        
        // Generate pseudocode based on actual steps
        generateOperationPseudocode(operation.type, operation.value, steps);
        
    } else if (operation.type === 'clear') {
        if (currentTreeType === 'rb') {
            rbTree = new RedBlackTree();
        } else {
            avlTree = new AVLTree();
        }
        steps = [{ code: 'CLEAR_TREE', text: 'Tree cleared', type: 'success' }];
        
        // Generate pseudocode for clear operation
        generateOperationPseudocode(operation.type, null, steps);
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
            
            // Update algorithm display immediately
            updateAlgorithmDisplay(step, currentStep, steps.length);
            
            // Draw tree at regular animation speed
            drawTree();
            currentStep++;
            
            // Use algorithm speed for next step
            animationTimeout = setTimeout(showStep, algorithmSpeed);
        } else if (currentStep >= steps.length) {
            // Keep the last step displayed
            const lastStep = steps[steps.length - 1];
            updateAlgorithmDisplay(lastStep, steps.length - 1, steps.length);
            drawTree();
            
            window.animationComplete = true;
            
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
    
    // Clear current operation
    window.currentOperation = null;
    
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
    
    // Reset to default content
    const detailsContent = document.getElementById('detailsContent');
    const algorithmCode = document.getElementById('algorithmCode');
    
    detailsContent.innerHTML = `<p>Perform an operation to see detailed explanations of each step.</p>`;
    algorithmCode.textContent = "Pseudocode for the current operation will appear here.";
    
    // Update statistics with explicit reset
    document.getElementById('nodeCount').textContent = '0';
    document.getElementById('treeHeight').textContent = '0';
    
    if (currentTreeType === 'rb') {
        document.getElementById('treeStat').textContent = '0';
        document.getElementById('treeStatLabel').textContent = 'Black Height';
    } else {
        document.getElementById('treeStat').textContent = '-';
        document.getElementById('treeStatLabel').textContent = 'Balance Factor';
    }
    
    // Update traversal results
    updateTraversalResults();
    
    // Update history
    addToHistory('Clear Tree', null, 'clear');
    showToast('Tree cleared', 'info');
    
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
    initBackgroundAnimations();
    initFloatingParticles();
    initThemeParticles();
    initOrbitingElements();
    initializeBackgroundEffects();
    initializeTinyElements();
    initFooterLinks();
    addScrollIndicator();
    
    // Initialize persistent display variable
    window.persistentOperationDetails = null;
    
    // REMOVE THIS LINE - NO MORE INTERVAL CHECK
    // setInterval(maintainPersistentDisplay, 2000);
}
// Particle System for Dark Mode
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Twinkle effect
            particle.opacity += particle.twinkleSpeed;
            if (particle.opacity > 1 || particle.opacity < 0.2) {
                particle.twinkleSpeed = -particle.twinkleSpeed;
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Add glow effect for larger particles
            if (particle.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.2})`;
                this.ctx.fill();
            }
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Autumn Leaves System for Light Mode
class AutumnLeavesSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.leaves = [];
        this.leafColors = ['#D2691E', '#FF8C00', '#FF6347', '#CD853F', '#8B4513'];
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const leafCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);
        
        for (let i = 0; i < leafCount; i++) {
            this.leaves.push(this.createLeaf(true));
        }
    }
    
    createLeaf(initial = false) {
        return {
            x: Math.random() * this.canvas.width,
            y: initial ? Math.random() * this.canvas.height : -20,
            size: Math.random() * 15 + 10,
            speedX: (Math.random() - 0.5) * 2,
            speedY: Math.random() * 2 + 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            color: this.leafColors[Math.floor(Math.random() * this.leafColors.length)],
            opacity: Math.random() * 0.7 + 0.3,
            swayAmount: Math.random() * 30 + 20,
            swaySpeed: Math.random() * 0.02 + 0.01,
            time: Math.random() * Math.PI * 2
        };
    }
    
    update() {
        this.leaves.forEach((leaf, index) => {
            leaf.y += leaf.speedY;
            leaf.time += leaf.swaySpeed;
            leaf.x += Math.sin(leaf.time) * leaf.swayAmount * 0.02 + leaf.speedX;
            leaf.rotation += leaf.rotationSpeed;
            
            // Reset leaf when it falls off screen
            if (leaf.y > this.canvas.height + 20) {
                this.leaves[index] = this.createLeaf();
            }
            
            // Wrap horizontally
            if (leaf.x < -20) leaf.x = this.canvas.width + 20;
            if (leaf.x > this.canvas.width + 20) leaf.x = -20;
        });
    }
    
    drawLeaf(leaf) {
        this.ctx.save();
        this.ctx.translate(leaf.x, leaf.y);
        this.ctx.rotate(leaf.rotation);
        this.ctx.globalAlpha = leaf.opacity;
        
        // Draw a simple leaf shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, -leaf.size);
        this.ctx.quadraticCurveTo(leaf.size * 0.5, -leaf.size * 0.5, leaf.size * 0.4, 0);
        this.ctx.quadraticCurveTo(leaf.size * 0.3, leaf.size * 0.3, 0, leaf.size);
        this.ctx.quadraticCurveTo(-leaf.size * 0.3, leaf.size * 0.3, -leaf.size * 0.4, 0);
        this.ctx.quadraticCurveTo(-leaf.size * 0.5, -leaf.size * 0.5, 0, -leaf.size);
        
        this.ctx.fillStyle = leaf.color;
        this.ctx.fill();
        
        // Add leaf vein
        this.ctx.beginPath();
        this.ctx.moveTo(0, -leaf.size);
        this.ctx.lineTo(0, leaf.size);
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.leaves.forEach(leaf => {
            this.drawLeaf(leaf);
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the animation systems
function initBackgroundAnimations() {
    const particlesCanvas = document.getElementById('particlesCanvas');
    const leavesCanvas = document.getElementById('leavesCanvas');
    
    if (particlesCanvas && leavesCanvas) {
        const particleSystem = new ParticleSystem(particlesCanvas);
        const leavesSystem = new AutumnLeavesSystem(leavesCanvas);
        
        particleSystem.animate();
        leavesSystem.animate();
    }
}

// Interactive Celestial Theme Switcher
function initThemeToggle() {
    const celestialContainer = document.getElementById('celestialContainer');
    const moon = document.getElementById('moon');
    const sun = document.getElementById('sun');
    const body = document.body;
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
    }
    
    // Click handler for theme switching
    celestialContainer.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add animation class
        celestialContainer.style.transform = 'scale(0.8) rotate(360deg)';
        
        setTimeout(() => {
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                showToast('☀️ Switched to light mode', 'info');
                
                // Animate sun appearance
                sun.style.transform = 'translate(-50%, -50%) scale(1.2) rotate(0deg)';
                setTimeout(() => {
                    sun.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
                }, 300);
            } else {
                localStorage.setItem('theme', 'dark');
                showToast('🌙 Switched to dark mode', 'info');
                
                // Animate moon appearance
                moon.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => {
                    moon.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 300);
            }
            
            // Reset container transform
            celestialContainer.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    });
    
    // Add hover effect
    celestialContainer.addEventListener('mouseenter', function() {
        const currentElement = body.classList.contains('light-mode') ? sun : moon;
        currentElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
    });
    
    celestialContainer.addEventListener('mouseleave', function() {
        const currentElement = body.classList.contains('light-mode') ? sun : moon;
        currentElement.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// Add floating particles interaction
function initFloatingParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Add random delay to start animations
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add mouse interaction
        particle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(2)';
            this.style.opacity = '1';
        });
        
        particle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '';
        });
    });
}

// Clear persistent display when starting a new operation
function clearPersistentDisplay() {
    const detailsContent = document.getElementById('detailsContent');
    const algorithmCode = document.getElementById('algorithmCode');
    
    // Remove persistent attributes
    detailsContent.removeAttribute('data-persistent');
    algorithmCode.removeAttribute('data-persistent');
    
    // Reset to default content
    detailsContent.innerHTML = `
        <p>Perform an operation to see detailed explanations of each step.</p>
    `;
    algorithmCode.textContent = "Pseudocode for the current operation will appear here.";
}

// Call this function only when needed - add to these existing functions:
function resetOperationState() {
    isProcessingQueue = false;
    processQueue();
    // Add this line
    setTimeout(protectPersistentDisplay, 100);
}

function clearTree() {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }
    
    // Clear the queue first
    operationQueue = [];
    isProcessingQueue = false;
    
    // Clear persistent display when clearing tree
    window.persistentOperationDetails = null;
    window.animationComplete = false;
    
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
    
    // Reset to default content
    const detailsContent = document.getElementById('detailsContent');
    const algorithmCode = document.getElementById('algorithmCode');
    
    detailsContent.innerHTML = `<p>Perform an operation to see detailed explanations of each step.</p>`;
    algorithmCode.textContent = "Pseudocode for the current operation will appear here.";
    
    // Update statistics with explicit reset
    document.getElementById('nodeCount').textContent = '0';
    document.getElementById('treeHeight').textContent = '0';
    
    if (currentTreeType === 'rb') {
        document.getElementById('treeStat').textContent = '0';
        document.getElementById('treeStatLabel').textContent = 'Black Height';
    } else {
        document.getElementById('treeStat').textContent = '-';
        document.getElementById('treeStatLabel').textContent = 'Balance Factor';
    }
    
    // Update traversal results
    updateTraversalResults();
    
    // Update history
    addToHistory('Clear Tree', null, 'clear');
    showToast('Tree cleared', 'info');
    
    // Enable buttons
    setButtonsEnabled(true);
}

function generateOperationPseudocode(operationType, operationValue, steps) {
    const detailsContent = document.getElementById('detailsContent');
    const algorithmCode = document.getElementById('algorithmCode');
    
    let explanation = "";
    let pseudocode = "";
    
    if (operationType === 'insert') {
        if (currentTreeType === 'rb') {
            // Build explanation based on actual steps
            explanation = `Inserting value ${operationValue} into Red-Black Tree. `;
            
            // Check what steps will be performed
            const hasFixup = steps.some(step => step.code.includes('FIXUP') || step.code.includes('CASE'));
            const hasCase1 = steps.some(step => step.code === 'RB_INSERT_CASE_1');
            const hasCase2 = steps.some(step => step.code === 'RB_INSERT_CASE_2');
            const hasCase3 = steps.some(step => step.code === 'RB_INSERT_CASE_3');
            
            if (hasFixup) {
                explanation += `This insertion will trigger fixup operations to maintain Red-Black properties. `;
                if (hasCase1) explanation += `Case 1 (uncle recoloring) will be applied. `;
                if (hasCase2) explanation += `Case 2 (triangle rotation) will be applied. `;
                if (hasCase3) explanation += `Case 3 (line rotation) will be applied. `;
            } else {
                explanation += `This insertion will not require any fixup operations as it maintains all Red-Black properties. `;
            }
            
            // Build pseudocode based on actual steps
            pseudocode = `RB-Insert(T, ${operationValue})\n`;
            pseudocode += `  z = new Node(${operationValue})\n`;
            pseudocode += `  z.color = RED\n`;
            pseudocode += `  BST-Insert(T, z)\n`;
            
            if (hasFixup) {
                pseudocode += `  \n  // Fixup required:\n`;
                pseudocode += `  while z.parent.color == RED:\n`;
                
                if (hasCase1) {
                    pseudocode += `    // Case 1: Uncle is RED\n`;
                    pseudocode += `    z.parent.color = BLACK\n`;
                    pseudocode += `    z.uncle.color = BLACK\n`;
                    pseudocode += `    z.grandparent.color = RED\n`;
                    pseudocode += `    z = z.grandparent\n`;
                }
                
                if (hasCase2) {
                    pseudocode += `    // Case 2: Triangle formation\n`;
                    pseudocode += `    z = z.parent\n`;
                    pseudocode += `    LEFT-ROTATE(T, z)\n`;
                }
                
                if (hasCase3) {
                    pseudocode += `    // Case 3: Line formation\n`;
                    pseudocode += `    z.parent.color = BLACK\n`;
                    pseudocode += `    z.grandparent.color = RED\n`;
                    pseudocode += `    RIGHT-ROTATE(T, z.grandparent)\n`;
                }
            }
            
            pseudocode += `  \n  T.root.color = BLACK`;
            
        } else {
            // AVL Tree insertion
            explanation = `Inserting value ${operationValue} into AVL Tree. `;
            
            // Check what rotation cases will be performed
            const hasRotation = steps.some(step => step.code.includes('CASE'));
            const hasLL = steps.some(step => step.code === 'AVL_INSERT_LL_CASE');
            const hasRR = steps.some(step => step.code === 'AVL_INSERT_RR_CASE');
            const hasLR = steps.some(step => step.code === 'AVL_INSERT_LR_CASE');
            const hasRL = steps.some(step => step.code === 'AVL_INSERT_RL_CASE');
            
            if (hasRotation) {
                explanation += `This insertion will require rotation(s) to maintain AVL balance. `;
                if (hasLL) explanation += `Left-Left case: Right rotation will be applied. `;
                if (hasRR) explanation += `Right-Right case: Left rotation will be applied. `;
                if (hasLR) explanation += `Left-Right case: Left-Right rotation will be applied. `;
                if (hasRL) explanation += `Right-Left case: Right-Left rotation will be applied. `;
            } else {
                explanation += `This insertion maintains AVL balance without requiring rotations. `;
            }
            
            // Build pseudocode based on actual steps
            pseudocode = `AVL-Insert(T, ${operationValue})\n`;
            pseudocode += `  // Standard BST Insertion\n`;
            pseudocode += `  if T.root == NULL:\n`;
            pseudocode += `    T.root = new Node(${operationValue})\n`;
            pseudocode += `  else:\n`;
            pseudocode += `    if ${operationValue} < node.key:\n`;
            pseudocode += `      node.left = AVL-Insert(node.left, ${operationValue})\n`;
            pseudocode += `    else if ${operationValue} > node.key:\n`;
            pseudocode += `      node.right = AVL-Insert(node.right, ${operationValue})\n`;
            
            if (hasRotation) {
                pseudocode += `  \n  // Balance and Rotate:\n`;
                pseudocode += `  node.height = 1 + max(height(node.left), height(node.right))\n`;
                pseudocode += `  balance = getBalance(node)\n`;
                
                if (hasLL) {
                    pseudocode += `  \n  // Left-Left Case\n`;
                    pseudocode += `  if balance > 1 && ${operationValue} < node.left.key:\n`;
                    pseudocode += `    return rightRotate(node)\n`;
                }
                
                if (hasRR) {
                    pseudocode += `  \n  // Right-Right Case\n`;
                    pseudocode += `  if balance < -1 && ${operationValue} > node.right.key:\n`;
                    pseudocode += `    return leftRotate(node)\n`;
                }
                
                if (hasLR) {
                    pseudocode += `  \n  // Left-Right Case\n`;
                    pseudocode += `  if balance > 1 && ${operationValue} > node.left.key:\n`;
                    pseudocode += `    node.left = leftRotate(node.left)\n`;
                    pseudocode += `    return rightRotate(node)\n`;
                }
                
                if (hasRL) {
                    pseudocode += `  \n  // Right-Left Case\n`;
                    pseudocode += `  if balance < -1 && ${operationValue} < node.right.key:\n`;
                    pseudocode += `    node.right = rightRotate(node.right)\n`;
                    pseudocode += `    return leftRotate(node)\n`;
                }
            }
        }
        
    } else if (operationType === 'delete') {
        if (currentTreeType === 'rb') {
            explanation = `Deleting value ${operationValue} from Red-Black Tree. `;
            
            // Check what deletion cases will be performed
            const hasFixup = steps.some(step => step.code.includes('FIXUP') || step.code.includes('CASE'));
            const hasOneChild = steps.some(step => step.code === 'RB_DELETE_NODE_ONE_CHILD');
            const hasTwoChildren = steps.some(step => step.code === 'RB_DELETE_NODE_TWO_CHILDREN');
            
            if (hasOneChild) {
                explanation += `The node has at most one child and will be transplanted directly. `;
            } else if (hasTwoChildren) {
                explanation += `The node has two children and will be replaced with its in-order successor. `;
            }
            
            if (hasFixup) {
                explanation += `Fixup operations will be performed to maintain Red-Black properties. `;
            } else {
                explanation += `No fixup needed as the deleted node was red. `;
            }
            
            // Build deletion pseudocode
            pseudocode = `RB-Delete(T, ${operationValue})\n`;
            pseudocode += `  z = T.search(${operationValue})\n`;
            pseudocode += `  if z == T.NIL:\n`;
            pseudocode += `    return "Node not found"\n`;
            pseudocode += `  \n`;
            pseudocode += `  y = z\n`;
            pseudocode += `  y-original-color = y.color\n`;
            
            if (hasOneChild) {
                pseudocode += `  \n  // Node has one child or none\n`;
                pseudocode += `  if z.left == T.NIL:\n`;
                pseudocode += `    x = z.right\n`;
                pseudocode += `    TRANSPLANT(T, z, z.right)\n`;
                pseudocode += `  else if z.right == T.NIL:\n`;
                pseudocode += `    x = z.left\n`;
                pseudocode += `    TRANSPLANT(T, z, z.left)\n`;
            } else if (hasTwoChildren) {
                pseudocode += `  \n  // Node has two children\n`;
                pseudocode += `  y = TREE-MINIMUM(z.right)\n`;
                pseudocode += `  y-original-color = y.color\n`;
                pseudocode += `  x = y.right\n`;
                pseudocode += `  if y.parent != z:\n`;
                pseudocode += `    TRANSPLANT(T, y, y.right)\n`;
                pseudocode += `    y.right = z.right\n`;
                pseudocode += `    y.right.parent = y\n`;
                pseudocode += `  TRANSPLANT(T, z, y)\n`;
                pseudocode += `  y.left = z.left\n`;
                pseudocode += `  y.left.parent = y\n`;
                pseudocode += `  y.color = z.color\n`;
            }
            
            if (hasFixup) {
                pseudocode += `  \n  // Fixup required\n`;
                pseudocode += `  if y-original-color == BLACK:\n`;
                pseudocode += `    RB-Delete-Fixup(T, x)\n`;
            } else {
                pseudocode += `  \n  // No fixup needed\n`;
                pseudocode += `  // Tree remains valid\n`;
            }
            
        } else {
            // AVL Tree deletion
            explanation = `Deleting value ${operationValue} from AVL Tree. `;
            
            const hasRotation = steps.some(step => step.code.includes('CASE'));
            
            if (hasRotation) {
                explanation += `Balance violations detected and will be fixed with rotations. `;
            } else {
                explanation += `Deletion maintains AVL balance. `;
            }
            
            pseudocode = `AVL-Delete(T, ${operationValue})\n`;
            pseudocode += `  // Standard BST Deletion\n`;
            pseudocode += `  if node == NULL:\n`;
            pseudocode += `    return "Node not found"\n`;
            pseudocode += `  \n`;
            pseudocode += `  if ${operationValue} < node.key:\n`;
            pseudocode += `    node.left = AVL-Delete(node.left, ${operationValue})\n`;
            pseudocode += `  else if ${operationValue} > node.key:\n`;
            pseudocode += `    node.right = AVL-Delete(node.right, ${operationValue})\n`;
            pseudocode += `  else:\n`;
            pseudocode += `    // Delete this node\n`;
            
            if (hasRotation) {
                pseudocode += `    \n    // Rebalance after deletion\n`;
                pseudocode += `    node.height = 1 + max(height(node.left), height(node.right))\n`;
                pseudocode += `    balance = getBalance(node)\n`;
                pseudocode += `    \n`;
                pseudocode += `    // Apply necessary rotations\n`;
                pseudocode += `    if balance > 1 && getBalance(node.left) >= 0:\n`;
                pseudocode += `      return rightRotate(node)\n`;
                pseudocode += `    if balance > 1 && getBalance(node.left) < 0:\n`;
                pseudocode += `      node.left = leftRotate(node.left)\n`;
                pseudocode += `      return rightRotate(node)\n`;
                pseudocode += `    if balance < -1 && getBalance(node.right) <= 0:\n`;
                pseudocode += `      return leftRotate(node)\n`;
                pseudocode += `    if balance < -1 && getBalance(node.right) > 0:\n`;
                pseudocode += `      node.right = rightRotate(node.right)\n`;
                pseudocode += `      return leftRotate(node)\n`;
            }
        }
        
    } else if (operationType === 'clear') {
        explanation = "Clearing the entire tree. All nodes will be removed and the tree will be reset to an empty state.";
        pseudocode = `// Clear Tree Operation\n`;
        pseudocode += `if currentTreeType == 'rb':\n`;
        pseudocode += `  rbTree = new RedBlackTree()\n`;
        pseudocode += `else:\n`;
        pseudocode += `  avlTree = new AVLTree()\n`;
        pseudocode += `\n`;
        pseudocode += `// Reset display\n`;
        pseudocode += `updateStats()\n`;
        pseudocode += `updateTraversalResults()\n`;
        pseudocode += `drawTree()`;
    }
    
    // Update the display immediately
    detailsContent.innerHTML = `<p>${explanation}</p>`;
    algorithmCode.textContent = pseudocode;
    
    // Store as current operation
    window.currentOperation = {
        type: operationType,
        value: operationValue,
        explanation: explanation,
        pseudocode: pseudocode
    };
}

// Call the initialize function
initializeApp();

// Dynamic particle generation
function initAmbientParticles() {
    const container = document.querySelector('.ambient-particles');
    
    // Add more particles dynamically
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 20) + 's';
        container.appendChild(particle);
    }
}

// Mouse-reactive background
function initMouseReactiveBackground() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // Subtle parallax effect on background elements
        const particles = document.querySelectorAll('.ambient-particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Update gradient position based on mouse
        document.body.style.backgroundPosition = `${mouseX * 50}% ${mouseY * 50}%`;
    });
}

// Time-based background changes
function initTimeBasedBackground() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 6 && hour < 12) {
        // Morning - softer colors
        body.style.filter = 'brightness(1.1) saturate(0.9)';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon - normal colors
        body.style.filter = 'brightness(1) saturate(1)';
    } else if (hour >= 18 && hour < 22) {
        // Evening - warmer colors
        body.style.filter = 'brightness(0.9) saturate(1.1) hue-rotate(-10deg)';
    } else {
        // Night - cooler colors
        body.style.filter = 'brightness(0.8) saturate(0.8) hue-rotate(10deg)';
    }
}

// Performance optimization
function optimizeBackgroundEffects() {
    // Reduce particles on mobile
    if (window.innerWidth <= 768) {
        const particles = document.querySelectorAll('.ambient-particle');
        particles.forEach((particle, index) => {
            if (index > 10) particle.remove();
        });
    }
    
    // Disable animations on low-end devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.ambient-particle, .geo-shape, .aurora').forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// Initialize all background effects
function initializeBackgroundEffects() {
    initAmbientParticles();
    initMouseReactiveBackground();
    initTimeBasedBackground();
    optimizeBackgroundEffects();
    
    // Update time-based background every hour
    setInterval(initTimeBasedBackground, 3600000);
}


// Generate random tiny elements
function generateTinyElements() {
    const containers = [
        { selector: '.micro-dots', count: 15, className: 'micro-dot' },
        { selector: '.sparkles', count: 12, className: 'sparkle' },
        { selector: '.bubbles', count: 10, className: 'bubble' },
        { selector: '.stars', count: 8, className: 'star' },
        { selector: '.micro-lines', count: 6, className: 'micro-line' },
        { selector: '.plus-symbols', count: 5, className: 'plus-symbol' }
    ];
    
    containers.forEach(container => {
        const element = document.querySelector(container.selector);
        if (!element) return;
        
        // Clear existing elements
        element.innerHTML = '';
        
        // Generate new elements
        for (let i = 0; i < container.count; i++) {
            const el = document.createElement('div');
            el.className = container.className;
            
            // Random position
            el.style.top = Math.random() * 100 + '%';
            el.style.left = Math.random() * 100 + '%';
            
            // Random animation delay
            el.style.animationDelay = Math.random() * 5 + 's';
            
            // Random animation duration
            if (container.className === 'bubble') {
                el.style.width = Math.random() * 2 + 2 + 'px';
                el.style.height = el.style.width;
                el.style.animationDuration = (Math.random() * 5 + 10) + 's';
            } else if (container.className === 'micro-line') {
                el.style.width = Math.random() * 5 + 5 + 'px';
                el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
                el.style.setProperty('--rotation', Math.random() * 60 - 30 + 'deg');
            }
            
            element.appendChild(el);
        }
    });
}

// Interactive hover effect for tiny elements
function initTinyElementInteraction() {
    const elements = document.querySelectorAll('.micro-dot, .sparkle, .bubble, .star');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0.5';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
}

// Performance optimization
function optimizeTinyElements() {
    // Reduce elements on mobile
    if (window.innerWidth <= 768) {
        const elements = document.querySelectorAll('.micro-dots, .sparkles, .bubbles, .stars, .micro-lines, .plus-symbols');
        elements.forEach(container => {
            const children = container.children;
            for (let i = children.length - 1; i > 5; i--) {
                children[i].remove();
            }
        });
    }
    
    // Disable animations on low-end devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.micro-dot, .sparkle, .bubble, .star, .micro-line, .plus-symbol').forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// Initialize tiny elements
function initializeTinyElements() {
    generateTinyElements();
    initTinyElementInteraction();
    optimizeTinyElements();
    
    // Regenerate elements on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            generateTinyElements();
            optimizeTinyElements();
        }, 250);
    });
}

// Enhanced footer link functionality
function initFooterLinks() {
    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('.footer-link[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Universal scroll to section function with enhanced feedback
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
        // Calculate offset to account for fixed headers
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        
        // Smooth scroll to the section
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Wait for scroll to complete before highlighting
        setTimeout(() => {
            highlightSection(targetElement);
        }, 500);
        
        // Add a subtle pulse animation to the target section
        targetElement.style.animation = 'sectionPulse 0.6s ease';
        setTimeout(() => {
            targetElement.style.animation = '';
        }, 600);
        
    } else {
        console.warn(`Section with ID '${sectionId}' not found`);
        showToast(`Section '${sectionId}' not found`, 'error');
    }
}

// Enhanced highlight section function
function highlightSection(element) {
    // Remove existing highlights
    document.querySelectorAll('.section-highlight').forEach(el => {
        el.classList.remove('section-highlight');
    });
    
    // Add highlight class
    element.classList.add('section-highlight');
    
    // Remove highlight after animation
    setTimeout(() => {
        element.classList.remove('section-highlight');
    }, 2000);
}

// Highlight section function
function highlightSection(element) {
    element.style.transition = 'box-shadow 0.3s ease';
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
    
    setTimeout(() => {
        element.style.boxShadow = '';
    }, 2000);
}

// Scroll to algorithm panel
function scrollToAlgorithmPanel() {
    const algorithmPanel = document.querySelector('.algorithm-panel');
    if (algorithmPanel) {
        algorithmPanel.scrollIntoView({ behavior: 'smooth' });
        highlightSection(algorithmPanel);
    } else {
        showToast('Algorithm panel not found', 'error');
    }
}

// Enhanced performQuickAction with loading state
function performQuickAction(action) {
    // Find the clicked link
    const clickedLink = event.target;
    
    // Add loading state
    clickedLink.classList.add('loading');
    const originalText = clickedLink.textContent;
    
    try {
        switch(action) {
            case 'generateRandom':
                if (typeof generateRandom === 'function') {
                    generateRandom();
                    showToast('Random tree generated!', 'success');
                    setTimeout(() => {
                        scrollToSection('visualization');
                        removeLoadingState(clickedLink, originalText);
                    }, 300);
                } else {
                    showToast('Generate function not available', 'error');
                    removeLoadingState(clickedLink, originalText);
                }
                break;
                
            case 'clearTree':
                if (typeof clearTree === 'function') {
                    clearTree();
                    showToast('Tree cleared!', 'info');
                    scrollToSection('visualization');
                    removeLoadingState(clickedLink, originalText);
                } else {
                    showToast('Clear function not available', 'error');
                    removeLoadingState(clickedLink, originalText);
                }
                break;
                
            case 'switchToRB':
                if (typeof switchTreeType === 'function') {
                    switchTreeType('rb');
                    showToast('Switched to Red-Black Tree', 'success');
                    setTimeout(() => {
                        scrollToSection('visualization');
                        removeLoadingState(clickedLink, originalText);
                    }, 100);
                } else {
                    showToast('Switch function not available', 'error');
                    removeLoadingState(clickedLink, originalText);
                }
                break;
                
            case 'switchToAVL':
                if (typeof switchTreeType === 'function') {
                    switchTreeType('avl');
                    showToast('Switched to AVL Tree', 'success');
                    setTimeout(() => {
                        scrollToSection('visualization');
                        removeLoadingState(clickedLink, originalText);
                    }, 100);
                } else {
                    showToast('Switch function not available', 'error');
                    removeLoadingState(clickedLink, originalText);
                }
                break;
                
            default:
                showToast('Unknown action', 'error');
                removeLoadingState(clickedLink, originalText);
        }
    } catch (error) {
        console.error('Error performing quick action:', error);
        showToast('Error performing action', 'error');
        removeLoadingState(clickedLink, originalText);
    }
}

// Helper function to remove loading state
function removeLoadingState(element, originalText) {
    element.classList.remove('loading');
    // Restore original text if it was changed
    if (element.textContent !== originalText) {
        element.textContent = originalText;
    }
}

// Share app function
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'Red Blackify - Interactive Tree Visualizer',
            text: 'Check out this amazing Red-Black Tree and AVL Tree visualizer!',
            url: window.location.href
        }).then(() => {
            showToast('Shared successfully!', 'success');
        }).catch((error) => {
            console.log('Share cancelled or failed:', error);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast('Link copied to clipboard!', 'success');
    }
}

// Bookmark page function
function bookmarkPage() {
    if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel('Red Blackify', window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) {
        // IE
        window.external.AddFavorite(window.location.href, 'Red Blackify');
    } else if (window.opera && window.print) {
        // Opera
        this.title = 'Red Blackify';
        return true;
    } else {
        // WebKit - Safari, Chrome
        alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
    }
    showToast('Bookmark this page for easy access!', 'info');
}

// Documentation modal function
function showDocumentation() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.documentation-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'documentation-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--bg-light);
        padding: 2rem;
        border-radius: 1rem;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    content.innerHTML = `
        <h2 style="color: var(--accent); margin-bottom: 1rem;">Red Blackify Documentation</h2>
        <div style="color: var(--text-secondary); line-height: 1.6;">
            <h3 style="color: var(--text-primary); margin-top: 1.5rem;">Getting Started</h3>
            <p>Red Blackify is an interactive visualization tool for understanding Red-Black Trees and AVL Trees.</p>
            
            <h3 style="color: var(--text-primary); margin-top: 1.5rem;">Features</h3>
            <ul>
                <li>Interactive tree visualization</li>
                <li>Step-by-step algorithm explanations</li>
                <li>Support for both Red-Black and AVL trees</li>
                <li>Tree traversal animations</li>
                <li>Operation history tracking</li>
                <li>Tree comparison tools</li>
            </ul>
            
            <h3 style="color: var(--text-primary); margin-top: 1.5rem;">How to Use</h3>
            <ol>
                <li>Enter a value and click "Insert" to add nodes</li>
                <li>Enter a value and click "Delete" to remove nodes</li>
                <li>Use "Search" to find specific nodes</li>
                <li>Click "Generate Random" to create a sample tree</li>
                <li>Switch between Red-Black and AVL trees to compare</li>
                <li>Visualize traversals to understand different algorithms</li>
            </ol>
            
            <h3 style="color: var(--text-primary); margin-top: 1.5rem;">Keyboard Shortcuts</h3>
            <ul>
                <li><kbd>Enter</kbd> - Perform action when input is focused</li>
            </ul>
        </div>
        
        <button onclick="this.parentElement.parentElement.remove()" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 1.2rem;
        ">×</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close modal with Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Keyboard shortcuts modal
function showKeyboardShortcuts() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.shortcuts-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--bg-light);
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        position: relative;
    `;
    
    content.innerHTML = `
        <h2 style="color: var(--accent); margin-bottom: 1rem;">Keyboard Shortcuts</h2>
        <div style="color: var(--text-secondary); line-height: 1.6;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);"><kbd>Enter</kbd></td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Perform action when input is focused</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);"><kbd>Tab</kbd></td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Navigate between inputs</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);"><kbd>Esc</kbd></td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Close modals</td>
                </tr>
            </table>
        </div>
        
        <button onclick="this.parentElement.parentElement.remove()" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 1.2rem;
        ">×</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close modal with Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Add footer scroll indicator
function addScrollIndicator() {
    // Remove existing indicator if any
    const existingIndicator = document.querySelector('.footer-scroll-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'footer-scroll-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: var(--accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    indicator.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
    `;
    
    indicator.title = 'Go to footer';
    
    indicator.addEventListener('click', () => {
        footer.scrollIntoView({ behavior: 'smooth' });
    });
    
    document.body.appendChild(indicator);
    
    // Show/hide indicator based on scroll position
    const scrollHandler = () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage > 50) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(20px)';
        } else {
            indicator.style.opacity = '1';
            indicator.style.transform = 'translateY(0)';
        }
    };
    
    window.addEventListener('scroll', scrollHandler);
}

let actionTimeout;
function handleInsert() {
  clearTimeout(actionTimeout);
  actionTimeout = setTimeout(() => {
    insertNode();
  }, 100);
}

// Interactive Particle Network
class ParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    init() {
        this.resize();
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.02;
                particle.vy -= (dy / distance) * force * 0.02;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle network
const particleNetwork = new ParticleNetwork();


// Realistic space stars generator
class RealisticSpaceStars {
    constructor() {
        this.header = document.querySelector('header');
        this.stars = [];
        this.init();
    }
    
    init() {
        this.createSpaceOverlay();
        this.generateStars();
        this.animateStars();
    }
    
    createSpaceOverlay() {
        this.spaceOverlay = document.createElement('div');
        this.spaceOverlay.className = 'space-overlay';
        this.header.appendChild(this.spaceOverlay);
    }
    
    generateStars() {
        // Create different layers of stars for depth
        this.createStarLayer(30, 'small', 8, 12); // Background stars
        this.createStarLayer(15, 'medium', 6, 10); // Mid-layer stars
        this.createStarLayer(8, 'large', 4, 8);    // Foreground stars
    }
    
    createStarLayer(count, size, minDuration, maxDuration) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = `star ${size}`;
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random animation duration
            const duration = minDuration + Math.random() * (maxDuration - minDuration);
            const delay = Math.random() * 5;
            
            // Random initial opacity
            const opacity = 0.3 + Math.random() * 0.7;
            
            star.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${opacity};
            `;
            
            this.spaceOverlay.appendChild(star);
            this.stars.push({
                element: star,
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                size: size,
                speed: 0.01 + Math.random() * 0.02,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    animateStars() {
        // Create subtle movement for each star
        this.stars.forEach(star => {
            this.animateStar(star);
        });
    }
    
    animateStar(star) {
        // Create natural, subtle movement
        const moveStar = () => {
            // Calculate new position with subtle movement
            const time = Date.now() * 0.001;
            const offsetX = Math.sin(time * star.speed + star.phase) * 0.5;
            const offsetY = Math.cos(time * star.speed * 0.7 + star.phase) * 0.3;
            
            // Apply movement
            star.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            
            // Continue animation
            requestAnimationFrame(moveStar);
        };
        
        moveStar();
    }
}

// Alternative: Even simpler version with just CSS animations
class SimpleSpaceStars {
    constructor() {
        this.header = document.querySelector('header');
        this.init();
    }
    
    init() {
        this.createSpaceOverlay();
        this.generateStaticStars();
    }
    
    createSpaceOverlay() {
        this.spaceOverlay = document.createElement('div');
        this.spaceOverlay.className = 'space-overlay';
        this.header.appendChild(this.spaceOverlay);
    }
    
    generateStaticStars() {
        // Create 50 stars with random properties
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            
            // Random size
            const size = Math.random();
            let sizeClass = 'small';
            if (size > 0.7) sizeClass = 'medium';
            if (size > 0.9) sizeClass = 'large';
            
            star.className = `star ${sizeClass}`;
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random animation properties
            const duration = 3 + Math.random() * 7;
            const delay = Math.random() * 5;
            const opacity = 0.3 + Math.random() * 0.7;
            
            star.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${opacity};
            `;
            
            this.spaceOverlay.appendChild(star);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Choose one of the implementations:
    new RealisticSpaceStars();  // With natural movement
    // OR
    // new SimpleSpaceStars();    // Static with twinkling
});

// Mobile control functions
function mobileInsertNode() {
    const input = document.getElementById('mobileNodeValue');
    document.getElementById('nodeValue').value = input.value;
    insertNode();
    input.value = '';
}

function mobileDeleteNode() {
    const input = document.getElementById('mobileDeleteValue');
    document.getElementById('deleteValue').value = input.value;
    deleteNode();
    input.value = '';
}

// Sync mobile tree type buttons with desktop
function syncMobileTreeTypeButtons() {
    const isRB = currentTreeType === 'rb';
    document.getElementById('mobileRbTreeBtn').classList.toggle('active', isRB);
    document.getElementById('mobileAvlTreeBtn').classList.toggle('active', !isRB);
}

// Update your existing switchTreeType function to sync mobile buttons
function switchTreeType(type) {
    // ... your existing switchTreeType code ...
    
    // Add this at the end to sync mobile buttons
    syncMobileTreeTypeButtons();
}

// Show/hide mobile controls based on screen size
function updateMobileControls() {
    const isMobile = window.innerWidth <= 768;
    const mobileControls = document.querySelector('.mobile-controls-section');
    const rightPanel = document.querySelector('.right-panel');
    
    if (isMobile) {
        mobileControls.style.display = 'block';
        rightPanel.style.display = 'none';
    } else {
        mobileControls.style.display = 'none';
        rightPanel.style.display = 'flex';
    }
}

// Call this function when the page loads and when window is resized
document.addEventListener('DOMContentLoaded', () => {
    updateMobileControls();
    syncMobileTreeTypeButtons();
});

window.addEventListener('resize', updateMobileControls);

// Mobile control functions
function mobileInsertNode() {
    const input = document.getElementById('mobileNodeValue');
    document.getElementById('nodeValue').value = input.value;
    insertNode();
    input.value = '';
}

function mobileDeleteNode() {
    const input = document.getElementById('mobileDeleteValue');
    document.getElementById('deleteValue').value = input.value;
    deleteNode();
    input.value = '';
}

// Show/hide mobile controls based on screen size
function updateMobileView() {
    const isMobile = window.innerWidth <= 768;
    const mobileControls = document.getElementById('mobileControlsSection');
    const rightPanel = document.querySelector('.right-panel');
    const algorithmPanel = document.querySelector('.algorithm-panel');
    
    if (isMobile) {
        // Show mobile controls
        if (mobileControls) {
            mobileControls.style.display = 'block';
        }
        
        // Hide desktop panels
        if (rightPanel) {
            rightPanel.style.display = 'none';
        }
        
        if (algorithmPanel) {
            algorithmPanel.style.display = 'none';
        }
    } else {
        // Hide mobile controls
        if (mobileControls) {
            mobileControls.style.display = 'none';
        }
        
        // Show desktop panels
        if (rightPanel) {
            rightPanel.style.display = 'flex';
        }
        
        if (algorithmPanel) {
            algorithmPanel.style.display = 'flex';
        }
    }
}

// Call this function when the page loads and when window is resized
document.addEventListener('DOMContentLoaded', updateMobileView);
window.addEventListener('resize', updateMobileView);