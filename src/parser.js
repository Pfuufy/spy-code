import { parse } from '@babel/parser';
import generate from '@babel/generator';

/**
 * @param {function} callback 
 * @param {any} val
 * @returns {IIFE} Immediately invoked funciton expression
 * 
 * Returns an IIFE to execute the input code
 * and return an optional input value.
 */
function IIFEify(callback, val) {
    // Returns IIFE embedded within function because IIFE on it's 
    // own parses differently for AST
    const func = parse(`
        function urmom() {
            const a = (() => {
                ${callback()}
                return ${val ? val : undefined};
            })();
        }`);

    const iife = func.program.body[0].body.body[0].declarations[0].init;
    return iife;
}

/**
 * Calculates the amount of times a loop
 * is executed.
 * 
 * @param {number} initVal for loop initializer value
 * @param {number} testLim for loop test limit
 * @param {string} testOp for loop test operator
 * @param {number} incVal for loop incrementor value
 * @returns {number} number of times to execute
 */
function countTimes(initVal, testLim, testOp, incVal) {
    let constant = 0;

    if (testOp === '>') {
        initVal = -initVal;
        testLim = -testLim;
    } else if (testOp === '>=') {
        initVal = -initVal;
        testLim = -testLim;
        constant = 1;
    } else if (testOp === '<=') {
        constant = 1;
    }

    return Math.floor((testLim - initVal) / incVal) + constant;
}

/**
 * @param {AST node} node 
 */
function handleForStatement(node) {
    const initVal = node.init.declarations[0].init.value;
    const testLim = node.test.right.value;
    const testOp = node.test.operator;

    let incVal;

    try {
        incVal = node.update.right.value;
    } catch {
        incVal = 1;
    }
    
    const times = countTimes(initVal, testLim, testOp, incVal);

    const cb = () => {
        for (let i = initVal; i < times; i++) {
            console.log(`for loop iteration: ${i + 1}`);
        }
    }

    node.body.body.unshift(IIFEify(cb));
    return node;
}

function handleWhileStatement(node) {
    return node;
}

function handleExpressionStatement(node) {
    return node;
}

/**
 * @param {AST node} node 
 */
function handleVariableDeclaration(node) {
    const varName = node.declarations[0].id.name;
    const val = node.declarations[0].init.value;
    const cb = () => {
        console.log(`Assigning variable ${varName} value ${val}`);
    }

    node.declarations[0].init = IIFEify(cb, val);
    return node;
}

/**
 * @param {AST node} node 
 */
function handleIfStatement(node) {
    const cb = () => {
        console.log('if statement');
    }
    node.consequent.body.unshift(IIFEify(cb));
    return node;
}

/**
 * @param {AST node} node 
 */
function handleReturnStatement(node) {
    const cb = () => {
        console.log('return statement');
    }
    node.argument.callee = IIFEify(cb);
    return node;
}

/**
 * @param {AST node} node
 * @returns modified node
 * 
 * Takes as input an AST node and returns a function
 * to appropriately alter the node.
 */
function handleNode(node) {
    switch (node.type) {
        case 'IfStatement':
            return handleIfStatement(node);
        case 'ReturnStatement':
            return handleReturnStatement(node);
        case 'ForStatement':
            return handleForStatement(node);
        case 'VariableDeclaration':
            return handleVariableDeclaration(node);
        case 'ExpressionStatement':
            return handleExpressionStatement(node);
        case 'WhileStatement':
            return handleWhileStatement(node);
        default:
            break;
    }
}

/**
 * @param {function} func
 * @returns {AST}
 * 
 * This function takes a function as input
 * and converts all of its nodes to an
 * immediately invoked function expression (IIFE)
 * abstract syntax tree (AST) version of it.
 */
function convertToIIFEAST(func) {
    const ast = parse(func);
    const body = ast.program.body[0].body.body;

    body.forEach((node, i, arr) => {
        arr[i] = handleNode(node);
    });

    ast.program.body[0].body.body = body;
    return ast;
}

/**
 * @param {any} abstractSyntaxTree
 * @returns {function} executable function with eval()
 * 
 * Takes as input an abstract syntax tree
 * and converts it back into an executable
 * function.
 */
function convertToIIFEFunction(abstractSyntaxTree) {
    const ast = convertToIIFEAST(abstractSyntaxTree);
    return generate(ast).code;
}

export { convertToIIFEFunction }