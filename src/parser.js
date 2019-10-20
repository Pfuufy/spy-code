import { parse } from '@babel/parser';
import generate from '@babel/generator';

function IIFEify() {
    const func = parse('function dummy() {const b = (() => {return 1;})();}');
    const dum = func.program.body[0].body.body[0]
    console.log(dum);
    return dum;
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
    return IIFEify();
}

function handleIfStatement(node) {
    return node;
}

function handleReturnStatement(node) {
    return node;
}

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

function convertToIIFEAST(func) {
    const ast = parse(func);
    const body = ast.program.body[0].body.body;

    body.forEach((node, i, arr) => {
        arr[i] = handleNode(node);
    });

    ast.program.body[0].body.body = body;
    return ast;
}

function convertToIIFEFunction(abstractSyntaxTree) {
    const ast = convertToIIFEAST(abstractSyntaxTree);
    return generate(ast).code;
}

export { convertToIIFEFunction }