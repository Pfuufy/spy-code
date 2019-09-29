import { parse } from '@babel/parser';
import generate from '@babel/generator';

function handleIfStatement(node) {
    return;
}

function handleReturnStatement(node) {
    return;
}

function handleNode(node) {
    switch (node.type) {
        case 'IfStatement':
            handleIfStatement(node);
            break;
        case 'ReturnStatement':
            handleReturnStatement(node);
            break;
        default:
            break;
    }

    return node;
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