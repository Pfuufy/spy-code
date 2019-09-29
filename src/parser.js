function handleNode(node) {
    return 1;
}

function convertToIIFEFunction(abstractSyntaxTree) {
    const ast = abstractSyntaxTree;
    const body = ast.program.body[0].body.body;

    body.forEach((node, i, arr) => {
        arr[i] = handleNode(node);
    });

    console.log(body);
}

export { convertToIIFEFunction }