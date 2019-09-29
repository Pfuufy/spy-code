function convertToIIFEFunction(abstractSyntaxTree) {
    const ast = abstractSyntaxTree;
    const body = ast.program.body[0].body.body;

    body.forEach(node => {
        console.log(node);

        try {
            console.log(node.consequent.argument.name)
        } catch {}
    });
}

export { convertToIIFEFunction }