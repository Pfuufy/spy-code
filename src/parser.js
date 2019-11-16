import { parse } from '@babel/parser';

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
function countTimes(node) {
    let initVal = node.init.declarations[0].init.value;
    let testLim = node.test.right.value;
    const testOp = node.test.operator;

    let incVal;
    try {
        incVal = node.update.right.value;
    } catch {
        incVal = 1;
    }

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
    const times = countTimes(node);

    for (let i = 0; i < times; i++) {
        console.log(`for loop iteration: ${i + 1}`);
    }
}

function handleWhileStatement(node) {
    console.log('while statement');
    return node;
}

function handleExpressionStatement(node) {
    console.log('expression statement');
    return node;
}

/**
 * @param {AST node} node 
 */
function handleVariableDeclaration(node) {
    const val = node.declarations[0].init.value;
    console.log('variable declaration');
}

/**
 * @param {AST node} node 
 */
function handleIfStatement(node) {
    console.log('if statement');
}

/**
 * @param {AST node} node 
 */
function handleReturnStatement(node) {
    console.log('return statement');
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
            handleIfStatement(node);
            break;
        case 'ReturnStatement':
            handleReturnStatement(node);
            break;
        case 'ForStatement':
            handleForStatement(node);
            break;
        case 'VariableDeclaration':
            handleVariableDeclaration(node);
            break;
        case 'ExpressionStatement':
            handleExpressionStatement(node);
            break;
        case 'WhileStatement':
            handleWhileStatement(node);
            break;
        default:
            console.log('unknown node type');
            return node;
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
function createFunctionObjects(func) {
    const ast = parse(func);
    const body = ast.program.body[0].body.body;

    body.forEach((node, i, arr) => {
        arr[i] = handleNode(node);
    });

    return func;
}

export { createFunctionObjects }