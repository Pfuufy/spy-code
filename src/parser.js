import { parse } from '@babel/parser';
import generate from '@babel/generator';

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

function handleForStatement(node) {
    return node;
}

function handleWhileStatement(node) {
    return node;
}

function handleExpressionStatement(node) {
    return node;
}

function handleVariableDeclaration(node) {
    const varName = node.declarations[0].id.name;
    const val = node.declarations[0].init.value;
    const cb = () => {
        console.log(`Assigning variable ${varName} value ${val}`);
    }

    node.declarations[0].init = IIFEify(cb, val);
    return node;
}

function handleIfStatement(node) {
    const cb = () => {
        console.log('if statement');
    }
    node.consequent.body.unshift(IIFEify(cb))
    return node;
}

function handleReturnStatement(node) {
    return node;
}

function handleNode(node) {
    switch (node.type) {
        case 'IfStatement':
            // console.log(node);
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
 * 
 * @param {any} abstractSyntaxTree
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